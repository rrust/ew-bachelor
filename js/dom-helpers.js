// DOM manipulation utilities - DRY helpers

/**
 * Shows lecture list, hides player and overview
 */
function showLectureList() {
  document.getElementById('lecture-player').style.display = 'none';
  document.getElementById('lecture-overview').style.display = 'none';
  document.getElementById('lecture-list-container').style.display = 'block';
  showView('lecture');
}

/**
 * Shows lecture player, hides list and overview
 */
function showLecturePlayer() {
  document.getElementById('lecture-list-container').style.display = 'none';
  document.getElementById('lecture-overview').style.display = 'none';
  document.getElementById('lecture-player').style.display = 'flex';
  showView('lecture');
}

/**
 * Shows lecture overview, hides list and player
 */
function showLectureOverviewView() {
  document.getElementById('lecture-list-container').style.display = 'none';
  document.getElementById('lecture-player').style.display = 'none';
  document.getElementById('lecture-overview').style.display = 'flex';
  showView('lecture');
}

/**
 * Gets badge emoji and class based on score
 * @param {number} score - Score percentage (0-100)
 * @returns {Object} {emoji, html, class, text, color}
 */
function getBadgeInfo(score) {
  const thresholds = window.BADGE_THRESHOLDS || {
    GOLD: 90,
    SILVER: 70,
    BRONZE: 50
  };

  if (score >= thresholds.GOLD) {
    return {
      emoji: '★',
      html: '<span style="color: #FFD700; text-shadow: 0 0 2px #B8860B;">★</span>',
      class: 'gold',
      text: 'Gold',
      color: '#FFD700'
    };
  } else if (score >= thresholds.SILVER) {
    return {
      emoji: '★',
      html: '<span style="color: #C0C0C0; text-shadow: 0 0 2px #808080;">★</span>',
      class: 'silver',
      text: 'Silber',
      color: '#C0C0C0'
    };
  } else if (score >= thresholds.BRONZE) {
    return {
      emoji: '★',
      html: '<span style="color: #CD7F32; text-shadow: 0 0 2px #8B4513;">★</span>',
      class: 'bronze',
      text: 'Bronze',
      color: '#CD7F32'
    };
  } else {
    return {
      emoji: '☆',
      html: '<span style="color: #9CA3AF;">☆</span>',
      class: 'none',
      text: 'Nicht bestanden',
      color: '#9CA3AF'
    };
  }
}

/**
 * Creates a colored badge element
 * @param {string} label - Badge text
 * @param {string} color - Badge color (blue, purple, red, green, orange, gray)
 * @returns {string} HTML string
 */
function createBadge(label, color = 'blue') {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    purple:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    orange:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };

  const colorClass = colors[color] || colors.blue;
  return `<span class="inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClass}">${label}</span>`;
}

/**
 * Clears element content safely
 * @param {string} elementId - Element ID
 */
function clearElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
  }
}

/**
 * Sets element text content safely
 * @param {string} elementId - Element ID
 * @param {string} text - Text content
 */
function setTextContent(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

/**
 * Sets element HTML content safely
 * @param {string} elementId - Element ID
 * @param {string} html - HTML content
 */
function setHTMLContent(elementId, html) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = html;
  }
}

/**
 * Shows an element by setting display style
 * @param {string|HTMLElement} elementOrId - Element or element ID
 * @param {string} displayValue - Display value ('block', 'flex', 'inline', etc.)
 */
function showElement(elementOrId, displayValue = 'block') {
  const element =
    typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;
  if (element) {
    element.style.display = displayValue;
  }
}

/**
 * Hides an element by setting display to none
 * @param {string|HTMLElement} elementOrId - Element or element ID
 */
function hideElement(elementOrId) {
  const element =
    typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;
  if (element) {
    element.style.display = 'none';
  }
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      window.showElement = showElement;
      window.hideElement = hideElement;
      window.debounce = debounce;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Expose to global scope
window.showLectureList = showLectureList;
window.showLecturePlayer = showLecturePlayer;
window.showLectureOverviewView = showLectureOverviewView;
window.getBadgeInfo = getBadgeInfo;
window.createBadge = createBadge;
window.clearElement = clearElement;
window.setTextContent = setTextContent;
window.setHTMLContent = setHTMLContent;
