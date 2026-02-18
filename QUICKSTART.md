# Quick Start Guide

## 🎯 Complete This in 15 Minutes

### Step 1: Get Your Credentials (5 minutes)

#### A. Datastream ID
1. Go to https://experience.adobe.com/#/data-collection/datastreams
2. Create new datastream or copy existing ID
3. Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

#### B. Organization ID
1. Open Adobe Experience Platform
2. Click profile icon (top right) → Organization info
3. Format: `XXXXXXXXXXXXXXXX@AdobeOrg`

#### C. Tracking Dataset ID
1. Journey Optimizer → Data Management → Datasets
2. Find: "AJO Push Tracking Experience Event Dataset"
3. Copy the Dataset ID

### Step 2: Update Configuration (2 minutes)

Edit `scripts/config.js`:

```javascript
export const AEP_CONFIG = {
  datastreamId: "PASTE_YOUR_DATASTREAM_ID",
  orgId: "PASTE_YOUR_ORG_ID@AdobeOrg",
  vapidPublicKey: "BMuVnWsrV_tM2QV7POX8v7G1brpGNhN0wrRnOJ-lHTVXeK-kEQUBf_UDekpjFQ2ybgYjl3i_EwNqnZR022BvZnk",
  applicationId: "aem-web-push-demo",
  trackingDatasetId: "PASTE_YOUR_DATASET_ID",
};
```

### Step 3: Configure in Journey Optimizer (3 minutes)

#### Create Push Credentials
1. Journey Optimizer → Channels → Push settings → Push credentials
2. Click "Create push credential"
3. Platform: **Web**
4. App ID: `aem-web-push-demo`
5. Public Key: `BMuVnWsrV_tM2QV7POX8v7G1brpGNhN0wrRnOJ-lHTVXeK-kEQUBf_UDekpjFQ2ybgYjl3i_EwNqnZR022BvZnk`
6. Private Key: `WOTBhtLx9lvmJvGMqda_5W48vjPTQBBl_fJxZNzXyn4`
7. Submit

#### Create Channel Configuration
1. Journey Optimizer → Channels → Channel configurations
2. Create new configuration
3. Name: "Web Push Demo"
4. Channel: Push, Platform: Web
5. App ID: `aem-web-push-demo`
6. Save

### Step 4: Test Locally (2 minutes)

```bash
# Run setup script
./setup.sh

# OR manually start a server:
python3 -m http.server 8000
```

Open: http://localhost:8000/push-demo.html

### Step 5: Subscribe to Push (1 minute)

1. Click "Enable Push Notifications"
2. Allow notifications in browser prompt
3. Verify subscription status shows "✅ Active"

### Step 6: Create Test Journey (2 minutes)

1. Journey Optimizer → Journeys → Create Journey
2. Add event trigger (or use segment)
3. Add Push notification action
4. Select your "Web Push Demo" configuration
5. Compose message:
   - Title: "Test Push Notification"
   - Body: "This is a test from AJO!"
6. Publish journey

### Step 7: Test Notification

1. Trigger the journey (based on your event/segment)
2. Check browser for notification
3. ✅ Success!

---

## 🚀 You're Done!

Now you can:
- ✅ Send web push notifications from Journey Optimizer
- ✅ Target users who have subscribed
- ✅ Track notification delivery and interactions
- ✅ Deploy to Edge Delivery Services

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Service Worker failed" | Use HTTPS or localhost |
| "Permission denied" | Reset in browser settings |
| "Not receiving notifications" | Check journey is published and active |
| "Subscription not showing in AJO" | Verify datastream and dataset ID |

## 📚 Next Steps

1. **Deploy to EDS**: Push to GitHub and follow AEM EDS setup
2. **Customize**: Modify the UI and messaging
3. **Integrate**: Add to your existing AEM site
4. **Scale**: Create sophisticated journey campaigns

---

Need help? Check `CONFIGURATION.md` for detailed instructions.
