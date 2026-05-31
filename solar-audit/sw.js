/* ═══════════════════════════════════════════════════════
   SOVEREIGN NODE — SERVICE WORKER
   Solar Audit PWA · Island First · Offline Capable
   Cache strategy: Cache-first for assets, network-first
   for navigation with offline fallback.
   ═══════════════════════════════════════════════════════ */

const CACHE_NAME    = 'solar-audit-v1';
const OFFLINE_URL   = './index.html';
// Relative paths — works correctly whether served from root
// or a subdirectory (e.g. github.io/pwa/solar-audit/)
const CACHE_ASSETS  = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
];

/* ─── INSTALL ─────────────────────────────────────────── */
/* Pre-cache all app shell assets on first install.
   skipWaiting() activates immediately — no waiting for
   existing tabs to close.                                 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ─── ACTIVATE ────────────────────────────────────────── */
/* Clean up old cache versions on activation.
   clients.claim() takes control of all open tabs.        */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

/* ─── FETCH ───────────────────────────────────────────── */
/* Navigation requests: network-first with offline fallback.
   Asset requests: cache-first (fonts, images, etc.).     */
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle same-origin requests
  if (!request.url.startsWith(self.location.origin)) return;

  // Navigation (HTML pages) — network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the fresh response
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(OFFLINE_URL).then(cached => cached || caches.match('/'))
        )
    );
    return;
  }

  // Assets — cache first, network fallback
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      });
    })
  );
});

/* ─── BACKGROUND SYNC ─────────────────────────────────── */
/* When connectivity returns, notify the client so it can
   display a "back online" indicator.                      */
self.addEventListener('sync', event => {
  if (event.tag === 'connectivity-restored') {
    event.waitUntil(
      self.clients.matchAll().then(clients =>
        clients.forEach(client =>
          client.postMessage({ type: 'CONNECTIVITY_RESTORED' })
        )
      )
    );
  }
});

/* ─── MESSAGE HANDLER ─────────────────────────────────── */
/* Receive messages from the main thread.
   SKIP_WAITING: force activate new SW immediately.        */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
