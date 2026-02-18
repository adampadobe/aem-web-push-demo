# AEM Edge Delivery Services - Google Drive Integration Setup Guide

## Step 1: Create GitHub Repository ✅ (We'll do this next)

Since you have GitHub access, let's create a repository for your project:

### Actions:
1. Go to https://github.com/new
2. Repository name: `aem-web-push-demo` (or your choice)
3. Set visibility: **Public** (recommended for EDS)
4. **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

## Step 2: Configure Your Google Drive 📁

You mentioned you have a Google Drive site. Here's how to connect it:

### Actions:

1. **Create a folder in Google Drive** for your AEM content
   - Name it something like "AEM Web Push Content"
   - Share it with your team if needed

2. **Get the Folder ID**
   - Open the folder in Google Drive
   - Look at the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy the FOLDER_ID (the long string after `/folders/`)

3. **Update fstab.yaml**
   - Replace `YOUR_FOLDER_ID_HERE` in `fstab.yaml` with your actual folder ID
   - Format: `https://drive.google.com/drive/u/0/folders/YOUR_FOLDER_ID`

Example:
```yaml
mountpoints:
  /: https://drive.google.com/drive/u/0/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
```

## Step 3: Install AEM Code Sync GitHub App

This app syncs your code from GitHub to AEM EDS:

### Actions:

1. Visit: https://github.com/apps/aem-code-sync/installations/new
2. Select your GitHub account/organization
3. Choose "Only select repositories"
4. Select your `aem-web-push-demo` repository
5. Click "Install" or "Save"

✅ This enables automatic deployment when you push to GitHub

## Step 4: Push Your Code to GitHub

Now let's commit and push all our code:

```bash
cd "/Users/apalmer/Campaign Orchestration/aem-web-push-demo"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: AEM EDS with Web Push Notifications"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/aem-web-push-demo.git

# Push to GitHub
git push -u origin main
```

## Step 5: Access Your Site 🚀

After pushing, your site will be available at:

**Preview URL (from `main` branch):**
```
https://main--aem-web-push-demo--YOUR_GITHUB_USERNAME.aem.page/
```

**Preview with path:**
```
https://main--aem-web-push-demo--YOUR_GITHUB_USERNAME.aem.page/push-demo
```

**Production URL (after publishing):**
```
https://main--aem-web-push-demo--YOUR_GITHUB_USERNAME.aem.live/
```

## Step 6: Create Content in Google Drive 📝

Create documents in your Google Drive folder:

### Example Documents:

1. **index** (Google Doc)
   ```
   # Welcome to AEM Web Push Demo
   
   This is your homepage content managed in Google Drive.
   
   [Try Push Demo](/push-demo)
   ```

2. **push-demo** (Google Doc)
   ```
   # Web Push Notifications Demo
   
   Enable push notifications to receive updates from this site.
   
   ## How It Works
   - Request notification permission
   - Subscribe to push notifications
   - Receive messages from Adobe Journey Optimizer
   ```

### Document Structure:
- Each Google Doc becomes a webpage
- Filename = URL path (e.g., `about.gdoc` → `/about`)
- Use markdown-like formatting
- Links: `[Text](URL)`
- Images: Paste directly into the doc

## Step 7: Install AEM Sidekick (Chrome Extension) 🔧

The Sidekick helps you preview and publish content:

### Actions:

1. Install: https://chrome.google.com/webstore/search/aem%20sidekick
2. Pin the extension in Chrome
3. Navigate to your Google Drive folder
4. Click the Sidekick extension
5. Add your project:
   - Host: `main--aem-web-push-demo--YOUR_USERNAME.aem.page`
   - Click "Add"

### Using Sidekick:
- **Preview**: See changes before publishing
- **Publish**: Make content live
- **Edit**: Open source in Google Drive

## Step 8: Configure Web Push in Your Deployed Site ⚙️

Once deployed to EDS, update `scripts/config.js` with your Adobe credentials:

```javascript
export const AEP_CONFIG = {
  datastreamId: "YOUR_DATASTREAM_ID",
  orgId: "YOUR_ORG_ID@AdobeOrg",
  vapidPublicKey: "BMuVnWsrV_tM2QV7POX8v7G1brpGNhN0wrRnOJ-lHTVXeK-kEQUBf_UDekpjFQ2ybgYjl3i_EwNqnZR022BvZnk",
  applicationId: "aem-web-push-demo",
  trackingDatasetId: "YOUR_TRACKING_DATASET_ID",
};
```

Then commit and push the changes.

## Step 9: Test Everything ✅

### Checklist:

- [ ] Site loads at `*.aem.page` URL
- [ ] Navigation works
- [ ] Push demo page loads
- [ ] Service worker registers
- [ ] Can enable push notifications
- [ ] Subscription shows as active

## Step 10: Set Up Journey Optimizer 🎯

Follow the previous instructions to:

1. Create push credentials in Journey Optimizer
2. Create channel configuration  
3. Create test journey
4. Send test notification

---

## Troubleshooting

### Site doesn't load (404)
- Wait 1-2 minutes after first push (initial deployment)
- Check GitHub Actions tab for build status
- Verify AEM Code Sync is installed

### Content not updating
- Click "Publish" in Sidekick (not just "Preview")
- Clear browser cache
- Check correct Google Drive folder ID in fstab.yaml

### Push notifications not working
- Verify HTTPS (*.aem.page and *.aem.live use HTTPS)
- Check browser console for errors
- Confirm config.js has correct credentials
- Ensure service-worker.js is accessible at root

---

## EDS-Specific Features

### Automatic Image Optimization
- Upload images to Google Drive
- Insert in documents
- EDS automatically optimizes (WebP, responsive sizes)

### Block System  
- Create reusable components in `/blocks` folder
- Use in content with special syntax

### Performance
- Instant global CDN
- Perfect Lighthouse scores out of the box
- Automatic lazy loading

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Configure Google Drive folder
3. ✅ Install AEM Code Sync
4. ✅ Push code to GitHub
5. ✅ Access your EDS site
6. ✅ Install Sidekick
7. ✅ Create content in Google Drive
8. ✅ Configure Web Push
9. ✅ Test push notifications
10. ✅ Create Journey Optimizer campaigns

---

## Resources

- [AEM EDS Documentation](https://www.aem.live/)
- [AEM Developer Tutorial](https://www.aem.live/developer/tutorial)
- [Google Drive Authoring](https://www.aem.live/docs/authoring)
- [AEM Sidekick Guide](https://www.aem.live/developer/sidekick)

---

**Your VAPID Keys (for reference):**

Public: `BMuVnWsrV_tM2QV7POX8v7G1brpGNhN0wrRnOJ-lHTVXeK-kEQUBf_UDekpjFQ2ybgYjl3i_EwNqnZR022BvZnk`
Private: `WOTBhtLx9lvmJvGMqda_5W48vjPTQBBl_fJxZNzXyn4`
