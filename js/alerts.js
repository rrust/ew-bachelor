// js/alerts.js
// Achievement expiration alerts and renewal system

const EXPIRING_SOON_DAYS = 7; // Days before expiration to show warning

/**
 * Get all achievements that need attention (expired or expiring soon)
 * @returns {Object} { expired: [], expiringSoon: [], total: number }
 */
function getAchievementAlerts() {
  const progress = window.getUserProgress ? window.getUserProgress() : null;
  if (!progress) return { expired: [], expiringSoon: [], total: 0 };

  const now = new Date();
  const expired = [];
  const expiringSoon = [];

  for (const moduleId in progress.modules) {
    const achievements = progress.modules[moduleId].achievements;
    if (!achievements) continue;

    for (const achievementId in achievements) {
      const achievementProgress = achievements[achievementId];
      if (!achievementProgress.expiresAt) continue;

      const expiresAt = new Date(achievementProgress.expiresAt);
      const daysRemaining = Math.ceil(
        (expiresAt - now) / (1000 * 60 * 60 * 24)
      );

      // Get achievement metadata from APP_CONTENT
      const achievement = window.APP_CONTENT?.achievements?.[achievementId];
      if (!achievement) continue;

      const alertItem = {
        achievementId,
        moduleId,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        expiresAt: expiresAt,
        daysRemaining: daysRemaining,
        status: achievementProgress.status,
        unlockCondition: achievement.unlockCondition
      };

      if (expiresAt < now) {
        // Already expired
        alertItem.alertType = 'expired';
        expired.push(alertItem);
      } else if (daysRemaining <= EXPIRING_SOON_DAYS) {
        // Expiring soon
        alertItem.alertType = 'expiring-soon';
        expiringSoon.push(alertItem);
      }
    }
  }

  // Sort by expiration date (most urgent first)
  expired.sort((a, b) => a.expiresAt - b.expiresAt);
  expiringSoon.sort((a, b) => a.expiresAt - b.expiresAt);

  return {
    expired,
    expiringSoon,
    total: expired.length + expiringSoon.length
  };
}

/**
 * Get alert badge info for header display
 * @returns {Object|null} { count: number, color: 'red'|'yellow' } or null if no alerts
 */
function getAlertBadgeInfo() {
  const alerts = getAchievementAlerts();

  if (alerts.total === 0) {
    return null;
  }

  return {
    count: alerts.total,
    color: alerts.expired.length > 0 ? 'red' : 'yellow'
  };
}

/**
 * Update the alert badge in the header
 */
function updateAlertBadge() {
  const badges = document.querySelectorAll('[id^="alert-badge"]');
  const badgeInfo = getAlertBadgeInfo();

  badges.forEach((badge) => {
    if (!badgeInfo) {
      badge.classList.add('hidden');
    } else {
      badge.classList.remove('hidden');
      badge.textContent = badgeInfo.count > 9 ? '9+' : badgeInfo.count;

      // Update color
      badge.classList.remove('bg-red-500', 'bg-yellow-500');
      badge.classList.add(
        badgeInfo.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'
      );
    }
  });
}

/**
 * Render the alerts view content
 */
function renderAlertsView() {
  const container = document.getElementById('alerts-content');
  if (!container) return;

  const alerts = getAchievementAlerts();
  const isDevMode = window.isDevMode && window.isDevMode();

  let html = '';

  // Header with title and status icons
  html += `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Benachrichtigungen</h2>
      <div class="flex items-center gap-1">
        ${renderNotificationStatusIcon()}
        <button
          id="alerts-help-button"
          onclick="toggleAlertsHelp()"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Hilfe"
        >
          <span id="alerts-help-icon" class="text-gray-500 dark:text-gray-400">
            ${Icons.get('questionCircle', 'w-5 h-5')}
          </span>
        </button>
      </div>
    </div>
  `;

  // Help section (hidden by default)
  html += `
    <div id="alerts-help" class="hidden bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div class="flex items-start justify-between gap-2">
        <div class="text-sm text-blue-800 dark:text-blue-200">
          <p class="font-medium mb-2">So funktioniert die Verlängerung:</p>
          <ul class="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
            <li><strong>Bald ablaufend:</strong> Beantworte nur 1 Frage aus dem Quiz richtig</li>
            <li><strong>Abgelaufen:</strong> Schließe den gesamten Test erneut mit Gold ab</li>
          </ul>
        </div>
        <button onclick="toggleAlertsHelp()" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          ${Icons.get('close', 'w-4 h-4')}
        </button>
      </div>
    </div>
  `;

  // Dev Mode section
  if (isDevMode) {
    html += `
      <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-bold px-2 py-0.5 rounded bg-orange-500 text-white">DEV</span>
          <span class="text-sm font-medium text-orange-800 dark:text-orange-200">Test-Funktionen</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            onclick="generateDemoAlerts()"
            class="flex items-center gap-1 text-xs px-3 py-1.5 bg-orange-100 dark:bg-orange-800/30 border border-orange-300 dark:border-orange-600 rounded hover:bg-orange-200 dark:hover:bg-orange-700/30 transition-colors"
          >
            ${Icons.get('plus', 'w-3 h-3')} Demo-Alerts
          </button>
          <button
            onclick="testNotification()"
            class="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-800/30 border border-blue-300 dark:border-blue-600 rounded hover:bg-blue-200 dark:hover:bg-blue-700/30 transition-colors text-blue-700 dark:text-blue-300"
          >
            ${Icons.get('bell', 'w-3 h-3')} Test Push
          </button>
          <button
            onclick="clearDemoAlerts()"
            class="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded hover:bg-red-200 dark:hover:bg-red-700/30 transition-colors text-red-700 dark:text-red-300"
          >
            ${Icons.get('trash', 'w-3 h-3')} Löschen
          </button>
        </div>
      </div>
    `;
  }

  if (alerts.total === 0) {
    html += `
      <div class="text-center py-12 text-gray-500 dark:text-gray-400">
        <div class="mb-3">${Icons.get(
          'bell',
          'w-16 h-16 mx-auto',
          'text-gray-300 dark:text-gray-600'
        )}</div>
        <p class="text-lg font-medium">Keine Benachrichtigungen</p>
        <p class="text-sm">Alle deine Achievements sind aktuell.</p>
      </div>
    `;
  } else {
    // Expired achievements

    // Expired achievements
    if (alerts.expired.length > 0) {
      html += `
        <div class="mb-6">
          <h3 class="flex items-center gap-2 text-lg font-bold text-red-600 dark:text-red-400 mb-3">
            ${Icons.get('exclamation', 'w-5 h-5')}
            Abgelaufen (${alerts.expired.length})
          </h3>
          <div class="space-y-3">
            ${alerts.expired.map((alert) => renderAlertCard(alert)).join('')}
          </div>
        </div>
      `;
    }

    // Expiring soon
    if (alerts.expiringSoon.length > 0) {
      html += `
        <div class="mb-6">
          <h3 class="flex items-center gap-2 text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-3">
            ${Icons.get('clock', 'w-5 h-5')}
            Läuft bald ab (${alerts.expiringSoon.length})
          </h3>
          <div class="space-y-3">
            ${alerts.expiringSoon
              .map((alert) => renderAlertCard(alert))
              .join('')}
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = html;
}

/**
 * Render a single alert card
 */
function renderAlertCard(alert) {
  const isExpired = alert.alertType === 'expired';
  const borderColor = isExpired
    ? 'border-red-300 dark:border-red-700'
    : 'border-yellow-300 dark:border-yellow-700';
  const bgColor = isExpired
    ? 'bg-red-50 dark:bg-red-900/10'
    : 'bg-yellow-50 dark:bg-yellow-900/10';

  const expirationText = isExpired
    ? `Abgelaufen vor ${Math.abs(alert.daysRemaining)} Tag${
        Math.abs(alert.daysRemaining) !== 1 ? 'en' : ''
      }`
    : `Läuft ab in ${alert.daysRemaining} Tag${
        alert.daysRemaining !== 1 ? 'en' : ''
      }`;

  const buttonText = isExpired ? 'Test wiederholen' : 'Schnell verlängern';
  const buttonClass = isExpired
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-yellow-600 hover:bg-yellow-700';

  return `
    <div class="border ${borderColor} ${bgColor} rounded-lg p-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3 min-w-0">
          <span class="text-2xl flex-shrink-0">${
            alert.icon
              ? Icons.get(alert.icon, 'w-8 h-8')
              : Icons.get('trophy', 'w-8 h-8')
          }</span>
          <div class="min-w-0">
            <h4 class="font-medium text-gray-900 dark:text-gray-100 truncate">${
              alert.title
            }</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">${
              alert.description
            }</p>
            <p class="text-xs mt-1 ${
              isExpired
                ? 'text-red-600 dark:text-red-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }">
              ${Icons.get('clock', 'w-3 h-3 inline-block mr-1')}
              ${expirationText}
            </p>
          </div>
        </div>
        <button
          onclick="startRenewal('${alert.achievementId}', '${
    alert.moduleId
  }', ${isExpired})"
          class="flex-shrink-0 flex items-center gap-2 px-4 py-2 ${buttonClass} text-white text-sm font-medium rounded-lg transition-colors"
        >
          ${Icons.get('refresh', 'w-4 h-4')}
          <span class="hidden sm:inline">${buttonText}</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Start the renewal process for an achievement
 * @param {string} achievementId - The achievement to renew
 * @param {string} moduleId - The module containing the achievement
 * @param {boolean} isExpired - Whether the achievement is expired (requires full test)
 */
function startRenewal(achievementId, moduleId, isExpired) {
  const achievement = window.APP_CONTENT?.achievements?.[achievementId];
  if (!achievement) {
    alert('Achievement nicht gefunden');
    return;
  }

  const condition = achievement.unlockCondition;
  if (!condition || !condition.lectureId) {
    alert('Keine Verlängerungsmöglichkeit für dieses Achievement');
    return;
  }

  // Store renewal info in sessionStorage
  const renewalInfo = {
    achievementId,
    moduleId,
    lectureId: condition.lectureId,
    isExpired,
    quickRenewal: !isExpired // Quick renewal = only 1 question needed
  };
  sessionStorage.setItem('achievementRenewal', JSON.stringify(renewalInfo));

  if (isExpired) {
    // Full quiz required - navigate to the quiz
    window.location.hash = `#/module/${moduleId}/lecture/${condition.lectureId}/quiz`;
  } else {
    // Quick renewal - show single question modal
    startQuickRenewal(renewalInfo);
  }
}

/**
 * Start quick renewal with a single question
 */
function startQuickRenewal(renewalInfo) {
  // Navigate to a special quick-renewal mode
  // We'll use a modal for this
  openQuickRenewalModal(renewalInfo);
}

/**
 * Open the quick renewal modal with a random question
 */
async function openQuickRenewalModal(renewalInfo) {
  const modal = document.getElementById('quick-renewal-modal');
  if (!modal) return;

  const content = document.getElementById('quick-renewal-content');
  if (!content) return;

  // Load quiz data - APP_CONTENT structure is APP_CONTENT[moduleId].lectures[lectureId]
  // lecture.quiz is directly the array of questions, not an object with questions property
  const moduleContent = window.APP_CONTENT?.[renewalInfo.moduleId];
  const lecture = moduleContent?.lectures?.[renewalInfo.lectureId];

  // lecture.quiz is the array of questions directly
  const quizQuestions = lecture?.quiz;

  if (
    !lecture ||
    !quizQuestions ||
    !Array.isArray(quizQuestions) ||
    quizQuestions.length === 0
  ) {
    alert('Keine Quiz-Fragen für dieses Achievement gefunden');
    return;
  }

  // Pick a random question
  const questions = quizQuestions;
  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  // Store current question for answer checking
  window.currentRenewalQuestion = {
    ...renewalInfo,
    question,
    questionIndex: randomIndex
  };

  // Render the question
  const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

  content.innerHTML = `
    <div class="mb-6">
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Beantworte diese Frage richtig, um dein Achievement zu verlängern:
      </p>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">${
        question.question
      }</h3>
      <div class="space-y-2" id="renewal-options">
        ${shuffledOptions
          .map(
            (option, i) => `
          <button
            onclick="checkRenewalAnswer('${escapeHtml(option)}')"
            class="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ${option}
          </button>
        `
          )
          .join('')}
      </div>
    </div>
    <div id="renewal-result" class="hidden"></div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Escape HTML for safe insertion
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/'/g, "\\'");
}

/**
 * Check the answer for quick renewal
 */
function checkRenewalAnswer(selectedAnswer) {
  const renewalData = window.currentRenewalQuestion;
  if (!renewalData) return;

  const question = renewalData.question;
  const isCorrect = selectedAnswer === question.correctAnswer;

  const resultDiv = document.getElementById('renewal-result');
  const optionsDiv = document.getElementById('renewal-options');

  if (!resultDiv || !optionsDiv) return;

  // Disable all buttons
  optionsDiv.querySelectorAll('button').forEach((btn) => {
    btn.disabled = true;
    const btnText = btn.textContent.trim();
    if (btnText === question.correctAnswer) {
      btn.classList.add(
        'bg-green-100',
        'dark:bg-green-900/30',
        'border-green-500'
      );
    } else if (btnText === selectedAnswer && !isCorrect) {
      btn.classList.add('bg-red-100', 'dark:bg-red-900/30', 'border-red-500');
    }
  });

  resultDiv.classList.remove('hidden');

  if (isCorrect) {
    // Extend the achievement
    if (window.extendAchievement) {
      window.extendAchievement(renewalData.achievementId, renewalData.moduleId);
    }

    resultDiv.innerHTML = `
      <div class="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 text-center">
        <div class="text-3xl mb-2">🎉</div>
        <p class="font-bold text-green-800 dark:text-green-200">Richtig!</p>
        <p class="text-sm text-green-700 dark:text-green-300">Dein Achievement wurde verlängert.</p>
        <button
          onclick="closeQuickRenewalModal(); updateAlertBadge(); updateAppBadgeFromAlerts(); renderAlertsView();"
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Schließen
        </button>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 text-center">
        <div class="text-3xl mb-2">😔</div>
        <p class="font-bold text-red-800 dark:text-red-200">Leider falsch</p>
        <p class="text-sm text-red-700 dark:text-red-300 mb-2">
          Die richtige Antwort war: <strong>${question.correctAnswer}</strong>
        </p>
        <div class="flex gap-2 justify-center mt-4">
          <button
            onclick="retryQuickRenewal()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nochmal versuchen
          </button>
          <button
            onclick="closeQuickRenewalModal()"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * Retry quick renewal with a new question
 */
function retryQuickRenewal() {
  const renewalData = window.currentRenewalQuestion;
  if (renewalData) {
    openQuickRenewalModal({
      achievementId: renewalData.achievementId,
      moduleId: renewalData.moduleId,
      lectureId: renewalData.lectureId,
      isExpired: renewalData.isExpired,
      quickRenewal: renewalData.quickRenewal
    });
  }
}

/**
 * Close the quick renewal modal
 */
function closeQuickRenewalModal() {
  const modal = document.getElementById('quick-renewal-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  window.currentRenewalQuestion = null;
}

/**
 * Toggle the help section visibility
 */
function toggleAlertsHelp() {
  const helpSection = document.getElementById('alerts-help');
  const helpButton = document.getElementById('alerts-help-button');
  const helpIcon = document.getElementById('alerts-help-icon');

  if (helpSection) {
    const isHidden = helpSection.classList.toggle('hidden');

    // Update button and icon color
    if (helpButton && helpIcon) {
      if (isHidden) {
        helpButton.classList.remove('bg-blue-100', 'dark:bg-blue-900/30');
        helpIcon.classList.remove('text-blue-500');
        helpIcon.classList.add('text-gray-500', 'dark:text-gray-400');
      } else {
        helpButton.classList.add('bg-blue-100', 'dark:bg-blue-900/30');
        helpIcon.classList.add('text-blue-500');
        helpIcon.classList.remove('text-gray-500', 'dark:text-gray-400');
      }
    }
  }
}

/**
 * Enable notifications and re-render the view
 */
async function enableNotificationsAndRefresh() {
  if (window.enableNotifications) {
    await window.enableNotifications();
  }
  // Enable in localStorage
  localStorage.setItem('pushNotificationsEnabled', 'true');
  // Re-render to update the status icon
  renderAlertsView();
}

/**
 * Check if push notifications are enabled (user preference)
 */
function arePushNotificationsEnabled() {
  // If never set, default to true if permission is granted
  const stored = localStorage.getItem('pushNotificationsEnabled');
  if (stored === null) {
    return Notification.permission === 'granted';
  }
  return stored === 'true';
}

/**
 * Toggle push notifications on/off
 */
function togglePushNotifications() {
  const permission = Notification.permission;

  if (permission !== 'granted') {
    // Need to request permission first
    enableNotificationsAndRefresh();
    return;
  }

  const currentlyEnabled = arePushNotificationsEnabled();
  const newState = !currentlyEnabled;

  localStorage.setItem('pushNotificationsEnabled', newState ? 'true' : 'false');

  // Show feedback toast
  showNotificationToggleToast(newState);

  // Re-render to update icon
  renderAlertsView();
}

/**
 * Show toast for notification toggle
 */
function showNotificationToggleToast(enabled) {
  const existing = document.getElementById('notification-toggle-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'notification-toggle-toast';

  if (enabled) {
    toast.className =
      'fixed bottom-20 left-4 right-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg p-3 z-50 shadow-lg text-sm';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        ${Icons.get('checkCircle', 'w-5 h-5', 'text-green-500')}
        <span>Push-Benachrichtigungen aktiviert</span>
      </div>
    `;
  } else {
    toast.className =
      'fixed bottom-20 left-4 right-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg p-3 z-50 shadow-lg text-sm';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        ${Icons.get('close', 'w-5 h-5', 'text-red-500')}
        <span>Push-Benachrichtigungen deaktiviert</span>
      </div>
    `;
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/**
 * Render the notification status icon for the header
 * @returns {string} HTML string
 */
function renderNotificationStatusIcon() {
  const isSupported = 'Notification' in window;

  if (!isSupported) {
    return `
      <span class="p-2" title="Push-Benachrichtigungen nicht unterstützt">
        ${Icons.get('bell', 'w-5 h-5', 'text-gray-300 dark:text-gray-600')}
      </span>
    `;
  }

  const permission = Notification.permission;

  if (permission === 'granted') {
    const enabled = arePushNotificationsEnabled();

    if (enabled) {
      return `
        <button
          onclick="togglePushNotifications()"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Push-Benachrichtigungen aktiv (klicken zum Deaktivieren)"
        >
          ${Icons.get('bell', 'w-5 h-5', 'text-green-500')}
        </button>
      `;
    } else {
      return `
        <button
          onclick="togglePushNotifications()"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Push-Benachrichtigungen deaktiviert (klicken zum Aktivieren)"
        >
          ${Icons.get('bell', 'w-5 h-5', 'text-red-500')}
        </button>
      `;
    }
  } else if (permission === 'denied') {
    return `
      <button
        onclick="alert('Push-Benachrichtigungen sind blockiert. Aktiviere sie in den Browser-Einstellungen.')"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Push-Benachrichtigungen blockiert"
      >
        ${Icons.get('exclamation', 'w-5 h-5', 'text-yellow-500')}
      </button>
    `;
  } else {
    return `
      <button
        onclick="enableNotificationsAndRefresh()"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Push-Benachrichtigungen aktivieren"
      >
        ${Icons.get('bell', 'w-5 h-5', 'text-gray-400 dark:text-gray-500')}
      </button>
    `;
  }
}

/**
 * Render the notification settings section (kept for compatibility)
 * @returns {string} HTML string
 */
function renderNotificationSettings() {
  // Check if notifications are supported
  const isSupported = 'Notification' in window;

  if (!isSupported) {
    return `
      <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-3">
          ${Icons.get('bell', 'w-5 h-5', 'text-gray-400')}
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">Push-Benachrichtigungen</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Nicht unterstützt in diesem Browser</p>
          </div>
        </div>
      </div>
    `;
  }

  const permission = Notification.permission;

  if (permission === 'granted') {
    return `
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            ${Icons.get('checkCircle', 'w-5 h-5', 'text-green-500')}
            <div>
              <p class="font-medium text-green-700 dark:text-green-300">Push-Benachrichtigungen aktiv</p>
              <p class="text-sm text-green-600 dark:text-green-400">Du erhältst Erinnerungen bei ablaufenden Achievements</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (permission === 'denied') {
    return `
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-3">
          ${Icons.get('exclamation', 'w-5 h-5', 'text-yellow-500')}
          <div>
            <p class="font-medium text-yellow-700 dark:text-yellow-300">Push-Benachrichtigungen blockiert</p>
            <p class="text-sm text-yellow-600 dark:text-yellow-400">
              Aktiviere sie in den Browser-Einstellungen, um Erinnerungen zu erhalten.
            </p>
          </div>
        </div>
      </div>
    `;
  } else {
    // Permission not yet requested
    return `
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            ${Icons.get('bell', 'w-5 h-5', 'text-blue-500')}
            <div>
              <p class="font-medium text-blue-700 dark:text-blue-300">Push-Benachrichtigungen</p>
              <p class="text-sm text-blue-600 dark:text-blue-400">Erhalte Erinnerungen bei ablaufenden Achievements</p>
            </div>
          </div>
          <button
            onclick="enableNotifications()"
            class="flex-shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aktivieren
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * Check if quiz completion should trigger achievement renewal
 * Called after quiz is completed
 */
function checkRenewalAfterQuiz(moduleId, lectureId, badge) {
  const renewalInfo = sessionStorage.getItem('achievementRenewal');
  if (!renewalInfo) return;

  const renewal = JSON.parse(renewalInfo);

  // Check if this quiz matches the renewal
  if (renewal.moduleId === moduleId && renewal.lectureId === lectureId) {
    if (badge === 'gold') {
      // Achievement renewed via full quiz
      if (window.extendAchievement) {
        window.extendAchievement(renewal.achievementId, renewal.moduleId);
      }
      sessionStorage.removeItem('achievementRenewal');
    }
  }
}

/**
 * Initialize alerts on page load
 */
function initAlerts() {
  updateAlertBadge();
}

/**
 * [DEV MODE] Generate demo expired/expiring achievements for testing
 */
function generateDemoAlerts() {
  if (!window.isDevMode || !window.isDevMode()) {
    console.warn('[Alerts] Demo generation only available in Dev Mode');
    return;
  }

  const progress = window.getUserProgress ? window.getUserProgress() : null;
  if (!progress) {
    alert('Kein Fortschritt vorhanden');
    return;
  }

  // Find first module with achievements in APP_CONTENT
  const appContent = window.APP_CONTENT;
  if (!appContent || !appContent.achievements) {
    alert('Keine Achievements im Content gefunden');
    return;
  }

  const now = new Date();
  let addedCount = 0;

  for (const achievementId in appContent.achievements) {
    const achievement = appContent.achievements[achievementId];
    const moduleId = achievement.moduleId;

    if (!moduleId) continue;

    // Initialize module if needed
    if (!progress.modules[moduleId]) {
      progress.modules[moduleId] = { lectures: {}, achievements: {} };
    }
    if (!progress.modules[moduleId].achievements) {
      progress.modules[moduleId].achievements = {};
    }

    // Create demo achievement with expiration (overwrite existing for demo purposes)
    let expiresAt;
    let status;

    if (addedCount % 3 === 0) {
      // Expired (3 days ago)
      expiresAt = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      status = 'expired';
    } else if (addedCount % 3 === 1) {
      // Expiring soon (in 3 days)
      expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      status = 'unlocked';
    } else {
      // Expiring (in 6 days)
      expiresAt = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
      status = 'unlocked';
    }

    progress.modules[moduleId].achievements[achievementId] = {
      unlockedAt: new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: status,
      extensionCount: 0
    };

    addedCount++;
    if (addedCount >= 6) break; // Add up to 6 demo achievements
  }

  if (addedCount > 0) {
    window.saveUserProgress(progress);
    updateAlertBadge();
    updateAppBadgeFromAlerts();
    renderAlertsView();
    console.log('[Alerts] Generated', addedCount, 'demo achievement alerts');
  } else {
    alert('Keine Achievements zum Hinzufügen gefunden');
  }
}

/**
 * [DEV MODE] Clear all achievement alerts
 */
function clearDemoAlerts() {
  if (!window.isDevMode || !window.isDevMode()) {
    console.warn('[Alerts] Clear only available in Dev Mode');
    return;
  }

  if (!confirm('Alle Achievement-Daten löschen?')) {
    return;
  }

  const progress = window.getUserProgress ? window.getUserProgress() : null;
  if (!progress) return;

  for (const moduleId in progress.modules) {
    if (progress.modules[moduleId].achievements) {
      progress.modules[moduleId].achievements = {};
    }
  }

  window.saveUserProgress(progress);
  updateAlertBadge();
  updateAppBadgeFromAlerts();
  renderAlertsView();
  console.log('[Alerts] Cleared all achievement data');
}

/**
 * Update the app badge (PWA icon badge) based on current alerts
 */
function updateAppBadgeFromAlerts() {
  if (window.Notifications && window.Notifications.updateAppBadge) {
    const alerts = getAchievementAlerts();
    window.Notifications.updateAppBadge(alerts.total);
  }
}

// Expose to global scope
window.getAchievementAlerts = getAchievementAlerts;
window.getAlertBadgeInfo = getAlertBadgeInfo;
window.updateAlertBadge = updateAlertBadge;
window.updateAppBadgeFromAlerts = updateAppBadgeFromAlerts;
window.renderAlertsView = renderAlertsView;
window.toggleAlertsHelp = toggleAlertsHelp;
window.enableNotificationsAndRefresh = enableNotificationsAndRefresh;
window.startRenewal = startRenewal;
window.openQuickRenewalModal = openQuickRenewalModal;
window.checkRenewalAnswer = checkRenewalAnswer;
window.retryQuickRenewal = retryQuickRenewal;
window.closeQuickRenewalModal = closeQuickRenewalModal;
window.checkRenewalAfterQuiz = checkRenewalAfterQuiz;
window.initAlerts = initAlerts;
window.generateDemoAlerts = generateDemoAlerts;
window.clearDemoAlerts = clearDemoAlerts;
window.togglePushNotifications = togglePushNotifications;
window.arePushNotificationsEnabled = arePushNotificationsEnabled;
