#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const cred = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'credentials/google-oauth.json'), 'utf8'));
const token = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'credentials/token.json'), 'utf8'));
const c = cred.web || cred.installed;
const auth = new google.auth.OAuth2(c.client_id, c.client_secret, 'urn:ietf:wg:oauth:2.0:oob');
auth.setCredentials({ refresh_token: token.refresh_token });

const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1I3Pwu_SigTC4hZPiOnzJaOhv8T15ElH8';

async function main() {
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 50,
  });
  const files = res.data.files || [];
  console.log('Drive folder ID:', folderId);
  console.log('Files in folder:', files.length);
  files.forEach((f) => console.log('  -', f.name, '|', (f.mimeType || '').replace('application/vnd.google-apps.', '')));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
