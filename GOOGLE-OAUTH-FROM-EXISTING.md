# Use your existing Google OAuth (e.g. firebaseFunctions)

Your `firebaseFunctions` folder is **outside** Campaign Orchestration. You can reuse the same Google account and OAuth client by copying the relevant credentials here and enabling Drive + Docs APIs.

## 1. Copy credentials from the other project

From the **aem-web-push-demo** folder, run (use the **full path** to your firebaseFunctions folder):

```bash
cd "/Users/apalmer/Campaign Orchestration/aem-web-push-demo"
npm run copy-credentials -- /path/to/firebaseFunctions
```

Example if firebaseFunctions is in your home directory:

```bash
npm run copy-credentials -- /Users/apalmer/firebaseFunctions
```

Or point to a specific credentials file:

```bash
npm run copy-credentials -- /Users/apalmer/firebaseFunctions/credentials.json
```

The script looks for `client_id` and `client_secret` in:

- `credentials.json`, `google-oauth.json`, `oauth.json`, or `client_secret*.json` (JSON with `.installed` or `.web`)
- `.env` (e.g. `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, or `CLIENT_ID` / `CLIENT_SECRET`)

It writes:

- `credentials/google-oauth.json` (client_id + client_secret in the format this project expects)
- `credentials/token.json` (if it finds a `refresh_token` in the other project)

## 2. Add Drive and Docs APIs in the same Google Cloud project

In the **same** Google Cloud project you use for firebaseFunctions:

1. Go to [APIs & Services → Library](https://console.cloud.google.com/apis/library).
2. Enable **Google Drive API** and **Google Docs API**.

If this app uses a **Web application** OAuth client and you use the in-project login flow:

3. In [APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials), edit your OAuth 2.0 Client ID.
4. Under **Authorized redirect URIs** add: `http://localhost:3333/oauth2callback`.

## 3. Get a refresh token that includes Drive/Docs (if needed)

Your existing refresh token may only have Firebase/auth scopes. For Drive sync we need Drive + Docs.

- **If you didn’t have a refresh_token** (or the script said “No refresh_token found”):  
  Run once:
  ```bash
  npm run google-login
  ```
  Sign in with the same Google account; the new token will be saved to `credentials/token.json`.

- **If you copied a refresh_token** but `npm run push-content` fails with permission/403 errors:  
  Run `npm run google-login` once so a new token with Drive/Docs scopes is saved (it will overwrite `token.json`).

## 4. Run from aem-web-push-demo

Always run npm commands from the project folder:

```bash
cd "/Users/apalmer/Campaign Orchestration/aem-web-push-demo"
npm run push-content
# or
npm run deploy:full
```

Summary: same Google account and OAuth client as firebaseFunctions, with Drive + Docs APIs enabled and a token that has Drive/Docs scopes.
