// Main JavaScript file for the Nutritional Science Learning App
// App Version - used for debugging PWA cache issues
const APP_VERSION = '1.2.0';

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
    training: document.getElementById('training-view'),
    search: document.getElementById('search-view')
  };

  const buttons = {
    start: document.getElementById('start-button'),
    startQuiz: document.getElementById('start-quiz-button'),
    prevItem: document.getElementById('prev-item-button'),
    nextItem: document.getElementById('next-item-button'),
    backToLecture: document.getElementById('back-to-lecture-button'),
    backToLectureFromResults: document.getElementById(
      'back-to-lecture-from-results'
    ),
    retakeQuiz: document.getElementById('retake-quiz-button'),
    resultsToMap: document.getElementById('results-to-map-button'),
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
  // Main routing logic is in js/router.js
  // These are thin wrappers for backward compatibility within this file

  function updateURL(path, title) {
    if (window.Router) {
      window.Router.updateURL(path, title);
    }
  }

  function parseURL() {
    return window.Router ? window.Router.parseURL() : null;
  }

  function navigateFromURL() {
    const route = parseURL();
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
          // Show overview for this lecture (async for lazy loading)
          currentModuleId = route.moduleId;
          currentLectureId = route.lectureId;

          // Load lecture first if needed (lazy loading)
          (async () => {
            const settings = getAppSettings();
            if (window.BundleLoader) {
              const hideLoading = window.showLoadingOverlay
                ? window.showLoadingOverlay('Übersicht wird geladen...')
                : null;

              await window.BundleLoader.ensureLectureLoaded(
                APP_CONTENT,
                settings.activeStudyId,
                route.moduleId,
                route.lectureId
              );

              if (hideLoading) hideLoading();
            }

            const lecture =
              APP_CONTENT[route.moduleId]?.lectures[route.lectureId];
            if (lecture && lecture.items && lecture.items.length > 0) {
              lectureState.currentItems = lecture.items;
              lectureState.currentIndex = 0;
              showView('lecture'); // Show lecture view first
              showLectureOverview(); // Then show overview within lecture view
            } else {
              alert('Diese Vorlesung hat keinen Inhalt.');
            }
          })();
          return true;
        } else if (route.quiz) {
          currentModuleId = route.moduleId;
          currentLectureId = route.lectureId;

          // Load lecture first if needed (lazy loading)
          (async () => {
            const settings = getAppSettings();
            if (window.BundleLoader) {
              const hideLoading = window.showLoadingOverlay
                ? window.showLoadingOverlay('Quiz wird geladen...')
                : null;

              await window.BundleLoader.ensureLectureLoaded(
                APP_CONTENT,
                settings.activeStudyId,
                route.moduleId,
                route.lectureId
              );

              if (hideLoading) hideLoading();
            }

            startQuiz();
          })();
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
    } else if (route.view === 'training') {
      updateGreeting();
      showView('training');
      // Set training context from URL parameters
      if (window.setTrainingContext) {
        window.setTrainingContext(
          route.trainingModuleId || null,
          route.trainingLectureId || null
        );
      }
      if (window.initTrainingView) {
        window.initTrainingView();
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

    // Special handling for training - initialize training view
    // Note: Don't call initTrainingView here as it's called from navigateFromURL with context
    // Also don't update URL here as it would lose query parameters
    if (viewId === 'training') {
      // Only init if not already initialized by navigateFromURL
      // This handles direct showView('training') calls without URL navigation
      if (!window.location.hash.includes('/training')) {
        if (window.initTrainingView) {
          window.initTrainingView();
        }
        updateURL('/training', 'Training');
      }
    }
  }

  // Expose showView globally for menu navigation
  window.showView = showView;

  // --- Helper Functions ---

  /**
   * Update the loading screen status text and progress bar
   * @param {string} status - Status text to show
   * @param {number} progress - Progress percentage (0-100)
   */
  function updateLoadingStatus(status, progress = null) {
    const statusEl = document.getElementById('loading-status');
    const progressEl = document.getElementById('loading-progress');
    if (statusEl) {
      statusEl.textContent = status;
    }
    if (progressEl && progress !== null) {
      progressEl.style.width = `${progress}%`;
    }
  }

  // Expose for use by parser
  window.updateLoadingStatus = updateLoadingStatus;

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
    injectHeader('training-view', 'training');
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
   * Loads content for a specific study (LAZY mode - only metadata)
   * Lectures are loaded on-demand via BundleLoader
   * @param {string} studyId - The study ID to load
   */
  async function loadStudyContentLazy(studyId) {
    // Load modules metadata from JSON
    MODULES = await loadModules(studyId);
    window.MODULES = MODULES;
    window.APP_MODULES = MODULES;

    // Initialize empty APP_CONTENT structure with module shells
    APP_CONTENT = {};
    for (const module of MODULES) {
      APP_CONTENT[module.id] = {
        lectures: {}
      };
    }

    // Load achievements from pre-generated JSON
    try {
      const basePath = window.getBasePath ? window.getBasePath() : '/';
      const achievementsPath = `${basePath}content/${studyId}/achievements.json`;
      const response = await fetch(achievementsPath);
      if (response.ok) {
        APP_CONTENT.achievements = await response.json();
      } else {
        console.warn('[App] No achievements.json found, achievements disabled');
        APP_CONTENT.achievements = {};
      }
    } catch (e) {
      console.warn('[App] Failed to load achievements:', e);
      APP_CONTENT.achievements = {};
    }

    window.APP_CONTENT = APP_CONTENT;
  }

  /**
   * Loads content for a specific study (FULL mode - all content)
   * Used for search functionality and backward compatibility
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
    updateLoadingStatus('Studiengänge laden...', 5);

    // 1. Load available studies FIRST (needed for header title)
    const studies = await loadStudies();
    setStudies(studies);

    updateLoadingStatus('Einstellungen prüfen...', 15);

    // 2. Check for saved user settings and migrate legacy progress
    const settings = getAppSettings();

    // Migrate legacy progress if needed (sets activeStudyId)
    if (!settings.activeStudyId && studies.length > 0) {
      migrateLegacyProgress(studies[0].id);
    }

    updateLoadingStatus('Benutzeroberfläche vorbereiten...', 25);

    // 3. Inject headers into views (now studies AND activeStudyId are available)
    injectHeader('module-map-view', 'moduleMap');
    injectHeader('achievements-view', 'achievements');
    injectHeader('tools-view', 'tools');
    injectHeader('map-view', 'map');
    injectHeader('progress-view', 'progress');
    injectHeader('alerts-view', 'alerts');
    injectHeader('training-view', 'training');
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

    updateLoadingStatus('Inhalte laden...', 35);

    // 4. Load content for active study (lazy mode - only metadata)
    setCurrentStudy(currentSettings.activeStudyId);
    await loadStudyContentLazy(currentSettings.activeStudyId);

    // 5. Preload content manifest for lazy loading
    if (window.DownloadManager) {
      await window.DownloadManager.loadManifest(currentSettings.activeStudyId);
    }

    updateLoadingStatus('Fast fertig...', 95);

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

    // Initialize streak system
    if (window.initStreak) {
      window.initStreak();
    }

    // Initialize alerts badge
    if (window.updateAlertBadge) {
      window.updateAlertBadge();
    }

    // Initialize notifications (app badge and optional notification)
    if (window.Notifications && window.Notifications.init) {
      window.Notifications.init();
    }

    // Initialize offline indicator
    if (window.OfflineIndicator && window.OfflineIndicator.init) {
      window.OfflineIndicator.init();
    }

    // Initialize app update manager
    if (window.AppUpdate && window.AppUpdate.init) {
      window.AppUpdate.init();
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
      if (!navigateFromURL()) {
        loadModuleCards();
        showView('moduleMap');
      }
    });

    // Handle hash changes (for <a href="#/..."> links)
    window.addEventListener('hashchange', (event) => {
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
      async (modId, lecId) => {
        currentModuleId = modId;
        currentLectureId = lecId;

        // Ensure lecture is loaded (lazy loading support)
        const settings = getAppSettings();
        if (window.BundleLoader) {
          const hideLoading = window.showLoadingOverlay
            ? window.showLoadingOverlay('Quiz wird geladen...')
            : null;

          await window.BundleLoader.ensureLectureLoaded(
            APP_CONTENT,
            settings.activeStudyId,
            modId,
            lecId
          );

          if (hideLoading) hideLoading();
        }

        startQuiz();
      },
      async (modId, lecId) => {
        currentModuleId = modId;
        currentLectureId = lecId;

        // Ensure lecture is loaded (lazy loading support)
        const settings = getAppSettings();
        if (window.BundleLoader) {
          const hideLoading = window.showLoadingOverlay
            ? window.showLoadingOverlay('Übersicht wird geladen...')
            : null;

          await window.BundleLoader.ensureLectureLoaded(
            APP_CONTENT,
            settings.activeStudyId,
            modId,
            lecId
          );

          if (hideLoading) hideLoading();
        }

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

  // Expose displayLecturesForModule globally for breadcrumb navigation
  window.displayLecturesForModule = displayLecturesForModule;

  // --- Lecture Player Logic (using LectureModule) ---
  async function startLecture(moduleId, lectureId, startIndex = 0) {
    currentModuleId = moduleId;
    currentLectureId = lectureId;

    // Ensure lecture is loaded (lazy loading support)
    const settings = getAppSettings();
    const studyId = settings.activeStudyId;

    if (window.BundleLoader) {
      // Check if lecture is already loaded in memory
      const existingLecture = APP_CONTENT[moduleId]?.lectures?.[lectureId];
      const isAlreadyLoaded = existingLecture?.items?.length > 0;

      // Only show loading overlay if we need to load from disk/network
      let hideLoading = null;
      if (!isAlreadyLoaded) {
        hideLoading = window.showLoadingOverlay
          ? window.showLoadingOverlay('Vorlesung wird geladen...')
          : null;
      }

      const lecture = await window.BundleLoader.ensureLectureLoaded(
        APP_CONTENT,
        studyId,
        moduleId,
        lectureId
      );

      // Hide loading overlay
      if (hideLoading) hideLoading();

      if (!lecture) {
        console.error(`[App] Failed to load lecture: ${moduleId}/${lectureId}`);

        // Show appropriate error message based on online/offline status
        if (!navigator.onLine) {
          alert(
            'Du bist offline und diese Vorlesung wurde noch nicht heruntergeladen.\n\n' +
              'Gehe online und öffne die Vorlesung einmal, dann ist sie auch offline verfügbar.'
          );
        } else {
          alert(
            'Vorlesung konnte nicht geladen werden. Bitte versuche es erneut.'
          );
        }
        return;
      }
    }

    // Get lecture topic for snapshot descriptions
    const moduleContent = APP_CONTENT[moduleId];
    const lecture = moduleContent?.lectures?.[lectureId];
    currentLectureTopic = lecture?.topic || lectureId;

    // Inject dynamic breadcrumb header for lecture player
    const moduleData = MODULES.find((m) => m.id === moduleId);
    injectLecturePlayerHeader({
      moduleId: moduleId,
      lectureId: lectureId,
      moduleTitle: moduleData?.title || moduleId,
      moduleIcon: moduleData?.icon || 'modules',
      lectureTopic: lecture?.topic || lectureId,
      hasQuiz: lecture?.quiz && lecture.quiz.length > 0
    });

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

  // Helper function to inject lecture player header
  function injectLecturePlayerHeader(options) {
    const container = document.getElementById(
      'lecture-player-header-container'
    );
    if (!container) return;

    container.innerHTML = '';
    if (window.createAppHeader) {
      const header = window.createAppHeader('lecturePlayer', options);
      container.appendChild(header);

      // Update theme icons
      if (window.updateMenuThemeIcons) {
        window.updateMenuThemeIcons(header);
      }

      // Update dev mode badge
      if (window.updateDevModeUI) {
        window.updateDevModeUI();
      }

      // Update alert badge
      if (window.updateAlertBadge) {
        window.updateAlertBadge();
      }

      // Show/hide quiz button based on availability
      const quizBtn = header.querySelector('#lecture-quiz-btn-lecturePlayer');
      if (quizBtn) {
        quizBtn.style.display = options.hasQuiz ? 'block' : 'none';
      }
    }
  }

  // Helper function to inject lecture overview header
  function injectLectureOverviewHeader(options) {
    const container = document.getElementById(
      'lecture-overview-header-container'
    );
    if (!container) return;

    container.innerHTML = '';
    if (window.createAppHeader) {
      const header = window.createAppHeader('lectureOverview', options);
      container.appendChild(header);

      // Update theme icons
      if (window.updateMenuThemeIcons) {
        window.updateMenuThemeIcons(header);
      }

      // Update dev mode badge
      if (window.updateDevModeUI) {
        window.updateDevModeUI();
      }

      // Update alert badge
      if (window.updateAlertBadge) {
        window.updateAlertBadge();
      }

      // Setup back-to-player button
      const backBtn = header.querySelector(
        '#back-to-player-btn-lectureOverview'
      );
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          document.getElementById('lecture-player').style.display = 'flex';
          document.getElementById('lecture-overview').style.display = 'none';
          updateURL(
            `/module/${currentModuleId}/lecture/${currentLectureId}/item/${lectureState.currentIndex}`,
            document.title.split(' - ')[0]
          );
        });
      }
    }
  }

  function renderCurrentLectureItem() {
    const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
    const sources = lecture?.sources || [];
    
    // Build intro audio URL if available
    let introAudioUrl = null;
    if (lecture?.introAudio && lectureState.currentIndex === 0) {
      const studyId = settings.activeStudyId;
      introAudioUrl = `content/${studyId}/${currentModuleId}/${currentLectureId}/${lecture.introAudio}`;
    }
    
    window.LectureModule.renderCurrentLectureItem(
      lectureState,
      updateLectureNav,
      renderSelfAssessmentMC,
      renderYouTubeVideo,
      renderImage,
      renderMermaidDiagram,
      sources,
      introAudioUrl
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

  function renderSelfAssessmentMC(item, container) {
    window.LectureModule.renderSelfAssessmentMC(item, container);
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
    // Inject dynamic header for lecture overview
    const moduleData = MODULES.find((m) => m.id === currentModuleId);
    const lecture = APP_CONTENT[currentModuleId]?.lectures?.[currentLectureId];
    injectLectureOverviewHeader({
      moduleId: currentModuleId,
      lectureId: currentLectureId,
      moduleTitle: moduleData?.title || currentModuleId,
      lectureTopic: lecture?.topic || currentLectureId
    });

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
    // backToPlayer is now handled dynamically in injectLectureOverviewHeader

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

      // Lecture player: Overview button (breadcrumb header)
      else if (target.id && target.id.startsWith('lecture-overview-btn')) {
        showLectureOverview();
      }

      // Lecture player: Quiz button (breadcrumb header)
      else if (target.id && target.id.startsWith('lecture-quiz-btn')) {
        startQuiz(currentModuleId, currentLectureId);
      }
    });
  }

  function setupLectureListeners() {
    // Overview and Quiz buttons are now handled via event delegation in setupNavigationListeners

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
