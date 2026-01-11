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
function showAlertNotification(alerts) {
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
  let icon = '/icons/icon-192x192.png';

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

  // Create and show notification
  const notification = new Notification(title, {
    body: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
    icon: icon,
    badge: icon,
    tag: 'achievement-alerts', // Prevents duplicate notifications
    requireInteraction: false,
    silent: false
  });

  // Handle click - open alerts page
  notification.onclick = function () {
    window.focus();
    window.location.hash = '#/alerts';
    notification.close();
  };

  // Remember that we showed a notification today
  localStorage.setItem('lastAlertNotification', today);
  console.log('[Notifications] Showed alert notification');
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
  // Wait a moment for alerts module to be ready
  if (!window.getAchievementAlerts) {
    console.log('[Notifications] Alerts module not ready');
    return;
  }

  const alerts = window.getAchievementAlerts();

  // Update app badge
  await updateAppBadge(alerts.total);

  // Show notification if there are alerts
  if (alerts.total > 0) {
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

  const promptEl = document.getElementById('notification-prompt');
  if (promptEl) {
    if (permission === 'granted') {
      promptEl.innerHTML = `
        <div class="flex items-center gap-2 text-green-700 dark:text-green-300">
          ${window.Icons ? Icons.get('checkCircle', 'w-5 h-5') : '✓'}
          <span>Benachrichtigungen aktiviert!</span>
        </div>
      `;
      promptEl.className =
        'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4';

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

      // Remove after 3 seconds
      setTimeout(() => promptEl.remove(), 3000);
    } else {
      promptEl.innerHTML = `
        <div class="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
          ${window.Icons ? Icons.get('exclamation', 'w-5 h-5') : '⚠️'}
          <span>Benachrichtigungen wurden blockiert. Du kannst sie in den Browser-Einstellungen aktivieren.</span>
        </div>
      `;
      promptEl.className =
        'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4';
    }
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

// Expose to global scope
window.Notifications = {
  isSupported: isNotificationSupported,
  isBadgeSupported: isBadgeSupported,
  requestPermission: requestNotificationPermission,
  showAlertNotification: showAlertNotification,
  updateAppBadge: updateAppBadge,
  init: initNotifications,
  promptIfNeeded: promptForNotificationsIfNeeded
};

// Also expose individual functions for onclick handlers
window.enableNotifications = enableNotifications;
window.dismissNotificationPrompt = dismissNotificationPrompt;
