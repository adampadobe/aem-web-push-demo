/**
 * Service Worker for Push Notifications
 * This service worker handles push notification events
 */

// Service worker version - update this when you make changes
const SW_VERSION = '1.0.0';

console.log(`Service Worker ${SW_VERSION} loading...`);

/**
 * Install event - called when service worker is first installed
 */
self.addEventListener('install', (event) => {
  console.log(`Service Worker ${SW_VERSION} installed`);
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

/**
 * Activate event - called when service worker becomes active
 */
self.addEventListener('activate', (event) => {
  console.log(`Service Worker ${SW_VERSION} activated`);
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

/**
 * Push event - called when a push notification is received
 */
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'New Notification',
    body: 'You have a new message',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    data: {
      url: self.registration.scope,
    },
  };
  
  // Parse push notification data if available
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('Push payload:', payload);
      
      // Adobe Journey Optimizer push notification format
      if (payload.title) notificationData.title = payload.title;
      if (payload.body) notificationData.body = payload.body;
      if (payload.icon) notificationData.icon = payload.icon;
      if (payload.image) notificationData.image = payload.image;
      if (payload.badge) notificationData.badge = payload.badge;
      if (payload.clickAction) notificationData.data.url = payload.clickAction;
      if (payload.data) notificationData.data = { ...notificationData.data, ...payload.data };
      
      // Custom actions
      if (payload.actions && Array.isArray(payload.actions)) {
        notificationData.actions = payload.actions;
      }
      
    } catch (error) {
      console.error('Failed to parse push data:', error);
      // Use text data if JSON parsing fails
      notificationData.body = event.data.text();
    }
  }
  
  // Show the notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      image: notificationData.image,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: false,
      tag: 'ajo-push-notification',
    })
  );
});

/**
 * Notification click event - called when user clicks on a notification
 */
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Get the URL to open from notification data
  const urlToOpen = event.notification.data?.url || self.registration.scope;
  
  // Handle action buttons if clicked
  if (event.action) {
    console.log('Action clicked:', event.action);
    // Handle custom actions here
  }
  
  // Open or focus the page
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open with this URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

/**
 * Notification close event - called when notification is closed without clicking
 */
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Track notification dismissal if needed
  // You can send this data back to Adobe Analytics via Web SDK
});

/**
 * Message event - allows communication between the page and service worker
 */
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle other message types as needed
});

console.log(`Service Worker ${SW_VERSION} loaded successfully`);
