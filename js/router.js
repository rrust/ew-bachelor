// js/router.js
// Centralized routing logic for the app

/**
 * Route definitions
 * Each route has: pattern, view, and optional parameter extraction
 */
const ROUTE_PATTERNS = {
  // Simple routes (exact match after study prefix)
  tools: { view: 'tools' },
  map: { view: 'map' },
  progress: { view: 'progress' },
  alerts: { view: 'alerts' },
  search: { view: 'search', hasQuery: true },
  achievements: { view: 'achievements', hasId: true },
  'study-select': { view: 'studySelection' }
};

/**
 * Parse the current URL hash into a route object
 * @returns {Object|null} Route object with view and parameters, or null for home
 */
function parseURL() {
  const fullHash = window.location.hash.slice(1); // Remove #
  if (!fullHash || fullHash === '/') return null;

  // Separate path from query string BEFORE splitting
  const [hashPath, queryString] = fullHash.split('?');

  const parts = hashPath.split('/').filter((p) => p);
  const route = { view: parts[0] };

  // Check for study-select route
  if (parts[0] === 'study-select') {
    route.view = 'studySelection';
    return route;
  }

  // Check if first part is a known study ID
  const studies = window.getStudies ? window.getStudies() : [];
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
  } else if (parts[offset] === 'training') {
    route.view = 'training';
    // Parse query parameters for context-specific training
    // queryString was extracted at the top of parseURL()
    if (queryString) {
      const params = new URLSearchParams(queryString);
      // Only set if parameter has a non-empty value
      const moduleParam = params.get('module');
      const lectureParam = params.get('lecture');
      if (moduleParam) {
        route.trainingModuleId = moduleParam;
      }
      if (lectureParam) {
        route.trainingLectureId = lectureParam;
      }
    }
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

/**
 * Update the browser URL without reloading
 * @param {string} path - The path to set (without #)
 * @param {string} title - Page title
 */
function updateURL(path, title) {
  if (window.history && window.history.pushState) {
    const settings = window.getAppSettings ? window.getAppSettings() : {};
    const studyInfo = window.getCurrentStudyInfo
      ? window.getCurrentStudyInfo()
      : null;
    const studyTitle = studyInfo ? studyInfo.shortTitle : 'Lern-App';

    window.history.pushState({ path }, title, `#${path}`);
    document.title = title
      ? `${title} - ${studyTitle}`
      : `${studyTitle} - Lern-App`;
  }
}

/**
 * Navigate to a specific route
 * @param {string} path - Route path (e.g., '/tools', '/module/01/lecture/01')
 * @param {string} title - Optional page title
 */
function navigateTo(path, title = '') {
  updateURL(path, title);
  // Trigger route handling
  if (window.handleRoute) {
    window.handleRoute();
  }
}

/**
 * Get all registered simple routes
 * Useful for debugging and validation
 * @returns {string[]} Array of route names
 */
function getRegisteredRoutes() {
  return Object.keys(ROUTE_PATTERNS);
}

/**
 * Check if a view name is a valid route
 * @param {string} viewName - The view name to check
 * @returns {boolean} True if valid
 */
function isValidRoute(viewName) {
  const simpleRoutes = [
    'tools',
    'map',
    'progress',
    'alerts',
    'training',
    'search',
    'achievements',
    'studySelection',
    'module'
  ];
  return simpleRoutes.includes(viewName);
}

/**
 * Debug helper - log current route info
 */
function debugRoute() {
  const route = parseURL();
  if (window.isDevMode && window.isDevMode()) {
    console.group('[Router] Debug Info');
    console.log('Hash:', window.location.hash);
    console.log('Parsed route:', route);
    console.log('Registered routes:', getRegisteredRoutes());
    console.groupEnd();
  }
  return route;
}

// Expose to global scope
window.Router = {
  parseURL,
  updateURL,
  navigateTo,
  getRegisteredRoutes,
  isValidRoute,
  debugRoute,
  ROUTE_PATTERNS
};

// Also expose individual functions for backward compatibility
window.parseURL = parseURL;
window.updateURL = updateURL;
