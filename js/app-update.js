/**
 * App Update Manager
 *
 * Handles:
 * - Showing update banner when new SW version is available
 * - App reset functionality (clear cache, keep localStorage)
 */

const AppUpdate = {
  updateBanner: null,
  updateButton: null,
  resetButton: null,
  pendingWorker: null,

  /**
   * Initialize update manager
   */
  init() {
    this.updateBanner = document.getElementById('update-banner');
    this.updateButton = document.getElementById('update-now-button');
    this.resetButton = document.getElementById('reset-app-button');

    if (this.updateButton) {
      this.updateButton.addEventListener('click', () => this.applyUpdate());
    }

    if (this.resetButton) {
      this.resetButton.addEventListener('click', () => this.resetApp());
    }

    // Listen for SW update events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Check if there's already a waiting worker
        if (registration.waiting) {
          this.showUpdateBanner(registration.waiting);
        }

        // Listen for new updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              this.showUpdateBanner(newWorker);
            }
          });
        });
      });
    }
  },

  /**
   * Show the update banner
   */
  showUpdateBanner(worker) {
    this.pendingWorker = worker;
    if (this.updateBanner) {
      this.updateBanner.classList.remove('hidden');
      console.log('[AppUpdate] New version available, showing banner');
    }
  },

  /**
   * Apply the pending update
   */
  applyUpdate() {
    if (this.pendingWorker) {
      // Tell the new SW to take over
      this.pendingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // No pending worker, just reload
      window.location.reload();
    }
  },

  /**
   * Reset the app (clear caches but keep localStorage)
   */
  async resetApp() {
    const confirmed = confirm(
      'App-Cache wird gelöscht und die Seite neu geladen.\n\n' +
        'Dein Lernfortschritt bleibt erhalten!\n\n' +
        'Fortfahren?'
    );

    if (!confirmed) return;

    try {
      // 1. Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('[AppUpdate] SW unregistered');
        }
      }

      // 2. Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log('[AppUpdate] Cache deleted:', cacheName);
        }
      }

      // 3. Clear IndexedDB (downloaded content, but NOT localStorage!)
      if ('indexedDB' in window) {
        const databases = (await indexedDB.databases?.()) || [];
        for (const db of databases) {
          if (db.name && db.name.includes('ew-lernapp')) {
            indexedDB.deleteDatabase(db.name);
            console.log('[AppUpdate] IndexedDB deleted:', db.name);
          }
        }
      }

      // Note: localStorage is NOT cleared - this preserves learning progress!
      console.log('[AppUpdate] Reset complete, reloading...');

      // 4. Hard reload
      window.location.reload(true);
    } catch (error) {
      console.error('[AppUpdate] Reset failed:', error);
      alert('Fehler beim Zurücksetzen. Bitte versuche es erneut.');
    }
  }
};

// Export for use in app.js
window.AppUpdate = AppUpdate;
