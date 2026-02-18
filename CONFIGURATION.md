# AEM Web Push Demo - Configuration Guide

## 🔧 Configuration Steps

### 1. Update `scripts/config.js`

You need to replace the placeholder values with your actual Adobe credentials:

```javascript
export const AEP_CONFIG = {
  datastreamId: "YOUR_DATASTREAM_ID_HERE",
  orgId: "YOUR_ORG_ID@AdobeOrg",
  vapidPublicKey: "BMuVnWsrV_tM2QV7POX8v7G1brpGNhN0wrRnOJ-lHTVXeK-kEQUBf_UDekpjFQ2ybgYjl3i_EwNqnZR022BvZnk",
  applicationId: "aem-web-push-demo",
  trackingDatasetId: "YOUR_TRACKING_DATASET_ID_HERE",
};
```

### 2. How to Get Your Credentials

#### A. Datastream ID
1. Go to https://experience.adobe.com/#/data-collection/datastreams
2. If you don't have a datastream, create one:
   - Click "New Datastream"
   - Name it (e.g., "Web Push Demo Datastream")
   - Select your schema
   - Enable Adobe Journey Optimizer
3. Copy the Datastream ID from the overview page

#### B. Organization ID (IMS Org ID)
1. Go to Adobe Experience Platform or Adobe Admin Console
2. Click your profile icon in the top right corner
3. Look for "Organization ID" or "IMS Org ID"
4. Format: `XXXXXXXXXXXXXXXX@AdobeOrg`

#### C. Tracking Dataset ID
1. Go to Adobe Journey Optimizer
2. Navigate to **Data Management** → **Datasets**
3. Search for: **"AJO Push Tracking Experience Event Dataset"**
4. Click on it and copy the Dataset ID
5. Format: `5f8c4e6d7a8b9c0d1e2f3a4b` (example)

### 3. Configure Push Credentials in Journey Optimizer

1. Go to **Journey Optimizer** → **Administration** → **Channels** → **Push settings** → **Push credentials**
2. Click **Create push credential**
3. Fill in:
   - **Platform**: Web
   - **App ID**: `aem-web-push-demo`
   - **VAPID Public Key**: `BMuVnWsrV_tM2QV7POX8v7G1brpGNhN0wrRnOJ-lHTVXeK-kEQUBf_UDekpjFQ2ybgYjl3i_EwNqnZR022BvZnk`
   - **VAPID Private Key**: `WOTBhtLx9lvmJvGMqda_5W48vjPTQBBl_fJxZNzXyn4`
4. Click **Submit**

### 4. Create Channel Configuration

1. Go to **Journey Optimizer** → **Administration** → **Channels** → **Channel configurations**
2. Click **Create channel configuration**
3. Fill in:
   - **Name**: "Web Push Configuration"
   - **Channel**: Push
   - **Platform**: Web
   - **App ID**: `aem-web-push-demo` (same as above)
   - **Marketing actions**: Choose appropriate actions
4. Click **Save**

### 5. Test Locally

Run a local web server to test:

```bash
# Option 1: Using Python
python3 -m http.server 8000

# Option 2: Using Node.js
npx http-server -p 8000

# Option 3: Using PHP
php -S localhost:8000
```

Then open: http://localhost:8000/push-demo.html

### 6. Deploy to AEM Edge Delivery Services (Optional)

1. Create a GitHub repository
2. Push this code to the repository
3. Update `fstab.yaml` with your Google Drive or SharePoint folder ID
4. Follow AEM EDS setup: https://www.aem.live/developer/tutorial
5. Your site will be available at: `https://{branch}--{repo}--{owner}.hlx.page`

## ⚠️ Important Notes for Edge Delivery Services

### Service Worker Limitations
- Service workers must be served from the root domain
- HTTPS is required (except localhost)
- The service worker file must be at the root level (`/service-worker.js`)

### Testing on EDS
When deployed to `*.hlx.page`:
- Service worker will register correctly
- Push notifications will work as expected
- Make sure to update your channel configuration if you change domains

### HTTPS Requirement
Push notifications require HTTPS. They will work on:
- ✅ `localhost` (any port)
- ✅ `*.hlx.page` (EDS preview)
- ✅ `*.hlx.live` (EDS production)
- ✅ Your custom domain (with SSL)
- ❌ `http://` (non-secure) - **Will NOT work**

## 🧪 Testing the Implementation

### Local Testing Checklist
- [ ] Config file updated with real credentials
- [ ] Local web server running
- [ ] Browser console shows "✅ Adobe Web SDK loaded"
- [ ] Browser console shows "✅ Service Worker registered"
- [ ] Permission request appears when clicking "Enable Push Notifications"
- [ ] Subscription status shows "✅ Active" after granting permission

### Journey Optimizer Testing
1. Create a simple journey:
   - Trigger: Event-based or audience-based
   - Action: Push notification
   - Select your web push configuration
2. Compose your message
3. Test the journey
4. Verify notification appears in browser

## 🔍 Troubleshooting

### "Service Worker registration failed"
- Make sure you're using HTTPS or localhost
- Check browser console for specific errors
- Ensure service-worker.js is accessible at `/service-worker.js`

### "Push notifications not supported"
- Check browser compatibility (Chrome, Firefox, Edge, Safari 16.4+)
- Verify you're using HTTPS (or localhost)

### "Permission denied"
- User must grant permission manually
- If denied, user must reset in browser settings
- Incognito mode always resets permissions

### "Failed to subscribe"
- Verify all config values are correct
- Check that datastream is properly configured
- Ensure AJO service is enabled in datastream
- Check browser console for specific error messages

## 📚 Additional Resources

- [Web Push Protocol Spec](https://datatracker.ietf.org/doc/html/rfc8030)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
