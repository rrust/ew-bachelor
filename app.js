// Main JavaScript file for the Nutritional Science Learning App

document.addEventListener('DOMContentLoaded', async () => {
  // --- State Management ---
  let APP_CONTENT = {};
  let MODULES = []; // Will be loaded from modules.json
  let currentModuleId = null;
  let currentLectureId = null;

  // State for the lecture player
  const lectureState = {
    currentItems: [],
    currentIndex: 0
  };

  // --- DOM Element Caching ---
  const views = {
    welcome: document.getElementById('welcome-view'),
    moduleMap: document.getElementById('module-map-view'),
    lecture: document.getElementById('lecture-view'),
    quiz: document.getElementById('quiz-view'),
    quizResults: document.getElementById('quiz-results-view'),
    tools: document.getElementById('tools-view'),
    map: document.getElementById('map-view'),
    progress: document.getElementById('progress-view')
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
    lectureOverview: document.getElementById('lecture-overview-button'),
    backToPlayer: document.getElementById('back-to-player-button'),
    // These will be set after headers are injected
    navModule: null,
    navMap: null,
    navProgress: null,
    navTools: null,
    themeToggle: null
  };

  // Get references to dynamically created header buttons
  function refreshHeaderButtons() {
    buttons.navModule = document.getElementById('nav-module');
    buttons.navMap = document.getElementById('nav-map');
    buttons.navProgress = document.getElementById('nav-progress');
    buttons.navTools = document.getElementById('nav-tools');
    buttons.themeToggle = document.getElementById('theme-toggle');
  }

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

  const lectureElements = {
    lectureJumpTo: inputs.lectureJumpTo,
    lectureListContainer: document.getElementById('lecture-list-container'),
    lecturePlayer: document.getElementById('lecture-player'),
    lectureOverview: document.getElementById('lecture-overview')
  };

  // --- URL Routing ---
  function updateURL(path, title) {
    if (window.history && window.history.pushState) {
      window.history.pushState({ path }, title, `#${path}`);
      document.title = title
        ? `${title} - EW Bachelor`
        : 'EW Bachelor - Ernährungswissenschaft Lern-App';
    }
  }

  function parseURL() {
    const hash = window.location.hash.slice(1); // Remove #
    if (!hash || hash === '/') return null;

    const parts = hash.split('/').filter((p) => p);
    const route = { view: parts[0] };

    // Parse route patterns
    if (parts[0] === 'module' && parts[1]) {
      route.moduleId = parts[1];
      if (parts[2] === 'lecture' && parts[3]) {
        route.lectureId = parts[3];
        if (parts[4] === 'overview') {
          route.overview = true;
        } else if (parts[4] === 'item' && parts[5] !== undefined) {
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
    } else if (parts[0] === 'map') {
      route.view = 'map';
    } else if (parts[0] === 'progress') {
      route.view = 'progress';
    }

    return route;
  }

  function navigateFromURL() {
    const route = parseURL();
    console.log('navigateFromURL - parsed route:', route);
    if (!route) return false;

    if (route.view === 'module' && route.moduleId) {
      if (route.lectureId) {
        if (route.overview) {
          // Show overview for this lecture
          currentModuleId = route.moduleId;
          currentLectureId = route.lectureId;
          const lecture =
            APP_CONTENT[route.moduleId]?.lectures[route.lectureId];
          if (lecture && lecture.items && lecture.items.length > 0) {
            currentLectureItems = lecture.items;
            currentItemIndex = 0;
            showView('lecture'); // Show lecture view first
            showLectureOverview(); // Then show overview within lecture view
          }
          return true;
        } else if (route.quiz) {
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
    } else if (route.view === 'map') {
      updateGreeting();
      showView('map');
      renderModuleMap(MODULES, APP_CONTENT);
      return true;
    } else if (route.view === 'progress') {
      updateGreeting();
      showView('progress');
      renderProgressDashboard(MODULES, APP_CONTENT);
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
    // Inject headers into views using components.js
    injectHeader('module-map-view', 'moduleMap');
    injectHeader('tools-view', 'tools');
    injectHeader('map-view', 'map');
    injectHeader('progress-view', 'progress');

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

    // Refresh button references after headers are injected
    refreshHeaderButtons();
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

  // --- Module & Lecture Loading (using ModulesModule) ---
  function getModuleStats(moduleId) {
    return window.ModulesModule.getModuleStats(
      moduleId,
      APP_CONTENT,
      getUserProgress
    );
  }

  function loadModuleCards() {
    window.ModulesModule.loadModuleCards(
      MODULES,
      APP_CONTENT,
      getUserProgress,
      getModuleStats,
      createModuleCard,
      displayLecturesForModule
    );
  }

  function createModuleCard(moduleId, moduleMeta, onClick) {
    return window.ModulesModule.createModuleCard(
      moduleId,
      moduleMeta,
      APP_CONTENT,
      getUserProgress,
      getModuleStats,
      onClick
    );
  }

  function displayLecturesForModule(moduleId) {
    currentModuleId = moduleId;
    window.ModulesModule.displayLecturesForModule(
      moduleId,
      APP_CONTENT,
      MODULES,
      getUserProgress,
      updateURL,
      showView,
      startLecture,
      (modId, lecId) => {
        currentModuleId = modId;
        currentLectureId = lecId;
        startQuiz();
      },
      (modId, lecId) => {
        currentModuleId = modId;
        currentLectureId = lecId;
        const lecture = APP_CONTENT[modId]?.lectures[lecId];
        if (lecture && lecture.items && lecture.items.length > 0) {
          lectureState.currentItems = lecture.items;
          lectureState.currentIndex = 0;
          showLectureOverview();
        } else {
          alert('Diese Vorlesung hat keinen Inhalt.');
        }
      }
    );
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

    lectureState.currentItems = lecture.items;
    lectureState.currentIndex = 0;

    // Update URL
    const moduleData = MODULES.find((m) => m.id === moduleId);
    const lectureTopic = lecture.topic || lectureId;
    updateURL(
      `/module/${moduleId}/lecture/${lectureId}/item/0`,
      `${lectureTopic} - ${moduleData?.title || 'Module'}`
    );

    // Populate jump-to dropdown
    inputs.lectureJumpTo.innerHTML = '';
    lectureState.currentItems.forEach((item, index) => {
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
    const item = lectureState.currentItems[lectureState.currentIndex];
    const lectureItemDisplay = document.getElementById('lecture-item-display');
    lectureItemDisplay.innerHTML = ''; // Clear previous item

    switch (item.type) {
      case 'learning-content':
        lectureItemDisplay.innerHTML = item.html;
        break;
      case 'self-assessment-mc':
        renderSelfAssessment(item, lectureItemDisplay);
        break;
      case 'youtube-video':
        renderYouTubeVideo(item, lectureItemDisplay);
        break;
      case 'image':
        renderImage(item, lectureItemDisplay);
        break;
      case 'mermaid-diagram':
        renderMermaidDiagram(item, lectureItemDisplay);
        break;
      default:
        lectureItemDisplay.innerHTML = `<p class="text-red-500">Unbekannter Inhaltstyp: ${item.type}</p>`;
    }

    updateLectureNav();
  }

  function renderYouTubeVideo(item, container) {
    // Extract video ID from URL
    let videoId = '';
    if (item.url) {
      const urlParams = new URLSearchParams(new URL(item.url).search);
      videoId = urlParams.get('v') || item.url.split('/').pop();
    }

    const title = item.title
      ? `<h3 class="text-xl font-bold mb-4">${item.title}</h3>`
      : '';

    container.innerHTML = `
      <div class="video-container">
        ${title}
        <div class="relative" style="padding-bottom: 56.25%; height: 0;">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            class="absolute top-0 left-0 w-full h-full rounded-lg"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </div>
    `;
  }

  function renderImage(item, container) {
    const title = item.title
      ? `<h3 class="text-xl font-bold mb-4">${item.title}</h3>`
      : '';
    const caption = item.caption
      ? `<p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">${item.caption}</p>`
      : '';
    const alt = item.alt || item.title || 'Bild';

    container.innerHTML = `
      <div class="image-container">
        ${title}
        <div class="flex justify-center">
          <img 
            src="${item.url}" 
            alt="${alt}"
            class="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        ${caption}
      </div>
    `;
  }

  async function renderMermaidDiagram(item, container) {
    const title = item.title
      ? `<h3 class="text-xl font-bold mb-4">${item.title}</h3>`
      : '';
    const diagramId = `mermaid-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    container.innerHTML = `
      <div class="mermaid-container">
        ${title}
        <div class="flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg">
          <div id="${diagramId}" class="mermaid-diagram"></div>
        </div>
      </div>
    `;

    // Render mermaid diagram
    try {
      const diagramDiv = document.getElementById(diagramId);
      const { svg } = await window.mermaid.render(
        `diagram-${diagramId}`,
        item.diagram
      );
      diagramDiv.innerHTML = svg;
    } catch (error) {
      console.error('Error rendering Mermaid diagram:', error);
      container.innerHTML = `<p class="text-red-500">Fehler beim Rendern des Diagramms: ${error.message}</p>`;
    }
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
    const totalItems = lectureState.currentItems.length;
    displays.lectureProgress.textContent = `Schritt ${
      lectureState.currentIndex + 1
    } / ${totalItems}`;
    inputs.lectureJumpTo.value = lectureState.currentIndex;

    // Update URL for current item
    updateURL(
      `/module/${currentModuleId}/lecture/${currentLectureId}/item/${lectureState.currentIndex}`,
      document.title.split(' - ')[0]
    );

    buttons.prevItem.style.display =
      lectureState.currentIndex > 0 ? 'block' : 'none';
    buttons.nextItem.style.display =
      lectureState.currentIndex < totalItems - 1 ? 'block' : 'none';

    const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
    buttons.startQuiz.style.display =
      lectureState.currentIndex === totalItems - 1 && lecture.quiz.length > 0
        ? 'block'
        : 'none';
  }

  // --- Lecture Overview ---
  function showLectureOverview() {
    const overviewContent = document.getElementById('lecture-overview-content');
    const overviewDescription = document.getElementById(
      'lecture-overview-description'
    );

    overviewContent.innerHTML = '';

    // Set description
    const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
    const moduleData = MODULES.find((m) => m.id === currentModuleId);

    // Show lecture description if available
    if (lecture?.descriptionHtml) {
      overviewDescription.innerHTML = lecture.descriptionHtml;
    } else {
      // Generate description based on content
      const totalItems = lectureState.currentItems.length;
      const contentCount = lectureState.currentItems.filter(
        (i) => i.type === 'learning-content'
      ).length;
      const questionCount = lectureState.currentItems.filter(
        (i) => i.type === 'self-assessment-mc'
      ).length;
      const videoCount = lectureState.currentItems.filter(
        (i) => i.type === 'youtube-video'
      ).length;
      const imageCount = lectureState.currentItems.filter(
        (i) => i.type === 'image'
      ).length;
      const diagramCount = lectureState.currentItems.filter(
        (i) => i.type === 'mermaid-diagram'
      ).length;

      const descParts = [];
      if (contentCount > 0)
        descParts.push(
          `${contentCount} Lerninhalt${contentCount > 1 ? 'e' : ''}`
        );
      if (questionCount > 0)
        descParts.push(
          `${questionCount} Selbsttest${questionCount > 1 ? 's' : ''}`
        );
      if (videoCount > 0)
        descParts.push(`${videoCount} Video${videoCount > 1 ? 's' : ''}`);
      if (imageCount > 0)
        descParts.push(`${imageCount} Bild${imageCount > 1 ? 'er' : ''}`);
      if (diagramCount > 0)
        descParts.push(
          `${diagramCount} Diagramm${diagramCount > 1 ? 'e' : ''}`
        );

      overviewDescription.textContent = `${totalItems} Schritte insgesamt • ${descParts.join(
        ' • '
      )}`;
    }

    lectureState.currentItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className =
        'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer';

      let typeLabel = '';
      let badgeClass = '';
      let preview = '';
      let description = '';

      switch (item.type) {
        case 'learning-content':
          typeLabel = 'Text';
          badgeClass =
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
          // Extract first heading or first few words
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = item.html;
          const heading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
          preview = heading
            ? heading.textContent
            : tempDiv.textContent.substring(0, 100) + '...';
          // Extract description from first paragraph
          const firstP = tempDiv.querySelector('p');
          description = firstP
            ? firstP.textContent.substring(0, 150) + '...'
            : '';
          break;
        case 'self-assessment-mc':
          typeLabel = 'Selbsttest';
          badgeClass =
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
          preview = item.question;
          description = `${item.options?.length || 0} Antwortmöglichkeiten`;
          break;
        case 'youtube-video':
          typeLabel = 'Video';
          badgeClass =
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
          preview = item.title || 'YouTube Video';
          description = 'Eingebettetes YouTube-Video';
          break;
        case 'image':
          typeLabel = 'Bild';
          badgeClass =
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
          preview = item.title || item.alt || 'Bild';
          description = item.caption || item.alt || 'Bilddarstellung';
          break;
        case 'mermaid-diagram':
          typeLabel = 'Diagramm';
          badgeClass =
            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
          preview = item.title || 'Mermaid Diagramm';
          description = 'Interaktives Diagramm';
          break;
        default:
          typeLabel = 'Inhalt';
          badgeClass =
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
          preview = 'Unbekannter Typ';
          description = '';
      }

      card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1">${preview}</h3>
          <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full ${badgeClass} ml-4 flex-shrink-0">${typeLabel}</span>
        </div>
        ${
          description
            ? `<p class="text-sm text-gray-600 dark:text-gray-400">${description}</p>`
            : ''
        }
      `;

      card.addEventListener('click', () => {
        lectureState.currentIndex = index;
        renderCurrentLectureItem();
        document.getElementById('lecture-player').style.display = 'flex';
        document.getElementById('lecture-overview').style.display = 'none';
        // Update URL for the specific item
        updateURL(
          `/module/${currentModuleId}/lecture/${currentLectureId}/item/${lectureState.currentIndex}`,
          document.title.split(' - ')[0]
        );
      });

      overviewContent.appendChild(card);
    });

    document.getElementById('lecture-player').style.display = 'none';
    document.getElementById('lecture-overview').style.display = 'flex';

    // Update URL for overview
    updateURL(
      `/module/${currentModuleId}/lecture/${currentLectureId}/overview`,
      lecture?.topic || 'Vorlesungsübersicht'
    );
  }

  // --- Quiz Logic (using QuizModule) ---
  const quizState = {
    data: null,
    currentQuestionIndex: 0,
    userScore: 0
  };

  function startQuiz() {
    window.QuizModule.startQuiz(
      APP_CONTENT,
      MODULES,
      currentModuleId,
      currentLectureId,
      showView,
      updateURL,
      getUserProgress,
      (score, isExisting) =>
        window.QuizModule.showQuizResults(
          score,
          isExisting,
          displays,
          buttons,
          showView
        ),
      beginQuiz
    );
  }

  function beginQuiz() {
    window.QuizModule.beginQuiz(
      APP_CONTENT,
      currentModuleId,
      currentLectureId,
      quizState,
      displays,
      renderCurrentQuizQuestion,
      showView
    );
  }

  function updateQuizProgress() {
    window.QuizModule.updateQuizProgress(quizState, displays);
  }

  function renderCurrentQuizQuestion() {
    window.QuizModule.renderCurrentQuizQuestion(
      quizState,
      updateQuizProgress,
      checkAnswer,
      finishQuiz
    );
  }

  function checkAnswer(selectedValue, correctAnswer) {
    window.QuizModule.checkAnswer(
      selectedValue,
      correctAnswer,
      quizState,
      displays,
      renderCurrentQuizQuestion
    );
  }

  function finishQuiz() {
    window.QuizModule.finishQuiz(
      quizState,
      displays,
      currentModuleId,
      currentLectureId,
      updateLectureProgress,
      (score, isExisting) =>
        window.QuizModule.showQuizResults(
          score,
          isExisting,
          displays,
          buttons,
          showView
        )
    );
  }

  // --- Event Listeners ---
  function setupWelcomeListeners() {
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
  }

  function setupNavigationListeners() {
    buttons.backToMap.addEventListener('click', () => {
      loadModuleCards(); // Reload modules in case progress was made
      showView('moduleMap');
      updateURL('/', 'Module Overview');
    });

    buttons.backToLectures.addEventListener('click', () => {
      displayLecturesForModule(currentModuleId);
    });

    buttons.backToPlayer.addEventListener('click', () => {
      // Navigate back to lecture list
      displayLecturesForModule(currentModuleId);
    });

    // Header navigation using event delegation to handle all view variants
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      // Module navigation (nav-module, nav-module-map, nav-module-tools, etc.)
      if (target.id && target.id.startsWith('nav-module')) {
        loadModuleCards();
        showView('moduleMap');
        updateURL('/', 'Module Overview');
      }

      // Map navigation
      else if (target.id && target.id.startsWith('nav-map')) {
        updateGreeting();
        showView('map');
        renderModuleMap(MODULES, APP_CONTENT);
        updateURL('/map', 'Studienstruktur Map');
      }

      // Progress navigation
      else if (target.id && target.id.startsWith('nav-progress')) {
        updateGreeting();
        showView('progress');
        renderProgressDashboard(MODULES, APP_CONTENT);
        updateURL('/progress', 'Lernfortschritt');
      }

      // Tools navigation
      else if (
        target.id &&
        (target.id === 'nav-tools' || target.id === 'nav-tools-active')
      ) {
        updateGreeting();
        showView('tools');
        updateURL('/tools', 'Tools');
      }

      // Theme toggle
      else if (target.id && target.id.startsWith('theme-toggle')) {
        toggleTheme();
      }
    });
  }

  function setupLectureListeners() {
    buttons.lectureOverview.addEventListener('click', () => {
      showLectureOverview();
    });

    buttons.backToLecture.addEventListener('click', () => {
      showView('lecture');
      updateURL(
        `/module/${currentModuleId}/lecture/${currentLectureId}/item/${lectureState.currentIndex}`,
        document.title.split(' - ')[0]
      );
    });

    buttons.nextItem.addEventListener('click', () => {
      if (lectureState.currentIndex < lectureState.currentItems.length - 1) {
        lectureState.currentIndex++;
        renderCurrentLectureItem();
      }
    });

    buttons.prevItem.addEventListener('click', () => {
      if (lectureState.currentIndex > 0) {
        lectureState.currentIndex--;
        renderCurrentLectureItem();
      }
    });

    inputs.lectureJumpTo.addEventListener('change', (e) => {
      const newIndex = parseInt(e.target.value, 10);
      if (newIndex >= 0 && newIndex < lectureState.currentItems.length) {
        lectureState.currentIndex = newIndex;
        renderCurrentLectureItem();
      }
    });
  }

  function setupQuizListeners() {
    buttons.startQuiz.addEventListener('click', startQuiz);

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
  }

  function setupThemeListener() {
    if (buttons.themeToggle) {
      // Debounce theme toggle to prevent rapid clicking issues
      const debouncedToggle = window.debounce
        ? window.debounce(toggleTheme, 200)
        : toggleTheme;
      buttons.themeToggle.addEventListener('click', debouncedToggle);
    }
  }

  function addEventListeners() {
    setupWelcomeListeners();
    setupNavigationListeners();
    setupLectureListeners();
    setupQuizListeners();
    setupThemeListener();
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
