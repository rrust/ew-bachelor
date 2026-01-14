// Keyboard navigation module

/**
 * Initialize keyboard navigation for the app
 * Provides keyboard shortcuts for:
 * - Lecture player: Arrow keys for prev/next
 * - Quiz: Number keys for option selection, Enter for submit
 * - Global: Escape for back, / for search focus
 */
function initKeyboardNavigation() {
  document.addEventListener('keydown', handleKeyDown);
}

/**
 * Main keyboard event handler
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyDown(e) {
  // Don't intercept when user is typing in an input
  const activeElement = document.activeElement;
  const isTyping =
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.isContentEditable;

  // Allow Escape even when typing (to blur input)
  if (e.key === 'Escape') {
    handleEscape(activeElement, isTyping);
    return;
  }

  // Don't intercept other keys when typing
  if (isTyping) return;

  // Global shortcuts
  if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    focusSearch();
    return;
  }

  // Show keyboard shortcuts help with ? key
  if (e.key === '?' || (e.shiftKey && e.key === '/')) {
    e.preventDefault();
    openKeyboardShortcutsOverlay();
    return;
  }

  // Get current active view
  const activeView = getActiveView();

  // View-specific shortcuts
  switch (activeView) {
    case 'lecture':
      handleLectureKeys(e);
      break;
    case 'quiz':
      handleQuizKeys(e);
      break;
  }
}

/**
 * Handle Escape key - blur inputs or navigate back
 */
function handleEscape(activeElement, isTyping) {
  if (isTyping) {
    activeElement.blur();
    return;
  }

  // Close keyboard shortcuts overlay if open
  const keyboardOverlay = document.getElementById('keyboard-shortcuts-overlay');
  if (keyboardOverlay && !keyboardOverlay.classList.contains('hidden')) {
    closeKeyboardShortcutsOverlay();
    return;
  }

  // Find and click a "back" button if visible
  const backButtons = [
    document.getElementById('back-to-lectures-button'),
    document.getElementById('back-to-lecture-button'),
    document.getElementById('back-to-player-button'),
    document.getElementById('back-to-lecture-from-results')
  ];

  for (const btn of backButtons) {
    if (btn && isVisible(btn)) {
      btn.click();
      return;
    }
  }
}

/**
 * Focus the search input
 */
function focusSearch() {
  // Check if we're on search page
  const searchInput = document.getElementById('search-input');
  if (searchInput && isVisible(searchInput)) {
    searchInput.focus();
    return;
  }

  // Otherwise navigate to search
  const searchNavButton =
    document.getElementById('nav-search') ||
    document.querySelector('[id^="nav-search"]');
  if (searchNavButton) {
    searchNavButton.click();
    // Focus input after navigation
    setTimeout(() => {
      const input = document.getElementById('search-input');
      if (input) input.focus();
    }, 100);
  }
}

/**
 * Get the currently active view ID
 * @returns {string|null} View ID
 */
function getActiveView() {
  const views = [
    'welcome-view',
    'module-map-view',
    'lecture-view',
    'quiz-view',
    'quiz-results-view',
    'achievements-view',
    'tools-view',
    'map-view',
    'progress-view',
    'search-view',
    'alerts-view',
    'training-view'
  ];

  for (const viewId of views) {
    const view = document.getElementById(viewId);
    // Check both inline style and computed style for visibility
    if (view) {
      const style = window.getComputedStyle(view);
      if (style.display !== 'none' && view.style.display !== 'none') {
        return viewId.replace('-view', '');
      }
    }
  }
  return null;
}

/**
 * Check if element is visible
 * @param {HTMLElement} el - Element to check
 * @returns {boolean} True if visible
 */
function isVisible(el) {
  if (!el) return false;
  // Check computed style for more reliable visibility detection
  // (offsetParent is null for fixed/sticky positioned elements)
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

/**
 * Handle keyboard shortcuts in lecture player
 */
function handleLectureKeys(e) {
  const lecturePlayer = document.getElementById('lecture-player');
  const lectureOverview = document.getElementById('lecture-overview');

  // Check if we're in player mode (not overview)
  // Use computed style since lecture-player is position:fixed
  const inPlayer = lecturePlayer && isVisible(lecturePlayer);
  const inOverview = lectureOverview && isVisible(lectureOverview);

  if (inPlayer && !inOverview) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextBtn = document.getElementById('next-item-button');
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevBtn = document.getElementById('prev-item-button');
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
        break;

      case 'o':
      case 'O':
        // Open overview
        const overviewBtn = document.getElementById('lecture-overview-button');
        if (overviewBtn) overviewBtn.click();
        break;

      case 'q':
      case 'Q':
        // Start quiz if available
        const quizBtn = document.getElementById('lecture-quiz-button');
        if (quizBtn && isVisible(quizBtn)) quizBtn.click();
        break;
    }
  }

  if (inOverview) {
    // Number keys to jump to item in overview
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) {
      const itemButtons = lectureOverview.querySelectorAll(
        '[data-lecture-item-index]'
      );
      if (num <= itemButtons.length) {
        itemButtons[num - 1].click();
      }
    }
  }
}

/**
 * Handle keyboard shortcuts in quiz
 */
function handleQuizKeys(e) {
  const quizView = document.getElementById('quiz-view');
  if (!quizView || !isVisible(quizView)) return;

  // Number keys 1-9 to select options
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 9) {
    const options = quizView.querySelectorAll(
      'input[name="quiz-option"], input[name="quiz-option-checkbox"]'
    );
    if (num <= options.length) {
      const option = options[num - 1];
      if (option.type === 'checkbox') {
        option.checked = !option.checked;
      } else {
        option.checked = true;
      }
      // Also highlight the label
      const label = option.closest('label');
      if (label) {
        label.classList.add('ring-2', 'ring-blue-500');
        setTimeout(
          () => label.classList.remove('ring-2', 'ring-blue-500'),
          200
        );
      }
    }
    return;
  }

  // Enter to submit
  if (e.key === 'Enter') {
    const submitBtn = quizView.querySelector('button');
    if (submitBtn && submitBtn.textContent.includes('Antwort')) {
      submitBtn.click();
    }
  }

  // Space to toggle current focused option
  if (e.key === ' ') {
    const focused = document.activeElement;
    if (focused && focused.type === 'checkbox') {
      e.preventDefault();
      focused.checked = !focused.checked;
    }
  }
}

/**
 * Add visible focus styles to interactive elements
 * Called once on init
 */
function enhanceFocusStyles() {
  // Add focus-visible polyfill behavior via CSS class
  const style = document.createElement('style');
  style.textContent = `
    /* Enhanced focus styles for keyboard navigation */
    button:focus-visible,
    a:focus-visible,
    input:focus-visible,
    select:focus-visible,
    [tabindex]:focus-visible {
      outline: 2px solid #3b82f6 !important;
      outline-offset: 2px !important;
    }
    
    /* Remove default outline when not using keyboard */
    button:focus:not(:focus-visible),
    a:focus:not(:focus-visible) {
      outline: none;
    }
    
    /* Skip link for accessibility */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #3b82f6;
      color: white;
      padding: 8px 16px;
      z-index: 100;
      transition: top 0.3s;
    }
    
    .skip-link:focus {
      top: 0;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Show keyboard shortcuts help
 */
function showKeyboardHelp() {
  const shortcuts = [
    { key: '← →', desc: 'Vorheriger/Nächster Schritt (Lecture)' },
    { key: '1-9', desc: 'Antwort auswählen (Quiz)' },
    { key: 'Enter', desc: 'Antwort abschicken (Quiz)' },
    { key: 'O', desc: 'Übersicht öffnen (Lecture)' },
    { key: 'Q', desc: 'Quiz starten (Lecture)' },
    { key: '/', desc: 'Suche öffnen' },
    { key: 'Esc', desc: 'Zurück / Eingabe verlassen' }
  ];

  let html = '<div class="grid gap-2">';
  shortcuts.forEach(({ key, desc }) => {
    html += `
      <div class="flex justify-between gap-4">
        <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">${key}</kbd>
        <span class="text-gray-600 dark:text-gray-400">${desc}</span>
      </div>
    `;
  });
  html += '</div>';

  return { title: 'Tastaturkürzel', html, shortcuts };
}

/**
 * Open the keyboard shortcuts overlay
 */
function openKeyboardShortcutsOverlay() {
  const overlay = document.getElementById('keyboard-shortcuts-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    // Re-inject icons if needed
    if (window.Icons && window.Icons.injectAll) {
      window.Icons.injectAll();
    }
  }
}

/**
 * Close the keyboard shortcuts overlay
 */
function closeKeyboardShortcutsOverlay() {
  const overlay = document.getElementById('keyboard-shortcuts-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

/**
 * Initialize keyboard shortcuts button in Tools view
 */
function initKeyboardShortcutsButton() {
  const btn = document.getElementById('show-keyboard-shortcuts-button');
  if (btn) {
    btn.addEventListener('click', openKeyboardShortcutsOverlay);
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initKeyboardNavigation();
  enhanceFocusStyles();
  initKeyboardShortcutsButton();
});

// Expose globally
window.KeyboardNav = {
  init: initKeyboardNavigation,
  showHelp: showKeyboardHelp,
  openOverlay: openKeyboardShortcutsOverlay,
  closeOverlay: closeKeyboardShortcutsOverlay
};

// Expose close function globally for onclick handlers
window.closeKeyboardShortcutsOverlay = closeKeyboardShortcutsOverlay;
