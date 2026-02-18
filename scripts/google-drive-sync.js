#!/usr/bin/env node
/**
 * Push content from repo files to Google Drive docs (for EDS).
 * Uses Google OAuth2 (client_id, client_secret, refresh_token) from env or credentials/token files.
 *
 * Required: Drive API + Docs API enabled in Google Cloud, OAuth consent configured.
 * Env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 * Or: credentials/google-oauth.json (client_id, client_secret) + credentials/token.json (refresh_token)
 * Optional: GOOGLE_DRIVE_FOLDER_ID (defaults to folder from fstab)
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const FSTAB = path.join(PROJECT_ROOT, 'fstab.yaml');
const DEFAULT_FOLDER_ID = '1I3Pwu_SigTC4hZPiOnzJaOhv8T15ElH8'; // from fstab

// Optional: path to index.docx to upload and convert to Google Doc (drops .docx, creates "index" in Drive)
// Set INDEX_DOCX_PATH to override (e.g. /Users/apalmer/Downloads/starter-content 2/index.docx)
const DEFAULT_INDEX_DOCX = path.join(
  process.env.HOME || '',
  'Downloads',
  'starter-content 2',
  'index.docx'
);
const INDEX_DOCX_PATH = process.env.INDEX_DOCX_PATH || DEFAULT_INDEX_DOCX;

// Doc name in Drive -> local file (relative to project root) — used when no .docx is provided for index
const CONTENT_MAP = {
  index: 'index-content.txt',
  // add more: 'push-demo': 'push-demo-content.txt',
};

function getFolderId() {
  if (process.env.GOOGLE_DRIVE_FOLDER_ID) return process.env.GOOGLE_DRIVE_FOLDER_ID;
  try {
    const yaml = fs.readFileSync(FSTAB, 'utf8');
    const m = yaml.match(/folders\/([a-zA-Z0-9_-]+)/);
    return m ? m[1] : DEFAULT_FOLDER_ID;
  } catch {
    return DEFAULT_FOLDER_ID;
  }
}

function loadCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    return { clientId, clientSecret, refreshToken };
  }

  const credPath = path.join(PROJECT_ROOT, 'credentials', 'google-oauth.json');
  const tokenPath = path.join(PROJECT_ROOT, 'credentials', 'token.json');
  if (fs.existsSync(credPath) && fs.existsSync(tokenPath)) {
    const cred = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    const c = cred.installed || cred.web;
    if (c && token.refresh_token) {
      return {
        clientId: c.client_id,
        clientSecret: c.client_secret,
        refreshToken: token.refresh_token,
      };
    }
  }

  return null;
}

async function getAuthClient() {
  const cred = loadCredentials();
  if (!cred) {
    console.error('Missing Google OAuth credentials.');
    console.error('Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN');
    console.error('Or add credentials/google-oauth.json and credentials/token.json');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    cred.clientId,
    cred.clientSecret,
    'urn:ietf:wg:oauth:2.0:oob'
  );
  oauth2Client.setCredentials({ refresh_token: cred.refreshToken });
  return oauth2Client;
}

function getLastEndIndex(body) {
  if (!body || !body.content || body.content.length === 0) return 1;
  let max = 1;
  for (const el of body.content) {
    if (el.endIndex != null && el.endIndex > max) max = el.endIndex;
  }
  return max;
}

/**
 * Upload a .docx file to Drive and convert to a Google Doc named "index" in the folder.
 * If an existing "index" doc exists, it is deleted first.
 */
async function uploadDocxAsIndex(drive, folderId, docxPath) {
  const name = 'index';
  const { data: { files } } = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });
  const existing = (files || []).find(
    (f) => f.name.toLowerCase() === name && f.mimeType === 'application/vnd.google-apps.document'
  );
  if (existing) {
    await drive.files.delete({ fileId: existing.id });
    console.log('  Removed existing "%s" doc.', name);
  }
  const fileMetadata = {
    name,
    parents: [folderId],
    mimeType: 'application/vnd.google-apps.document',
  };
  const media = {
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    body: fs.createReadStream(docxPath),
  };
  await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, webViewLink',
  });
  console.log('  Uploaded and converted "%s" from', name, path.basename(docxPath));
}

async function updateDocContent(docs, documentId, newText) {
  const doc = await docs.documents.get({ documentId });
  const endIndex = getLastEndIndex(doc.data.body);
  if (endIndex <= 1) {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          { insertText: { location: { index: 1 }, text: newText } },
        ],
      },
    });
    return;
  }
  // API doesn't allow deleting the final newline of the segment; use endIndex - 1
  const deleteEnd = Math.max(2, endIndex - 1);
  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [
        { deleteContentRange: { range: { startIndex: 1, endIndex: deleteEnd } } },
        { insertText: { location: { index: 1 }, text: newText } },
      ],
    },
  });
}

async function main() {
  const folderId = getFolderId();
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });
  const docs = google.docs({ version: 'v1', auth });

  const { data: { files } } = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });

  const fileByName = new Map((files || []).map((f) => [f.name.toLowerCase().replace(/\s+/g, ' ').trim(), f]));

  // Use .docx for index only when USE_INDEX_DOCX=1; otherwise use structured index-content.txt
  const useDocxForIndex = process.env.USE_INDEX_DOCX === '1' && fs.existsSync(INDEX_DOCX_PATH);
  if (useDocxForIndex) {
    console.log('Uploading index from .docx (convert to Google Doc)...');
    await uploadDocxAsIndex(drive, folderId, INDEX_DOCX_PATH);
    console.log('  Done.');
    // Refresh file list so we don't overwrite index with index-content.txt below
    const res2 = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });
    const fileByName2 = new Map((res2.data.files || []).map((f) => [f.name.toLowerCase().replace(/\s+/g, ' ').trim(), f]));
    for (const k of fileByName2.keys()) fileByName.set(k, fileByName2.get(k));
  }

  // Update docs from text files (skip index if we just used .docx)
  for (const [docName, localFile] of Object.entries(CONTENT_MAP)) {
    if (docName === 'index' && useDocxForIndex) continue;
    const localPath = path.join(PROJECT_ROOT, localFile);
    if (!fs.existsSync(localPath)) {
      console.warn('Skip', docName, '(file not found:', localFile, ')');
      continue;
    }
    const text = fs.readFileSync(localPath, 'utf8').replace(/\r\n/g, '\n').trim();
    const key = docName.toLowerCase();
    const driveFile = fileByName.get(key) || fileByName.get(docName);
    if (!driveFile) {
      console.warn('Skip', docName, '(no doc named "' + docName + '" in Drive folder)');
      continue;
    }
    if (driveFile.mimeType !== 'application/vnd.google-apps.document') {
      console.warn('Skip', docName, '(not a Google Doc)');
      continue;
    }
    console.log('Updating Drive doc "%s" from %s...', docName, localFile);
    await updateDocContent(docs, driveFile.id, text);
    console.log('  Done.');
  }

  console.log('Google Drive sync finished.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
