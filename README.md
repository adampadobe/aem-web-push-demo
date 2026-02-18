# AEM Edge Delivery Services - Web Push Notifications Demo

This project demonstrates how to implement Adobe Journey Optimizer Web Push Notifications with AEM Edge Delivery Services.

## 🔑 Your VAPID Keys

**Public Key:**
```
BMuVnWsrV_tM2QV7POX8v7G1brpGNhN0wrRnOJ-lHTVXeK-kEQUBf_UDekpjFQ2ybgYjl3i_EwNqnZR022BvZnk
```

**Private Key:**
```
WOTBhtLx9lvmJvGMqda_5W48vjPTQBBl_fJxZNzXyn4
```

⚠️ **Important:** Keep the private key secure. Only use it in Journey Optimizer.

## Prerequisites

1. Adobe Experience Platform Datastream ID
2. Adobe Organization ID (IMS Org ID)
3. AJO Push Tracking Dataset ID
4. Push credentials configured in Journey Optimizer

## Project Structure

```
aem-web-push-demo/
├── blocks/                    # AEM EDS custom blocks
├── scripts/
│   ├── aep-web-sdk.js        # Web SDK initialization
│   ├── push-notifications.js  # Push notification logic
│   └── scripts.js            # Main EDS scripts
├── styles/
│   └── styles.css            # Global styles
├── head.html                 # Default head content
├── index.html                # Homepage
├── push-demo.html            # Push notification demo page
├── service-worker.js         # Service worker for push
└── fstab.yaml               # EDS configuration

```

## Setup Instructions

### 1. Configure Your Environment Variables

Create a `config.js` file (not committed to git) with your credentials:

```javascript
export const AEP_CONFIG = {
  datastreamId: "YOUR_DATASTREAM_ID",
  orgId: "YOUR_ORG_ID@AdobeOrg",
  vapidPublicKey: "BMuVnWsrV_tM2QV7POX8v7G1brpGNhN0wrRnOJ-lHTVXeK-kEQUBf_UDekpjFQ2ybgYjl3i_EwNqnZR022BvZnk",
  applicationId: "aem-web-push-demo",
  trackingDatasetId: "YOUR_TRACKING_DATASET_ID"
};
```

### 2. Configure Push Credentials in Journey Optimizer

1. Go to **Journey Optimizer** → **Channels** → **Push settings** → **Push credentials**
2. Click **Create push credential**
3. Platform: **Web**
4. App ID: `aem-web-push-demo`
5. Enter both VAPID keys
6. Save

### 3. Create Channel Configuration

1. Go to **Journey Optimizer** → **Channels** → **Channel configurations**
2. Create new configuration
3. Select **Push** channel, **Web** platform
4. Use App ID: `aem-web-push-demo`

### 4. Deploy to Edge Delivery Services

Follow standard AEM EDS deployment process:
- Push to GitHub repository
- Configure fstab.yaml with your content source
- Access via `https://{branch}--{repo}--{owner}.hlx.page`

## Testing

1. Open the site in a browser
2. Navigate to `/push-demo`
3. Click "Enable Push Notifications"
4. Grant permission when prompted
5. Create a test journey in AJO to send notifications

## Edge Delivery Services Compatibility

✅ **Compatible**: The Web SDK operates client-side and works with EDS
✅ **Service Worker**: Registers independently of EDS
✅ **Performance**: No impact on EDS edge caching
⚠️ **Note**: Service worker must be served from the same domain

## Resources

- [AEM Edge Delivery Services Documentation](https://www.aem.live/developer/tutorial)
- [Adobe Web SDK Push Notifications](https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/pushnotifications)
- [Journey Optimizer Web Push Configuration](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/push/push-config/push-configuration-web)
