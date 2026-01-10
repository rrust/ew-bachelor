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
  header.className = 'bg-white dark:bg-gray-800 shadow-md mb-8';

  // Special header for lecture list view with back button
  if (view === 'lecture') {
    header.innerHTML = `
      <div class="container mx-auto px-4 md:px-8 py-3 md:py-4">
        <button
          id="back-to-modules-button"
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md transition duration-300 text-sm md:text-base"
        >
          &larr; Zurück
        </button>
        ${
          options.moduleTitle
            ? `<h2 class="text-lg md:text-2xl font-bold mt-2 md:mt-4">Vorlesungen für ${options.moduleTitle}</h2>`
            : ''
        }
      </div>
    `;
    return header;
  }

  const idSuffix = view === 'moduleMap' ? '' : `-${view}`;
  const activeNav = view; // Which nav button is active

  // Get current study title dynamically
  const studyInfo = typeof getCurrentStudyInfo === 'function' ? getCurrentStudyInfo() : null;
  const studyTitle = studyInfo ? studyInfo.shortTitle : 'Lern-App';

  header.innerHTML = `
    <div class="container mx-auto px-4 md:px-8 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
      <div class="flex items-center space-x-2">
        <h1 class="text-sm md:text-xl font-bold text-gray-800 dark:text-gray-100">
          ${studyTitle}
        </h1>
        <span class="hidden md:inline text-gray-400 dark:text-gray-500">-</span>
        <span
          id="header-greeting${idSuffix}"
          class="hidden md:inline text-lg text-blue-600 dark:text-blue-400 font-medium"
        ></span>
      </div>
      <nav class="flex items-center flex-wrap gap-2 md:gap-4 text-xs md:text-base">
        <button
          id="nav-module${idSuffix}"
          class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition duration-200 ${
            activeNav === 'moduleMap'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : ''
          }"
        >
          Module
        </button>
        <button
          id="nav-progress${idSuffix}"
          class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition duration-200 ${
            activeNav === 'progress'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : ''
          }"
        >
          Progress
        </button>
        <button
          id="nav-tools${idSuffix === '' ? '' : '-active'}"
          class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition duration-200 ${
            activeNav === 'tools'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : ''
          }"
        >
          Tools
        </button>
        <!-- Search Icon -->
        <button
          id="nav-search${idSuffix}"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ${
            activeNav === 'search'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }"
          title="Suche"
          onclick="window.location.hash='#/search'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <!-- Map Icon (Folder Tree) -->
        <button
          id="nav-map${idSuffix}"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ${
            activeNav === 'map'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }"
          title="Modul-Map"
          onclick="window.location.hash='#/map'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="2" width="6" height="4" rx="1" stroke-width="1.5"/>
            <rect x="14" y="7" width="6" height="4" rx="1" stroke-width="1.5"/>
            <rect x="14" y="15" width="6" height="4" rx="1" stroke-width="1.5"/>
            <path stroke-width="1.5" d="M5 6v13M5 9h9M5 17h9"/>
          </svg>
        </button>
        <!-- Achievements Icon (Trophy) -->
        <button
          id="nav-achievements${idSuffix}"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ${
            activeNav === 'achievements'
              ? 'text-yellow-500'
              : 'text-gray-600 dark:text-gray-400'
          }"
          title="Achievements"
          onclick="window.showView && window.showView('achievements')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3h14v4a7 7 0 01-14 0V3z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5H3a2 2 0 000 4h2M19 5h2a2 2 0 010 4h-2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14v3M8 21h8M10 17h4"/>
          </svg>
        </button>
        <!-- Theme Toggle -->
        <button
          id="theme-toggle${idSuffix}"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
          title="Farbschema umschalten"
        >
          <svg
            class="theme-toggle-light-icon hidden w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            class="theme-toggle-dark-icon w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
            ></path>
          </svg>
        </button>
      </nav>
    </div>
  `;

  return header;
}

/**
 * Injects header into a view container
 * @param {string} viewId - DOM id of the view container
 * @param {string} viewName - Name identifier for the view ('moduleMap', 'tools', 'map', 'progress', 'lecture')
 * @param {Object} options - Optional parameters (e.g., moduleTitle for lecture view)
 */
function injectHeader(viewId, viewName, options = {}) {
  const viewElement = document.getElementById(viewId);
  if (!viewElement) return;

  // Create header and insert as first child
  const header = createAppHeader(viewName, options);
  viewElement.insertBefore(header, viewElement.firstChild);

  // Update theme icons after header injection
  if (window.updateThemeIcons) {
    window.updateThemeIcons();
  }
}

// Expose functions to global scope
window.createAppHeader = createAppHeader;
window.injectHeader = injectHeader;
