# Google API access for Drive sync

This lets you push content from the repo (e.g. `index-content.txt`) to your Google Drive docs from Cursor, so you don’t have to paste manually or use Sidekick for content.

## 1. Google Cloud project and OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or pick an existing one) and enable:
   - **Google Drive API**
   - **Google Docs API**
3. **APIs & Services > Credentials > Create Credentials > OAuth client ID**.
4. If asked, configure the OAuth consent screen (e.g. External, add your email as test user).
5. Create an **OAuth 2.0 Client ID**:
   - Application type: **Desktop app** or **Web application**.
   - Name: e.g. `AEM EDS Drive Sync`.
   - For **copy-paste token flow**: add redirect URI `urn:ietf:wg:oauth:2.0:oob` (Desktop apps often have this by default).
   - Or for browser callback: add `http://localhost:3333/oauth2callback`.
6. Download the JSON (or copy **Client ID** and **Client secret**).

## 2. Give me the OAuth credentials

You can use either **env vars** or **files**.

### Option A: Environment variables

Set these (e.g. in your shell or `.env`):

- `GOOGLE_CLIENT_ID` – OAuth client ID  
- `GOOGLE_CLIENT_SECRET` – OAuth client secret  
- `GOOGLE_REFRESH_TOKEN` – refresh token (see below)

### Option B: Files in the repo (ignored by git)

1. Create `credentials/` in the project (it’s in `.gitignore`).
2. **Client ID + secret:**  
   Save your OAuth client JSON as:
   ```text
   credentials/google-oauth.json
   ```
   It should look like:
   ```json
   {
     "installed": {
       "client_id": "....apps.googleusercontent.com",
       "client_secret": "...",
       "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
     }
   }
   ```
   or use `"web"` instead of `"installed"` with the same keys.

3. **Refresh token (one-time):**  
   Run:
   ```bash
   npm run google-login
   ```
   A browser will open; sign in with the Google account that owns the Drive folder.  
   The script will save a refresh token to `credentials/token.json`.  
   After that, you can use `npm run push-content` without signing in again.

If you use **Option A**, you still need a refresh token once. Easiest is to run `npm run google-login` once with `google-oauth.json` in place; it writes `token.json`. Then you can copy the `refresh_token` from `credentials/token.json` into your env as `GOOGLE_REFRESH_TOKEN` and use only env vars from then on.

## 3. What gets synced

- **Drive folder:** The one in `fstab.yaml` (or set `GOOGLE_DRIVE_FOLDER_ID`).
- **Doc names:** A Google Doc in that folder named **index** is updated from `index-content.txt`.  
  You can extend the script to map more doc names to more files (see `CONTENT_MAP` in `scripts/google-drive-sync.js`).

## 4. Commands from Cursor

- **Push content to Drive only:**  
  ```bash
  npm run push-content
  ```
- **Full deploy (push code, push content to Drive, then preview + publish):**  
  Run push-content, then deploy:
  ```bash
  npm run push-content && npm run deploy
  ```
  Or add a single script that runs both if you want one command.

## 5. Security

- Do **not** commit `credentials/` or `.env` (they are gitignored).
- Prefer env vars in CI or shared machines; use files only on your own machine if you like.
