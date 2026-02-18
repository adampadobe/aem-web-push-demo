#!/usr/bin/env node
/**
 * Copy Google OAuth credentials from an external project (e.g. firebaseFunctions)
 * into this project's credentials/ folder so we can reuse the same Google account.
 *
 * Usage:
 *   node scripts/copy-google-credentials-from.js /path/to/firebaseFunctions
 *   node scripts/copy-google-credentials-from.js /path/to/some/credentials.json
 *
 * The script looks for:
 *   - In a folder: credentials.json, .env, google-oauth.json, token.json, or similar
 *   - client_id and client_secret (installed or web format)
 *   - Optionally refresh_token (may need re-auth for Drive/Docs scopes)
 *
 * Then enable Drive API + Docs API in the same Google Cloud project and run:
 *   npm run google-login
 * to get a refresh token that includes Drive/Docs (if your existing token doesn't).
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CRED_OUT = path.join(PROJECT_ROOT, 'credentials', 'google-oauth.json');
const TOKEN_OUT = path.join(PROJECT_ROOT, 'credentials', 'token.json');

const CANDIDATE_FILES = [
  'credentials.json',
  'google-oauth.json',
  'oauth.json',
  'client_secret*.json',
  '.env',
  'token.json',
];

function findCredentialFiles(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
  const out = [];
  const scan = (d) => {
    const files = fs.readdirSync(d);
    for (const f of files) {
      const full = path.join(d, f);
      if (f === 'credentials.json' || f === 'google-oauth.json' || f === 'oauth.json' || (f.startsWith('client_secret') && f.endsWith('.json'))) out.push(full);
      if (f === '.env') out.push(full);
      if (f === 'token.json') out.push(full);
    }
  };
  scan(dir);
  const functionsDir = path.join(dir, 'functions');
  if (fs.existsSync(functionsDir) && fs.statSync(functionsDir).isDirectory()) scan(functionsDir);
  return out;
}

function parseJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function parseEnv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const out = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

function extractOAuthCred(obj) {
  if (!obj) return null;
  const c = obj.installed || obj.web;
  if (c && c.client_id && c.client_secret) {
    return { client_id: c.client_id, client_secret: c.client_secret };
  }
  if (obj.client_id && obj.client_secret) {
    return { client_id: obj.client_id, client_secret: obj.client_secret };
  }
  return null;
}

function extractFromEnv(env) {
  const id = env.GOOGLE_CLIENT_ID || env.GMAIL_CLIENT_ID || env.CLIENT_ID || env.GOOGLE_OAUTH_CLIENT_ID;
  const secret = env.GOOGLE_CLIENT_SECRET || env.GMAIL_CLIENT_SECRET || env.CLIENT_SECRET || env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (id && secret) return { client_id: id, client_secret: secret };
  return null;
}

function extractRefreshToken(obj) {
  if (!obj) return null;
  return obj.refresh_token || null;
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: node scripts/copy-google-credentials-from.js <path-to-firebaseFunctions-or-credentials-file>');
    process.exit(1);
  }

  const resolved = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(resolved)) {
    console.error('Path not found:', resolved);
    process.exit(1);
  }

  let clientId = null;
  let clientSecret = null;
  let refreshToken = null;

  const isFile = fs.statSync(resolved).isFile();

  if (isFile) {
    const ext = path.extname(resolved).toLowerCase();
    if (ext === '.json') {
      const j = parseJson(resolved);
      const cred = extractOAuthCred(j);
      if (cred) clientId = cred.client_id, clientSecret = cred.client_secret;
      refreshToken = extractRefreshToken(j);
    } else if (resolved.endsWith('.env')) {
      const env = parseEnv(resolved);
      const cred = extractFromEnv(env);
      if (cred) clientId = cred.client_id, clientSecret = cred.client_secret;
      refreshToken = env.GOOGLE_REFRESH_TOKEN || env.GMAIL_REFRESH_TOKEN || env.REFRESH_TOKEN || null;
    }
  } else {
    const files = findCredentialFiles(resolved);
    for (const fp of files) {
      const name = path.basename(fp);
      if (name.endsWith('.json')) {
        const j = parseJson(fp);
        if (!clientId && !clientSecret) {
          const cred = extractOAuthCred(j);
          if (cred) clientId = cred.client_id, clientSecret = cred.client_secret;
        }
        if (!refreshToken) refreshToken = extractRefreshToken(j);
      } else if (name === '.env') {
        const env = parseEnv(fp);
        if (!clientId && !clientSecret) {
          const cred = extractFromEnv(env);
          if (cred) clientId = cred.client_id, clientSecret = cred.client_secret;
        }
        if (!refreshToken) refreshToken = env.GOOGLE_REFRESH_TOKEN || env.GMAIL_REFRESH_TOKEN || env.REFRESH_TOKEN;
      }
    }
  }

  if (!clientId || !clientSecret) {
    console.error('Could not find client_id and client_secret in the given path.');
    console.error('Expected: a JSON file with .installed or .web (client_id, client_secret) or .env with GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET');
    process.exit(1);
  }

  const credDir = path.dirname(CRED_OUT);
  if (!fs.existsSync(credDir)) fs.mkdirSync(credDir, { recursive: true });

  const oauthJson = {
    web: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: ['http://localhost:3333/oauth2callback'],
    },
  };
  fs.writeFileSync(CRED_OUT, JSON.stringify(oauthJson, null, 2));
  console.log('Wrote credentials/google-oauth.json (client_id + client_secret from your existing project).');

  if (refreshToken) {
    fs.writeFileSync(TOKEN_OUT, JSON.stringify({ refresh_token: refreshToken }, null, 2));
    console.log('Wrote credentials/token.json (refresh_token copied).');
    console.log('');
    console.log('Note: If that token was only for Firebase/auth, Drive/Docs may still require re-auth.');
    console.log('If npm run push-content fails with permission errors, run: npm run google-login');
  } else {
    console.log('');
    console.log('No refresh_token found. Run once: npm run google-login');
    console.log('(Sign in with the same Google account; a new token with Drive/Docs scopes will be saved.)');
  }

  console.log('');
  console.log('In Google Cloud Console (same project as firebaseFunctions):');
  console.log('  - Enable "Google Drive API" and "Google Docs API"');
  console.log('  - If this app uses a Web client, add redirect URI: http://localhost:3333/oauth2callback');
}

main();
