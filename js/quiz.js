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

  const questionEl = document.createElement('p');
  questionEl.className = 'quiz-question text-xl font-semibold mb-6';
  questionEl.textContent = questionData.question;
  quizContentDiv.appendChild(questionEl);

  const optionsList = document.createElement('div');
  optionsList.className = 'quiz-options space-y-3';
  questionData.options.forEach((optionText) => {
    const label = document.createElement('label');
    label.className =
      'option-label block p-4 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz-option';
    radio.value = optionText;
    radio.className = 'mr-3';
    label.appendChild(radio);
    label.appendChild(document.createTextNode(optionText));
    optionsList.appendChild(label);
  });
  quizContentDiv.appendChild(optionsList);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Antwort abschicken';
  submitButton.className =
    'mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300';
  submitButton.onclick = () => {
    const selectedOption = document.querySelector(
      'input[name="quiz-option"]:checked'
    );
    if (selectedOption) {
      checkAnswer(selectedOption.value, questionData.correctAnswer);
    } else {
      alert('Bitte wähle eine Antwort aus.');
    }
  };
  quizContentDiv.appendChild(submitButton);
}

/**
 * Checks the user's answer and updates score
 * @param {string} selectedValue - Selected answer
 * @param {string} correctAnswer - Correct answer
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
  if (selectedValue === correctAnswer) {
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

  // Display badge with emoji and styling
  let badgeText = '';
  let badgeClass = '';
  if (score >= 90) {
    badgeText = '🥇 Gold-Abzeichen';
    badgeClass = 'text-yellow-500';
  } else if (score >= 70) {
    badgeText = '🥈 Silber-Abzeichen';
    badgeClass = 'text-gray-400';
  } else if (score >= 50) {
    badgeText = '🥉 Bronze-Abzeichen';
    badgeClass = 'text-orange-600';
  } else {
    badgeText = 'Kein Abzeichen';
    badgeClass = 'text-gray-500';
  }
  displays.finalBadge.textContent = badgeText;
  displays.finalBadge.className = `text-lg mb-8 font-semibold ${badgeClass}`;

  // Configure view based on whether this is an existing score or just completed
  if (isExisting) {
    displays.resultsTitle.textContent = 'Bisheriges Ergebnis';
    displays.resultsSubtitle.textContent =
      'Du hast dieses Quiz bereits abgeschlossen mit:';
    displays.retakePrompt.style.display = 'block';
    buttons.retakeQuiz.style.display = 'block';
  } else {
    displays.resultsTitle.textContent = 'Quiz abgeschlossen!';
    displays.resultsSubtitle.textContent = 'Dein Ergebnis:';
    displays.retakePrompt.style.display = 'none';
    buttons.retakeQuiz.style.display = 'none';
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
