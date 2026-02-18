#!/usr/bin/env node
/**
 * One-time OAuth flow: open browser, sign in, then COPY THE CODE from the browser
 * and paste it here. Saves refresh_token to credentials/token.json.
 *
 * Requires credentials/google-oauth.json with client_id and client_secret.
 * Run: node scripts/google-oauth-login.js
 *
 * In Google Cloud Console, your OAuth client must have redirect URI:
 *   urn:ietf:wg:oauth:2.0:oob
 * (Desktop apps get this by default; for Web app add it under Authorized redirect URIs.)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const { execSync } = require('child_process');

function openUrl(url) {
  try {
    const openModule = require('open');
    const open = typeof openModule === 'function' ? openModule : openModule.default;
    if (typeof open === 'function') return open(url);
  } catch (_) {}
  try {
    if (process.platform === 'darwin') execSync(`open "${url}"`, { stdio: 'ignore' });
    else if (process.platform === 'win32') execSync(`start "" "${url}"`, { stdio: 'ignore' });
    else execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
  } catch (_) {
    console.log('Open this URL in your browser:', url);
  }
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); }));
}

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CRED_PATH = path.join(PROJECT_ROOT, 'credentials', 'google-oauth.json');
const TOKEN_PATH = path.join(PROJECT_ROOT, 'credentials', 'token.json');
const OOB_REDIRECT = 'urn:ietf:wg:oauth:2.0:oob';

async function main() {
  if (!fs.existsSync(CRED_PATH)) {
    console.error('Missing credentials/google-oauth.json');
    process.exit(1);
  }

  const cred = JSON.parse(fs.readFileSync(CRED_PATH, 'utf8'));
  const c = cred.installed || cred.web;
  if (!c || !c.client_id || !c.client_secret) {
    console.error('google-oauth.json must contain client_id and client_secret (installed or web)');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(c.client_id, c.client_secret, OOB_REDIRECT);

  const scopes = [
    'https://www.googleapis.com/auth/drive',  // see & update files in your folders (drive.file only sees app-created files)
    'https://www.googleapis.com/auth/documents',
  ];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });

  console.log('Opening browser for Google sign-in...');
  openUrl(authUrl);
  console.log('');
  console.log('After you sign in, Google will show a page with an authorization CODE.');
  console.log('Copy that code and paste it below.');
  console.log('');

  const code = await ask('Paste the authorization code here: ');
  if (!code) {
    console.error('No code entered.');
    process.exit(1);
  }

  const { credentials } = await oauth2Client.getToken(code);

  const dir = path.dirname(TOKEN_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));
  console.log('');
  console.log('Saved token to', TOKEN_PATH);
  console.log('You can now run: npm run push-content');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
