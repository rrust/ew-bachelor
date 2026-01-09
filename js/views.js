// View management

/**
 * Shows a specific view and hides others
 * @param {string} viewName - Name of the view to show
 */
function showView(viewName) {
  const views = [
    'welcome',
    'moduleMap',
    'lecture',
    'quiz',
    'quizResults',
    'tools',
    'map',
    'progress'
  ];

  views.forEach((v) => {
    const viewId =
      v === 'welcome'
        ? 'welcome-view'
        : v === 'moduleMap'
        ? 'module-map-view'
        : v === 'quizResults'
        ? 'quiz-results-view'
        : `${v}-view`;

    const element = document.getElementById(viewId);
    if (element) {
      element.style.display = v === viewName ? 'block' : 'none';
    }
  });
}

/**
 * Updates the greeting with user's name
 * @param {string} userName - User's name (optional)
 */
function updateGreeting(userName) {
  const progress = getUserProgress();
  const name = userName || progress?.userName || 'Gast';

  // Update all greeting elements (for different views)
  const greetingIds = [
    'header-greeting',
    'header-greeting-tools',
    'header-greeting-map',
    'header-greeting-progress'
  ];

  greetingIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = `Hallo, ${name}`;
    }
  });
}

// Expose to global scope
window.showView = showView;
window.updateGreeting = updateGreeting;
