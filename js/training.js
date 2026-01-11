// js/training.js
// Training mode - Random questions from completed tests with cheat-sheet support

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

  // Start training with 10 random questions
  trainingState.questions = getRandomTrainingQuestions(10);
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

      <!-- Topic badge -->
      <div class="mb-4 flex items-center justify-between flex-wrap gap-2">
        <span class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
          ${question.topic}
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

  // Show feedback
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

  // Change button to "Next"
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
 * Render training results
 */
function renderTrainingResults() {
  const container = document.getElementById('training-content');
  const percentage = Math.round(
    (trainingState.correctCount / trainingState.questions.length) * 100
  );

  let emoji, message;
  if (percentage >= 90) {
    emoji = '🏆';
    message = 'Ausgezeichnet! Du beherrschst den Stoff!';
  } else if (percentage >= 70) {
    emoji = '🌟';
    message = 'Sehr gut! Weiter so!';
  } else if (percentage >= 50) {
    emoji = '💪';
    message = 'Gut gemacht! Übung macht den Meister.';
  } else {
    emoji = '📚';
    message = 'Wiederhole die Lektionen und versuche es erneut!';
  }

  container.innerHTML = `
    <div class="max-w-md mx-auto text-center py-8">
      <span class="text-6xl mb-4 block">${emoji}</span>
      <h2 class="text-2xl font-bold mb-2">Training abgeschlossen!</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">${message}</p>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="text-4xl font-bold ${
          percentage >= 70
            ? 'text-green-500'
            : percentage >= 50
            ? 'text-yellow-500'
            : 'text-red-500'
        } mb-2">
          ${percentage}%
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          ${trainingState.correctCount} von ${
    trainingState.questions.length
  } richtig
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onclick="initTrainingView()"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          ${Icons.get('refresh', 'w-5 h-5')}
          Neues Training
        </button>
        <button
          onclick="window.showView && window.showView('moduleMap')"
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg transition"
        >
          Zu den Modulen
        </button>
      </div>
    </div>
  `;
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
window.showTrainingCheatSheet = showTrainingCheatSheet;
window.closeTrainingCheatSheet = closeTrainingCheatSheet;
window.getCompletedTests = getCompletedTests;
