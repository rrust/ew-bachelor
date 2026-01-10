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
      <div class="container mx-auto px-8 py-4">
        <button
          id="back-to-modules-button"
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md transition duration-300"
        >
          &larr; Zurück zur Modulübersicht
        </button>
        ${
          options.moduleTitle
            ? `<h2 class="text-2xl font-bold mt-4">Vorlesungen für ${options.moduleTitle}</h2>`
            : ''
        }
      </div>
    `;
    return header;
  }

  const idSuffix = view === 'moduleMap' ? '' : `-${view}`;
  const activeNav = view; // Which nav button is active

  header.innerHTML = `
    <div class="container mx-auto px-8 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          Bachelor Studium Ernährungswissenschaften
        </h1>
        <span class="text-gray-400 dark:text-gray-500">-</span>
        <span
          id="header-greeting${idSuffix}"
          class="text-lg text-blue-600 dark:text-blue-400 font-medium"
        ></span>
      </div>
      <nav class="flex items-center space-x-6">
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
          id="nav-achievements${idSuffix}"
          class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition duration-200 ${
            activeNav === 'achievements'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : ''
          }"
        >
          🏆 Achievements
        </button>
        <button
          id="nav-map${idSuffix}"
          class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition duration-200 ${
            activeNav === 'map'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : ''
          }"
        >
          Map
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
