// View management

/**
 * Shows a specific view and hides others
 * @param {string} viewName - Name of the view to show
 */
function showView(viewName) {
  const views = [
    'welcome',
    'moduleMap',
    'lecture',
    'quiz',
    'quizResults',
    'tools',
    'map',
    'progress',
    'achievements',
    'alerts',
    'search'
  ];

  views.forEach((v) => {
    const viewId =
      v === 'welcome'
        ? 'welcome-view'
        : v === 'moduleMap'
        ? 'module-map-view'
        : v === 'quizResults'
        ? 'quiz-results-view'
        : `${v}-view`;

    const element = document.getElementById(viewId);
    if (element) {
      element.style.display = v === viewName ? 'block' : 'none';
    }
  });
}

/**
 * Updates the greeting with user's name
 * @param {string} userName - User's name (optional)
 */
function updateGreeting(userName) {
  const progress = getUserProgress();
  const name = userName || progress?.userName || 'Gast';

  // Update all greeting elements (for different views)
  const greetingIds = [
    'header-greeting',
    'header-greeting-tools',
    'header-greeting-map',
    'header-greeting-progress',
    'header-greeting-achievements',
    'header-greeting-alerts',
    'header-greeting-training'
  ];

  greetingIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = `Hallo, ${name}`;
    }
  });
}

/**
 * Shows a loading overlay with optional message
 * @param {string} message - Loading message to display
 * @param {number} minDisplayTime - Minimum time to show overlay (ms)
 * @returns {Function} Function to hide the overlay
 */
function showLoadingOverlay(message = 'Wird geladen...', minDisplayTime = 200) {
  const startTime = Date.now();

  // Create overlay if it doesn't exist
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className =
      'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    overlay.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-xs text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-3"></div>
        <p id="loading-overlay-message" class="text-gray-700 dark:text-gray-300"></p>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Update message and show
  const msgEl = overlay.querySelector('#loading-overlay-message');
  if (msgEl) msgEl.textContent = message;
  overlay.style.display = 'flex';

  // Return hide function with minimum display time
  return function hideOverlay() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDisplayTime - elapsed);

    if (remaining > 0) {
      setTimeout(() => {
        overlay.style.display = 'none';
      }, remaining);
    } else {
      overlay.style.display = 'none';
    }
  };
}

/**
 * Hides the loading overlay
 */
function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Expose to global scope
window.showView = showView;
window.updateGreeting = updateGreeting;
window.showLoadingOverlay = showLoadingOverlay;
window.hideLoadingOverlay = hideLoadingOverlay;
