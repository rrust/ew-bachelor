// UI Component Functions
// Reusable functions for generating common UI elements following DRY principles

/**
 * Creates the application header with navigation and theme toggle
 * @param {string} view - Current view name ('moduleMap', 'tools', 'comingSoon')
 * @returns {HTMLElement} Header element
 */
function createAppHeader(view = 'moduleMap') {
  const header = document.createElement('header');
  header.className =
    'bg-white dark:bg-gray-800 shadow-md mb-8 sticky top-0 z-10';

  const idSuffix = view === 'moduleMap' ? '' : `-${view}`;

  header.innerHTML = `
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
        EW Bachelor
      </h1>
      <div class="flex items-center space-x-4">
        <span
          id="header-greeting${idSuffix}"
          class="text-sm text-gray-600 dark:text-gray-400"
        ></span>
        <button
          id="theme-toggle${idSuffix}"
          class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Theme wechseln"
        >
          <svg
            class="w-5 h-5 text-gray-800 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  return header;
}

/**
 * Creates the navigation bar
 * @param {string} view - Current view name for button ID suffixes
 * @returns {HTMLElement} Navigation element
 */
function createNavBar(view = 'moduleMap') {
  const nav = document.createElement('nav');
  nav.className = 'bg-gray-200 dark:bg-gray-800 py-3 mb-6 sticky top-16 z-10';

  const idSuffix = view === 'moduleMap' ? '' : `-${view}`;

  nav.innerHTML = `
    <div class="container mx-auto px-4">
      <div class="flex justify-center space-x-2">
        <button
          id="nav-module${idSuffix}"
          class="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-200"
        >
          📚 Module
        </button>
        <button
          id="nav-map${idSuffix}"
          class="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200"
        >
          🗺️ Map
        </button>
        <button
          id="nav-progress${idSuffix}"
          class="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200"
        >
          📊 Progress
        </button>
        <button
          id="nav-tools${idSuffix}"
          class="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200"
        >
          🔧 Tools
        </button>
      </div>
    </div>
  `;

  return nav;
}

/**
 * Initializes headers and navigation for a view
 * @param {string} viewId - DOM id of the view container
 * @param {string} viewName - Name identifier for the view
 */
function initializeViewHeader(viewId, viewName) {
  const viewElement = document.getElementById(viewId);
  if (!viewElement) return;

  // Find existing header container or create one
  let headerContainer = viewElement.querySelector('.view-header-container');
  if (!headerContainer) {
    headerContainer = document.createElement('div');
    headerContainer.className = 'view-header-container';
    viewElement.insertBefore(headerContainer, viewElement.firstChild);
  }

  // Clear and rebuild
  headerContainer.innerHTML = '';
  headerContainer.appendChild(createAppHeader(viewName));
  headerContainer.appendChild(createNavBar(viewName));
}
