// js/module-training.js
// Module Training Mode - Level-based training for exam preparation

// Training state
let moduleTrainingState = {
  moduleId: null,
  bundle: null,
  currentQuestion: null,
  remainingQuestions: [],
  sessionAnswered: 0,
  sessionCorrect: 0,
  hasAnswered: false
};

/**
 * Load training bundle for a module
 * @param {string} studyId - Study ID
 * @param {string} moduleId - Module ID
 * @returns {Promise<Object>} Training bundle
 */
async function loadTrainingBundle(studyId, moduleId) {
  const url = `content/${studyId}/${moduleId}/module-training/training-bundle.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[ModuleTraining] Failed to load bundle: ${error.message}`);
    return null;
  }
}

/**
 * Initialize module training view
 * @param {string} moduleId - Module ID to train
 */
async function initModuleTrainingView(moduleId) {
  const container = document.getElementById('module-training-content');
  if (!container) {
    console.error('[ModuleTraining] Container not found');
    return;
  }

  // Show loading
  container.innerHTML = `
    <div class="text-center py-12">
      <span class="text-6xl mb-4 block animate-pulse">📚</span>
      <p class="text-gray-600 dark:text-gray-400">Lade Training...</p>
    </div>
  `;

  // Get study ID
  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId;

  if (!studyId) {
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="text-6xl mb-4 block">⚠️</span>
        <p class="text-gray-600 dark:text-gray-400">Kein Studiengang ausgewählt.</p>
      </div>
    `;
    return;
  }

  // Load training bundle
  const bundle = await loadTrainingBundle(studyId, moduleId);

  if (!bundle) {
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="text-6xl mb-4 block">📭</span>
        <h3 class="text-xl font-bold mb-2">Kein Training verfügbar</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Für dieses Modul gibt es noch kein Level-Training.
        </p>
        <button
          onclick="window.showView && window.showView('moduleMap')"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Zurück zu den Modulen
        </button>
      </div>
    `;
    return;
  }

  // Initialize state
  moduleTrainingState.moduleId = moduleId;
  moduleTrainingState.bundle = bundle;
  moduleTrainingState.sessionAnswered = 0;
  moduleTrainingState.sessionCorrect = 0;
  moduleTrainingState.hasAnswered = false;

  // Get remaining questions
  moduleTrainingState.remainingQuestions = window.getRemainingQuestions(
    moduleId,
    bundle
  );

  // Render training view
  renderModuleTrainingView();
}

/**
 * Render the main training view
 */
function renderModuleTrainingView() {
  const container = document.getElementById('module-training-content');
  const { moduleId, bundle, remainingQuestions } = moduleTrainingState;

  const training = window.getModuleTrainingProgress(moduleId);
  const stats = window.getModuleTrainingStats(moduleId, bundle.totalQuestions);

  // Get module title
  const modules = window.MODULES || [];
  const moduleMeta = modules.find((m) => m.id === moduleId);
  const moduleTitle = moduleMeta?.title || moduleId;

  // Level stars display
  const levelStars = renderLevelStars(training.currentLevel);

  // Check if all done
  if (remainingQuestions.length === 0) {
    if (stats.isComplete) {
      // All levels complete!
      container.innerHTML = `
        <div class="text-center py-12">
          <span class="text-6xl mb-4 block">🏆</span>
          <h3 class="text-2xl font-bold mb-2 text-yellow-600 dark:text-yellow-400">
            Training abgeschlossen!
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Du hast alle ${bundle.totalQuestions} Fragen korrekt beantwortet!
          </p>
          <div class="flex justify-center gap-4">
            <button
              onclick="window.resetModuleTrainingProgress('${moduleId}'); window.initModuleTrainingView('${moduleId}');"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Training zurücksetzen
            </button>
            <button
              onclick="window.showView && window.showView('moduleMap')"
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Zurück zu den Modulen
            </button>
          </div>
        </div>
      `;
      return;
    } else {
      // Level complete, check for level up
      const result = window.checkAndAdvanceLevel(moduleId, bundle);
      if (result.levelUp) {
        // Show level up message
        container.innerHTML = `
          <div class="text-center py-12">
            <span class="text-6xl mb-4 block animate-bounce">⭐</span>
            <h3 class="text-2xl font-bold mb-2 text-yellow-600 dark:text-yellow-400">
              Level ${result.newLevel - 1} geschafft!
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-2">
              Du hast alle Fragen von Level ${result.newLevel - 1} korrekt beantwortet.
            </p>
            <p class="text-lg font-medium mb-6">
              Neues Level: ${renderLevelStars(result.newLevel)}
            </p>
            <button
              onclick="window.moduleTrainingState.remainingQuestions = window.getRemainingQuestions('${moduleId}', window.moduleTrainingState.bundle); window.renderModuleTrainingView();"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
            >
              Weiter zu Level ${result.newLevel}
            </button>
          </div>
        `;
        return;
      }
    }
  }

  // Shuffle and pick a random question
  const shuffled = [...remainingQuestions].sort(() => Math.random() - 0.5);
  const currentQuestion = shuffled[0];
  moduleTrainingState.currentQuestion = currentQuestion;
  moduleTrainingState.hasAnswered = false;

  // Shuffle options
  const shuffledOptions = [...currentQuestion.options].sort(
    () => Math.random() - 0.5
  );

  // Render question
  container.innerHTML = `
    <!-- Stats Header -->
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Level</span>
          <div class="text-lg">${levelStars}</div>
        </div>
        <div class="text-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">Fortschritt</span>
          <div class="text-lg font-bold">${stats.totalCorrect}/${bundle.totalQuestions}</div>
        </div>
        <div class="text-right">
          <span class="text-sm text-gray-500 dark:text-gray-400">Verbleibend (Level ${training.currentLevel})</span>
          <div class="text-lg font-bold">${remainingQuestions.length}</div>
        </div>
      </div>
      <!-- Progress bar -->
      <div class="mt-3">
        <div class="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
          <div class="bg-green-500 h-2 rounded-full transition-all duration-300" 
               style="width: ${stats.percent}%"></div>
        </div>
      </div>
    </div>

    <!-- Topic badge -->
    <div class="mb-4">
      <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
        ${escapeHtml(currentQuestion.topicTitle)}
      </span>
    </div>

    <!-- Question -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-medium mb-6">${escapeHtml(currentQuestion.question)}</h3>

      <!-- Options -->
      <div id="module-training-options" class="space-y-3">
        ${shuffledOptions
          .map(
            (option, index) => `
          <button
            class="module-training-option w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all"
            data-option="${escapeHtml(option)}"
            onclick="window.selectModuleTrainingOption(this)"
          >
            <span class="font-medium mr-2">${String.fromCharCode(65 + index)}.</span>
            ${escapeHtml(option)}
          </button>
        `
          )
          .join('')}
      </div>
    </div>

    <!-- Submit button -->
    <div class="flex justify-center">
      <button
        id="module-training-submit"
        onclick="window.submitModuleTrainingAnswer()"
        disabled
        class="bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-bold py-3 px-8 rounded-lg cursor-not-allowed transition"
      >
        Antwort prüfen
      </button>
    </div>

    <!-- Session stats -->
    <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
      Diese Sitzung: ${moduleTrainingState.sessionCorrect}/${moduleTrainingState.sessionAnswered} richtig
    </div>
  `;
}

/**
 * Render level stars (★★★☆☆)
 * @param {number} level - Current level (1-5)
 * @returns {string} HTML string with stars
 */
function renderLevelStars(level) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= level) {
      stars += '<span class="text-yellow-500">★</span>';
    } else {
      stars += '<span class="text-gray-400">☆</span>';
    }
  }
  return stars;
}

/**
 * Handle option selection
 * @param {HTMLElement} button - Clicked button
 */
function selectModuleTrainingOption(button) {
  if (moduleTrainingState.hasAnswered) return;

  // Deselect all
  const options = document.querySelectorAll('.module-training-option');
  options.forEach((opt) => {
    opt.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900');
    opt.classList.add('border-gray-200', 'dark:border-gray-600');
  });

  // Select clicked
  button.classList.remove('border-gray-200', 'dark:border-gray-600');
  button.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900');

  // Enable submit button
  const submitBtn = document.getElementById('module-training-submit');
  submitBtn.disabled = false;
  submitBtn.className =
    'bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition';
}

/**
 * Submit the selected answer
 */
function submitModuleTrainingAnswer() {
  if (moduleTrainingState.hasAnswered) return;

  const selectedBtn = document.querySelector(
    '.module-training-option.border-blue-500'
  );
  if (!selectedBtn) return;

  const selectedOption = selectedBtn.dataset.option;
  const { currentQuestion, moduleId, bundle } = moduleTrainingState;

  // Check if correct (handle both single and multiple correct answers)
  const correctAnswers = currentQuestion.correctAnswers || [
    currentQuestion.correctAnswer
  ];
  const isCorrect = correctAnswers.includes(selectedOption);

  moduleTrainingState.hasAnswered = true;
  moduleTrainingState.sessionAnswered++;

  // Update stats
  if (isCorrect) {
    moduleTrainingState.sessionCorrect++;
    window.recordCorrectTrainingAnswer(moduleId, currentQuestion.id);

    // Remove from remaining
    moduleTrainingState.remainingQuestions =
      moduleTrainingState.remainingQuestions.filter(
        (q) => q.id !== currentQuestion.id
      );
  }

  // Show feedback on options
  const options = document.querySelectorAll('.module-training-option');
  options.forEach((opt) => {
    const optionText = opt.dataset.option;
    const isThisCorrect = correctAnswers.includes(optionText);
    const isSelected = opt === selectedBtn;

    opt.onclick = null; // Disable further clicks

    if (isThisCorrect) {
      opt.classList.remove(
        'border-gray-200',
        'dark:border-gray-600',
        'border-blue-500',
        'bg-blue-50',
        'dark:bg-blue-900'
      );
      opt.classList.add('border-green-500', 'bg-green-50', 'dark:bg-green-900');
    } else if (isSelected && !isCorrect) {
      opt.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900');
      opt.classList.add('border-red-500', 'bg-red-50', 'dark:bg-red-900');
    }
  });

  // Update submit button to "Next"
  const submitBtn = document.getElementById('module-training-submit');
  submitBtn.innerHTML = isCorrect
    ? '✓ Richtig! Weiter →'
    : '✗ Falsch. Weiter →';
  submitBtn.className = isCorrect
    ? 'bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition'
    : 'bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition';
  submitBtn.onclick = () => nextModuleTrainingQuestion();
}

/**
 * Move to next question
 */
function nextModuleTrainingQuestion() {
  // Check for level up
  const { moduleId, bundle } = moduleTrainingState;
  const result = window.checkAndAdvanceLevel(moduleId, bundle);

  if (result.levelUp || result.completed) {
    // Refresh remaining questions and render view (will show level up or completion message)
    moduleTrainingState.remainingQuestions = window.getRemainingQuestions(
      moduleId,
      bundle
    );
  }

  renderModuleTrainingView();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Expose to global scope
window.moduleTrainingState = moduleTrainingState;
window.loadTrainingBundle = loadTrainingBundle;
window.initModuleTrainingView = initModuleTrainingView;
window.renderModuleTrainingView = renderModuleTrainingView;
window.renderLevelStars = renderLevelStars;
window.selectModuleTrainingOption = selectModuleTrainingOption;
window.submitModuleTrainingAnswer = submitModuleTrainingAnswer;
window.nextModuleTrainingQuestion = nextModuleTrainingQuestion;
