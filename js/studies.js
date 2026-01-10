// js/studies.js
// Module for study selection and management

/**
 * Creates a study card component
 * @param {object} study - Study object from studies.json
 * @param {function} onClick - Callback when study is selected
 * @returns {HTMLElement} The study card element
 */
function createStudyCard(study, onClick) {
  const card = document.createElement('div');
  const isAvailable = study.status === 'active';

  card.className = `bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-200 ${
    isAvailable
      ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]'
      : 'opacity-60 cursor-not-allowed'
  }`;
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', isAvailable ? '0' : '-1');

  card.innerHTML = `
    <div class="text-5xl mb-4 text-center">${study.icon || '📚'}</div>
    <h3 class="text-xl font-bold mb-2 text-center">${study.title}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
      ${study.university || ''}
    </p>
    ${
      !isAvailable
        ? '<span class="block mt-4 text-center text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">Demnächst verfügbar</span>'
        : ''
    }
  `;

  if (isAvailable) {
    card.addEventListener('click', () => onClick(study.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(study.id);
      }
    });
  }

  return card;
}

/**
 * Renders the study selection grid
 * @param {Array} studies - Array of study objects
 * @param {function} onSelect - Callback when a study is selected
 */
function renderStudySelection(studies, onSelect) {
  const grid = document.getElementById('study-grid');
  if (!grid) return;

  grid.innerHTML = '';

  for (const study of studies) {
    const card = createStudyCard(study, onSelect);
    grid.appendChild(card);
  }
}

/**
 * Gets the current study info
 * @returns {object|null} Current study object or null
 */
function getCurrentStudyInfo() {
  const settings = getAppSettings();
  const studies = getStudies();
  if (!settings.activeStudyId || !studies.length) return null;
  return studies.find((s) => s.id === settings.activeStudyId) || null;
}

/**
 * Switches to a different study
 * @param {string} studyId - The study ID to switch to
 */
function switchToStudy(studyId) {
  const settings = getAppSettings();
  settings.activeStudyId = studyId;
  saveAppSettings(settings);
  setCurrentStudy(studyId);
}

// Expose to global scope
window.createStudyCard = createStudyCard;
window.renderStudySelection = renderStudySelection;
window.getCurrentStudyInfo = getCurrentStudyInfo;
window.switchToStudy = switchToStudy;
