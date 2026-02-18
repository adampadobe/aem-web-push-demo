/**
 * Push Notifications Module
 * Handles push notification subscription and management
 */

/**
 * Check if push notifications are supported
 */
export function isPushSupported() {
  return 'Notification' in window && 
         'serviceWorker' in navigator && 
         'PushManager' in window;
}

/**
 * Get current notification permission status
 */
export function getPermissionStatus() {
  if (!isPushSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission() {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }
  
  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Subscribe to push notifications
 * This registers the user's subscription with Adobe Experience Platform
 */
export async function subscribeToPushNotifications() {
  try {
    // Check if already supported
    if (!isPushSupported()) {
      throw new Error('Push notifications are not supported');
    }
    
    // Request permission
    const permission = await requestNotificationPermission();
    
    if (permission !== 'granted') {
      console.log('⚠️ Notification permission denied');
      return { success: false, reason: 'permission_denied' };
    }
    
    console.log('✅ Notification permission granted');
    
    // Wait for AEP SDK to be ready
    if (typeof window.alloy !== 'function') {
      console.log('⏳ Waiting for AEP SDK...');
      await new Promise((resolve) => {
        window.addEventListener('aep-ready', resolve, { once: true });
      });
    }
    
    // Register the push subscription with Adobe
    await window.alloy('sendPushSubscription');
    
    console.log('✅ Push subscription registered with Adobe');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Failed to subscribe to push notifications:', error);
    return { success: false, reason: error.message };
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log('✅ Unsubscribed from push notifications');
      return { success: true };
    }
    
    return { success: false, reason: 'no_subscription' };
  } catch (error) {
    console.error('❌ Failed to unsubscribe:', error);
    return { success: false, reason: error.message };
  }
}

/**
 * Check if user is currently subscribed
 */
export async function isSubscribed() {
  try {
    if (!isPushSupported()) {
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    return subscription !== null;
  } catch (error) {
    console.error('❌ Failed to check subscription status:', error);
    return false;
  }
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      return null;
    }
    
    return {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
        auth: arrayBufferToBase64(subscription.getKey('auth')),
      },
    };
  } catch (error) {
    console.error('❌ Failed to get subscription details:', error);
    return null;
  }
}

/**
 * Helper function to convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return window.btoa(binary);
}

/**
 * Show a test notification (requires permission)
 */
export async function showTestNotification() {
  if (Notification.permission !== 'granted') {
    throw new Error('Notification permission not granted');
  }
  
  const registration = await navigator.serviceWorker.ready;
  
  await registration.showNotification('Test Notification', {
    body: 'This is a test notification from your AEM site',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: 'test-notification',
    requireInteraction: false,
    data: {
      url: window.location.origin,
    },
  });
}
