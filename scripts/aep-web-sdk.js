/**
 * Adobe Experience Platform Web SDK Initialization
 * This file initializes the AEP Web SDK with push notification support
 */

// Import the Web SDK from Adobe's CDN
import { AEP_CONFIG } from './config.js';

/**
 * Load and configure the Adobe Experience Platform Web SDK
 */
async function initializeAEPWebSDK() {
  // Load the alloy.js library from Adobe CDN
  const script = document.createElement('script');
  script.src = 'https://cdn1.adoberesources.net/alloy/2.22.0/alloy.min.js';
  script.async = true;
  
  return new Promise((resolve, reject) => {
    script.onload = () => {
      console.log('✅ Adobe Web SDK loaded');
      
      // Configure the Web SDK with push notifications
      window.alloy('configure', {
        datastreamId: AEP_CONFIG.datastreamId,
        orgId: AEP_CONFIG.orgId,
        edgeDomain: 'edge.adobedc.net',
        
        // Push Notifications Configuration
        pushNotifications: {
          vapidPublicKey: AEP_CONFIG.vapidPublicKey,
          applicationId: AEP_CONFIG.applicationId,
          trackingDatasetId: AEP_CONFIG.trackingDatasetId,
        },
        
        // Enable debugging in development
        debugEnabled: window.location.hostname === 'localhost' || window.location.hostname.includes('hlx.page'),
        
        // Default consent
        defaultConsent: 'pending',
      });
      
      console.log('✅ Adobe Web SDK configured with push notifications');
      resolve();
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Adobe Web SDK');
      reject(new Error('Failed to load Adobe Web SDK'));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Register the service worker for push notifications
 */
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ Service Workers not supported in this browser');
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });
    
    console.log('✅ Service Worker registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    return false;
  }
}

/**
 * Initialize AEP Web SDK on page load
 */
export async function initializeAEP() {
  try {
    // Register service worker first
    await registerServiceWorker();
    
    // Then initialize Web SDK
    await initializeAEPWebSDK();
    
    // Dispatch custom event to notify that AEP is ready
    window.dispatchEvent(new CustomEvent('aep-ready'));
    
    return true;
  } catch (error) {
    console.error('❌ AEP initialization failed:', error);
    return false;
  }
}

/**
 * Send page view event
 */
export function sendPageView(pageName) {
  if (typeof window.alloy === 'function') {
    window.alloy('sendEvent', {
      xdm: {
        eventType: 'web.webpagedetails.pageViews',
        web: {
          webPageDetails: {
            name: pageName || document.title,
            URL: window.location.href,
          },
        },
      },
    });
  }
}

/**
 * Set user consent
 */
export function setConsent(consentValue) {
  if (typeof window.alloy === 'function') {
    window.alloy('setConsent', {
      consent: [{
        standard: 'Adobe',
        version: '2.0',
        value: {
          collect: { val: consentValue },
          personalize: { val: consentValue },
        },
      }],
    });
  }
}
