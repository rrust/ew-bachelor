// js/notifications.js
// Local notifications and app badge for achievement alerts

/**
 * Check if notifications are supported
 * @returns {boolean}
 */
function isNotificationSupported() {
  return 'Notification' in window;
}

/**
 * Check if the Badge API is supported
 * @returns {boolean}
 */
function isBadgeSupported() {
  return 'setAppBadge' in navigator;
}

/**
 * Request notification permission
 * @returns {Promise<string>} 'granted', 'denied', or 'default'
 */
async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    console.log('[Notifications] Not supported in this browser');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * Show a notification for achievement alerts
 * @param {Object} alerts - The alerts object from getAchievementAlerts()
 */
async function showAlertNotification(alerts) {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;
  if (!alerts || alerts.total === 0) return;

  // Don't spam - check if we already showed a notification today
  const lastNotification = localStorage.getItem('lastAlertNotification');
  const today = new Date().toDateString();
  if (lastNotification === today) {
    console.log('[Notifications] Already showed notification today');
    return;
  }

  // Build notification text
  let title = '';
  let body = '';
  let icon = 'icons/icon-192.png';

  if (alerts.expired.length > 0 && alerts.expiringSoon.length > 0) {
    title = `${alerts.total} Achievements brauchen Aufmerksamkeit`;
    body = `${alerts.expired.length} abgelaufen, ${alerts.expiringSoon.length} laufen bald ab`;
  } else if (alerts.expired.length > 0) {
    title = `${alerts.expired.length} Achievement${
      alerts.expired.length > 1 ? 's' : ''
    } abgelaufen`;
    body = alerts.expired.map((a) => a.title).join(', ');
  } else {
    title = `${alerts.expiringSoon.length} Achievement${
      alerts.expiringSoon.length > 1 ? 's' : ''
    } laufen bald ab`;
    body = alerts.expiringSoon.map((a) => a.title).join(', ');
  }

  console.log('[Notifications] Creating notification:', { title, body, icon });

  // Try Service Worker notification first (required for Android PWA)
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
        icon: icon,
        badge: icon,
        tag: 'achievement-alerts',
        requireInteraction: false,
        silent: false,
        data: { url: '#/alerts' }
      });
      console.log('[Notifications] SW notification shown successfully');
      localStorage.setItem('lastAlertNotification', today);
      return;
    } catch (swError) {
      console.log('[Notifications] SW notification failed, trying fallback:', swError);
    }
  }

  // Fallback to regular Notification API (works on desktop)
  try {
    const notification = new Notification(title, {
      body: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
      icon: icon,
      badge: icon,
      tag: 'achievement-alerts',
      requireInteraction: false,
      silent: false
    });

    console.log('[Notifications] Notification created:', notification);

    notification.onclick = function () {
      window.focus();
      window.location.hash = '#/alerts';
      notification.close();
    };

    localStorage.setItem('lastAlertNotification', today);
    console.log('[Notifications] Showed alert notification successfully');
  } catch (error) {
    console.error('[Notifications] Failed to create notification:', error);
  }
}

/**
 * Update the app badge with the number of alerts
 * @param {number} count - Number of alerts to show
 */
async function updateAppBadge(count) {
  if (!isBadgeSupported()) {
    console.log('[Notifications] Badge API not supported');
    return;
  }

  try {
    if (count > 0) {
      await navigator.setAppBadge(count);
      console.log('[Notifications] App badge set to', count);
    } else {
      await navigator.clearAppBadge();
      console.log('[Notifications] App badge cleared');
    }
  } catch (error) {
    console.error('[Notifications] Failed to set app badge:', error);
  }
}

/**
 * Initialize notifications on app start
 * - Check for alerts
 * - Update app badge
 * - Show notification if needed and permission granted
 */
async function initNotifications() {
  console.log('[Notifications] Initializing...');

  // Wait a moment for alerts module to be ready
  if (!window.getAchievementAlerts) {
    console.log('[Notifications] Alerts module not ready');
    return;
  }

  const alerts = window.getAchievementAlerts();
  console.log('[Notifications] Found', alerts.total, 'alerts');

  // Update app badge
  await updateAppBadge(alerts.total);

  // Show notification if there are alerts and permission is granted
  if (alerts.total > 0) {
    console.log('[Notifications] Permission status:', Notification.permission);
    showAlertNotification(alerts);
  }
}

/**
 * Check if we should prompt for notification permission
 * Only prompt once per session and if there are alerts
 * @returns {boolean}
 */
function shouldPromptForPermission() {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === 'granted') return false;
  if (Notification.permission === 'denied') return false;

  // Check if we already prompted this session
  if (sessionStorage.getItem('notificationPrompted')) return false;

  return true;
}

/**
 * Show a prompt to enable notifications
 * Call this when user visits the alerts page
 */
async function promptForNotificationsIfNeeded() {
  if (!shouldPromptForPermission()) return;

  // Only prompt if there are alerts
  const alerts = window.getAchievementAlerts
    ? window.getAchievementAlerts()
    : null;
  if (!alerts || alerts.total === 0) return;

  sessionStorage.setItem('notificationPrompted', 'true');

  // Show a nice in-app prompt first
  const container = document.getElementById('alerts-content');
  if (!container) return;

  const promptHTML = `
    <div id="notification-prompt" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div class="flex items-start gap-3">
        <span class="flex-shrink-0 mt-0.5">${
          window.Icons ? Icons.get('bell', 'w-5 h-5', 'text-blue-500') : '🔔'
        }</span>
        <div class="flex-grow">
          <p class="font-medium text-blue-800 dark:text-blue-200 mb-1">Benachrichtigungen aktivieren?</p>
          <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Erhalte eine Erinnerung wenn Achievements ablaufen.
          </p>
          <div class="flex gap-2">
            <button
              onclick="enableNotifications()"
              class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aktivieren
            </button>
            <button
              onclick="dismissNotificationPrompt()"
              class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Später
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insert at beginning of alerts content
  container.insertAdjacentHTML('afterbegin', promptHTML);
}

/**
 * Enable notifications (called from prompt button)
 */
async function enableNotifications() {
  const permission = await requestNotificationPermission();

  // Re-render alerts view to show updated status
  if (window.renderAlertsView) {
    window.renderAlertsView();
  }

  if (permission === 'granted') {
    // Show test notification
    setTimeout(() => {
      const alerts = window.getAchievementAlerts
        ? window.getAchievementAlerts()
        : null;
      if (alerts && alerts.total > 0) {
        // Clear the "already showed today" flag to show notification
        localStorage.removeItem('lastAlertNotification');
        showAlertNotification(alerts);
      }
    }, 500);
  }
}
/**
 * Dismiss the notification prompt
 */
function dismissNotificationPrompt() {
  const promptEl = document.getElementById('notification-prompt');
  if (promptEl) {
    promptEl.remove();
  }
}

/**
 * [DEV MODE] Force show a test notification (bypasses daily limit)
 * Shows visual feedback in a toast instead of alert()
 */
function testNotification() {
  const results = [];

  // Check support
  const supported = isNotificationSupported();
  results.push(`Unterstützt: ${supported ? '✅' : '❌'}`);

  if (!supported) {
    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      results.push('iOS erkannt - Notifications nur ab iOS 16.4+ in PWA');
      results.push('PWA muss zum Home-Screen hinzugefügt sein');
    }
    showTestResult(results, 'error');
    return;
  }

  // Check permission
  const permission = Notification.permission;
  results.push(`Permission: ${permission}`);

  if (permission === 'default') {
    results.push('Klicke erst "Aktivieren" oben');
    showTestResult(results, 'warning');
    return;
  }

  if (permission === 'denied') {
    results.push('Blockiert - In Browser-Einstellungen erlauben');
    showTestResult(results, 'error');
    return;
  }

  // Check alerts
  const alerts = window.getAchievementAlerts
    ? window.getAchievementAlerts()
    : null;
  results.push(`Alerts: ${alerts ? alerts.total : 0}`);

  if (!alerts || alerts.total === 0) {
    results.push('Keine Alerts - Klicke erst "Demo-Alerts"');
    showTestResult(results, 'warning');
    return;
  }

  // Clear daily limit and show
  localStorage.removeItem('lastAlertNotification');

  try {
    showAlertNotification(alerts);
    results.push('Notification gesendet! 🔔');
    showTestResult(results, 'success');
  } catch (e) {
    results.push('Fehler: ' + e.message);
    showTestResult(results, 'error');
  }
}

/**
 * Show test result as a toast on the page
 */
function showTestResult(messages, type) {
  // Remove existing toast
  const existing = document.getElementById('notification-test-toast');
  if (existing) existing.remove();

  const colors = {
    success:
      'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300',
    warning:
      'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300',
    error:
      'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
  };

  const toast = document.createElement('div');
  toast.id = 'notification-test-toast';
  toast.className = `fixed bottom-4 left-4 right-4 p-4 rounded-lg border ${colors[type]} z-50 shadow-lg`;
  toast.innerHTML = `
    <div class="font-medium mb-1">Notification Test</div>
    <div class="text-sm space-y-1">
      ${messages.map((m) => `<div>${m}</div>`).join('')}
    </div>
    <button onclick="this.parentElement.remove()" class="absolute top-2 right-2 opacity-50 hover:opacity-100">✕</button>
  `;

  document.body.appendChild(toast);

  // Auto-remove after 8 seconds
  setTimeout(() => toast.remove(), 8000);

  // Also log to console
  console.log('[Notifications Test]', messages);
}

/**
 * [DEV MODE] Show notification debug info
 */
function debugNotifications() {
  const info = {
    supported: isNotificationSupported(),
    permission: 'Notification' in window ? Notification.permission : 'N/A',
    badgeSupported: isBadgeSupported(),
    lastNotification: localStorage.getItem('lastAlertNotification'),
    today: new Date().toDateString(),
    alerts: window.getAchievementAlerts ? window.getAchievementAlerts() : null
  };
  console.table(info);
  return info;
}

// Expose to global scope
window.Notifications = {
  isSupported: isNotificationSupported,
  isBadgeSupported: isBadgeSupported,
  requestPermission: requestNotificationPermission,
  showAlertNotification: showAlertNotification,
  updateAppBadge: updateAppBadge,
  init: initNotifications,
  promptIfNeeded: promptForNotificationsIfNeeded,
  test: testNotification,
  debug: debugNotifications
};

// Also expose individual functions for onclick handlers
window.enableNotifications = enableNotifications;
window.dismissNotificationPrompt = dismissNotificationPrompt;
window.testNotification = testNotification;
