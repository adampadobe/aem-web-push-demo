/**
 * Push Demo Block
 * Interactive web push notification demo
 */

import { 
  isPushSupported, 
  getPermissionStatus,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isSubscribed,
  getSubscriptionDetails,
  showTestNotification
} from '../../scripts/push-notifications.js';

export default async function decorate(block) {
  // Create the push demo UI
  block.innerHTML = `
    <div class="push-demo-container">
      <div class="status-display" id="status-display">
        <div class="status-item">
          <strong>Browser Support:</strong> <span id="browser-support">Checking...</span>
        </div>
        <div class="status-item">
          <strong>Permission Status:</strong> <span id="permission-status">Checking...</span>
        </div>
        <div class="status-item">
          <strong>Subscription Status:</strong> <span id="subscription-status">Checking...</span>
        </div>
        <div class="status-item">
          <strong>AEP SDK Status:</strong> <span id="aep-status">Loading...</span>
        </div>
      </div>

      <div class="button-group">
        <button id="subscribe-btn" class="button primary">
          Enable Push Notifications
        </button>
        <button id="unsubscribe-btn" class="button secondary" disabled>
          Disable Push Notifications
        </button>
        <button id="test-notification-btn" class="button" disabled>
          Show Test Notification
        </button>
      </div>

      <div class="info-box" id="info-box" style="display: none;">
        <p id="info-message"></p>
      </div>

      <div class="subscription-details" id="subscription-details" style="display: none;">
        <h3>Subscription Details</h3>
        <pre id="subscription-json"></pre>
      </div>
    </div>
  `;

  // Get DOM elements
  const subscribeBtn = block.querySelector('#subscribe-btn');
  const unsubscribeBtn = block.querySelector('#unsubscribe-btn');
  const testNotificationBtn = block.querySelector('#test-notification-btn');
  const infoBox = block.querySelector('#info-box');
  const infoMessage = block.querySelector('#info-message');
  const subscriptionDetailsEl = block.querySelector('#subscription-details');
  const subscriptionJsonEl = block.querySelector('#subscription-json');

  // Status display elements
  const browserSupportEl = block.querySelector('#browser-support');
  const permissionStatusEl = block.querySelector('#permission-status');
  const subscriptionStatusEl = block.querySelector('#subscription-status');
  const aepStatusEl = block.querySelector('#aep-status');

  // Update UI based on current status
  async function updateUI() {
    // Browser support
    const supported = isPushSupported();
    browserSupportEl.textContent = supported ? '✅ Supported' : '❌ Not Supported';
    browserSupportEl.className = supported ? 'status-success' : 'status-error';

    if (!supported) {
      subscribeBtn.disabled = true;
      return;
    }

    // Permission status
    const permission = getPermissionStatus();
    permissionStatusEl.textContent = permission === 'granted' ? '✅ Granted' : 
                                     permission === 'denied' ? '❌ Denied' : 
                                     '⚠️ Not Requested';
    permissionStatusEl.className = permission === 'granted' ? 'status-success' : 
                                   permission === 'denied' ? 'status-error' : 
                                   'status-warning';

    // Subscription status
    const subscribed = await isSubscribed();
    subscriptionStatusEl.textContent = subscribed ? '✅ Active' : '❌ Not Subscribed';
    subscriptionStatusEl.className = subscribed ? 'status-success' : 'status-error';

    // Update button states
    if (subscribed) {
      subscribeBtn.disabled = true;
      unsubscribeBtn.disabled = false;
      testNotificationBtn.disabled = false;

      // Show subscription details
      const details = await getSubscriptionDetails();
      if (details) {
        subscriptionDetailsEl.style.display = 'block';
        subscriptionJsonEl.textContent = JSON.stringify(details, null, 2);
      }
    } else {
      subscribeBtn.disabled = permission === 'denied';
      unsubscribeBtn.disabled = true;
      testNotificationBtn.disabled = true;
      subscriptionDetailsEl.style.display = 'none';
    }
  }

  // Show info message
  function showInfo(message, type = 'info') {
    infoMessage.textContent = message;
    infoBox.className = `info-box info-${type}`;
    infoBox.style.display = 'block';
    
    setTimeout(() => {
      infoBox.style.display = 'none';
    }, 5000);
  }

  // Subscribe button click
  subscribeBtn.addEventListener('click', async () => {
    subscribeBtn.disabled = true;
    subscribeBtn.textContent = 'Subscribing...';

    const result = await subscribeToPushNotifications();

    if (result.success) {
      showInfo('✅ Successfully subscribed to push notifications!', 'success');
    } else {
      if (result.reason === 'permission_denied') {
        showInfo('❌ Permission denied. Please allow notifications in your browser settings.', 'error');
      } else {
        showInfo(`❌ Failed to subscribe: ${result.reason}`, 'error');
      }
    }

    subscribeBtn.textContent = 'Enable Push Notifications';
    await updateUI();
  });

  // Unsubscribe button click
  unsubscribeBtn.addEventListener('click', async () => {
    unsubscribeBtn.disabled = true;
    unsubscribeBtn.textContent = 'Unsubscribing...';

    const result = await unsubscribeFromPushNotifications();

    if (result.success) {
      showInfo('✅ Successfully unsubscribed from push notifications', 'success');
    } else {
      showInfo(`❌ Failed to unsubscribe: ${result.reason}`, 'error');
    }

    unsubscribeBtn.textContent = 'Disable Push Notifications';
    await updateUI();
  });

  // Test notification button click
  testNotificationBtn.addEventListener('click', async () => {
    try {
      await showTestNotification();
      showInfo('✅ Test notification sent!', 'success');
    } catch (error) {
      showInfo(`❌ Failed to show notification: ${error.message}`, 'error');
    }
  });

  // Listen for AEP ready event
  window.addEventListener('aep-ready', () => {
    aepStatusEl.textContent = '✅ Ready';
    aepStatusEl.className = 'status-success';
    updateUI();
  });

  // Initial UI update
  setTimeout(() => {
    const aepReady = typeof window.alloy === 'function';
    aepStatusEl.textContent = aepReady ? '✅ Ready' : '⏳ Loading...';
    aepStatusEl.className = aepReady ? 'status-success' : 'status-warning';
    updateUI();
  }, 1000);
}
