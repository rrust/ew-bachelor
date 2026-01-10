// Quiz module - Handles quiz functionality

/**
 * Starts a quiz for the current lecture
 * Checks if quiz exists and if user has completed it before
 * @param {Object} APP_CONTENT - The content object
 * @param {Array} MODULES - Array of module metadata
 * @param {string} currentModuleId - Current module ID
 * @param {string} currentLectureId - Current lecture ID
 * @param {Function} showView - Function to show a view
 * @param {Function} updateURL - Function to update URL
 * @param {Function} getUserProgress - Function to get user progress
 * @param {Function} showQuizResults - Function to show results
 * @param {Function} beginQuiz - Function to begin quiz
 */
function startQuiz(
  APP_CONTENT,
  MODULES,
  currentModuleId,
  currentLectureId,
  showView,
  updateURL,
  getUserProgress,
  showQuizResults,
  beginQuiz
) {
  const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
  if (!lecture || lecture.quiz.length === 0) {
    alert('Für diese Vorlesung wurde kein Abschlussquiz gefunden.');
    showView('lecture');
    return;
  }

  // Update URL
  const moduleData = MODULES.find((m) => m.id === currentModuleId);
  const lectureTopic = lecture.topic || currentLectureId;
  updateURL(
    `/module/${currentModuleId}/lecture/${currentLectureId}/quiz`,
    `Quiz: ${lectureTopic} - ${moduleData?.title || 'Module'}`
  );

  // Check if user has already completed this quiz
  const progress = getUserProgress();
  const existingProgress =
    progress?.modules?.[currentModuleId]?.lectures?.[currentLectureId];

  if (existingProgress && existingProgress.score !== undefined) {
    // Show results view with existing score and retake option
    showQuizResults(existingProgress.score, true);
  } else {
    // Start quiz fresh
    beginQuiz();
  }
}

/**
 * Begins a fresh quiz
 * @param {Object} APP_CONTENT - The content object
 * @param {string} currentModuleId - Current module ID
 * @param {string} currentLectureId - Current lecture ID
 * @param {Object} quizState - Quiz state object { data, currentQuestionIndex, userScore }
 * @param {Object} displays - Display elements
 * @param {Function} renderCurrentQuizQuestion - Function to render question
 * @param {Function} showView - Function to show a view
 */
function beginQuiz(
  APP_CONTENT,
  currentModuleId,
  currentLectureId,
  quizState,
  displays,
  renderCurrentQuizQuestion,
  showView
) {
  const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
  quizState.data = { questions: lecture.quiz };
  quizState.currentQuestionIndex = 0;
  quizState.userScore = 0;
  displays.quizLiveScore.textContent = `Punkte: 0`;
  renderCurrentQuizQuestion();
  showView('quiz');
}

/**
 * Updates the quiz progress bar and text
 * @param {Object} quizState - Quiz state object
 * @param {Object} displays - Display elements
 */
function updateQuizProgress(quizState, displays) {
  const totalQuestions = quizState.data.questions.length;
  const currentQ =
    quizState.currentQuestionIndex + 1 > totalQuestions
      ? totalQuestions
      : quizState.currentQuestionIndex + 1;
  const progressPercentage =
    (quizState.currentQuestionIndex / totalQuestions) * 100;

  displays.quizProgressBar.style.width = `${progressPercentage}%`;
  displays.quizProgressText.textContent = `Frage ${currentQ} von ${totalQuestions}`;
}

/**
 * Renders the current quiz question
 * @param {Object} quizState - Quiz state object
 * @param {Function} updateQuizProgress - Function to update progress
 * @param {Function} checkAnswer - Function to check answer
 * @param {Function} finishQuiz - Function to finish quiz
 */
function renderCurrentQuizQuestion(
  quizState,
  updateQuizProgress,
  checkAnswer,
  finishQuiz
) {
  updateQuizProgress();
  const quizContentDiv = document.getElementById('quiz-content');
  quizContentDiv.innerHTML = '';

  const questionData = quizState.data.questions[quizState.currentQuestionIndex];
  if (!questionData) {
    finishQuiz();
    return;
  }

  const isMultipleAnswers = questionData.type === 'multiple-choice-multiple';

  const questionEl = document.createElement('p');
  questionEl.className = 'quiz-question text-xl font-semibold mb-6';
  questionEl.textContent = questionData.question;
  quizContentDiv.appendChild(questionEl);

  // Add hint for multiple choice questions
  if (isMultipleAnswers) {
    const hintEl = document.createElement('p');
    hintEl.className = 'text-sm text-gray-600 dark:text-gray-400 mb-4 italic';
    hintEl.textContent = 'Hinweis: Mehrere Antworten können richtig sein. Wähle alle zutreffenden Optionen.';
    quizContentDiv.appendChild(hintEl);
  }

  const optionsList = document.createElement('div');
  optionsList.className = 'quiz-options space-y-3';
  questionData.options.forEach((optionText) => {
    const label = document.createElement('label');
    label.className =
      'option-label block p-4 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
    const input = document.createElement('input');
    input.type = isMultipleAnswers ? 'checkbox' : 'radio';
    input.name = isMultipleAnswers ? 'quiz-option-checkbox' : 'quiz-option';
    input.value = optionText;
    input.className = 'mr-3';
    label.appendChild(input);
    label.appendChild(document.createTextNode(optionText));
    optionsList.appendChild(label);
  });
  quizContentDiv.appendChild(optionsList);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Antwort abschicken';
  submitButton.className =
    'mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300';
  submitButton.onclick = () => {
    let selectedValue;
    let correctAnswer;
    
    if (isMultipleAnswers) {
      // Collect all checked checkboxes
      const selectedCheckboxes = document.querySelectorAll(
        'input[name="quiz-option-checkbox"]:checked'
      );
      selectedValue = Array.from(selectedCheckboxes).map(cb => cb.value);
      correctAnswer = questionData.correctAnswers; // Note: plural for multiple choice
      
      if (selectedValue.length === 0) {
        alert('Bitte wähle mindestens eine Antwort aus.');
        return;
      }
    } else {
      // Single selection radio button
      const selectedOption = document.querySelector(
        'input[name="quiz-option"]:checked'
      );
      if (!selectedOption) {
        alert('Bitte wähle eine Antwort aus.');
        return;
      }
      selectedValue = selectedOption.value;
      correctAnswer = questionData.correctAnswer; // Note: singular
    }
    
    checkAnswer(selectedValue, correctAnswer);
  };
  quizContentDiv.appendChild(submitButton);
}

/**
 * Checks the user's answer and updates score
 * @param {string} selectedValue - Selected answer
 * @param {string} correctAnswer - Correct answer
 * @param {Object} quizState - Quiz state object
 * @param {Object} displays - Display elements
/**
 * Checks if the selected answer(s) is correct
 * @param {string|string[]} selectedValue - The selected answer(s)
 * @param {string|string[]} correctAnswer - The correct answer(s)
 * @param {Object} quizState - Quiz state object
 * @param {Object} displays - Display elements
 * @param {Function} renderCurrentQuizQuestion - Function to render next question
 */
function checkAnswer(
  selectedValue,
  correctAnswer,
  quizState,
  displays,
  renderCurrentQuizQuestion
) {
  let isCorrect = false;
  
  // Handle multiple choice with multiple answers
  if (Array.isArray(correctAnswer)) {
    const selectedSet = new Set(selectedValue);
    const correctSet = new Set(correctAnswer);
    
    // Correct only if sets are identical (all correct selected, no wrong selected)
    isCorrect = selectedSet.size === correctSet.size && 
                [...selectedSet].every(answer => correctSet.has(answer));
  } else {
    // Handle single answer multiple choice
    isCorrect = selectedValue === correctAnswer;
  }
  
  if (isCorrect) {
    quizState.userScore++;
    displays.quizLiveScore.textContent = `Punkte: ${quizState.userScore}`;
  }
  quizState.currentQuestionIndex++;
  renderCurrentQuizQuestion();
}

/**
 * Finishes the quiz and shows results
 * @param {Object} quizState - Quiz state object
 * @param {Object} displays - Display elements
 * @param {string} currentModuleId - Current module ID
 * @param {string} currentLectureId - Current lecture ID
 * @param {Function} updateLectureProgress - Function to update progress
 * @param {Function} showQuizResults - Function to show results
 */
function finishQuiz(
  quizState,
  displays,
  currentModuleId,
  currentLectureId,
  updateLectureProgress,
  showQuizResults
) {
  displays.quizProgressBar.style.width = '100%'; // Fill bar at the end
  const finalScore =
    (quizState.userScore / quizState.data.questions.length) * 100;
  updateLectureProgress(currentModuleId, currentLectureId, finalScore);

  // Show results with the just-completed score (no retake option)
  showQuizResults(finalScore, false);

  // Reset quiz state
  quizState.data = null;
  quizState.currentQuestionIndex = 0;
  quizState.userScore = 0;
}

/**
 * Shows quiz results (either after completion or when viewing existing score)
 * @param {number} score - The quiz score (0-100)
 * @param {boolean} isExisting - Whether this is an existing score or just completed
 * @param {Object} displays - Display elements
 * @param {Object} buttons - Button elements
 * @param {Function} showView - Function to show a view
 */
function showQuizResults(score, isExisting, displays, buttons, showView) {
  displays.finalScore.textContent = `${score.toFixed(0)}%`;

  // Display badge with emoji and styling using helper
  const badgeInfo = window.getBadgeInfo ? window.getBadgeInfo(score) : null;
  let badgeText = '';
  let badgeClass = '';

  if (badgeInfo) {
    badgeText = `${badgeInfo.emoji} ${badgeInfo.text}-Abzeichen`;
    const colorClasses = {
      gold: 'text-yellow-500',
      silver: 'text-gray-400',
      bronze: 'text-orange-600',
      none: 'text-gray-500'
    };
    badgeClass = colorClasses[badgeInfo.class] || 'text-gray-500';
    if (badgeInfo.class === 'none') {
      badgeText = 'Kein Abzeichen';
    }
  } else {
    // Fallback if helper not available
    const thresholds = window.BADGE_THRESHOLDS || {
      GOLD: 90,
      SILVER: 70,
      BRONZE: 50
    };
    if (score >= thresholds.GOLD) {
      badgeText = '🥇 Gold-Abzeichen';
      badgeClass = 'text-yellow-500';
    } else if (score >= thresholds.SILVER) {
      badgeText = '🥈 Silber-Abzeichen';
      badgeClass = 'text-gray-400';
    } else if (score >= thresholds.BRONZE) {
      badgeText = '🥉 Bronze-Abzeichen';
      badgeClass = 'text-orange-600';
    } else {
      badgeText = 'Kein Abzeichen';
      badgeClass = 'text-gray-500';
    }
  }

  displays.finalBadge.textContent = badgeText;
  displays.finalBadge.className = `text-lg mb-8 font-semibold ${badgeClass}`;

  // Configure view based on whether this is an existing score or just completed
  if (isExisting) {
    displays.resultsTitle.textContent = 'Bisheriges Ergebnis';
    displays.resultsSubtitle.textContent =
      'Du hast diesen Test bereits abgeschlossen mit:';
    if (window.showElement) {
      window.showElement(displays.retakePrompt);
      window.showElement(buttons.retakeQuiz);
    } else {
      displays.retakePrompt.style.display = 'block';
      buttons.retakeQuiz.style.display = 'block';
    }
  } else {
    displays.resultsTitle.textContent = 'Test abgeschlossen!';
    displays.resultsSubtitle.textContent = 'Dein Ergebnis:';
    if (window.hideElement) {
      window.hideElement(displays.retakePrompt);
      window.hideElement(buttons.retakeQuiz);
    } else {
      displays.retakePrompt.style.display = 'none';
      buttons.retakeQuiz.style.display = 'none';
    }
  }

  showView('quizResults');
}

// Expose functions to global scope
window.QuizModule = {
  startQuiz,
  beginQuiz,
  updateQuizProgress,
  renderCurrentQuizQuestion,
  checkAnswer,
  finishQuiz,
  showQuizResults
};
