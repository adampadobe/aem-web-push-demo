# Implementation Checklist

Use this checklist to track your progress through the setup.

## Phase 1: Get Credentials ⏱️ 5 minutes

### Adobe Experience Platform
- [ ] Log into Adobe Experience Platform
- [ ] Navigate to Data Collection > Datastreams
- [ ] Create new datastream OR copy existing datastream ID
- [ ] Datastream ID obtained: `_______________________________`

### Organization ID
- [ ] Open Adobe Admin Console or AEP
- [ ] Click profile icon (top right)
- [ ] Find Organization ID / IMS Org ID
- [ ] Organization ID obtained: `_______________________________@AdobeOrg`

### Tracking Dataset
- [ ] Open Journey Optimizer
- [ ] Navigate to Data Management > Datasets
- [ ] Search for "AJO Push Tracking Experience Event Dataset"
- [ ] Click dataset and copy ID
- [ ] Dataset ID obtained: `_______________________________`

---

## Phase 2: Configure Project ⏱️ 3 minutes

### Update Config File
- [ ] Open `scripts/config.js` in editor
- [ ] Replace `YOUR_DATASTREAM_ID_HERE` with actual datastream ID
- [ ] Replace `YOUR_ORG_ID@AdobeOrg` with actual org ID
- [ ] Replace `YOUR_TRACKING_DATASET_ID_HERE` with actual dataset ID
- [ ] Save file

### Verify VAPID Keys
- [ ] Confirm public key in `scripts/config.js` matches:
      `BMuVnWsrV_tM2QV7POX8v7G1brpGNhN0wrRnOJ-lHTVXeK-kEQUBf_UDekpjFQ2ybgYjl3i_EwNqnZR022BvZnk`
- [ ] Have private key ready:
      `WOTBhtLx9lvmJvGMqda_5W48vjPTQBBl_fJxZNzXyn4`

---

## Phase 3: Configure Journey Optimizer ⏱️ 5 minutes

### Create Push Credentials
- [ ] Journey Optimizer > Channels > Push settings > Push credentials
- [ ] Click "Create push credential"
- [ ] Select Platform: **Web**
- [ ] Enter App ID: `aem-web-push-demo`
- [ ] Paste VAPID Public Key (from above)
- [ ] Paste VAPID Private Key (from above)
- [ ] Click Submit
- [ ] Verify credential appears in list

### Create Channel Configuration
- [ ] Journey Optimizer > Channels > Channel configurations
- [ ] Click "Create channel configuration"
- [ ] Enter name: "Web Push Demo"
- [ ] Select Channel: **Push**
- [ ] Select Platform: **Web**
- [ ] Select App ID: `aem-web-push-demo`
- [ ] Choose Marketing actions (as appropriate)
- [ ] Click Save
- [ ] Verify configuration appears in list

---

## Phase 4: Local Testing ⏱️ 5 minutes

### Start Web Server
- [ ] Open terminal
- [ ] Navigate to project directory: `cd aem-web-push-demo`
- [ ] Run setup script: `./setup.sh`
  - OR manually: `python3 -m http.server 8000`
  - OR: `npx http-server -p 8000`
- [ ] Verify server starts without errors

### Test in Browser
- [ ] Open browser (Chrome, Firefox, or Edge recommended)
- [ ] Navigate to: `http://localhost:8000/push-demo.html`
- [ ] Page loads without errors
- [ ] Open browser console (F12)
- [ ] Verify logs show:
  - [ ] "✅ Adobe Web SDK loaded"
  - [ ] "✅ Service Worker registered"
  - [ ] "✅ Adobe Web SDK configured with push notifications"

### Subscribe to Push
- [ ] Click "Enable Push Notifications" button
- [ ] Browser shows permission prompt
- [ ] Click "Allow" or "Accept"
- [ ] Status shows "Permission Status: ✅ Granted"
- [ ] Status shows "Subscription Status: ✅ Active"
- [ ] Console shows: "✅ Push subscription registered with Adobe"
- [ ] Subscription details appear on page

### Test Local Notification
- [ ] Click "Show Test Notification" button
- [ ] Test notification appears in browser
- [ ] Click notification (should focus/open page)

---

## Phase 5: Create Journey ⏱️ 5 minutes

### Journey Setup
- [ ] Journey Optimizer > Journeys
- [ ] Click "Create Journey"
- [ ] Enter journey name: "Web Push Test"
- [ ] Add trigger:
  - [ ] Event-based (create simple test event)
  - OR [ ] Segment-based (use existing segment)
- [ ] Add Push notification action
- [ ] Select configuration: "Web Push Demo"
- [ ] Compose notification:
  - [ ] Title: `Test Push Notification`
  - [ ] Body: `This is a test from Adobe Journey Optimizer!`
  - [ ] (Optional) Add image URL
  - [ ] (Optional) Add click action URL
- [ ] Set journey to "Test" mode
- [ ] Publish journey

### Test Journey
- [ ] Trigger the journey (via event or segment qualification)
- [ ] Wait for notification to appear
- [ ] Notification received in browser
- [ ] Click notification
- [ ] Verify click action works
- [ ] Check Journey Optimizer reporting for delivery confirmation

---

## Phase 6: Deployment (Optional) ⏱️ 15 minutes

### GitHub Setup
- [ ] Create new GitHub repository
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Add remote: `git remote add origin YOUR_REPO_URL`
- [ ] Push: `git push -u origin main`

### AEM Edge Delivery Services
- [ ] Update `fstab.yaml` with content source (Google Drive/SharePoint)
- [ ] Configure AEM EDS project (follow: https://www.aem.live/developer/tutorial)
- [ ] Access preview URL: `https://main--{repo}--{owner}.hlx.page`
- [ ] Test push notifications on preview URL
- [ ] Verify HTTPS works correctly
- [ ] Test on mobile devices

### Production Channel Configuration
- [ ] Create new channel configuration in Journey Optimizer for production domain
- [ ] Update journeys to use production configuration
- [ ] Test end-to-end on production

---

## Verification Checklist ✅

### Technical Verification
- [ ] Service worker registered and active
- [ ] Push subscription created successfully
- [ ] Subscription visible in browser DevTools > Application > Service Workers
- [ ] No console errors
- [ ] Web SDK initialized correctly
- [ ] Events tracked in Adobe Experience Platform

### Journey Optimizer Verification
- [ ] Push credentials created and active
- [ ] Channel configuration created
- [ ] Test journey published
- [ ] Journey reporting shows delivery
- [ ] Push events tracked in datasets

### User Experience Verification
- [ ] Permission prompt appears correctly
- [ ] Notifications display with correct content
- [ ] Click actions work as expected
- [ ] Notifications appear even when browser is minimized
- [ ] Unsubscribe works correctly

---

## Troubleshooting Notes

### Issue Log
Document any issues encountered:

**Issue 1:**
- Problem: _______________________________________________
- Solution: ______________________________________________
- Date: _________________________________________________

**Issue 2:**
- Problem: _______________________________________________
- Solution: ______________________________________________
- Date: _________________________________________________

**Issue 3:**
- Problem: _______________________________________________
- Solution: ______________________________________________
- Date: _________________________________________________

---

## Next Steps After Completion

- [ ] Customize notification design
- [ ] Integrate with existing AEM site
- [ ] Create production journeys
- [ ] Set up audience segments
- [ ] Implement personalization
- [ ] Configure A/B testing
- [ ] Set up reporting dashboards
- [ ] Train team on Journey Optimizer

---

## Resources Used

- [ ] QUICKSTART.md - Quick setup guide
- [ ] CONFIGURATION.md - Detailed configuration
- [ ] README.md - Project documentation
- [ ] PROJECT-SUMMARY.md - Overview and next steps

---

## Sign-off

**Setup Completed By:** _____________________________

**Date:** _____________________________

**Environment:** 
- [ ] Local Development
- [ ] AEM EDS Preview (hlx.page)
- [ ] AEM EDS Production (hlx.live)
- [ ] Custom Domain

**Status:** 
- [ ] ✅ Fully Working
- [ ] ⚠️ Working with Issues
- [ ] ❌ Not Working (see troubleshooting notes)

---

**Total Estimated Time:** ~25-30 minutes

**Notes:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
