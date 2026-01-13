// Service Worker for EW Lernapp
// Version-based cache for easy invalidation
const CACHE_VERSION = 'v1.21.0';
const CACHE_NAME = `ew-lernapp-${CACHE_VERSION}`;

// Files to cache on install
// Use relative paths for GitHub Pages compatibility
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './css/styles.css',
  './css/custom-styles.css',
  './js/state.js',
  './js/dom-helpers.js',
  './js/theme.js',
  './js/navigation.js',
  './js/router.js',
  './js/views.js',
  './js/progress.js',
  './js/parser.js',
  './js/achievements.js',
  './js/achievements-ui.js',
  './js/streak.js',
  './js/alerts.js',
  './js/notifications.js',
  './js/components.js',
  './js/swipe.js',
  './js/search.js',
  './js/quiz.js',
  './js/lecture.js',
  './js/modules.js',
  './js/map.js',
  './js/progress-view.js',
  './js/studies.js',
  './js/icons.js',
  './js/keyboard.js',
  './js/pwa-install.js',
  './js/validator.js',
  './js/dev-mode.js',
  './js/snapshots.js',
  './js/training.js',
  './js/download-manager.js',
  './js/bundle-loader.js',
  './js/offline-indicator.js',
  './js/app-update.js',
  './content/studies.json',
  './manifest.json'
];

// External CDN resources (cache but allow network fallback)
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com?plugins=typography',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/js-yaml/dist/js-yaml.min.js',
  'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/mhchem.min.js'
];

// Listen for SKIP_WAITING message from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING, activating new version...');
    self.skipWaiting();
  }
});

// Install: Cache static assets AND CDN assets for offline use
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        console.log('[SW] Caching static assets');
        await cache.addAll(STATIC_ASSETS);

        // Try to cache CDN assets (don't fail install if CDN is down)
        console.log('[SW] Caching CDN assets');
        for (const url of CDN_ASSETS) {
          try {
            await cache.add(url);
          } catch (e) {
            console.warn('[SW] Failed to cache CDN asset:', url);
          }
        }
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Cache failed:', error);
      })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) => name.startsWith('ew-lernapp-') && name !== CACHE_NAME
            )
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch: Cache-first for static, network-first for content
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Lecture bundles - Network first (always get latest content, cache fallback for offline)
  if (
    url.pathname.includes('/content/') &&
    url.pathname.endsWith('lecture-bundle.json')
  ) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Study metadata files - Network first (always get latest, cache fallback for offline)
  if (
    url.pathname.includes('/content/') &&
    (url.pathname.endsWith('modules.json') ||
      url.pathname.endsWith('search-index.json') ||
      url.pathname.endsWith('content-manifest.json') ||
      url.pathname.endsWith('content-list.json'))
  ) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Content files (markdown) - Network first, cache fallback
  if (url.pathname.includes('/content/') && url.pathname.endsWith('.md')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // CDN resources - Cache first with network fallback
  if (CDN_ASSETS.some((cdn) => event.request.url.startsWith(cdn))) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Static assets - Network first for JS/CSS to get updates immediately
  // Falls back to cache for offline use
  if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/css/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Other static assets (HTML, images) - Cache first
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Default: Network first
  event.respondWith(networkFirst(event.request));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const url = new URL(request.url);
    console.error('[SW] Fetch failed:', error);

    // Return appropriate fallback based on file type
    if (url.pathname.endsWith('.json')) {
      return new Response('{}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request) {
  const url = new URL(request.url);
  const isJsonFile = url.pathname.endsWith('.json');

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    console.error('[SW] Network and cache failed:', error);

    // Return appropriate fallback based on file type
    if (isJsonFile) {
      // Return empty JSON object/array to prevent parse errors
      const fallback =
        url.pathname.includes('modules.json') ||
        url.pathname.includes('content-list.json') ||
        url.pathname.includes('search-index.json')
          ? '[]'
          : '{}';
      return new Response(fallback, {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate: Return cache immediately, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  // Fetch fresh version in background (don't await, fire-and-forget)
  // Errors are caught silently - we already have cached version or will handle below
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {
      // Network failed - silently ignore if we have cache
      // If no cache, this will be handled below
      return null;
    });

  // Return cached version immediately if available
  if (cached) {
    return cached;
  }

  // No cache - must wait for network
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }

  // Both cache and network failed
  console.warn(
    '[SW] Stale-while-revalidate: No cache and network failed for:',
    request.url
  );
  return new Response('Offline', { status: 503 });
}

// Listen for messages (e.g., skip waiting)
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  event.notification.close();

  // Get the URL from notification data
  const urlToOpen = event.notification.data?.url || '#/alerts';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it and navigate
        for (const client of clientList) {
          if ('focus' in client) {
            client.focus();
            client.navigate(self.location.origin + '/' + urlToOpen);
            return;
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow('/' + urlToOpen);
        }
      })
  );
});
