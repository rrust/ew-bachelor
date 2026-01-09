// Main JavaScript file for the Nutritional Science Learning App

document.addEventListener('DOMContentLoaded', async () => {
  // --- State Management ---
  let APP_CONTENT = {};
  let MODULES = []; // Will be loaded from modules.json
  let currentModuleId = null;
  let currentLectureId = null;

  // State for the lecture player
  let currentLectureItems = [];
  let currentItemIndex = 0;

  // State for the final quiz
  let quizData = null;
  let currentQuestionIndex = 0;
  let userScore = 0;

  // --- DOM Element Caching ---
  const views = {
    welcome: document.getElementById('welcome-view'),
    moduleMap: document.getElementById('module-map-view'),
    lecture: document.getElementById('lecture-view'),
    quiz: document.getElementById('quiz-view'),
    quizResults: document.getElementById('quiz-results-view'),
    tools: document.getElementById('tools-view'),
    comingSoon: document.getElementById('coming-soon-view')
  };

  const buttons = {
    start: document.getElementById('start-button'),
    backToMap: document.getElementById('back-to-map-button'),
    backToLectures: document.getElementById('back-to-lectures-button'),
    startQuiz: document.getElementById('start-quiz-button'),
    prevItem: document.getElementById('prev-item-button'),
    nextItem: document.getElementById('next-item-button'),
    backToLecture: document.getElementById('back-to-lecture-button'),
    backToLectureFromResults: document.getElementById(
      'back-to-lecture-from-results'
    ),
    retakeQuiz: document.getElementById('retake-quiz-button'),
    resultsToMap: document.getElementById('results-to-map-button'),
    navModule: document.getElementById('nav-module'),
    navMap: document.getElementById('nav-map'),
    navProgress: document.getElementById('nav-progress'),
    navTools: document.getElementById('nav-tools'),
    navModuleTools: document.getElementById('nav-module-tools'),
    navMapTools: document.getElementById('nav-map-tools'),
    navProgressTools: document.getElementById('nav-progress-tools'),
    navModuleComingSoon: document.getElementById('nav-module-coming-soon'),
    navMapComingSoon: document.getElementById('nav-map-coming-soon'),
    navProgressComingSoon: document.getElementById('nav-progress-coming-soon'),
    navToolsComingSoon: document.getElementById('nav-tools-coming-soon'),
    backToModuleFromComingSoon: document.getElementById(
      'back-to-module-from-coming-soon'
    ),
    themeToggle: document.getElementById('theme-toggle'),
    themeToggleTools: document.getElementById('theme-toggle-tools'),
    themeToggleComingSoon: document.getElementById('theme-toggle-coming-soon')
  };

  const inputs = {
    name: document.getElementById('name-input'),
    lectureJumpTo: document.getElementById('lecture-jump-to')
  };

  const displays = {
    headerGreeting: document.getElementById('header-greeting'),
    headerGreetingTools: document.getElementById('header-greeting-tools'),
    headerGreetingComingSoon: document.getElementById(
      'header-greeting-coming-soon'
    ),
    lectureProgress: document.getElementById('lecture-progress'),
    quizProgressBar: document.getElementById('quiz-progress-bar'),
    quizProgressText: document.getElementById('quiz-progress-text'),
    quizLiveScore: document.getElementById('quiz-live-score'),
    finalScore: document.getElementById('final-score-display'),
    finalBadge: document.getElementById('final-badge-display'),
    resultsTitle: document.getElementById('results-title'),
    resultsSubtitle: document.getElementById('results-subtitle'),
    retakePrompt: document.getElementById('retake-prompt')
  };

  // --- URL Routing ---
  function updateURL(path, title) {
    if (window.history && window.history.pushState) {
      window.history.pushState({ path }, title, `#${path}`);
      document.title = title ? `${title} - EW Bachelor` : 'EW Bachelor - Ernährungswissenschaft Lern-App';
    }
  }

  function parseURL() {
    const hash = window.location.hash.slice(1); // Remove #
    if (!hash || hash === '/') return null;
    
    const parts = hash.split('/').filter(p => p);
    const route = { view: parts[0] };
    
    // Parse route patterns
    if (parts[0] === 'module' && parts[1]) {
      route.moduleId = parts[1];
      if (parts[2] === 'lecture' && parts[3]) {
        route.lectureId = parts[3];
        if (parts[4] === 'item' && parts[5] !== undefined) {
          route.itemIndex = parseInt(parts[5], 10);
        } else if (parts[4] === 'quiz') {
          route.quiz = true;
          if (parts[5] !== undefined) {
            route.questionIndex = parseInt(parts[5], 10);
          }
        }
      }
    } else if (parts[0] === 'tools') {
      route.view = 'tools';
    } else if (parts[0] === 'map' || parts[0] === 'progress') {
      route.view = 'comingSoon';
    }
    
    return route;
  }

  function navigateFromURL() {
    const route = parseURL();
    if (!route) return false;
    
    if (route.view === 'module' && route.moduleId) {
      if (route.lectureId) {
        if (route.quiz) {
          currentModuleId = route.moduleId;
          currentLectureId = route.lectureId;
          startQuiz();
          return true;
        } else {
          startLecture(route.moduleId, route.lectureId);
          if (route.itemIndex !== undefined) {
            currentItemIndex = route.itemIndex;
            renderCurrentLectureItem();
          }
          return true;
        }
      } else {
        displayLecturesForModule(route.moduleId);
        return true;
      }
    } else if (route.view === 'tools') {
      updateGreeting();
      showView('tools');
      return true;
    } else if (route.view === 'comingSoon') {
      updateGreeting();
      showView('comingSoon');
      return true;
    }
    
    return false;
  }

  // --- View Management ---
  function showView(viewId) {
    Object.values(views).forEach((view) => {
      if (view) view.style.display = 'none';
    });
    if (views[viewId]) {
      views[viewId].style.display = 'block';
    }
  }

  // --- App Initialization ---
  async function init() {
    // Load modules metadata from JSON
    MODULES = await loadModules();
    // Load content
    APP_CONTENT = await parseContent();

    const progress = getUserProgress();
    if (progress && progress.userName) {
      updateGreeting(progress.userName);
      
      // Try to navigate from URL first
      if (!navigateFromURL()) {
        loadModuleCards();
        showView('moduleMap');
        updateURL('/', 'Module Overview');
      }
    } else {
      showView('welcome');
      updateURL('/', 'Welcome');
    }
    addEventListeners();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
      if (!navigateFromURL()) {
        loadModuleCards();
        showView('moduleMap');
      }
    });
  }

  // --- Update Greeting ---
  function updateGreeting(userName) {
    if (!userName) {
      const progress = getUserProgress();
      userName = progress?.userName || 'User';
    }
    const greeting = `Hi ${userName}!`;
    if (displays.headerGreeting) {
      displays.headerGreeting.textContent = greeting;
    }
    if (displays.headerGreetingTools) {
      displays.headerGreetingTools.textContent = greeting;
    }
    if (displays.headerGreetingComingSoon) {
      displays.headerGreetingComingSoon.textContent = greeting;
    }
  }

  // --- Module & Lecture Loading ---
  function getModuleStats(moduleId) {
    const module = APP_CONTENT[moduleId];
    const progress = getUserProgress();

    if (!module || !module.lectures) {
      return {
        totalQuizzes: 0,
        completedQuizzes: 0,
        averageScore: 0,
        badge: 'none'
      };
    }

    let totalQuizzes = 0;
    let completedQuizzes = 0;
    let totalScore = 0;

    for (const lectureId in module.lectures) {
      const lecture = module.lectures[lectureId];
      if (lecture.quiz && lecture.quiz.length > 0) {
        totalQuizzes++;
        const lectureProgress =
          progress?.modules?.[moduleId]?.lectures?.[lectureId];
        if (lectureProgress && lectureProgress.score !== undefined) {
          completedQuizzes++;
          totalScore += lectureProgress.score;
        }
      }
    }

    const averageScore =
      completedQuizzes > 0 ? totalScore / completedQuizzes : 0;

    // Determine badge based on average score of completed quizzes
    let badge = 'none';
    if (completedQuizzes > 0) {
      if (averageScore >= 90) {
        badge = 'gold';
      } else if (averageScore >= 70) {
        badge = 'silver';
      } else if (averageScore >= 50) {
        badge = 'bronze';
      } else {
        badge = 'incomplete';
      }
    }

    return { totalQuizzes, completedQuizzes, averageScore, badge };
  }

  function loadModuleCards() {
    const moduleGrid = document.getElementById('module-grid');
    moduleGrid.innerHTML = '';

    // Sort modules by order
    const sortedModules = [...MODULES].sort((a, b) => a.order - b.order);

    for (const module of sortedModules) {
      const card = createModuleCard(module.id, module, () =>
        displayLecturesForModule(module.id)
      );
      moduleGrid.appendChild(card);
    }
  }

  function createModuleCard(moduleId, moduleMeta, onClick) {
    const stats = getModuleStats(moduleId);

    const card = document.createElement('div');
    card.className =
      'module-card bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[200px]';

    if (moduleMeta.status === 'gesperrt') {
      card.classList.add('locked', 'opacity-50');
    }

    // Card Header: Status (left), ECTS (center), Badge (right)
    let cardHTML = `
            <div class="card-header flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 rounded-t-lg">
                <div class="status-badge text-xs font-semibold px-2 py-1 rounded-full ${
                  moduleMeta.status === 'gesperrt'
                    ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
                }">${moduleMeta.status}</div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">${
                  moduleMeta.ects
                } ECTS</span>
        `;

    // Badge on the right
    cardHTML += '<div class="badge-container">';
    if (stats.totalQuizzes > 0 && moduleMeta.status !== 'gesperrt') {
      if (stats.badge === 'gold') {
        cardHTML += `<span class="text-2xl" title="Durchschnittliche Punktzahl: ${stats.averageScore.toFixed(
          0
        )}%">🥇</span>`;
      } else if (stats.badge === 'silver') {
        cardHTML += `<span class="text-2xl" title="Durchschnittliche Punktzahl: ${stats.averageScore.toFixed(
          0
        )}%">🥈</span>`;
      } else if (stats.badge === 'bronze') {
        cardHTML += `<span class="text-2xl" title="Durchschnittliche Punktzahl: ${stats.averageScore.toFixed(
          0
        )}%">🥉</span>`;
      } else if (stats.badge === 'incomplete') {
        cardHTML += `<span class="text-2xl" title="${stats.completedQuizzes} von ${stats.totalQuizzes} Quizzes absolviert">⚪</span>`;
      } else {
        cardHTML += `<span class="text-2xl text-gray-300" title="Noch keine Quizzes absolviert">⚪</span>`;
      }
    } else {
      cardHTML +=
        '<span class="text-2xl text-gray-300" title="Noch keine Quizzes absolviert">⚪</span>';
    }
    cardHTML += '</div>';
    cardHTML += '</div>'; // Close header

    // Card Content: Module Title and Description
    cardHTML += `
            <div class="card-content flex-grow px-4 py-6">
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">${
                  moduleMeta.title
                }</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">${
                  moduleMeta.description || ''
                }</p>
            </div>
        `;

    // Card Footer: Action buttons (right aligned)
    if (moduleMeta.status !== 'gesperrt') {
      cardHTML +=
        '<div class="card-footer px-4 py-3 border-t dark:border-gray-700 rounded-b-lg flex items-center justify-end space-x-2">';
      cardHTML += `<button class="view-lectures-btn text-sm px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-200">Vorlesungen</button>`;

      // Exam button
      const examEnabled =
        stats.averageScore >= 80 && stats.completedQuizzes > 0;
      const examBtnClass = examEnabled
        ? 'text-sm px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition duration-200'
        : 'text-sm px-3 py-1.5 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-medium rounded cursor-not-allowed';

      const examTooltip = examEnabled
        ? 'Modulprüfung ablegen'
        : `Deine aktuelle Punktzahl: ${stats.averageScore.toFixed(
            0
          )}%, du brauchst 80%`;

      cardHTML += `<button class="exam-btn ${examBtnClass}" ${
        !examEnabled ? 'disabled' : ''
      } title="${examTooltip}">Prüfung</button>`;
      cardHTML += '</div>'; // Close footer
    }

    card.innerHTML = cardHTML;

    // Add event listeners
    if (moduleMeta.status !== 'gesperrt') {
      const viewLecturesBtn = card.querySelector('.view-lectures-btn');
      viewLecturesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick();
      });

      const examBtn = card.querySelector('.exam-btn');
      if (examBtn && !examBtn.disabled) {
        examBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          // TODO: Start module exam
          alert('Modulprüfung wird noch implementiert.');
        });
      }
    }

    return card;
  }

  function displayLecturesForModule(moduleId) {
    currentModuleId = moduleId;
    const module = APP_CONTENT[moduleId];
    const progress = getUserProgress();

    if (!module || !module.lectures) {
      alert('Für dieses Modul wurden keine Vorlesungen gefunden.');
      return;
    }
    
    // Update URL
    const moduleData = MODULES.find(m => m.id === moduleId);
    updateURL(`/module/${moduleId}`, moduleData?.title || 'Module');

    const lectureContentDiv = document.getElementById('lecture-content');
    lectureContentDiv.innerHTML = ''; // Clear previous player UI

    const header = document.createElement('h2');
    header.className = 'text-2xl font-bold mb-4';
    header.textContent = `Vorlesungen für ${moduleData?.title || moduleId}`;
    lectureContentDiv.appendChild(header);

    const lectureList = document.createElement('ul');
    lectureList.className = 'space-y-4';
    for (const lectureId in module.lectures) {
      const lecture = module.lectures[lectureId];
      if (lecture.items.length === 0) continue; // Don't show empty lectures

      const lectureProgress =
        progress?.modules?.[moduleId]?.lectures?.[lectureId];

      const listItem = document.createElement('li');
      listItem.className =
        'p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center';

      let contentHTML = `<div class="flex-grow">
                <h3 class="font-bold">${
                  lecture.topic || lectureId.replace(/-/g, ' ')
                }</h3>
            </div>`;

      contentHTML += '<div class="flex-shrink-0 flex items-center space-x-2">';
      contentHTML += `<button data-action="start-lecture" data-module="${moduleId}" data-lecture="${lectureId}" class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">Vorlesung</button>`;

      if (lecture.quiz && lecture.quiz.length > 0) {
        contentHTML += `<button data-action="start-quiz" data-module="${moduleId}" data-lecture="${lectureId}" class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm">Quiz</button>`;

        // Determine badge emoji
        let badgeEmoji = '';
        let tooltipText = '';

        if (lectureProgress?.badge === 'gold') {
          badgeEmoji = '🥇';
          tooltipText = `Erreichte Punktzahl: ${lectureProgress.score.toFixed(
            0
          )}%`;
        } else if (lectureProgress?.badge === 'silver') {
          badgeEmoji = '🥈';
          tooltipText = `Erreichte Punktzahl: ${lectureProgress.score.toFixed(
            0
          )}%`;
        } else if (lectureProgress?.badge === 'bronze') {
          badgeEmoji = '🥉';
          tooltipText = `Erreichte Punktzahl: ${lectureProgress.score.toFixed(
            0
          )}%`;
        } else {
          // No score yet - show placeholder
          badgeEmoji = '⚪';
          tooltipText = 'Quiz noch nicht absolviert';
        }

        // Add badge after quiz button with tooltip
        contentHTML += `<span class="text-2xl ${
          lectureProgress?.badge ? '' : 'text-gray-300'
        }" title="${tooltipText}">${badgeEmoji}</span>`;
      }
      contentHTML += '</div>';

      listItem.innerHTML = contentHTML;
      lectureList.appendChild(listItem);
    }
    lectureContentDiv.appendChild(lectureList);

    // Add event listeners for the new buttons
    lectureList.addEventListener('click', (e) => {
      const button = e.target.closest('button[data-action]');
      if (!button) return;

      const action = button.dataset.action;
      const modId = button.dataset.module;
      const lecId = button.dataset.lecture;

      if (action === 'start-lecture') {
        startLecture(modId, lecId);
      } else if (action === 'start-quiz') {
        // Set current lecture context before starting quiz directly
        currentModuleId = modId;
        currentLectureId = lecId;
        startQuiz();
      }
    });

    // Show lecture list, hide player
    document.getElementById('lecture-list-container').style.display = 'block';
    document.getElementById('lecture-player').style.display = 'none';
    showView('lecture');
  }

  // --- Lecture Player Logic ---
  function startLecture(moduleId, lectureId) {
    currentModuleId = moduleId;
    currentLectureId = lectureId;
    const lecture = APP_CONTENT[moduleId]?.lectures[lectureId];

    if (!lecture || !lecture.items || lecture.items.length === 0) {
      alert('Diese Vorlesung hat keinen Inhalt.');
      return;
    }

    currentLectureItems = lecture.items;
    currentItemIndex = 0;
    
    // Update URL
    const moduleData = MODULES.find(m => m.id === moduleId);
    const lectureTopic = lecture.topic || lectureId;
    updateURL(`/module/${moduleId}/lecture/${lectureId}/item/0`, `${lectureTopic} - ${moduleData?.title || 'Module'}`);

    // Populate jump-to dropdown
    inputs.lectureJumpTo.innerHTML = '';
    currentLectureItems.forEach((item, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `Schritt ${index + 1}`;
      inputs.lectureJumpTo.appendChild(option);
    });

    // Show player, hide lecture list
    document.getElementById('lecture-list-container').style.display = 'none';
    document.getElementById('lecture-player').style.display = 'flex';
    renderCurrentLectureItem();
    showView('lecture');
  }

  function renderCurrentLectureItem() {
    const item = currentLectureItems[currentItemIndex];
    const lectureItemDisplay = document.getElementById('lecture-item-display');
    lectureItemDisplay.innerHTML = ''; // Clear previous item

    switch (item.type) {
      case 'learning-content':
        lectureItemDisplay.innerHTML = item.html;
        break;
      case 'self-assessment-mc':
        renderSelfAssessment(item, lectureItemDisplay);
        break;
      default:
        lectureItemDisplay.innerHTML = `<p class="text-red-500">Unbekannter Inhaltstyp: ${item.type}</p>`;
    }

    updateLectureNav();
  }

  function renderSelfAssessment(item, container) {
    let content = `<div class="p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p class="font-semibold mb-4">${item.question}</p>
            <div class="space-y-2">`;

    item.options.forEach((option, index) => {
      content += `<label class="block p-3 border dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                <input type="radio" name="self-assessment-option" value="${option}" class="mr-2">
                ${option}
            </label>`;
    });

    content += `</div>
            <button class="check-answer-btn mt-4 bg-blue-200 dark:bg-blue-700 hover:bg-blue-300 dark:hover:bg-blue-600 text-blue-800 dark:text-blue-100 font-bold py-2 px-4 rounded-md">Antwort prüfen</button>
            <div class="explanation mt-3 p-3 border-l-4 border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30" style="display:none;"></div>
        </div>`;

    container.innerHTML = content;

    const checkBtn = container.querySelector('.check-answer-btn');
    checkBtn.addEventListener('click', () => {
      const selected = container.querySelector(
        'input[name="self-assessment-option"]:checked'
      );
      if (!selected) {
        alert('Bitte wähle eine Antwort.');
        return;
      }
      const isCorrect = selected.value === item.correctAnswer;
      const explanationDiv = container.querySelector('.explanation');
      explanationDiv.innerHTML =
        (isCorrect
          ? '<p class="font-bold text-green-700">Richtig!</p>'
          : '<p class="font-bold text-red-700">Leider falsch.</p>') +
        item.explanation;
      explanationDiv.style.display = 'block';
      checkBtn.disabled = true; // Prevent re-checking
    });
  }

  function updateLectureNav() {
    const totalItems = currentLectureItems.length;
    displays.lectureProgress.textContent = `Schritt ${
      currentItemIndex + 1
    } / ${totalItems}`;
    inputs.lectureJumpTo.value = currentItemIndex;
    
    // Update URL for current item
    updateURL(
      `/module/${currentModuleId}/lecture/${currentLectureId}/item/${currentItemIndex}`,
      document.title.split(' - ')[0]
    );

    buttons.prevItem.style.display = currentItemIndex > 0 ? 'block' : 'none';
    buttons.nextItem.style.display =
      currentItemIndex < totalItems - 1 ? 'block' : 'none';

    const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
    buttons.startQuiz.style.display =
      currentItemIndex === totalItems - 1 && lecture.quiz.length > 0
        ? 'block'
        : 'none';
  }

  // --- Quiz Logic ---
  function startQuiz() {
    const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
    if (!lecture || lecture.quiz.length === 0) {
      alert('Für diese Vorlesung wurde kein Abschlussquiz gefunden.');
      showView('lecture');
      return;
    }
    
    // Update URL
    const moduleData = MODULES.find(m => m.id === currentModuleId);
    const lectureTopic = lecture.topic || currentLectureId;
    updateURL(`/module/${currentModuleId}/lecture/${currentLectureId}/quiz`, `Quiz: ${lectureTopic} - ${moduleData?.title || 'Module'}`);

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

  function beginQuiz() {
    const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
    quizData = { questions: lecture.quiz };
    currentQuestionIndex = 0;
    userScore = 0;
    displays.quizLiveScore.textContent = `Punkte: 0`;
    renderCurrentQuizQuestion();
    showView('quiz');
  }

  function updateQuizProgress() {
    const totalQuestions = quizData.questions.length;
    const currentQ =
      currentQuestionIndex + 1 > totalQuestions
        ? totalQuestions
        : currentQuestionIndex + 1;
    const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;

    displays.quizProgressBar.style.width = `${progressPercentage}%`;
    displays.quizProgressText.textContent = `Frage ${currentQ} von ${totalQuestions}`;
  }

  function renderCurrentQuizQuestion() {
    updateQuizProgress();
    const quizContentDiv = document.getElementById('quiz-content');
    quizContentDiv.innerHTML = '';

    const questionData = quizData.questions[currentQuestionIndex];
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

  function checkAnswer(selectedValue, correctAnswer) {
    if (selectedValue === correctAnswer) {
      userScore++;
      displays.quizLiveScore.textContent = `Punkte: ${userScore}`;
    }
    currentQuestionIndex++;
    renderCurrentQuizQuestion();
  }

  function finishQuiz() {
    displays.quizProgressBar.style.width = '100%'; // Fill bar at the end
    const finalScore = (userScore / quizData.questions.length) * 100;
    updateLectureProgress(currentModuleId, currentLectureId, finalScore);

    // Show results with the just-completed score (no retake option)
    showQuizResults(finalScore, false);

    // Reset quiz state
    quizData = null;
    currentQuestionIndex = 0;
    userScore = 0;
  }

  function showQuizResults(score, isExisting) {
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

  // --- Event Listeners ---
  function addEventListeners() {
    buttons.start.addEventListener('click', () => {
      const userName = inputs.name.value.trim();
      if (userName) {
        saveUserProgress(getInitialProgress(userName));
        updateGreeting(userName);
        loadModuleCards();
        showView('moduleMap');
        updateURL('/', 'Module Overview');
      } else {
        alert('Bitte gib deinen Namen ein.');
      }
    });

    buttons.backToMap.addEventListener('click', () => {
      loadModuleCards(); // Reload modules in case progress was made
      showView('moduleMap');
      updateURL('/', 'Module Overview');
    });

    buttons.backToLectures.addEventListener('click', () => {
      displayLecturesForModule(currentModuleId);
    });

    buttons.backToLecture.addEventListener('click', () => {
      showView('lecture');
      updateURL(`/module/${currentModuleId}/lecture/${currentLectureId}/item/${currentItemIndex}`, document.title.split(' - ')[0]);
    });

    buttons.backToLectureFromResults.addEventListener('click', () => {
      displayLecturesForModule(currentModuleId);
    });

    buttons.retakeQuiz.addEventListener('click', () => {
      // Reset the score and start quiz fresh
      resetLectureProgress(currentModuleId, currentLectureId);
      beginQuiz();
    });

    buttons.resultsToMap.addEventListener('click', () => {
      loadModuleCards();
      showView('moduleMap');
      updateURL('/', 'Module Overview');
    });

    buttons.startQuiz.addEventListener('click', startQuiz);

    buttons.nextItem.addEventListener('click', () => {
      if (currentItemIndex < currentLectureItems.length - 1) {
        currentItemIndex++;
        renderCurrentLectureItem();
      }
    });

    buttons.prevItem.addEventListener('click', () => {
      if (currentItemIndex > 0) {
        currentItemIndex--;
        renderCurrentLectureItem();
      }
    });

    inputs.lectureJumpTo.addEventListener('change', (e) => {
      const newIndex = parseInt(e.target.value, 10);
      if (newIndex >= 0 && newIndex < currentLectureItems.length) {
        currentItemIndex = newIndex;
        renderCurrentLectureItem();
      }
    });

    buttons.navModule.addEventListener('click', () => {
      loadModuleCards();
      showView('moduleMap');
      updateURL('/', 'Module Overview');
    });

    buttons.navMap.addEventListener('click', () => {
      updateGreeting();
      showView('comingSoon');
      updateURL('/map', 'Map (Coming Soon)');
    });

    buttons.navProgress.addEventListener('click', () => {
      updateGreeting();
      showView('comingSoon');
      updateURL('/progress', 'Progress (Coming Soon)');
    });

    buttons.navTools.addEventListener('click', () => {
      updateGreeting();
      showView('tools');
      updateURL('/tools', 'Tools');
    });

    buttons.navModuleTools.addEventListener('click', () => {
      loadModuleCards();
      showView('moduleMap');
      updateURL('/', 'Module Overview');
    });

    buttons.navMapTools.addEventListener('click', () => {
      updateGreeting();
      showView('comingSoon');
      updateURL('/map', 'Map (Coming Soon)');
    });

    buttons.navProgressTools.addEventListener('click', () => {
      updateGreeting();
      showView('comingSoon');
      updateURL('/progress', 'Progress (Coming Soon)');
    });

    // Coming Soon View Navigation
    buttons.navModuleComingSoon.addEventListener('click', () => {
      loadModuleCards();
      showView('moduleMap');
      updateURL('/', 'Module Overview');
    });

    buttons.navMapComingSoon.addEventListener('click', () => {
      updateGreeting();
      showView('comingSoon');
      updateURL('/map', 'Map (Coming Soon)');
    });

    buttons.navProgressComingSoon.addEventListener('click', () => {
      updateGreeting();
      showView('comingSoon');
      updateURL('/progress', 'Progress (Coming Soon)');
    });

    buttons.navToolsComingSoon.addEventListener('click', () => {
      updateGreeting();
      showView('tools');
      updateURL('/tools', 'Tools');
    });

    buttons.backToModuleFromComingSoon.addEventListener('click', () => {
      loadModuleCards();
      showView('moduleMap');
      updateURL('/', 'Module Overview');
    });

    buttons.themeToggle.addEventListener('click', () => {
      toggleTheme();
    });

    if (buttons.themeToggleTools) {
      buttons.themeToggleTools.addEventListener('click', () => {
        toggleTheme();
      });
    }

    if (buttons.themeToggleComingSoon) {
      buttons.themeToggleComingSoon.addEventListener('click', () => {
        toggleTheme();
      });
    }
  }

  // --- Theme Toggle ---
  function toggleTheme() {
    const html = document.documentElement;

    // Get all light and dark icons (by ID and class)
    const lightIcons = [
      document.getElementById('theme-toggle-light-icon'),
      ...document.querySelectorAll('.theme-toggle-light-icon')
    ].filter(Boolean);

    const darkIcons = [
      document.getElementById('theme-toggle-dark-icon'),
      ...document.querySelectorAll('.theme-toggle-dark-icon')
    ].filter(Boolean);

    if (html.classList.contains('dark')) {
      // Switch to light mode
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      lightIcons.forEach((icon) => icon.classList.add('hidden'));
      darkIcons.forEach((icon) => icon.classList.remove('hidden'));
    } else {
      // Switch to dark mode
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      lightIcons.forEach((icon) => icon.classList.remove('hidden'));
      darkIcons.forEach((icon) => icon.classList.add('hidden'));
    }
  }

  // --- Initialize Theme Icons ---
  function initializeThemeIcons() {
    const lightIcons = [
      document.getElementById('theme-toggle-light-icon'),
      ...document.querySelectorAll('.theme-toggle-light-icon')
    ].filter(Boolean);

    const darkIcons = [
      document.getElementById('theme-toggle-dark-icon'),
      ...document.querySelectorAll('.theme-toggle-dark-icon')
    ].filter(Boolean);

    if (document.documentElement.classList.contains('dark')) {
      lightIcons.forEach((icon) => icon.classList.remove('hidden'));
      darkIcons.forEach((icon) => icon.classList.add('hidden'));
    } else {
      lightIcons.forEach((icon) => icon.classList.add('hidden'));
      darkIcons.forEach((icon) => icon.classList.remove('hidden'));
    }
  }

  // --- Initial Load ---
  init();
  initializeThemeIcons();
});
