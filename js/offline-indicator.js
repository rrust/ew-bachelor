// js/offline-indicator.js
// Shows offline/online status indicator

/**
 * Initialize offline indicator
 * Adds event listeners for online/offline events and shows indicator when offline
 */
function initOfflineIndicator() {
  // Create the indicator element
  const indicator = document.createElement('div');
  indicator.id = 'offline-indicator';
  indicator.className =
    'fixed bottom-16 left-3 z-50 flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 bg-amber-500 text-white text-xs font-medium rounded-full sm:rounded-lg shadow-lg transform transition-all duration-300 translate-y-20 opacity-0';
  indicator.innerHTML = `
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"></path>
    </svg>
    <span class="hidden sm:inline">Offline</span>
  `;
  document.body.appendChild(indicator);

  // Update indicator state
  function updateIndicator() {
    if (navigator.onLine) {
      indicator.classList.add('translate-y-20', 'opacity-0');
      indicator.classList.remove('translate-y-0', 'opacity-100');
    } else {
      indicator.classList.remove('translate-y-20', 'opacity-0');
      indicator.classList.add('translate-y-0', 'opacity-100');
    }
  }

  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('[OfflineIndicator] Back online');
    updateIndicator();
  });

  window.addEventListener('offline', () => {
    console.log('[OfflineIndicator] Gone offline');
    updateIndicator();
  });

  // Initial check
  updateIndicator();
}

// Export to window
window.OfflineIndicator = {
  init: initOfflineIndicator
};
