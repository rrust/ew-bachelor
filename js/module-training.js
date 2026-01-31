// js/module-training.js
// Module Training Mode - Level-based training for exam preparation

// Training mode options
const TRAINING_MODES = {
  BOTH: 'both', // MC questions and exercises mixed
  MC_ONLY: 'mc-only', // Only MC questions
  EXERCISES_ONLY: 'exercises-only' // Only practical exercises
};

// Training state
let moduleTrainingState = {
  moduleId: null,
  bundle: null,
  currentQuestion: null,
  remainingQuestions: [],
  sessionAnswered: 0,
  sessionCorrect: 0,
  hasAnswered: false,
  // Exercise state
  currentExercise: null,
  exerciseMode: false,
  revealedHints: [],
  revealedSteps: 0,
  exerciseSolved: false,
  // Training mode
  trainingMode: TRAINING_MODES.BOTH
};

/**
 * Get training mode from settings
 * @returns {string} Training mode
 */
function getTrainingMode() {
  const settings = window.getAppSettings ? window.getAppSettings() : {};
  return settings.trainingMode || TRAINING_MODES.BOTH;
}

/**
 * Set training mode in settings
 * @param {string} mode - Training mode
 */
function setTrainingMode(mode) {
  const settings = window.getAppSettings ? window.getAppSettings() : {};
  settings.trainingMode = mode;
  if (window.saveAppSettings) {
    window.saveAppSettings(settings);
  }
  moduleTrainingState.trainingMode = mode;
}

window.TRAINING_MODES = TRAINING_MODES;
window.getTrainingMode = getTrainingMode;
window.setTrainingMode = setTrainingMode;

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
      <div class="mb-4 flex justify-center">
        ${window.getIcon ? window.getIcon('book', 'w-16 h-16 animate-pulse') : ''}
      </div>
      <p class="text-gray-600 dark:text-gray-400">Lade Training...</p>
    </div>
  `;

  // Get study ID
  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId;

  if (!studyId) {
    container.innerHTML = `
      <div class="text-center py-12">
        <div class="mb-4 flex justify-center">
          ${window.getIcon ? window.getIcon('exclamation', 'w-16 h-16 text-yellow-500') : ''}
        </div>
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
        <div class="mb-4 flex justify-center">
          ${window.getIcon ? window.getIcon('inbox', 'w-16 h-16 text-gray-400') : ''}
        </div>
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

  // Check training mode
  const trainingMode = getTrainingMode();
  const exercises = getAvailableExercises(
    moduleId,
    bundle,
    training.currentLevel
  );

  // If exercises-only mode and exercises exist, start an exercise
  if (trainingMode === TRAINING_MODES.EXERCISES_ONLY && exercises.length > 0) {
    const randomExercise =
      exercises[Math.floor(Math.random() * exercises.length)];
    startExercise(randomExercise);
    return;
  }

  // If "both" mode, randomly decide (30% chance for exercise if available)
  if (
    trainingMode === TRAINING_MODES.BOTH &&
    exercises.length > 0 &&
    remainingQuestions.length > 0
  ) {
    if (Math.random() < 0.3) {
      const randomExercise =
        exercises[Math.floor(Math.random() * exercises.length)];
      startExercise(randomExercise);
      return;
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
      <!-- Training Mode Toggle -->
      ${renderTrainingModeToggle(bundle, training.currentLevel)}
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
    
    <!-- Exercise toggle button -->
    ${renderExerciseToggleButton(bundle, training.currentLevel)}
  `;

  // Dev mode: highlight correct answers with light green border
  if (window.isDevMode && window.isDevMode()) {
    // Support both new format (correctAnswers array) and legacy format
    let correctAnswers = currentQuestion.correctAnswers;
    if (!correctAnswers || correctAnswers.length === 0) {
      // Fallback to correctAnswer (single)
      correctAnswers = currentQuestion.correctAnswer
        ? [currentQuestion.correctAnswer]
        : [];
    }

    // Use container to find options (more reliable than document)
    const options = container.querySelectorAll('.module-training-option');
    options.forEach((btn) => {
      const optionText = btn.dataset.option;
      if (correctAnswers.includes(optionText)) {
        btn.classList.add('border-green-400', 'border-2');
        btn.classList.remove('border-gray-200', 'dark:border-gray-600');
      }
    });
  }
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
  const checkIcon = window.getIcon
    ? window.getIcon('check', 'w-5 h-5 inline')
    : '';
  const closeIcon = window.getIcon
    ? window.getIcon('close', 'w-5 h-5 inline')
    : '';
  submitBtn.innerHTML = isCorrect
    ? `${checkIcon} Richtig! Weiter →`
    : `${closeIcon} Falsch. Weiter →`;
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

// ═══════════════════════════════════════════════════════════════════════════
// TRAINING MODE SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Render training mode toggle (only if exercises exist)
 * @param {Object} bundle - Training bundle
 * @param {number} currentLevel - Current training level
 * @returns {string} HTML string
 */
function renderTrainingModeToggle(bundle, currentLevel) {
  // Check if any exercises exist for this level
  const exercises = getAvailableExercises(
    moduleTrainingState.moduleId,
    bundle,
    currentLevel
  );

  if (exercises.length === 0) {
    return ''; // No exercises, no toggle needed
  }

  const currentMode = getTrainingMode();

  const trainingIcon = window.getIcon
    ? window.getIcon('training', 'w-3 h-3 inline')
    : '';
  const questionIcon = window.getIcon
    ? window.getIcon('questionCircle', 'w-3 h-3 inline')
    : '';
  const pencilIcon = window.getIcon
    ? window.getIcon('pencil', 'w-3 h-3 inline')
    : '';
  const modes = [
    { value: TRAINING_MODES.BOTH, label: 'Gemischt', iconHtml: trainingIcon },
    { value: TRAINING_MODES.MC_ONLY, label: 'Nur MC', iconHtml: questionIcon },
    {
      value: TRAINING_MODES.EXERCISES_ONLY,
      label: 'Nur Übungen',
      iconHtml: pencilIcon
    }
  ];

  return `
    <div class="mt-3 flex items-center justify-center gap-1">
      <span class="text-xs text-gray-500 dark:text-gray-400 mr-2">Modus:</span>
      ${modes
        .map(
          (mode) => `
        <button
          onclick="window.setTrainingMode('${mode.value}'); window.renderModuleTrainingView();"
          class="px-2 py-1 text-xs rounded transition ${
            currentMode === mode.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }"
          title="${mode.label}"
        >
          ${mode.iconHtml ? mode.iconHtml + ' ' : ''}${mode.label}
        </button>
      `
        )
        .join('')}
    </div>
  `;
}

window.renderTrainingModeToggle = renderTrainingModeToggle;

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Render toggle button to switch to exercises
 * @param {Object} bundle - Training bundle
 * @param {number} currentLevel - Current training level
 * @returns {string} HTML string
 */
function renderExerciseToggleButton(bundle, currentLevel) {
  // Only show manual toggle in MC-only mode
  const trainingMode = getTrainingMode();
  if (trainingMode !== TRAINING_MODES.MC_ONLY) {
    return ''; // In "both" or "exercises-only" mode, exercises are shown automatically
  }

  // Get available exercises for current level
  const exercises = getAvailableExercises(
    moduleTrainingState.moduleId,
    bundle,
    currentLevel
  );

  if (exercises.length === 0) {
    return ''; // No exercises available
  }

  return `
    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
          ${exercises.length} praktische Übung${exercises.length > 1 ? 'en' : ''} für Level ${currentLevel} verfügbar
        </p>
        <button
          onclick="window.showExerciseSelection()"
          class="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg transition inline-flex items-center gap-2"
        >
          ${window.getIcon ? window.getIcon('pencil', 'w-5 h-5') : ''} Praktische Übung starten
        </button>
      </div>
    </div>
  `;
}

/**
 * Show exercise selection modal
 */
function showExerciseSelection() {
  const { bundle, moduleId } = moduleTrainingState;
  const training = window.getModuleTrainingProgress(moduleId);
  const exercises = getAvailableExercises(
    moduleId,
    bundle,
    training.currentLevel
  );

  if (exercises.length === 0) {
    return;
  }

  // Pick a random exercise
  const randomExercise =
    exercises[Math.floor(Math.random() * exercises.length)];
  startExercise(randomExercise);
}

window.renderExerciseToggleButton = renderExerciseToggleButton;
window.showExerciseSelection = showExerciseSelection;

/**
 * Get available exercises for current level
 * @param {string} moduleId - Module ID
 * @param {Object} bundle - Training bundle
 * @param {number} level - Current level
 * @returns {Array} Available exercises
 */
function getAvailableExercises(moduleId, bundle, level) {
  const exercises = [];

  for (const topic of bundle.topics) {
    if (!topic.exercises) continue;

    const levelExercises = topic.exercises[level] || [];
    for (const ex of levelExercises) {
      exercises.push({
        ...ex,
        topicId: topic.id,
        topicTitle: topic.title
      });
    }
  }

  return exercises;
}

/**
 * Start an exercise session
 * @param {Object} exercise - Exercise object
 */
function startExercise(exercise) {
  moduleTrainingState.currentExercise = exercise;
  moduleTrainingState.exerciseMode = true;
  moduleTrainingState.revealedHints = [];
  moduleTrainingState.revealedSteps = 0;
  moduleTrainingState.exerciseSolved = false;

  renderExerciseView();
}

/**
 * Render the exercise view
 */
function renderExerciseView() {
  const container = document.getElementById('module-training-content');
  const { currentExercise, revealedHints, revealedSteps, exerciseSolved } =
    moduleTrainingState;
  const { moduleId, bundle } = moduleTrainingState;

  if (!currentExercise) {
    renderModuleTrainingView();
    return;
  }

  const training = window.getModuleTrainingProgress(moduleId);
  const levelStars = renderLevelStars(training.currentLevel);

  // Build hints section
  const hintsHtml = buildHintsHtml(currentExercise.hints, revealedHints);

  // Build steps section
  const stepsHtml = buildStepsHtml(currentExercise.steps, revealedSteps);

  // Self-assessment buttons (only show after all steps revealed)
  const allStepsRevealed = revealedSteps >= currentExercise.steps.length;
  const assessmentHtml =
    allStepsRevealed && !exerciseSolved
      ? `
    <div class="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <p class="text-center mb-4 font-medium">Wie war deine Lösung?</p>
      <div class="flex justify-center gap-4">
        <button
          onclick="window.markExerciseResult(true)"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition flex items-center gap-2"
        >
          ${window.getIcon ? window.getIcon('check', 'w-5 h-5') : ''} Richtig gelöst
        </button>
        <button
          onclick="window.markExerciseResult(false)"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition flex items-center gap-2"
        >
          ${window.getIcon ? window.getIcon('close', 'w-5 h-5') : ''} Nicht geschafft
        </button>
      </div>
    </div>
  `
      : '';

  // Related resources (cheatsheets/blueprints)
  const relatedHtml = buildRelatedResourcesHtml(currentExercise);

  // Result message
  const resultHtml = exerciseSolved
    ? `
    <div class="mt-6 text-center">
      <button
        onclick="window.exitExerciseMode()"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition"
      >
        Weiter trainieren →
      </button>
    </div>
  `
    : '';

  container.innerHTML = `
    <!-- Exercise Header -->
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Level</span>
          <div class="text-lg">${levelStars}</div>
        </div>
        <div class="text-center">
          <span class="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium px-3 py-1 rounded-full inline-flex items-center gap-1">
            ${window.getIcon ? window.getIcon('pencil', 'w-4 h-4') : ''} Praktische Übung
          </span>
        </div>
        <button
          onclick="window.exitExerciseMode()"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title="Zurück zu MC-Fragen"
        >
          ✕
        </button>
      </div>
    </div>
    
    <!-- Topic badge -->
    <div class="mb-4">
      <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
        ${escapeHtml(currentExercise.topicTitle || 'Übung')}
      </span>
      <span class="inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
        Level ${currentExercise.level}
      </span>
    </div>
    
    <!-- Exercise Title & Task -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-xl font-bold mb-4">${escapeHtml(currentExercise.title)}</h3>
      <div class="prose dark:prose-invert max-w-none">
        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg whitespace-pre-wrap">${escapeHtml(currentExercise.task)}</div>
      </div>
    </div>
    
    <!-- Hints Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h4 class="font-bold mb-4 flex items-center gap-2">
        ${window.getIcon ? window.getIcon('lightbulb', 'w-5 h-5') : ''} Hilfestellungen
      </h4>
      ${hintsHtml}
    </div>
    
    <!-- Solution Steps -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h4 class="font-bold mb-4 flex items-center gap-2">
        ${window.getIcon ? window.getIcon('document', 'w-5 h-5') : ''} Lösungsweg
      </h4>
      ${stepsHtml}
    </div>
    
    ${relatedHtml}
    ${assessmentHtml}
    ${resultHtml}
  `;
}

/**
 * Build hints HTML with progressive reveal
 */
function buildHintsHtml(hints, revealedHints) {
  if (!hints) return '<p class="text-gray-500">Keine Hinweise verfügbar.</p>';

  const hintOrder = ['keyword', 'approach', 'overview'];
  const keyIcon = window.getIcon
    ? window.getIcon('lock', 'w-4 h-4 inline')
    : '';
  const compassIcon = window.getIcon
    ? window.getIcon('map', 'w-4 h-4 inline')
    : '';
  const listIcon = window.getIcon
    ? window.getIcon('clipboard', 'w-4 h-4 inline')
    : '';
  const hintLabels = {
    keyword: { label: 'Stichwort', iconHtml: keyIcon },
    approach: { label: 'Lösungsansatz', iconHtml: compassIcon },
    overview: { label: 'Lösungsübersicht', iconHtml: listIcon }
  };

  let html = '<div class="space-y-3">';

  for (let i = 0; i < hintOrder.length; i++) {
    const hintKey = hintOrder[i];
    const hintValue = hints[hintKey];
    const meta = hintLabels[hintKey];
    const isRevealed = revealedHints.includes(hintKey);
    const canReveal = i === 0 || revealedHints.includes(hintOrder[i - 1]);

    if (!hintValue) continue;

    if (isRevealed) {
      html += `
        <div class="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border-l-4 border-yellow-400">
          <div class="font-medium text-sm text-yellow-700 dark:text-yellow-300 mb-1 flex items-center gap-1">
            ${meta.iconHtml} ${meta.label}
          </div>
          <div class="whitespace-pre-wrap text-sm">${escapeHtml(hintValue)}</div>
        </div>
      `;
    } else if (canReveal) {
      html += `
        <button
          onclick="window.revealHint('${hintKey}')"
          class="w-full p-3 border-2 border-dashed border-yellow-300 dark:border-yellow-700 rounded-lg text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition text-sm flex items-center gap-1"
        >
          ${meta.iconHtml} ${meta.label} anzeigen
        </button>
      `;
    } else {
      const lockIconSmall = window.getIcon
        ? window.getIcon('lock', 'w-3 h-3 inline')
        : '';
      html += `
        <div class="p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 text-sm flex items-center gap-1">
          ${lockIconSmall} ${meta.label} (vorherigen Hinweis zuerst anzeigen)
        </div>
      `;
    }
  }

  html += '</div>';
  return html;
}

/**
 * Build steps HTML with progressive reveal
 */
function buildStepsHtml(steps, revealedSteps) {
  if (!steps || steps.length === 0) {
    return '<p class="text-gray-500">Keine Lösungsschritte verfügbar.</p>';
  }

  let html = '<div class="space-y-3">';

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const isRevealed = i < revealedSteps;
    const canReveal = i === revealedSteps;

    if (isRevealed) {
      html += `
        <div class="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border-l-4 border-green-500">
          <div class="font-medium text-sm text-green-700 dark:text-green-300 mb-1">
            Schritt ${i + 1}: ${escapeHtml(step.description)}
          </div>
          <div class="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded mt-2">
            ${escapeHtml(step.solution)}
          </div>
        </div>
      `;
    } else if (canReveal) {
      const eyeIcon = window.getIcon ? window.getIcon('zoomIn', 'w-4 h-4') : '';
      html += `
        <button
          onclick="window.revealStep(${i})"
          class="w-full p-4 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-left"
        >
          <span class="font-medium">Schritt ${i + 1}:</span> ${escapeHtml(step.description)}
          <span class="float-right flex items-center gap-1">${eyeIcon} Lösung anzeigen</span>
        </button>
      `;
    } else {
      const lockIcon = window.getIcon ? window.getIcon('lock', 'w-4 h-4') : '';
      html += `
        <div class="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400">
          <span class="font-medium">Schritt ${i + 1}:</span> ${escapeHtml(step.description)}
          <span class="float-right">${lockIcon}</span>
        </div>
      `;
    }
  }

  // Final answer (show after all steps)
  if (
    revealedSteps >= steps.length &&
    moduleTrainingState.currentExercise.finalAnswer
  ) {
    const checkIconFinal = window.getIcon
      ? window.getIcon('check', 'w-5 h-5 inline')
      : '';
    html += `
      <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-500">
        <div class="font-bold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1">${checkIconFinal} Endergebnis</div>
        <div class="font-mono whitespace-pre-wrap">${escapeHtml(moduleTrainingState.currentExercise.finalAnswer)}</div>
      </div>
    `;
  }

  html += '</div>';
  return html;
}

/**
 * Build related resources HTML (cheatsheets/blueprints)
 */
function buildRelatedResourcesHtml(exercise) {
  const cheatsheets = exercise.relatedCheatsheets || [];
  const blueprints = exercise.relatedBlueprints || [];

  if (cheatsheets.length === 0 && blueprints.length === 0) {
    return '';
  }

  let html = `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h4 class="font-medium text-sm mb-3 flex items-center gap-2">
        ${window.getIcon ? window.getIcon('book', 'w-4 h-4') : ''} Hilfreiche Ressourcen
      </h4>
      <div class="flex flex-wrap gap-2">
  `;

  // Cheatsheets
  for (const csId of cheatsheets) {
    const isUnlocked = checkResourceUnlocked(csId);
    const lockIconCs = window.getIcon ? window.getIcon('lock', 'w-3 h-3') : '';
    html += `
      <button
        onclick="window.openRelatedResource('${csId}')"
        class="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1 transition ${
          isUnlocked
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }"
        ${!isUnlocked ? 'disabled' : ''}
      >
        ${window.getIcon ? window.getIcon('clipboard', 'w-3 h-3') : ''}
        ${isUnlocked ? 'Cheatsheet' : lockIconCs + ' Cheatsheet'}
      </button>
    `;
  }

  // Blueprints
  for (const bpId of blueprints) {
    const isUnlocked = checkResourceUnlocked(bpId);
    const lockIconBp = window.getIcon ? window.getIcon('lock', 'w-3 h-3') : '';
    html += `
      <button
        onclick="window.openRelatedResource('${bpId}')"
        class="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1 transition ${
          isUnlocked
            ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }"
        ${!isUnlocked ? 'disabled' : ''}
      >
        ${window.getIcon ? window.getIcon('pencil', 'w-3 h-3') : ''}
        ${isUnlocked ? 'Blueprint' : lockIconBp + ' Blueprint'}
      </button>
    `;
  }

  html += `
      </div>
    </div>
  `;

  return html;
}

/**
 * Check if a resource (achievement) is unlocked
 * In training context, we always allow access to help resources
 */
function checkResourceUnlocked(achievementId) {
  // In training mode, always allow access to related resources as learning aids
  // The achievement system still tracks unlock status separately
  return true;
}

/**
 * Open a related resource (achievement modal)
 */
function openRelatedResource(achievementId) {
  if (window.showAchievementModalById) {
    window.showAchievementModalById(achievementId);
  }
}

window.buildRelatedResourcesHtml = buildRelatedResourcesHtml;
window.checkResourceUnlocked = checkResourceUnlocked;
window.openRelatedResource = openRelatedResource;

/**
 * Reveal a hint
 */
function revealHint(hintKey) {
  if (!moduleTrainingState.revealedHints.includes(hintKey)) {
    moduleTrainingState.revealedHints.push(hintKey);
    renderExerciseView();
  }
}

/**
 * Reveal the next step
 */
function revealStep(stepIndex) {
  if (stepIndex === moduleTrainingState.revealedSteps) {
    moduleTrainingState.revealedSteps++;
    renderExerciseView();
  }
}

/**
 * Mark exercise result (self-assessment)
 */
function markExerciseResult(isCorrect) {
  const { currentExercise, moduleId } = moduleTrainingState;

  moduleTrainingState.exerciseSolved = true;
  moduleTrainingState.sessionAnswered++;

  if (isCorrect) {
    moduleTrainingState.sessionCorrect++;
    // Record as solved in progress
    if (window.recordSolvedExercise) {
      window.recordSolvedExercise(
        moduleId,
        currentExercise.id,
        currentExercise.topicId
      );
    }
    console.log(`[Exercise] Solved: ${currentExercise.id}`);
  } else {
    console.log(`[Exercise] Failed: ${currentExercise.id}`);
  }

  renderExerciseView();
}

/**
 * Exit exercise mode and return to MC questions
 */
function exitExerciseMode() {
  moduleTrainingState.exerciseMode = false;
  moduleTrainingState.currentExercise = null;
  moduleTrainingState.revealedHints = [];
  moduleTrainingState.revealedSteps = 0;
  moduleTrainingState.exerciseSolved = false;

  renderModuleTrainingView();
}

// Expose exercise functions to global scope
window.getAvailableExercises = getAvailableExercises;
window.startExercise = startExercise;
window.renderExerciseView = renderExerciseView;
window.revealHint = revealHint;
window.revealStep = revealStep;
window.markExerciseResult = markExerciseResult;
window.exitExerciseMode = exitExerciseMode;
