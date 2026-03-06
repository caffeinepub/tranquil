const CACHE_NAME = 'tranquil-v1';

// App shell assets to cache on install
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/assets/generated/icon-192.dim_192x192.png',
  '/assets/generated/icon-512.dim_512x512.png',
  '/assets/generated/tranquil-logo.dim_400x120.png',
  '/assets/generated/tranquil-bg.dim_1200x900.png',
];

// Patterns for requests that should NEVER be cached (ICP canister API calls)
const BYPASS_PATTERNS = [
  /\/api\//,
  /icp0\.io/,
  /ic0\.app/,
  /localhost:4943/,
  /127\.0\.0\.1:4943/,
];

function shouldBypass(url) {
  return BYPASS_PATTERNS.some((pattern) => pattern.test(url));
}

// Install: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first for static assets, network-only for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Always bypass ICP canister API calls
  if (shouldBypass(url)) {
    return;
  }

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          // Only cache valid responses for same-origin or static assets
          if (
            response &&
            response.status === 200 &&
            (response.type === 'basic' || response.type === 'cors')
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: serve the cached root HTML for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});
