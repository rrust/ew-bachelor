// PWA Installation Module
// Handles the "Add to Home Screen" / "Install App" functionality

window.PWAInstall = (function () {
  let deferredPrompt = null;
  let installButton = null;

  /**
   * Initialize PWA install handling
   */
  function init() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      console.log('[PWA] Install prompt saved');
      // Update UI to show the install button
      updateInstallButton();
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App was installed');
      deferredPrompt = null;
      updateInstallButton();
    });

    // Check if app is already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[PWA] App is running in standalone mode');
    }
  }

  /**
   * Check if install is available
   */
  function isInstallAvailable() {
    return deferredPrompt !== null;
  }

  /**
   * Check if app is already installed
   */
  function isInstalled() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  /**
   * Prompt the user to install the app
   */
  async function promptInstall() {
    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response: ${outcome}`);

    // Clear the deferred prompt
    deferredPrompt = null;
    updateInstallButton();

    return outcome === 'accepted';
  }

  /**
   * Update the install button visibility and state
   */
  function updateInstallButton() {
    const container = document.getElementById('pwa-install-card');
    if (!container) return;

    if (isInstalled()) {
      // App is already installed
      container.innerHTML = `
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-bold">App installiert</h3>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Die App ist bereits auf diesem Gerät installiert und kann vom Startbildschirm aus geöffnet werden.
        </p>
        <span class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium py-2 px-4 rounded-md">
          ✓ Installiert
        </span>
      `;
    } else if (isInstallAvailable()) {
      // Install is available
      container.innerHTML = `
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11V7m0 4l-2-2m2 2l2-2"></path>
          </svg>
          <h3 class="text-xl font-bold">App installieren</h3>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Installiere die App auf deinem Gerät für schnellen Zugriff und Offline-Nutzung.
        </p>
        <button
          id="pwa-install-button"
          class="inline-block bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          📲 Jetzt installieren
        </button>
      `;
      // Add click handler
      const btn = document.getElementById('pwa-install-button');
      if (btn) {
        btn.addEventListener('click', promptInstall);
      }
    } else {
      // Install not available (browser doesn't support or already dismissed)
      container.innerHTML = `
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <h3 class="text-xl font-bold text-gray-500 dark:text-gray-400">App installieren</h3>
        </div>
        <p class="text-gray-500 dark:text-gray-500 mb-4">
          Die Installation ist derzeit nicht verfügbar. Mögliche Gründe:
        </p>
        <ul class="text-sm text-gray-500 dark:text-gray-500 list-disc list-inside mb-4">
          <li>Browser unterstützt keine PWA-Installation</li>
          <li>Seite wurde nicht über HTTPS geladen</li>
          <li>Installation wurde bereits abgelehnt (Browser-Cache löschen)</li>
        </ul>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          <strong>Tipp für iOS Safari:</strong> Tippe auf "Teilen" → "Zum Home-Bildschirm".
        </p>
      `;
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    isInstallAvailable,
    isInstalled,
    promptInstall,
    updateInstallButton
  };
})();
