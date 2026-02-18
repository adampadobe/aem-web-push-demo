# Deploy from Cursor (No Sidekick)

You can deploy code **and** trigger content preview/publish entirely from Cursor (or any terminal) without opening Sidekick.

## How it works

1. **Code** – Pushing to GitHub already deploys code via AEM Code Sync (within a few minutes).
2. **Content** – The script calls the AEM Admin API to run **preview** (pull latest from Google Drive into preview) and **publish** (copy preview → live). That’s what Sidekick’s buttons do; we do it from the command line.

## One-time setup

- **Google Drive**: Your site content (e.g. `index`, `push-demo`) must exist in your Drive folder and be shared with `helix@adobe.com`. Do **Preview** and **Publish** once in Sidekick so the pipeline knows those pages. After that, you can use the script for all future updates.
- **Optional auth**: If your org protects the Admin API, set an auth token and use it when running the script (see below).

## Deploy from Cursor

From the project folder, run:

```bash
npm run deploy
```

This will:

1. Run `git push origin main` (pushes your code to GitHub).
2. Call the Admin API to **preview** `/` and `/push-demo` (refreshes content from Drive).
3. Call the Admin API to **publish** those paths (makes them live).

Give it 1–2 minutes, then check:

- **Preview:** https://main--aem-web-push-demo--adampadobe.aem.page/
- **Live:** https://main--aem-web-push-demo--adampadobe.aem.live/

## If you get 401 (Unauthorized)

Some orgs require authentication for the Admin API. Then:

1. Get an auth token (e.g. from your org admin or by logging in and capturing the token as in [AEM auth docs](https://aem.live/docs/authentication-setup-authoring)).
2. Run deploy with the token:

   ```bash
   AEM_AUTH_TOKEN=your_token_here npm run deploy
   ```

   Or export it once in your shell: `export AEM_AUTH_TOKEN=your_token_here`, then `npm run deploy`.

## Workflow summary

| What you change | Where you change it | How it gets to the site |
|-----------------|----------------------|--------------------------|
| Code (blocks, scripts, styles, `head.html`, etc.) | Cursor → Git | `npm run deploy` (or `git push`; Code Sync deploys code) |
| Content (copy, sections, images in Drive docs) | Google Drive | `npm run deploy` triggers preview + publish from Drive (no Sidekick) |

So: edit in Cursor and/or Drive, then run **`npm run deploy`** from Cursor to push code and refresh content on both preview and live.
