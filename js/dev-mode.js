// js/dev-mode.js
// Developer mode functionality

/**
 * Check if dev mode is enabled
 * @returns {boolean}
 */
function isDevMode() {
  return localStorage.getItem('devMode') === 'true';
}

/**
 * Enable dev mode
 */
function enableDevMode() {
  localStorage.setItem('devMode', 'true');
  updateDevModeUI();
  console.log('[Dev] Developer mode enabled');
}

/**
 * Disable dev mode
 */
function disableDevMode() {
  localStorage.setItem('devMode', 'false');
  updateDevModeUI();
  console.log('[Dev] Developer mode disabled');
}

/**
 * Toggle dev mode
 */
function toggleDevMode() {
  if (isDevMode()) {
    disableDevMode();
  } else {
    enableDevMode();
  }
}

/**
 * Update the dev mode UI elements
 */
function updateDevModeUI() {
  const badge = document.getElementById('dev-mode-badge');
  const button = document.getElementById('toggle-dev-mode-button');
  const card = document.getElementById('dev-mode-card');

  // Get all header dev badges (there can be multiple headers)
  const headerBadges = document.querySelectorAll('[id^="header-dev-badge"]');

  if (isDevMode()) {
    // Dev mode is ON
    if (badge) {
      badge.classList.remove('hidden');
    }
    if (button) {
      button.textContent = 'Deaktivieren';
      button.classList.remove('bg-orange-500', 'hover:bg-orange-600');
      button.classList.add('bg-gray-500', 'hover:bg-gray-600');
    }
    if (card) {
      card.classList.add('ring-2', 'ring-orange-500');
    }

    // Show all header dev badges
    headerBadges.forEach((b) => b.classList.remove('hidden'));

    // Add dev indicator to body for CSS-based visibility
    document.body.classList.add('dev-mode');
  } else {
    // Dev mode is OFF
    if (badge) {
      badge.classList.add('hidden');
    }
    if (button) {
      button.textContent = 'Aktivieren';
      button.classList.remove('bg-gray-500', 'hover:bg-gray-600');
      button.classList.add('bg-orange-500', 'hover:bg-orange-600');
    }
    if (card) {
      card.classList.remove('ring-2', 'ring-orange-500');
    }

    // Hide all header dev badges
    headerBadges.forEach((b) => b.classList.add('hidden'));

    document.body.classList.remove('dev-mode');
  }

  // Update dev-only sections visibility
  document.querySelectorAll('.dev-only').forEach((el) => {
    el.classList.toggle('hidden', !isDevMode());
  });
}

/**
 * Get available test data files for the current study
 * @returns {Array} Array of {name, file, description}
 */
function getTestDataFiles() {
  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId || 'bsc-ernaehrungswissenschaften';

  const scenarios = [
    {
      name: 'Fresh',
      file: `progress-${studyId}-fresh.json`,
      description: 'Keine Fortschritte'
    },
    {
      name: 'Beginner',
      file: `progress-${studyId}-beginner.json`,
      description: 'Erste Module begonnen'
    },
    {
      name: 'Intermediate',
      file: `progress-${studyId}-intermediate.json`,
      description: 'Halb fertig'
    },
    {
      name: 'Advanced',
      file: `progress-${studyId}-advanced.json`,
      description: 'Fast komplett'
    },
    {
      name: 'Complete',
      file: `progress-${studyId}-complete.json`,
      description: 'Alles Gold'
    },
    {
      name: 'Mixed',
      file: `progress-${studyId}-mixed.json`,
      description: 'Realistische Verteilung'
    },
    {
      name: 'Alerts',
      file: `progress-${studyId}-alerts.json`,
      description: 'Ablaufende Achievements'
    }
  ];

  return scenarios;
}

/**
 * Load test progress data
 * @param {string} filename - Test data filename
 */
async function loadTestProgress(filename) {
  try {
    // Use basePath for correct URL resolution
    const basePath = window.getBasePath ? window.getBasePath() : '';
    const url = `${basePath}test-data/${filename}`;
    console.log(`[Dev] Fetching test data from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    const data = await response.json();
    console.log(`[Dev] Received data:`, data);

    // Import the progress data
    if (data.studyId && data.progress) {
      // Save progress data
      const progressKey = `progress_${data.studyId}`;
      localStorage.setItem(progressKey, JSON.stringify(data.progress));

      // Also update app settings to ensure activeStudyId is set
      const currentSettings = JSON.parse(
        localStorage.getItem('appSettings') || '{}'
      );
      const newSettings = {
        ...currentSettings,
        activeStudyId: data.studyId,
        userName:
          data.progress.userName ||
          data.settings?.userName ||
          currentSettings.userName,
        theme: data.settings?.theme || currentSettings.theme || 'light'
      };
      localStorage.setItem('appSettings', JSON.stringify(newSettings));

      console.log(`[Dev] Loaded test data: ${filename}`);

      // Close modal and reload the page to apply changes
      closeTestDataModal();
      location.reload();
    } else {
      throw new Error('Invalid test data format - missing studyId or progress');
    }
  } catch (error) {
    console.error('[Dev] Failed to load test data:', error);
    alert(`Fehler beim Laden der Testdaten: ${error.message}`);
  }
}

/**
 * Open the test data modal
 */
function openTestDataModal() {
  const modal = document.getElementById('test-data-modal');
  if (!modal) return;

  // Render content
  renderTestDataModalContent();

  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Close the test data modal
 */
function closeTestDataModal() {
  const modal = document.getElementById('test-data-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/**
 * Render test data modal content
 */
function renderTestDataModalContent() {
  const container = document.getElementById('test-data-content');
  if (!container) return;

  const scenarios = getTestDataFiles();

  container.innerHTML = `
    <p class="text-gray-600 dark:text-gray-400 mb-4">
      Wähle ein Test-Szenario für den aktuellen Studiengang:
    </p>
    <div class="grid grid-cols-2 gap-3">
      ${scenarios
        .map(
          (s) => `
        <button
          onclick="loadTestProgress('${s.file}')"
          class="flex flex-col items-start p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 transition-colors text-left"
        >
          <span class="font-medium">${s.name}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">${s.description}</span>
        </button>
      `
        )
        .join('')}
    </div>
    <p class="text-xs text-orange-600 dark:text-orange-400 mt-4 flex items-center gap-1">
      <span>⚠️</span>
      <span>Überschreibt den aktuellen Fortschritt!</span>
    </p>
  `;
}

/**
 * Setup dev mode event listeners
 */
function setupDevModeListeners() {
  const toggleBtn = document.getElementById('toggle-dev-mode-button');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleDevMode);
  }

  // Close modal when clicking backdrop
  const testDataModal = document.getElementById('test-data-modal');
  if (testDataModal) {
    testDataModal.addEventListener('click', (e) => {
      if (e.target === testDataModal) {
        closeTestDataModal();
      }
    });
  }

  // Initialize UI state
  updateDevModeUI();
}

// Expose to global scope
window.isDevMode = isDevMode;
window.enableDevMode = enableDevMode;
window.disableDevMode = disableDevMode;
window.toggleDevMode = toggleDevMode;
window.updateDevModeUI = updateDevModeUI;
window.setupDevModeListeners = setupDevModeListeners;
window.loadTestProgress = loadTestProgress;
window.openTestDataModal = openTestDataModal;
window.closeTestDataModal = closeTestDataModal;
