// Navigation and URL handling

/**
 * Updates the URL hash and document title
 * @param {string} path - The path to set (e.g., '/module/01-example')
 * @param {string} title - The page title
 */
function updateURL(path, title) {
  window.location.hash = path;
  document.title = title ? `${title} - EW Bachelor` : 'EW Bachelor';
}

/**
 * Parses the current URL hash
 * @returns {Object|null} Route object or null
 */
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
  } else if (parts[0] === 'map' || parts[0] === 'progress') {
    route.view = 'comingSoon';
  }

  return route;
}

// Expose to global scope
window.updateURL = updateURL;
window.parseURL = parseURL;
