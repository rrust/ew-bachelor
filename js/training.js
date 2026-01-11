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
 * @returns {Array} Array of {moduleId, lectureId, questions, badge, cheatSheet}
 */
function getCompletedTests() {
  const progress = getUserProgress();
  if (!progress || !progress.modules) return [];

  const completedTests = [];

  for (const moduleId in progress.modules) {
    const moduleProgress = progress.modules[moduleId];
    if (!moduleProgress.lectures) continue;

    for (const lectureId in moduleProgress.lectures) {
      const lectureProgress = moduleProgress.lectures[lectureId];
      // Check if test was taken (has score)
      if (lectureProgress.score !== undefined) {
        const lecture = APP_CONTENT[moduleId]?.lectures?.[lectureId];
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

/**
 * Get random questions from completed tests
 * @param {number} count Number of questions to get
 * @returns {Array} Array of question objects with metadata
 */
function getRandomTrainingQuestions(count = 10) {
  const completedTests = getCompletedTests();
  if (completedTests.length === 0) return [];

  // Collect all questions with their metadata
  const allQuestions = [];
  for (const test of completedTests) {
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

// Training state
let trainingState = {
  questions: [],
  currentIndex: 0,
  correctCount: 0,
  answeredCount: 0
};

/**
 * Initialize training view
 */
function initTrainingView() {
  const completedTests = getCompletedTests();
  const container = document.getElementById('training-content');

  if (completedTests.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="text-6xl mb-4 block">📝</span>
        <h3 class="text-xl font-bold mb-2">Noch keine Tests abgeschlossen</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Schließe erst einen Vorlesungs-Test ab, um den Trainings-Modus zu nutzen.
        </p>
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

  renderTrainingQuestion();
}

/**
 * Render the current training question
 */
function renderTrainingQuestion() {
  const container = document.getElementById('training-content');

  if (trainingState.currentIndex >= trainingState.questions.length) {
    renderTrainingResults();
    return;
  }

  const question = trainingState.questions[trainingState.currentIndex];
  const progress =
    (trainingState.currentIndex / trainingState.questions.length) * 100;
  const isMultipleAnswers = question.type === 'multiple-choice-multiple';

  container.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <!-- Progress -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Frage ${trainingState.currentIndex + 1} von ${
    trainingState.questions.length
  }
          </span>
          <span class="text-sm font-medium text-green-600 dark:text-green-400">
            ${trainingState.correctCount} richtig
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>
      </div>

      <!-- Topic badge with token indicator -->
      <div class="mb-4 flex items-center flex-wrap gap-2">
        <span class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
          ${question.topic}
        </span>
        <span class="flex-1"></span>
        <!-- Token indicator -->
        <span id="token-count-inline" class="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500" title="Trainings-Tokens">
          ${Icons.get('token', 'w-3 h-3')} ${getTrainingStats().tokens}
        </span>
        ${
          question.cheatSheet
            ? `
          <button
            onclick="showTrainingCheatSheet('${question.cheatSheet.id}')"
            class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition"
            title="Spickzettel anzeigen"
          >
            ${Icons.get('clipboard', 'w-3 h-3')}
            <span>Spickzettel</span>
          </button>
        `
            : ''
        }
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
 * Move to next question
 */
function nextTrainingQuestion() {
  trainingState.currentIndex++;
  renderTrainingQuestion();
}

/**
 * Render training results with token reward
 */
function renderTrainingResults() {
  const container = document.getElementById('training-content');
  const correctCount = trainingState.correctCount;
  const totalQuestions = trainingState.questions.length;

  // Award tokens based on performance
  const tokensEarned = awardTokensForRound(correctCount);

  // Update the token display
  updateTokenDisplay();

  // Determine feedback
  let icon, iconColor, title, message, tokenMessage, tokenClass;

  if (tokensEarned === 3) {
    icon = Icons.get('trophy', 'w-12 h-12');
    iconColor = 'text-yellow-500';
    title = 'Ausgezeichnet!';
    message = `${correctCount} von ${totalQuestions} richtig`;
    tokenMessage = `+${tokensEarned} Tokens!`;
    tokenClass =
      'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
  } else if (tokensEarned === 1) {
    icon = Icons.get('star', 'w-12 h-12');
    iconColor = 'text-blue-500';
    title = 'Gut gemacht!';
    message = `${correctCount} von ${totalQuestions} richtig`;
    tokenMessage = `+${tokensEarned} Token!`;
    tokenClass =
      'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
  } else {
    icon = Icons.get('muscle', 'w-12 h-12');
    iconColor = 'text-gray-400';
    title = 'Weiter üben!';
    message = `${correctCount} von ${totalQuestions} richtig`;
    tokenMessage = null;
    tokenClass = null;
  }

  container.innerHTML = `
    <div class="max-w-sm mx-auto text-center py-6">
      <!-- Result icon -->
      <div class="mb-4 ${iconColor}">
        ${icon}
      </div>
      
      <h2 class="text-xl font-bold mb-1">${title}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">${message}</p>
      
      ${
        tokenMessage
          ? `
        <!-- Token earned badge -->
        <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full ${tokenClass} text-sm font-medium mb-4">
          ${Icons.get('token', 'w-4 h-4')} ${tokenMessage}
        </div>
      `
          : ''
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

  // Render first question
  renderTrainingQuestion();
}

/**
 * Show cheat sheet in overlay
 */
function showTrainingCheatSheet(achievementId) {
  const achievement = APP_CONTENT.achievements[achievementId];
  if (!achievement) return;

  const modal = document.getElementById('training-cheatsheet-modal');
  const title = document.getElementById('training-cheatsheet-title');
  const content = document.getElementById('training-cheatsheet-content');

  if (title) title.textContent = achievement.title;
  if (content) {
    // Parse markdown content
    if (window.marked && achievement.content) {
      content.innerHTML = marked.parse(achievement.content);
      // Render math if available
      if (window.renderMathInElement) {
        renderMathInElement(content, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }
    } else {
      content.innerHTML =
        '<p class="text-gray-500">Inhalt konnte nicht geladen werden.</p>';
    }
  }

  if (modal) {
    modal.classList.remove('hidden');
    // Focus close button for accessibility
    const closeBtn = document.getElementById('close-training-cheatsheet');
    if (closeBtn) closeBtn.focus();
  }
}

/**
 * Close cheat sheet overlay
 */
function closeTrainingCheatSheet() {
  const modal = document.getElementById('training-cheatsheet-modal');
  if (modal) {
    modal.classList.add('hidden');
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
window.closeTrainingCheatSheet = closeTrainingCheatSheet;
window.getCompletedTests = getCompletedTests;
window.openTokenRedeemModal = openTokenRedeemModal;
window.closeTokenRedeemModal = closeTokenRedeemModal;
window.redeemTokenForAchievement = redeemTokenForAchievement;
window.getTrainingStats = getTrainingStats;
window.spendTokensForExtension = spendTokensForExtension;
