// UI Component Functions
// Reusable functions for generating common UI elements following DRY principles

/**
 * Creates the application header with navigation and theme toggle
 * @param {string} view - Current view name ('moduleMap', 'tools', 'map', 'progress', 'lecture')
 * @param {Object} options - Optional parameters like module title for lecture view
 * @returns {HTMLElement} Header element
 */
function createAppHeader(view = 'moduleMap', options = {}) {
  const header = document.createElement('header');
  header.className =
    'bg-white dark:bg-gray-800 shadow-md mb-8 sticky top-0 z-40';

  // Get current study info
  const studyInfo =
    typeof getCurrentStudyInfo === 'function' ? getCurrentStudyInfo() : null;
  const studyTitle = studyInfo ? studyInfo.shortTitle : 'Study';
  const studyIcon =
    studyInfo && studyInfo.icon
      ? Icons.get(
          studyInfo.icon,
          'w-5 h-5 md:w-6 md:h-6',
          'text-gray-600 dark:text-gray-400'
        )
      : '';

  const idSuffix = view === 'moduleMap' ? '' : `-${view}`;

  // Special header for lecture list view with back button
  if (view === 'lecture') {
    const moduleIcon = options.moduleIcon
      ? Icons.get(options.moduleIcon, 'w-5 h-5', '')
      : Icons.get('modules', 'w-5 h-5', '');
    const idSuffix = '-lecture';
    header.innerHTML = `
      <div class="container mx-auto px-4 md:px-8 py-3 md:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Burger Menu (links) -->
            <button
              id="menu-toggle-lecture"
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-gray-600 dark:text-gray-400"
              title="Menü"
              onclick="openOverlayMenu('${idSuffix}')"
            >
              ${Icons.get('listBullet')}
            </button>
            <button
              id="back-to-modules-button"
              class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold p-2 rounded-md transition duration-300 flex-shrink-0 flex items-center justify-center"
              title="Zurück zu den Modulen"
            >
              ${moduleIcon}
            </button>
            <h2 class="text-lg md:text-xl font-bold truncate" title="${
              options.moduleTitle || ''
            }">${options.moduleTitle || ''}</h2>
          </div>
          <div class="flex items-center gap-2">
            <!-- Dev Mode Badge -->
            <span
              id="header-dev-badge-lecture"
              class="hidden text-xs font-bold px-2 py-0.5 rounded bg-orange-500 text-white"
            >DEV</span>
            <button
              id="nav-search-lecture"
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-gray-600 dark:text-gray-400"
              title="Suche"
              onclick="window.location.hash='#/search'"
            >
              ${Icons.get('search')}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Overlay Menu for Lecture View -->
      <div id="overlay-menu${idSuffix}" class="hidden fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50" onclick="closeOverlayMenu('${idSuffix}')"></div>
        <!-- Menu Panel (links) -->
        <div class="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span class="font-bold text-lg">Menü</span>
            <button onclick="closeOverlayMenu('${idSuffix}')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              ${Icons.get('close', 'w-5 h-5')}
            </button>
          </div>
          <nav class="p-4 space-y-2">
            <!-- Training Button (prominent) -->
            <a
              href="#/training"
              onclick="closeOverlayMenu('${idSuffix}')"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition text-center"
            >
              TRAIN
            </a>
            <hr class="border-gray-200 dark:border-gray-700 my-2">
            <!-- Theme Toggle -->
            <button
              id="theme-toggle-menu${idSuffix}"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
              onclick="if(window.toggleTheme) window.toggleTheme(); updateMenuThemeIcons(this.closest('#overlay-menu${idSuffix}'));"
            >
              <span class="theme-icon-light hidden">${Icons.get(
                'sun',
                'w-5 h-5'
              )}</span>
              <span class="theme-icon-dark">${Icons.get(
                'moon',
                'w-5 h-5'
              )}</span>
              <span class="theme-text">Farbschema</span>
            </button>
            <hr class="border-gray-200 dark:border-gray-700 my-2">
            <!-- Module -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('moduleMap');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('modules', 'w-5 h-5')}
              <span>Module</span>
            </button>
            <!-- Progress -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('progress');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('chart', 'w-5 h-5')}
              <span>Progress</span>
            </button>
            <!-- Achievements -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('achievements');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('achievement', 'w-5 h-5')}
              <span>Achievements</span>
            </button>
            <!-- Map -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('map');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('map', 'w-5 h-5')}
              <span>Modul-Map</span>
            </button>
            <!-- Tools -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('tools');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('cog', 'w-5 h-5')}
              <span>Tools</span>
            </button>
          </nav>
        </div>
      </div>
    `;
    return header;
  }

  // Breadcrumb header for lecture player view
  if (view === 'lecturePlayer') {
    const idSuffix = '-lecturePlayer';
    const moduleIcon = options.moduleIcon
      ? Icons.get(
          options.moduleIcon,
          'w-5 h-5',
          'text-gray-600 dark:text-gray-400'
        )
      : Icons.get('modules', 'w-5 h-5', 'text-gray-600 dark:text-gray-400');

    header.className = 'bg-white dark:bg-gray-800 shadow-sm flex-shrink-0';
    header.innerHTML = `
      <div class="flex items-center">
        <!-- Burger Menu (außerhalb Container, ganz links) -->
        <button
          id="menu-toggle${idSuffix}"
          class="p-3 md:p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-gray-600 dark:text-gray-400 flex-shrink-0 self-stretch flex items-center"
          title="Menü"
          onclick="openOverlayMenu('${idSuffix}')"
        >
          ${Icons.get('listBullet')}
        </button>
        
        <!-- Rest im Container mit max-width -->
        <div class="container mx-auto px-2 md:px-4 py-2 flex items-center justify-between min-w-0 flex-1">
          <div class="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <!-- Modul-Icon → Modulübersicht -->
            <button
              id="breadcrumb-modules${idSuffix}"
              class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 flex-shrink-0"
              title="Zur Modulübersicht"
              onclick="window.showView && window.showView('moduleMap'); window.updateURL && window.updateURL('/', 'Module Overview');"
            >
              ${Icons.get('modules', 'w-5 h-5', 'text-gray-600 dark:text-gray-400')}
            </button>
            <span class="text-gray-300 dark:text-gray-600 flex-shrink-0">/</span>
            <!-- Buch-Icon → Vorlesungsliste -->
            <button
              id="breadcrumb-lectures${idSuffix}"
              class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 flex-shrink-0 flex items-center gap-1"
              title="${options.moduleTitle || 'Modul'} - Zur Vorlesungsliste"
              onclick="if(window.displayLecturesForModule) window.displayLecturesForModule('${options.moduleId || ''}');"
            >
              ${Icons.get('book', 'w-5 h-5', 'text-gray-600 dark:text-gray-400')}
            </button>
            <span class="text-gray-300 dark:text-gray-600 flex-shrink-0">/</span>
            <!-- Lecture Title -->
            <span class="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 truncate" title="${options.lectureTopic || ''}">${options.lectureTopic || ''}</span>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <!-- Dev Mode Badge -->
            <span
              id="header-dev-badge${idSuffix}"
              class="hidden text-xs font-bold px-2 py-0.5 rounded bg-orange-500 text-white"
            >DEV</span>
            <!-- Overview Button (Icon) -->
            <button
              id="lecture-overview-btn${idSuffix}"
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-blue-600 dark:text-blue-400"
              title="Vorlesungs-Übersicht (O)"
            >
              ${Icons.get('listBullet', 'w-5 h-5')}
            </button>
            <!-- Test Button (Icon) -->
            <button
              id="lecture-quiz-btn${idSuffix}"
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-green-600 dark:text-green-400"
              title="Test"
              style="display: none;"
            >
              ${Icons.get('exam', 'w-5 h-5')}
            </button>
            <!-- Search -->
            <button
              id="nav-search${idSuffix}"
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-gray-600 dark:text-gray-400"
              title="Suche"
              onclick="window.location.hash='#/search'"
            >
              ${Icons.get('search')}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Overlay Menu for Lecture Player -->
      <div id="overlay-menu${idSuffix}" class="hidden fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50" onclick="closeOverlayMenu('${idSuffix}')"></div>
        <!-- Menu Panel (links) -->
        <div class="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span class="font-bold text-lg">Menü</span>
            <button onclick="closeOverlayMenu('${idSuffix}')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              ${Icons.get('close', 'w-5 h-5')}
            </button>
          </div>
          <nav class="p-4 space-y-2">
            <!-- Training Buttons (context-specific for lecture player) -->
            <a
              href="#/training?module=${options.moduleId || ''}&lecture=${
      options.lectureId || ''
    }"
              onclick="closeOverlayMenu('${idSuffix}')"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition text-center"
              title="Training für diese Vorlesung"
            >
              TRAIN (Vorlesung)
            </a>
            <a
              href="#/training?module=${options.moduleId || ''}"
              onclick="closeOverlayMenu('${idSuffix}')"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-400 hover:bg-blue-500 text-white font-medium transition text-center text-sm"
              title="Training für dieses Modul"
            >
              TRAIN (Modul)
            </a>
            <a
              href="#/training"
              onclick="closeOverlayMenu('${idSuffix}')"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition text-center text-sm"
              title="Training für alle Tests"
            >
              TRAIN (Alle)
            </a>
            <hr class="border-gray-200 dark:border-gray-700 my-2">
            <!-- Theme Toggle -->
            <button
              id="theme-toggle-menu${idSuffix}"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
              onclick="if(window.toggleTheme) window.toggleTheme(); updateMenuThemeIcons(this.closest('#overlay-menu${idSuffix}'));"
            >
              <span class="theme-icon-light hidden">${Icons.get(
                'sun',
                'w-5 h-5'
              )}</span>
              <span class="theme-icon-dark">${Icons.get(
                'moon',
                'w-5 h-5'
              )}</span>
              <span class="theme-text">Farbschema</span>
            </button>
            <hr class="border-gray-200 dark:border-gray-700 my-2">
            <!-- Module -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('moduleMap');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('modules', 'w-5 h-5')}
              <span>Module</span>
            </button>
            <!-- Progress -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('progress');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('chart', 'w-5 h-5')}
              <span>Progress</span>
            </button>
            <!-- Achievements -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('achievements');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('achievement', 'w-5 h-5')}
              <span>Achievements</span>
            </button>
            <!-- Map -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('map');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('map', 'w-5 h-5')}
              <span>Modul-Map</span>
            </button>
            <!-- Tools -->
            <button
              onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('tools');"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            >
              ${Icons.get('cog', 'w-5 h-5')}
              <span>Tools</span>
            </button>
          </nav>
        </div>
      </div>
    `;
    return header;
  }

  // Only show greeting for non-search views
  const showGreeting = view !== 'search';

  // Get streak info for display
  const streakInfo = window.getStreakDisplayInfo
    ? window.getStreakDisplayInfo()
    : null;
  const showStreak =
    streakInfo && window.hasCompletedTests && window.hasCompletedTests();

  header.innerHTML = `
    <div class="container mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <!-- Burger Menu (links) -->
        <button
          id="menu-toggle${idSuffix}"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-gray-600 dark:text-gray-400"
          title="Menü"
          onclick="openOverlayMenu('${idSuffix}')"
        >
          ${Icons.get('listBullet')}
        </button>
        <a href="#/modules" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          ${studyIcon ? `<span class="flex-shrink-0">${studyIcon}</span>` : ''}
          <h1 class="text-sm md:text-xl font-bold text-gray-800 dark:text-gray-100">
            ${studyTitle}
          </h1>
        </a>
      </div>
      ${
        showGreeting
          ? `
      <span class="hidden md:inline text-gray-400 dark:text-gray-500 ml-2">-</span>
      <span
        id="header-greeting${idSuffix}"
        class="hidden md:inline text-lg text-blue-600 dark:text-blue-400 font-medium ml-2 flex-1"
      ></span>
      `
          : ''
      }
      <nav class="flex items-center gap-2">
        <!-- Dev Mode Badge (shown when dev mode is active) -->
        <a
          href="#/tools"
          id="header-dev-badge${idSuffix}"
          class="hidden text-xs font-bold px-2 py-0.5 rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        >DEV</a>
        <!-- Training Mode Button -->
        <a
          href="#/training"
          class="text-xs font-bold px-2 py-0.5 rounded ${
            view === 'training'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } transition-colors"
        >TRAIN</a>
        <!-- Streak Display -->
        ${
          showStreak
            ? `
        <button
          onclick="window.location.hash='#/alerts'"
          class="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-orange-500"
          title="${streakInfo.statusText}"
        >
          ${Icons.get('fire')}
          <span 
            id="streak-badge${idSuffix}" 
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white rounded-full ${
              streakInfo.current >= 5
                ? 'bg-green-500'
                : streakInfo.current >= 1
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }"
          >${streakInfo.current}</span>
        </button>
        `
            : ''
        }
        <!-- Alerts Icon (Bell) -->
        <button
          id="nav-alerts${idSuffix}"
          class="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ${
            view === 'alerts'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }"
          title="Benachrichtigungen"
          onclick="window.location.hash='#/alerts'"
        >
          ${Icons.get('bell')}
          <span
            id="alert-badge${idSuffix}"
            class="hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white rounded-full bg-red-500"
          ></span>
        </button>
        <!-- Search Icon -->
        <button
          id="nav-search${idSuffix}"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ${
            view === 'search'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }"
          title="Suche"
          onclick="window.location.hash='#/search'"
        >
          ${Icons.get('search')}
        </button>
      </nav>
    </div>
    
    <!-- Overlay Menu -->
    <div id="overlay-menu${idSuffix}" class="hidden fixed inset-0 z-50">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50" onclick="closeOverlayMenu('${idSuffix}')"></div>
      <!-- Menu Panel (links) -->
      <div class="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span class="font-bold text-lg">Menü</span>
          <button onclick="closeOverlayMenu('${idSuffix}')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            ${Icons.get('close', 'w-5 h-5')}
          </button>
        </div>
        <nav class="p-4 space-y-2">
          <!-- Training Button (prominent) -->
          <a
            href="#/training"
            onclick="closeOverlayMenu('${idSuffix}')"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${
              view === 'training'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } font-bold transition text-center"
          >
            TRAIN
          </a>
          <hr class="border-gray-200 dark:border-gray-700 my-2">
          <!-- Theme Toggle -->
          <button
            id="theme-toggle-menu${idSuffix}"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
            onclick="if(window.toggleTheme) window.toggleTheme(); updateMenuThemeIcons(this.closest('#overlay-menu${idSuffix}'));"
          >
            <span class="theme-icon-light hidden">${Icons.get(
              'sun',
              'w-5 h-5'
            )}</span>
            <span class="theme-icon-dark">${Icons.get('moon', 'w-5 h-5')}</span>
            <span class="theme-text">Farbschema</span>
          </button>
          <hr class="border-gray-200 dark:border-gray-700 my-2">
          <!-- Module -->
          <button
            onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('moduleMap');"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left ${
              view === 'moduleMap'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : ''
            }"
          >
            ${Icons.get('modules', 'w-5 h-5')}
            <span>Module</span>
          </button>
          <!-- Progress -->
          <button
            onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('progress');"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left ${
              view === 'progress'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : ''
            }"
          >
            ${Icons.get('chart', 'w-5 h-5')}
            <span>Progress</span>
          </button>
          <!-- Achievements -->
          <button
            onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('achievements');"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left ${
              view === 'achievements'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : ''
            }"
          >
            ${Icons.get('achievement', 'w-5 h-5')}
            <span>Achievements</span>
          </button>
          <!-- Map -->
          <button
            onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('map');"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left ${
              view === 'map'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : ''
            }"
          >
            ${Icons.get('map', 'w-5 h-5')}
            <span>Modul-Map</span>
          </button>
          <!-- Tools -->
          <button
            onclick="closeOverlayMenu('${idSuffix}'); window.showView && window.showView('tools');"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left ${
              view === 'tools'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : ''
            }"
          >
            ${Icons.get('cog', 'w-5 h-5')}
            <span>Tools</span>
          </button>
        </nav>
      </div>
    </div>
  `;

  return header;
}

// Menu toggle functions
function openOverlayMenu(idSuffix) {
  const menu = document.getElementById(`overlay-menu${idSuffix}`);
  if (menu) {
    menu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeOverlayMenu(idSuffix) {
  const menu = document.getElementById(`overlay-menu${idSuffix}`);
  if (menu) {
    menu.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

window.openOverlayMenu = openOverlayMenu;
window.closeOverlayMenu = closeOverlayMenu;

/**
 * Injects header into a view container
 * @param {string} viewId - DOM id of the view container
 * @param {string} viewName - Name identifier for the view ('moduleMap', 'tools', 'map', 'progress', 'lecture')
 * @param {Object} options - Optional parameters (e.g., moduleTitle for lecture view)
 */
function injectHeader(viewId, viewName, options = {}) {
  const viewElement = document.getElementById(viewId);
  if (!viewElement) return;

  // Remove existing header if present (for reinject after study switch)
  const existingHeader = viewElement.querySelector('header');
  if (existingHeader) {
    existingHeader.remove();
  }

  // Create header and insert as first child
  const header = createAppHeader(viewName, options);
  viewElement.insertBefore(header, viewElement.firstChild);

  // Setup menu toggle
  const idSuffix = viewName === 'moduleMap' ? '' : `-${viewName}`;
  const menuToggle = header.querySelector(`#menu-toggle${idSuffix}`);
  if (menuToggle) {
    menuToggle.addEventListener('click', () => openOverlayMenu(idSuffix));
  }

  // Setup theme toggle in menu
  const themeToggleMenu = header.querySelector(`#theme-toggle-menu${idSuffix}`);
  if (themeToggleMenu) {
    themeToggleMenu.addEventListener('click', () => {
      if (window.toggleTheme) window.toggleTheme();
      updateMenuThemeIcons(header);
    });
  }

  // Update theme icons
  updateMenuThemeIcons(header);

  // Update dev mode badge visibility
  if (window.updateDevModeUI) {
    window.updateDevModeUI();
  }
}

function updateMenuThemeIcons(container) {
  const isDark = document.documentElement.classList.contains('dark');
  container.querySelectorAll('.theme-icon-light').forEach((el) => {
    el.classList.toggle('hidden', !isDark);
  });
  container.querySelectorAll('.theme-icon-dark').forEach((el) => {
    el.classList.toggle('hidden', isDark);
  });
  container.querySelectorAll('.theme-text').forEach((el) => {
    el.textContent = isDark ? 'Hell' : 'Dunkel';
  });
}

// Expose functions to global scope
window.createAppHeader = createAppHeader;
window.injectHeader = injectHeader;
window.updateMenuThemeIcons = updateMenuThemeIcons;
