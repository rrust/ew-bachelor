// Service Worker for EW Lernapp
// Version-based cache for easy invalidation
const CACHE_VERSION = 'v1.0.2';
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
  './js/views.js',
  './js/progress.js',
  './js/parser.js',
  './js/achievements.js',
  './js/achievements-ui.js',
  './js/components.js',
  './js/swipe.js',
  './js/search.js',
  './js/quiz.js',
  './js/lecture.js',
  './js/modules.js',
  './js/map.js',
  './js/progress-view.js',
  './content/modules.json',
  './content/content-list.json',
  './manifest.json'
];

// External CDN resources (cache but allow network fallback)
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/js-yaml/dist/js-yaml.min.js',
  'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
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

  // Static assets - Stale-while-revalidate for JS/CSS (fast load, background update)
  if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/css/')) {
    event.respondWith(staleWhileRevalidate(event.request));
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
    console.error('[SW] Fetch failed:', error);
    // Return offline page or error
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request) {
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
    return new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate: Return cache immediately, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  // Fetch fresh version in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  // Return cached version immediately, or wait for network
  return cached || fetchPromise;
}

// Listen for messages (e.g., skip waiting)
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
