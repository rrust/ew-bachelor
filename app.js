// Main JavaScript file for the Nutritional Science Learning App
// App Version - used for debugging PWA cache issues
const APP_VERSION = '1.2.0';
console.log(`[App] Version ${APP_VERSION} loaded`);

// Global state (accessible by all modules)
let APP_CONTENT = {};
let MODULES = [];

document.addEventListener('DOMContentLoaded', async () => {
  // --- State Management ---
  let currentModuleId = null;
  let currentLectureId = null;
  let currentLectureTopic = null;

  // State for the lecture player
  const lectureState = {
    currentItems: [],
    currentIndex: 0
  };

  // --- DOM Element Caching ---
  const views = {
    welcome: document.getElementById('welcome-view'),
    studySelection: document.getElementById('study-selection-view'),
    moduleMap: document.getElementById('module-map-view'),
    achievements: document.getElementById('achievements-view'),
    lecture: document.getElementById('lecture-view'),
    quiz: document.getElementById('quiz-view'),
    quizResults: document.getElementById('quiz-results-view'),
    tools: document.getElementById('tools-view'),
    map: document.getElementById('map-view'),
    progress: document.getElementById('progress-view'),
    alerts: document.getElementById('alerts-view'),
    search: document.getElementById('search-view')
  };

  const buttons = {
    start: document.getElementById('start-button'),
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
    lectureQuizButton: document.getElementById('lecture-quiz-button'),
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
  // Note: parseURL and updateURL are now in js/router.js
  // We use the global window.parseURL and window.updateURL from there
  
  function updateURL(path, title) {
    // Delegate to router module
    if (window.Router && window.Router.updateURL) {
      window.Router.updateURL(path, title);
    }
  }

  function parseURL() {
    // Delegate to router module
    if (window.Router && window.Router.parseURL) {
      return window.Router.parseURL();
    }
    // Fallback for when router isn't loaded yet
    const hash = window.location.hash.slice(1); // Remove #
    if (!hash || hash === '/') return null;

    const parts = hash.split('/').filter((p) => p);
    const route = { view: parts[0] };

    // Check for study-select route
    if (parts[0] === 'study-select') {
      route.view = 'studySelection';
      return route;
    }

    // Check if first part is a known study ID
    const studies = getStudies();
    const firstPartIsStudy = studies.some((s) => s.id === parts[0]);

    let offset = 0;
    if (firstPartIsStudy) {
      route.studyId = parts[0];
      offset = 1;
      // Adjust view to be the second part
      route.view = parts[offset] || null;
    }

    // Parse route patterns (with offset for study prefix)
    if (parts[offset] === 'module' && parts[offset + 1]) {
      route.view = 'module';
      route.moduleId = parts[offset + 1];
      if (parts[offset + 2] === 'lecture' && parts[offset + 3]) {
        route.lectureId = parts[offset + 3];
        if (parts[offset + 4] === 'overview') {
          route.overview = true;
        } else if (
          parts[offset + 4] === 'item' &&
          parts[offset + 5] !== undefined
        ) {
          route.itemIndex = parseInt(parts[offset + 5], 10);
        } else if (parts[offset + 4] === 'quiz') {
          route.quiz = true;
          if (parts[offset + 5] !== undefined) {
            route.questionIndex = parseInt(parts[offset + 5], 10);
          }
        }
      }
    } else if (parts[offset] === 'tools') {
      route.view = 'tools';
    } else if (parts[offset] === 'map') {
      route.view = 'map';
    } else if (parts[offset] === 'progress') {
      route.view = 'progress';
    } else if (parts[offset] === 'alerts') {
      route.view = 'alerts';
    } else if (parts[offset] === 'search') {
      route.view = 'search';
      if (parts[offset + 1]) {
        route.query = decodeURIComponent(parts[offset + 1]);
      }
    } else if (parts[offset] === 'achievements') {
      route.view = 'achievements';
      if (parts[offset + 1]) {
        route.achievementId = parts[offset + 1];
      }
    }

    return route;
  }

  function navigateFromURL() {
    const route = parseURL();
    console.log('navigateFromURL - parsed route:', route);
    if (!route) return false;

    // Handle study selection route
    if (route.view === 'studySelection') {
      const settings = getAppSettings();
      showStudySelectionView(settings.userName);
      return true;
    }

    // If route contains a study ID, switch to that study if needed
    if (route.studyId) {
      const settings = getAppSettings();
      if (settings.activeStudyId !== route.studyId) {
        // Need to switch study - this requires async loading
        // For now, just switch and reload
        switchToStudy(route.studyId);
        // Content will be loaded on next page load or we could do it async
      }
    }

    if (route.view === 'module' && route.moduleId) {
      if (route.lectureId) {
        if (route.overview) {
          // Show overview for this lecture
          currentModuleId = route.moduleId;
          currentLectureId = route.lectureId;
          const lecture =
            APP_CONTENT[route.moduleId]?.lectures[route.lectureId];
          if (lecture && lecture.items && lecture.items.length > 0) {
            lectureState.currentItems = lecture.items;
            lectureState.currentIndex = 0;
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
          // Pass itemIndex to startLecture so it starts at the correct position
          startLecture(route.moduleId, route.lectureId, route.itemIndex);
          return true;
        }
      } else {
        displayLecturesForModule(route.moduleId);
        return true;
      }
    } else if (route.view === 'tools') {
      updateGreeting();
      showView('tools');
      // Update PWA install button state
      if (window.PWAInstall && window.PWAInstall.updateInstallButton) {
        window.PWAInstall.updateInstallButton();
      }
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
    } else if (route.view === 'alerts') {
      updateGreeting();
      showView('alerts');
      if (window.renderAlertsView) {
        window.renderAlertsView();
      }
      return true;
    } else if (route.view === 'search') {
      updateGreeting();
      showView('search');
      if (window.initSearchPage) {
        window.initSearchPage(route.query || '');
      }
      return true;
    } else if (route.view === 'achievements') {
      updateGreeting();
      showView('achievements');
      renderAchievementsGallery('all');
      // If specific achievement is requested, open its modal
      if (route.achievementId && APP_CONTENT.achievements) {
        const achievement = APP_CONTENT.achievements[route.achievementId];
        if (achievement) {
          const status = getAchievementStatus(route.achievementId);
          const progress = getAchievementProgress(route.achievementId);
          if (status === 'unlocked' || status === 'locked-soon') {
            showAchievementModal({
              ...achievement,
              currentStatus: status,
              progress
            });
          }
        }
      }
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

    // Special handling for moduleMap - need to reload cards
    if (viewId === 'moduleMap') {
      loadModuleCards();
    }

    // Special handling for map - need to render the diagram
    if (viewId === 'map') {
      renderModuleMap(MODULES, APP_CONTENT);
      updateURL('/map', 'Studienstruktur Map');
    }

    // Special handling for progress - need to render dashboard
    if (viewId === 'progress') {
      renderProgressDashboard(MODULES, APP_CONTENT);
      updateURL('/progress', 'Lernfortschritt');
    }

    // Special handling for achievements - need to render gallery
    if (viewId === 'achievements') {
      renderAchievementsGallery('all');
      updateURL('/achievements', 'Achievements');
    }

    // Special handling for tools
    if (viewId === 'tools') {
      if (window.PWAInstall && window.PWAInstall.updateInstallButton) {
        window.PWAInstall.updateInstallButton();
      }
      updateURL('/tools', 'Tools');
    }
  }

  // Expose showView globally for menu navigation
  window.showView = showView;

  // --- Helper Functions ---
  function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }

  /**
   * Re-injects all headers (used after study switch to update title)
   */
  function reinjectHeaders() {
    injectHeader('module-map-view', 'moduleMap');
    injectHeader('achievements-view', 'achievements');
    injectHeader('tools-view', 'tools');
    injectHeader('map-view', 'map');
    injectHeader('progress-view', 'progress');
    injectHeader('alerts-view', 'alerts');
    injectHeader('search-view', 'search');
  }

  /**
   * Shows the study selection view
   * @param {string} userName - The user's name for greeting
   */
  function showStudySelectionView(userName) {
    const greetingEl = document.getElementById('study-selection-greeting');
    if (greetingEl && userName) {
      greetingEl.textContent = `Hallo ${userName}! Welchen Studiengang möchtest du lernen?`;
    }

    const studies = getStudies();
    renderStudySelection(studies, async (studyId) => {
      // User selected a study
      switchToStudy(studyId);

      // Load content for the selected study
      await loadStudyContent(studyId);

      // Re-inject headers with new study title
      reinjectHeaders();

      // Create initial progress if needed
      let progress = getUserProgress();
      if (!progress) {
        const settings = getAppSettings();
        progress = getInitialProgress(settings.userName);
        saveUserProgress(progress);
      }

      // Show module map
      loadModuleCards();
      showView('moduleMap');
      updateURL('/', 'Module Overview');

      if (window.updateGreeting) {
        window.updateGreeting(getAppSettings().userName);
      }
    });

    showView('studySelection');
    updateURL('/study-select', 'Studiengang wählen');
  }

  /**
   * Loads content for a specific study
   * @param {string} studyId - The study ID to load
   */
  async function loadStudyContent(studyId) {
    // Load modules metadata from JSON
    MODULES = await loadModules(studyId);
    window.MODULES = MODULES;
    window.APP_MODULES = MODULES;

    // Load content (returns {content, achievements})
    const parsedData = await parseContent(studyId);
    APP_CONTENT = parsedData.content || parsedData;
    APP_CONTENT.achievements = parsedData.achievements || {};
    window.APP_CONTENT = APP_CONTENT;
  }

  // --- App Initialization ---
  async function init() {
    // 1. Load available studies FIRST (needed for header title)
    const studies = await loadStudies();
    setStudies(studies);

    // 2. Check for saved user settings and migrate legacy progress
    const settings = getAppSettings();

    // Migrate legacy progress if needed (sets activeStudyId)
    if (!settings.activeStudyId && studies.length > 0) {
      migrateLegacyProgress(studies[0].id);
    }

    // 3. Inject headers into views (now studies AND activeStudyId are available)
    injectHeader('module-map-view', 'moduleMap');
    injectHeader('achievements-view', 'achievements');
    injectHeader('tools-view', 'tools');
    injectHeader('map-view', 'map');
    injectHeader('progress-view', 'progress');
    injectHeader('alerts-view', 'alerts');
    injectHeader('search-view', 'search');

    // 4. Determine if user needs to enter name or select study
    const currentSettings = getAppSettings();

    if (!currentSettings.userName) {
      // New user - show welcome screen
      showView('welcome');
      updateURL('/', 'Welcome');
      hideLoadingScreen();
      refreshHeaderButtons();
      addEventListeners();
      return;
    }

    if (!currentSettings.activeStudyId) {
      // User exists but no study selected - show study selection
      showStudySelectionView(currentSettings.userName);
      hideLoadingScreen();
      refreshHeaderButtons();
      addEventListeners();
      return;
    }

    // 4. Load content for active study
    setCurrentStudy(currentSettings.activeStudyId);
    await loadStudyContent(currentSettings.activeStudyId);

    const progress = getUserProgress();
    if (progress) {
      // Try to navigate from URL first
      if (!navigateFromURL()) {
        loadModuleCards();
        showView('moduleMap');
        updateURL('/', 'Module Overview');
      }
      // Update greeting after view is shown to ensure elements exist
      if (window.updateGreeting) {
        window.updateGreeting(currentSettings.userName);
      }
    } else {
      // Create initial progress for this study
      const newProgress = getInitialProgress(currentSettings.userName);
      saveUserProgress(newProgress);
      loadModuleCards();
      showView('moduleMap');
      updateURL('/', 'Module Overview');
      if (window.updateGreeting) {
        window.updateGreeting(currentSettings.userName);
      }
    }

    hideLoadingScreen();

    // Refresh button references after headers are injected
    refreshHeaderButtons();
    addEventListeners();

    // Initialize global search
    if (window.initGlobalSearch) {
      window.initGlobalSearch();
    }

    // Initialize alerts badge
    if (window.updateAlertBadge) {
      window.updateAlertBadge();
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
      if (!navigateFromURL()) {
        loadModuleCards();
        showView('moduleMap');
      }
    });
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
      },
      loadModuleCards
    );
  }

  // --- Lecture Player Logic (using LectureModule) ---
  function startLecture(moduleId, lectureId, startIndex = 0) {
    currentModuleId = moduleId;
    currentLectureId = lectureId;

    // Get lecture topic for snapshot descriptions
    const moduleContent = APP_CONTENT[moduleId];
    const lecture = moduleContent?.lectures?.[lectureId];
    currentLectureTopic = lecture?.topic || lectureId;

    window.LectureModule.startLecture(
      moduleId,
      lectureId,
      APP_CONTENT,
      MODULES,
      lectureState,
      {
        lectureJumpTo: inputs.lectureJumpTo,
        lectureListContainer: document.getElementById('lecture-list-container'),
        lecturePlayer: document.getElementById('lecture-player')
      },
      updateURL,
      renderCurrentLectureItem,
      showView,
      startIndex
    );
  }

  function renderCurrentLectureItem() {
    window.LectureModule.renderCurrentLectureItem(
      lectureState,
      updateLectureNav,
      renderSelfAssessment,
      renderYouTubeVideo,
      renderImage,
      renderMermaidDiagram
    );
  }

  function renderYouTubeVideo(item, container) {
    window.LectureModule.renderYouTubeVideo(item, container);
  }

  function renderImage(item, container) {
    window.LectureModule.renderImage(item, container);
  }

  async function renderMermaidDiagram(item, container) {
    await window.LectureModule.renderMermaidDiagram(item, container);
  }

  function renderSelfAssessment(item, container) {
    window.LectureModule.renderSelfAssessment(item, container);
  }

  function updateLectureNav() {
    window.LectureModule.updateLectureNav(
      lectureState,
      currentModuleId,
      currentLectureId,
      APP_CONTENT,
      displays,
      inputs,
      buttons,
      updateURL
    );
  }

  // --- Lecture Overview ---
  function showLectureOverview() {
    window.LectureModule.showLectureOverview(
      currentModuleId,
      currentLectureId,
      APP_CONTENT,
      MODULES,
      lectureState,
      {
        overviewContent: document.getElementById('lecture-overview-content'),
        overviewDescription: document.getElementById(
          'lecture-overview-description'
        ),
        lecturePlayer: document.getElementById('lecture-player'),
        lectureOverview: document.getElementById('lecture-overview'),
        lectureListContainer: document.getElementById('lecture-list-container')
      },
      updateURL,
      (index) => {
        lectureState.currentIndex = index;
        renderCurrentLectureItem();
        document.getElementById('lecture-player').style.display = 'flex';
        document.getElementById('lecture-overview').style.display = 'none';
        updateURL(
          `/module/${currentModuleId}/lecture/${currentLectureId}/item/${lectureState.currentIndex}`,
          document.title.split(' - ')[0]
        );
      }
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
        ),
      currentLectureTopic
    );
  }

  // --- Event Listeners ---
  function setupWelcomeListeners() {
    buttons.start.addEventListener('click', () => {
      const userName = inputs.name.value.trim();
      if (userName) {
        // Save user name to global settings
        const settings = getAppSettings();
        settings.userName = userName;
        saveAppSettings(settings);

        // Check if there's already an active study
        if (settings.activeStudyId) {
          // User has a study, initialize progress and go to modules
          let progress = getUserProgress();
          if (!progress) {
            progress = getInitialProgress(userName);
            saveUserProgress(progress);
          }
          updateGreeting(userName);
          loadModuleCards();
          showView('moduleMap');
          updateURL('/', 'Module Overview');
        } else {
          // Show study selection
          showStudySelectionView(userName);
        }
      } else {
        alert('Bitte gib deinen Namen ein.');
      }
    });
  }

  function setupNavigationListeners() {
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
        if (window.updateGreeting) window.updateGreeting();
        loadModuleCards();
        showView('moduleMap');
        updateURL('/', 'Module Overview');
      }

      // Map navigation
      else if (target.id && target.id.startsWith('nav-map')) {
        if (window.updateGreeting) window.updateGreeting();
        showView('map');
        renderModuleMap(MODULES, APP_CONTENT);
        updateURL('/map', 'Studienstruktur Map');
      }

      // Achievements navigation
      else if (target.id && target.id.startsWith('nav-achievements')) {
        if (window.updateGreeting) window.updateGreeting();
        showView('achievements');
        renderAchievementsGallery('all');
        updateURL('/achievements', 'Achievements');
      }

      // Progress navigation
      else if (target.id && target.id.startsWith('nav-progress')) {
        if (window.updateGreeting) window.updateGreeting();
        showView('progress');
        renderProgressDashboard(MODULES, APP_CONTENT);
        updateURL('/progress', 'Lernfortschritt');
      }

      // Tools navigation
      else if (
        target.id &&
        (target.id === 'nav-tools' || target.id === 'nav-tools-active')
      ) {
        if (window.updateGreeting) window.updateGreeting();
        showView('tools');
        // Update PWA install button state
        if (window.PWAInstall && window.PWAInstall.updateInstallButton) {
          window.PWAInstall.updateInstallButton();
        }
        updateURL('/tools', 'Tools');
      }

      // Theme toggle
      else if (target.id && target.id.startsWith('theme-toggle')) {
        if (window.toggleTheme) {
          window.toggleTheme();
        }
      }
    });
  }

  function setupLectureListeners() {
    buttons.lectureOverview.addEventListener('click', () => {
      showLectureOverview();
    });

    if (buttons.lectureQuizButton) {
      buttons.lectureQuizButton.addEventListener('click', () => {
        startQuiz(currentModuleId, currentLectureId);
      });
    }

    buttons.backToLecture.addEventListener('click', () => {
      showView('lecture');
      updateURL(
        `/module/${currentModuleId}/lecture/${currentLectureId}/item/${lectureState.currentIndex}`,
        document.title.split(' - ')[0]
      );
    });

    buttons.nextItem.addEventListener('click', () => {
      if (lectureState.currentIndex < lectureState.currentItems.length - 1) {
        const lectureItemDisplay = document.getElementById(
          'lecture-item-display'
        );
        window.SwipeGestures.animateSlide(lectureItemDisplay, 'left', () => {
          lectureState.currentIndex++;
          renderCurrentLectureItem();
        });
      }
    });

    buttons.prevItem.addEventListener('click', () => {
      if (lectureState.currentIndex > 0) {
        const lectureItemDisplay = document.getElementById(
          'lecture-item-display'
        );
        window.SwipeGestures.animateSlide(lectureItemDisplay, 'right', () => {
          lectureState.currentIndex--;
          renderCurrentLectureItem();
        });
      }
    });

    if (inputs.lectureJumpTo) {
      inputs.lectureJumpTo.addEventListener('change', (e) => {
        const newIndex = parseInt(e.target.value, 10);
        if (newIndex >= 0 && newIndex < lectureState.currentItems.length) {
          lectureState.currentIndex = newIndex;
          renderCurrentLectureItem();
        }
      });
    }

    // Swipe gestures for mobile navigation
    const lecturePlayer = document.getElementById('lecture-player');
    const lectureItemDisplay = document.getElementById('lecture-item-display');
    if (lecturePlayer && window.SwipeGestures) {
      window.SwipeGestures.init(
        lecturePlayer,
        {
          onSwipeLeft: () => {
            // Swipe left = next item
            if (
              lectureState.currentIndex <
              lectureState.currentItems.length - 1
            ) {
              lectureState.currentIndex++;
              renderCurrentLectureItem();
            }
          },
          onSwipeRight: () => {
            // Swipe right = previous item
            if (lectureState.currentIndex > 0) {
              lectureState.currentIndex--;
              renderCurrentLectureItem();
            }
          }
        },
        { animateElement: lectureItemDisplay }
      );
    }
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

  function addEventListeners() {
    setupWelcomeListeners();
    setupNavigationListeners();
    setupLectureListeners();
    setupQuizListeners();
    setupAchievementsListeners();
    setupToolsListeners();

    // Setup validator listeners
    if (window.setupValidatorListeners) {
      window.setupValidatorListeners();
    }

    // Setup dev mode listeners
    if (window.setupDevModeListeners) {
      window.setupDevModeListeners();
    }

    // Setup snapshots listeners
    if (window.setupSnapshotsListeners) {
      window.setupSnapshotsListeners();
    }
  }

  function setupToolsListeners() {
    const switchStudyBtn = document.getElementById('switch-study-button');
    if (switchStudyBtn) {
      switchStudyBtn.addEventListener('click', () => {
        const settings = getAppSettings();
        showStudySelectionView(settings.userName);
      });
    }
  }

  // --- Initial Load ---
  init();

  // Initialize theme icons after content loads
  if (window.updateThemeIcons) {
    window.updateThemeIcons();
  }
});
