// js/training.js
// Training mode - Random questions from completed tests with cheat-sheet support

// Token system constants
const QUESTIONS_PER_ROUND = 10;
const TOKENS_FOR_EXTENSION = 3;

// Token rewards based on correct answers
const TOKEN_REWARDS = {
  NONE: { min: 0, max: 4, tokens: 0 }, // 0-4 correct: no token
  ONE: { min: 5, max: 7, tokens: 1 }, // 5-7 correct: 1 token
  THREE: { min: 8, max: 10, tokens: 3 } // 8-10 correct: 3 tokens
};

/**
 * Get training stats from user progress
 * @returns {Object} { tokens, totalAnswered, totalRounds }
 */
function getTrainingStats() {
  const progress = getUserProgress();
  if (!progress) {
    return { tokens: 0, totalAnswered: 0, totalRounds: 0 };
  }

  const training = progress.training || {
    tokens: 0,
    totalAnswered: 0,
    totalRounds: 0
  };

  return {
    tokens: training.tokens || 0,
    totalAnswered: training.totalAnswered || 0,
    totalRounds: training.totalRounds || 0
  };
}

/**
 * Save training stats to user progress
 * @param {number} tokens
 * @param {number} totalAnswered
 * @param {number} totalRounds
 */
function saveTrainingStats(tokens, totalAnswered, totalRounds) {
  const progress = getUserProgress();
  if (!progress) return;

  progress.training = {
    tokens,
    totalAnswered,
    totalRounds
  };

  saveUserProgress(progress);
}

/**
 * Award tokens based on round performance
 * @param {number} correctCount - Number of correct answers in this round
 * @returns {number} Number of tokens earned
 */
function awardTokensForRound(correctCount) {
  let tokensEarned = 0;

  if (correctCount >= TOKEN_REWARDS.THREE.min) {
    tokensEarned = TOKEN_REWARDS.THREE.tokens;
  } else if (correctCount >= TOKEN_REWARDS.ONE.min) {
    tokensEarned = TOKEN_REWARDS.ONE.tokens;
  }

  const stats = getTrainingStats();
  const newTotalAnswered = stats.totalAnswered + QUESTIONS_PER_ROUND;
  const newTotalRounds = stats.totalRounds + 1;
  const newTokens = stats.tokens + tokensEarned;

  saveTrainingStats(newTokens, newTotalAnswered, newTotalRounds);

  return tokensEarned;
}

/**
 * Spend tokens to extend an achievement
 * @param {string} achievementId
 * @returns {boolean} True if successful
 */
function spendTokensForExtension(achievementId) {
  const stats = getTrainingStats();

  if (stats.tokens < TOKENS_FOR_EXTENSION) {
    return false;
  }

  // Check if achievement is extendable (unlocked or locked-soon, not expired)
  const status = getAchievementStatus(achievementId);
  if (status !== 'unlocked' && status !== 'locked-soon') {
    return false;
  }

  // Extend the achievement
  extendAchievement(achievementId);

  // Deduct tokens
  saveTrainingStats(stats.tokens - TOKENS_FOR_EXTENSION, stats.totalAnswered);

  return true;
}

/**
 * Get achievements that can be extended with tokens
 * @returns {Array} Array of extendable achievements
 */
function getExtendableAchievements() {
  const extendable = [];

  if (!APP_CONTENT.achievements) return extendable;

  for (const achievementId in APP_CONTENT.achievements) {
    const achievement = APP_CONTENT.achievements[achievementId];
    const status = getAchievementStatus(achievementId);
    const progress = getAchievementProgress(achievementId);

    // Only unlocked or locked-soon (expiring) can be extended
    if (status === 'unlocked' || status === 'locked-soon') {
      const expiresAt = progress ? new Date(progress.expiresAt) : null;
      const daysRemaining = expiresAt
        ? Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60 * 24))
        : 0;

      extendable.push({
        ...achievement,
        id: achievementId,
        status,
        daysRemaining,
        expiresAt
      });
    }
  }

  // Sort by days remaining (most urgent first)
  extendable.sort((a, b) => a.daysRemaining - b.daysRemaining);

  return extendable;
}

/**
 * Get all completed tests from user progress
 * Works with lazy loading - loads lectures as needed
 * @returns {Promise<Array>} Array of {moduleId, lectureId, questions, badge, cheatSheet}
 */
async function getCompletedTests() {
  const progress = getUserProgress();
  if (!progress || !progress.modules) return [];

  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId;

  const completedTests = [];

  for (const moduleId in progress.modules) {
    const moduleProgress = progress.modules[moduleId];
    if (!moduleProgress.lectures) continue;

    for (const lectureId in moduleProgress.lectures) {
      const lectureProgress = moduleProgress.lectures[lectureId];
      // Check if test was taken (has score)
      if (lectureProgress.score !== undefined) {
        // Ensure lecture is loaded (lazy loading support)
        let lecture = APP_CONTENT[moduleId]?.lectures?.[lectureId];

        if (!lecture && window.BundleLoader && studyId) {
          // Load the lecture
          lecture = await window.BundleLoader.ensureLectureLoaded(
            APP_CONTENT,
            studyId,
            moduleId,
            lectureId
          );
        }

        if (lecture && lecture.quiz && lecture.quiz.length > 0) {
          // Find cheat-sheet achievement for this lecture
          const cheatSheet = findCheatSheetForLecture(moduleId, lectureId);
          completedTests.push({
            moduleId,
            lectureId,
            topic: lecture.topic || lectureId,
            questions: lecture.quiz,
            badge: lectureProgress.badge,
            score: lectureProgress.score,
            cheatSheet
          });
        }
      }
    }
  }

  return completedTests;
}

/**
 * Find an unlocked cheat-sheet achievement for a lecture
 * @param {string} moduleId
 * @param {string} lectureId
 * @returns {Object|null} Achievement object or null
 */
function findCheatSheetForLecture(moduleId, lectureId) {
  if (!APP_CONTENT.achievements) return null;

  for (const achievementId in APP_CONTENT.achievements) {
    const achievement = APP_CONTENT.achievements[achievementId];
    // Check if this is a cheat-sheet for this lecture
    if (
      achievement.unlockCondition &&
      achievement.unlockCondition.type === 'lecture-quiz-gold' &&
      achievement.unlockCondition.moduleId === moduleId &&
      achievement.unlockCondition.lectureId === lectureId
    ) {
      // Check if unlocked
      const status = getAchievementStatus(achievementId);
      if (status === 'unlocked' || status === 'locked-soon') {
        return {
          ...achievement,
          id: achievementId,
          status
        };
      }
    }
  }
  return null;
}

// Cached completed tests for training session
let cachedCompletedTests = [];

/**
 * Get random questions from completed tests
 * @param {number} count Number of questions to get
 * @returns {Array} Array of question objects with metadata
 */
function getRandomTrainingQuestions(count = 10) {
  if (cachedCompletedTests.length === 0) return [];

  // Collect all questions with their metadata
  const allQuestions = [];
  for (const test of cachedCompletedTests) {
    for (const question of test.questions) {
      allQuestions.push({
        ...question,
        moduleId: test.moduleId,
        lectureId: test.lectureId,
        topic: test.topic,
        cheatSheet: test.cheatSheet
      });
    }
  }

  // Shuffle and take requested count
  const shuffled = shuffleArray([...allQuestions]);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Celebration emojis for offline-friendly animations
const CELEBRATION_EMOJIS = ['🎉', '🎊', '🏆', '⭐', '🌟', '✨', '🥳', '💪'];

/**
 * Get a random celebration emoji
 */
function getRandomCelebrationEmoji() {
  return CELEBRATION_EMOJIS[
    Math.floor(Math.random() * CELEBRATION_EMOJIS.length)
  ];
}

/**
 * Create confetti animation HTML (CSS-based, works offline)
 */
function createConfettiAnimation() {
  const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#00bcd4',
    '#4caf50',
    '#ffeb3b',
    '#ff9800'
  ];
  let confettiHTML =
    '<div class="confetti-container" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:1000;">';

  for (let i = 0; i < 50; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = 3 + Math.random() * 2;
    const size = 8 + Math.random() * 8;

    confettiHTML += `
      <div style="
        position:absolute;
        left:${left}%;
        top:-20px;
        width:${size}px;
        height:${size}px;
        background:${color};
        opacity:0.8;
        animation: confetti-fall ${duration}s ease-out ${delay}s forwards;
        transform: rotate(${Math.random() * 360}deg);
      "></div>
    `;
  }

  confettiHTML += '</div>';
  return confettiHTML;
}

/**
 * Show celebration animation
 */
function showCelebration() {
  // Add confetti CSS animation if not exists
  if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes celebration-bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);
  }

  // Add confetti to page
  const confettiDiv = document.createElement('div');
  confettiDiv.innerHTML = createConfettiAnimation();
  document.body.appendChild(confettiDiv);

  // Remove after animation
  setTimeout(() => {
    confettiDiv.remove();
  }, 5000);
}

// Training state
let trainingState = {
  questions: [],
  currentIndex: 0,
  correctCount: 0,
  answeredCount: 0,
  results: [] // Array of 'correct', 'incorrect', or null for each question
};

// Training context for filtered training
let trainingContext = {
  moduleId: null, // null = all modules
  lectureId: null // null = all lectures in module
};

/**
 * Set training context for filtered training
 * @param {string|null} moduleId - Filter by module (null = all)
 * @param {string|null} lectureId - Filter by lecture (null = all in module)
 */
function setTrainingContext(moduleId = null, lectureId = null) {
  trainingContext.moduleId = moduleId;
  trainingContext.lectureId = lectureId;
}

/**
 * Get current training context
 * @returns {Object} { moduleId, lectureId }
 */
function getTrainingContext() {
  return { ...trainingContext };
}

/**
 * Clear training context (train on all tests)
 */
function clearTrainingContext() {
  trainingContext.moduleId = null;
  trainingContext.lectureId = null;
}

/**
 * Get completed tests filtered by context
 * @param {string|null} moduleId - Filter by module
 * @param {string|null} lectureId - Filter by lecture
 * @returns {Promise<Array>} Filtered array of completed tests
 */
async function getCompletedTestsFiltered(moduleId = null, lectureId = null) {
  const allTests = await getCompletedTests();

  if (lectureId && moduleId) {
    return allTests.filter(
      (t) => t.moduleId === moduleId && t.lectureId === lectureId
    );
  }

  if (moduleId) {
    return allTests.filter((t) => t.moduleId === moduleId);
  }

  return allTests;
}

/**
 * Get context description for display
 * @param {Object} context - { moduleId, lectureId }
 * @param {Array} modules - MODULES array
 * @returns {string} Human-readable context description
 */
function getTrainingContextDescription(context, modules) {
  if (!context.moduleId) {
    return 'Alle abgeschlossenen Tests';
  }

  const module = modules?.find((m) => m.id === context.moduleId);
  const moduleTitle = module?.title || context.moduleId;

  if (context.lectureId) {
    // Find lecture topic from cached tests
    const test = cachedCompletedTests.find(
      (t) =>
        t.moduleId === context.moduleId && t.lectureId === context.lectureId
    );
    const lectureTopic = test?.topic || context.lectureId;
    return `${moduleTitle} → ${lectureTopic}`;
  }

  return moduleTitle;
}

/**
 * Initialize training view
 */
async function initTrainingView() {
  const container = document.getElementById('training-content');
  const stickyInfo = document.getElementById('training-sticky-info');

  // Hide sticky info during loading
  if (stickyInfo) stickyInfo.style.display = 'none';

  // Show loading state while fetching completed tests
  container.innerHTML = `
    <div class="text-center py-12">
      <span class="text-6xl mb-4 block animate-pulse">🔄</span>
      <p class="text-gray-600 dark:text-gray-400">Lade Trainingsfragen...</p>
    </div>
  `;

  // Load and cache completed tests
  // Load and cache completed tests (filtered by context)
  const allTests = await getCompletedTests();
  cachedCompletedTests = await getCompletedTestsFiltered(
    trainingContext.moduleId,
    trainingContext.lectureId
  );

  // Get context description for display
  const contextDesc = getTrainingContextDescription(
    trainingContext,
    window.MODULES || []
  );
  const isFiltered = trainingContext.moduleId !== null;

  if (cachedCompletedTests.length === 0) {
    const noTestsMessage = isFiltered
      ? `Keine abgeschlossenen Tests für "${contextDesc}" gefunden.`
      : 'Schließe erst einen Vorlesungs-Test ab, um den Trainings-Modus zu nutzen.';

    // Keep sticky info hidden for empty state
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="text-6xl mb-4 block">📝</span>
        <h3 class="text-xl font-bold mb-2">Noch keine Tests abgeschlossen</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          ${noTestsMessage}
        </p>
        ${
          isFiltered
            ? `
        <button
          onclick="window.clearTrainingContext && window.clearTrainingContext(); window.initTrainingView && window.initTrainingView();"
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition mr-2"
        >
          Alle Tests trainieren
        </button>
        `
            : ''
        }
        <button
          onclick="window.showView && window.showView('moduleMap')"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Zu den Modulen
        </button>
      </div>
    `;
    return;
  }

  // Start training with random questions
  trainingState.questions = getRandomTrainingQuestions(QUESTIONS_PER_ROUND);
  trainingState.currentIndex = 0;
  trainingState.correctCount = 0;
  trainingState.answeredCount = 0;
  // Results array should match actual question count (may be less than QUESTIONS_PER_ROUND)
  trainingState.results = new Array(trainingState.questions.length).fill(null);

  renderTrainingQuestion();
}

/**
 * Render the current training question
 * @param {boolean} animateIn - If true, animate the question sliding in from right
 */
function renderTrainingQuestion(animateIn = false) {
  const container = document.getElementById('training-content');
  const stickyInfo = document.getElementById('training-sticky-info');

  if (trainingState.currentIndex >= trainingState.questions.length) {
    renderTrainingResults();
    return;
  }

  // Show sticky info bar during questions
  if (stickyInfo) stickyInfo.style.display = '';

  const question = trainingState.questions[trainingState.currentIndex];
  const progress =
    (trainingState.currentIndex / trainingState.questions.length) * 100;
  const isMultipleAnswers = question.type === 'multiple-choice-multiple';

  // Animation styles for slide-in
  const initialStyle = animateIn
    ? 'transform: translateX(100%); opacity: 0;'
    : '';

  // Context info for filtered training
  const contextDesc = getTrainingContextDescription(
    trainingContext,
    window.MODULES || []
  );
  const isFiltered = trainingContext.moduleId !== null;

  // Get module title for current question
  const questionModule = window.MODULES?.find(
    (m) => m.id === question.moduleId
  );
  const questionModuleTitle = questionModule?.title || question.moduleId;
  const questionContext = question.lectureId
    ? `${questionModuleTitle} → ${question.topic}`
    : questionModuleTitle;

  // Build segmented progress bar (10 segments)
  const progressSegments = trainingState.results
    .map((result, i) => {
      let colorClass = 'bg-gray-300 dark:bg-gray-600'; // unanswered
      if (result === 'correct') {
        colorClass = 'bg-green-500';
      } else if (result === 'incorrect') {
        colorClass = 'bg-red-500';
      }
      const isCurrentClass =
        i === trainingState.currentIndex
          ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900'
          : '';
      return `<div class="flex-1 h-3 ${colorClass} ${isCurrentClass} transition-all duration-200"></div>`;
    })
    .join('');

  // Render sticky info (progress bar, context, cheat-sheet) into dedicated container
  const stickyContainer = document.getElementById('training-sticky-content');
  if (stickyContainer) {
    stickyContainer.innerHTML = `
      <!-- Segmented Progress Bar -->
      <div class="flex gap-1 mb-2 rounded overflow-hidden">
        ${progressSegments}
      </div>

      <!-- Context + Token + CheatSheet row -->
      <div class="flex items-center flex-wrap gap-2 text-xs">
        <!-- Training scope -->
        <span class="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
          ${escapeHtml(contextDesc)}
          ${
            isFiltered
              ? `<button 
                  onclick="window.clearTrainingContext(); window.initTrainingView();"
                  class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 ml-1"
                  title="Filter entfernen"
                >✕</button>`
              : ''
          }
        </span>
        <span class="flex-1"></span>
        <!-- Token indicator -->
        <span id="token-count-inline" class="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500" title="Trainings-Tokens">
          ${Icons.get('token', 'w-3 h-3')} ${getTrainingStats().tokens}
        </span>
        ${
          question.cheatSheet
            ? `
          <button
            onclick="showTrainingCheatSheet('${question.cheatSheet.id}')"
            class="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition"
            title="Cheat-Sheet anzeigen"
          >
            ${Icons.get('clipboard', 'w-3 h-3')}
            Cheat-Sheet
          </button>
        `
            : ''
        }
      </div>
    `;
  }

  container.innerHTML = `
    <div class="max-w-2xl mx-auto training-question-card" style="${initialStyle}">
      <!-- Topic badge -->
      <div class="mb-4">
        <span class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
          ${question.topic}
        </span>
      </div>

      <!-- Question -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <p class="text-lg font-medium mb-4" id="training-question-text">${escapeHtml(
          question.question
        )}</p>
        
        ${
          isMultipleAnswers
            ? `
          <p class="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
            Hinweis: Mehrere Antworten können richtig sein.
          </p>
        `
            : ''
        }

        <div class="space-y-3" id="training-options">
          ${question.options
            .map(
              (option, index) => `
            <label class="block p-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition" data-option-index="${index}">
              <input
                type="${isMultipleAnswers ? 'checkbox' : 'radio'}"
                name="training-option"
                value="${escapeHtml(option)}"
                class="mr-3"
              />
              <span class="option-text">${escapeHtml(option)}</span>
            </label>
          `
            )
            .join('')}
        </div>

        <button
          id="training-submit-btn"
          onclick="submitTrainingAnswer()"
          class="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          Antwort prüfen
        </button>
      </div>
    </div>
  `;

  // Animate slide-in if requested
  if (animateIn) {
    const questionCard = container.querySelector('.training-question-card');
    if (questionCard) {
      // Trigger reflow to ensure initial styles are applied
      questionCard.offsetHeight;
      // Animate to final position
      requestAnimationFrame(() => {
        questionCard.style.transition =
          'transform 0.3s ease-out, opacity 0.3s ease-out';
        questionCard.style.transform = 'translateX(0)';
        questionCard.style.opacity = '1';
      });
    }
  }

  // Render math in question and options
  if (window.renderMathInElement) {
    const questionText = document.getElementById('training-question-text');
    const optionsContainer = document.getElementById('training-options');
    if (questionText) {
      renderMathInElement(questionText, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
    if (optionsContainer) {
      renderMathInElement(optionsContainer, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  // Dev mode: highlight correct answers with light green border
  if (window.isDevMode && window.isDevMode()) {
    const isMultiple = question.type === 'multiple-choice-multiple';
    const correctAnswers = isMultiple
      ? question.correctAnswers
      : [question.correctAnswer];

    const labels = document.querySelectorAll('#training-options label');
    labels.forEach((label) => {
      const input = label.querySelector('input');
      if (input && correctAnswers.includes(input.value)) {
        label.classList.add('border-green-400', 'border-2');
      }
    });
  }
}

/**
 * Submit and check the current training answer
 */
function submitTrainingAnswer() {
  const question = trainingState.questions[trainingState.currentIndex];
  const isMultipleAnswers = question.type === 'multiple-choice-multiple';

  let isCorrect = false;
  let userAnswer;
  let correctAnswer;

  if (isMultipleAnswers) {
    const checked = document.querySelectorAll(
      'input[name="training-option"]:checked'
    );
    userAnswer = Array.from(checked).map((cb) => cb.value);
    correctAnswer = question.correctAnswers;

    if (userAnswer.length === 0) {
      alert('Bitte wähle mindestens eine Antwort aus.');
      return;
    }

    // Check if arrays match (order independent)
    isCorrect =
      userAnswer.length === correctAnswer.length &&
      userAnswer.every((a) => correctAnswer.includes(a));
  } else {
    const selected = document.querySelector(
      'input[name="training-option"]:checked'
    );
    if (!selected) {
      alert('Bitte wähle eine Antwort aus.');
      return;
    }
    userAnswer = selected.value;
    correctAnswer = question.correctAnswer;
    isCorrect = userAnswer === correctAnswer;
  }

  trainingState.answeredCount++;
  trainingState.results[trainingState.currentIndex] = isCorrect
    ? 'correct'
    : 'incorrect';
  if (isCorrect) {
    trainingState.correctCount++;
  }

  // Show feedback (no token notification per question anymore)
  showTrainingFeedback(isCorrect, correctAnswer, isMultipleAnswers);
}

/**
 * Show feedback for the answer
 */
function showTrainingFeedback(isCorrect, correctAnswer, isMultipleAnswers) {
  const options = document.querySelectorAll('#training-options label');
  const submitBtn = document.getElementById('training-submit-btn');

  // Disable all inputs
  document
    .querySelectorAll('input[name="training-option"]')
    .forEach((input) => {
      input.disabled = true;
    });

  // Highlight correct/incorrect
  options.forEach((label) => {
    const input = label.querySelector('input');
    const value = input.value;

    const isThisCorrect = isMultipleAnswers
      ? correctAnswer.includes(value)
      : value === correctAnswer;

    if (isThisCorrect) {
      label.classList.add(
        'bg-green-100',
        'dark:bg-green-900/30',
        'border-green-500'
      );
    } else if (input.checked) {
      label.classList.add('bg-red-100', 'dark:bg-red-900/30', 'border-red-500');
    }
  });

  submitBtn.outerHTML = `
    <button
      onclick="nextTrainingQuestion()"
      class="mt-6 w-full ${
        isCorrect
          ? 'bg-green-500 hover:bg-green-600'
          : 'bg-orange-500 hover:bg-orange-600'
      } text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
    >
      ${isCorrect ? '✓ Richtig!' : '✗ Leider falsch'} – Weiter →
    </button>
  `;
}

/**
 * Move to next question with slide animation
 */
function nextTrainingQuestion() {
  const container = document.getElementById('training-content');
  const questionCard = container.querySelector('.training-question-card');

  if (questionCard) {
    // Slide out to the left
    questionCard.style.transition =
      'transform 0.3s ease-out, opacity 0.3s ease-out';
    questionCard.style.transform = 'translateX(-100%)';
    questionCard.style.opacity = '0';

    setTimeout(() => {
      trainingState.currentIndex++;
      renderTrainingQuestion(true); // true = animate in from right
    }, 300);
  } else {
    trainingState.currentIndex++;
    renderTrainingQuestion();
  }
}

/**
 * Render training results with token reward
 */
function renderTrainingResults() {
  const container = document.getElementById('training-content');
  const stickyInfo = document.getElementById('training-sticky-info');
  const correctCount = trainingState.correctCount;
  const totalQuestions = trainingState.questions.length;

  // Hide sticky info on results screen
  if (stickyInfo) stickyInfo.style.display = 'none';

  // Award tokens based on performance
  const tokensEarned = awardTokensForRound(correctCount);
  const totalTokens = getTrainingStats().tokens;

  // Show celebration animation if tokens earned
  if (tokensEarned > 0) {
    showCelebration();
  }

  // Get celebration emoji
  const celebrationEmoji =
    tokensEarned > 0 ? getRandomCelebrationEmoji() : null;

  // Determine feedback
  let title, message, tokenClass;

  if (tokensEarned === 3) {
    title = 'Ausgezeichnet!';
    message = `${correctCount} von ${totalQuestions} richtig`;
    tokenClass =
      'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
  } else if (tokensEarned === 1) {
    title = 'Gut gemacht!';
    message = `${correctCount} von ${totalQuestions} richtig`;
    tokenClass =
      'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
  } else {
    title = 'Weiter üben!';
    message = `${correctCount} von ${totalQuestions} richtig`;
    tokenClass = null;
  }

  container.innerHTML = `
    <div class="max-w-sm mx-auto text-center py-6">
      ${
        celebrationEmoji
          ? `
        <!-- Celebration Emoji -->
        <div class="mb-4 text-6xl" style="animation: celebration-bounce 0.5s ease-in-out infinite;">
          ${celebrationEmoji}
        </div>
      `
          : `
        <!-- No tokens - simple message -->
        <div class="mb-4 text-gray-400">
          ${Icons.get('refresh', 'w-12 h-12 mx-auto')}
        </div>
      `
      }
      
      <h2 class="text-xl font-bold mb-1">${title}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-2">${message}</p>
      
      ${
        tokensEarned > 0
          ? `
        <!-- Token earned badge with zoom animation -->
        <div id="token-reward-badge" class="inline-flex flex-col items-center gap-1 px-4 py-3 rounded-xl ${tokenClass} mb-4" style="transform: scale(0); opacity: 0;">
          <div class="flex items-center gap-2 text-2xl font-bold">
            ${Icons.get('token', 'w-6 h-6')} +${tokensEarned}
          </div>
          <div class="text-sm opacity-80">
            Gesamt: ${totalTokens} Tokens
          </div>
        </div>
      `
          : `
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Ab 5 richtigen Antworten gibt es Tokens
        </p>
      `
      }

      <!-- Action buttons -->
      <div class="flex flex-col gap-2 mt-4">
        <button
          onclick="continueTraining()"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Weiter trainieren
        </button>
        <button
          onclick="window.showView && window.showView('moduleMap')"
          class="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-2 transition"
        >
          Beenden
        </button>
      </div>
    </div>
  `;

  // Animate token badge with zoom effect
  if (tokensEarned > 0) {
    const badge = document.getElementById('token-reward-badge');
    if (badge) {
      // Small delay before animation starts
      setTimeout(() => {
        badge.style.transition =
          'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out';
        badge.style.transform = 'scale(1)';
        badge.style.opacity = '1';
      }, 200);
    }
  }
}

/**
 * Continue training with new questions
 */
function continueTraining() {
  // Get new random questions
  trainingState.questions = getRandomTrainingQuestions(QUESTIONS_PER_ROUND);
  trainingState.currentIndex = 0;
  trainingState.correctCount = 0;
  trainingState.answeredCount = 0;
  // Reset results array to match actual question count
  trainingState.results = new Array(trainingState.questions.length).fill(null);

  // Render first question
  renderTrainingQuestion();
}

/**
 * Show cheat sheet in overlay - reuses the global achievement modal for DRY
 */
function showTrainingCheatSheet(achievementId) {
  const achievement = APP_CONTENT.achievements[achievementId];
  if (!achievement) return;

  // Reuse the global showAchievementModal function from achievements-ui.js
  if (window.showAchievementModal) {
    window.showAchievementModal(achievement);
  }
}

/**
 * Update the inline token display
 */
function updateTokenDisplay() {
  const tokenCount = document.getElementById('token-count-inline');
  if (tokenCount) {
    const stats = getTrainingStats();
    tokenCount.textContent = stats.tokens;
  }
}

/**
 * Open the token redeem modal
 */
function openTokenRedeemModal() {
  const modal = document.getElementById('training-redeem-modal');
  if (!modal) return;

  const stats = getTrainingStats();
  const extendable = getExtendableAchievements();
  const content = document.getElementById('training-redeem-content');

  if (content) {
    content.innerHTML = `
      <div class="mb-4 text-center">
        <span class="text-3xl">🎟️</span>
        <p class="text-lg font-bold mt-2">Du hast ${stats.tokens} Tokens</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Wähle ein Achievement zum Verlängern (Kosten: ${TOKENS_FOR_EXTENSION} Tokens)
        </p>
      </div>
      
      <div class="space-y-3 max-h-[50vh] overflow-y-auto">
        ${extendable
          .map(
            (achievement) => `
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex-1 min-w-0">
              <p class="font-medium truncate">${achievement.title}</p>
              <p class="text-sm ${
                achievement.status === 'locked-soon'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-gray-500 dark:text-gray-400'
              }">
                ${
                  achievement.daysRemaining <= 0
                    ? 'Läuft heute ab!'
                    : achievement.daysRemaining === 1
                    ? 'Noch 1 Tag'
                    : `Noch ${achievement.daysRemaining} Tage`
                }
              </p>
            </div>
            <button
              onclick="redeemTokenForAchievement('${achievement.id}')"
              class="ml-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-lg transition ${
                stats.tokens < TOKENS_FOR_EXTENSION
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }"
              ${stats.tokens < TOKENS_FOR_EXTENSION ? 'disabled' : ''}
            >
              Verlängern
            </button>
          </div>
        `
          )
          .join('')}
      </div>
      
      ${
        extendable.length === 0
          ? `
        <p class="text-center text-gray-500 dark:text-gray-400 py-4">
          Keine Achievements verfügbar, die verlängert werden können.
        </p>
      `
          : ''
      }
    `;
  }

  modal.classList.remove('hidden');
}

/**
 * Close the token redeem modal
 */
function closeTokenRedeemModal() {
  const modal = document.getElementById('training-redeem-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/**
 * Redeem tokens to extend an achievement
 */
function redeemTokenForAchievement(achievementId) {
  const success = spendTokensForExtension(achievementId);

  if (success) {
    // Show success feedback
    const achievement = APP_CONTENT.achievements[achievementId];
    alert(
      `✓ ${achievement.title} wurde um ${achievement.extensionDuration} Tage verlängert!`
    );

    // Update UI
    closeTokenRedeemModal();
    renderTrainingStatsCard();
  } else {
    alert(
      'Verlängerung fehlgeschlagen. Nicht genug Tokens oder Achievement nicht verfügbar.'
    );
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Expose to global scope
window.initTrainingView = initTrainingView;
window.submitTrainingAnswer = submitTrainingAnswer;
window.nextTrainingQuestion = nextTrainingQuestion;
window.continueTraining = continueTraining;
window.showTrainingCheatSheet = showTrainingCheatSheet;
window.getCompletedTests = getCompletedTests;
window.getCompletedTestsFiltered = getCompletedTestsFiltered;
window.setTrainingContext = setTrainingContext;
window.getTrainingContext = getTrainingContext;
window.clearTrainingContext = clearTrainingContext;
window.openTokenRedeemModal = openTokenRedeemModal;
window.closeTokenRedeemModal = closeTokenRedeemModal;
window.redeemTokenForAchievement = redeemTokenForAchievement;
window.getTrainingStats = getTrainingStats;
window.spendTokensForExtension = spendTokensForExtension;
