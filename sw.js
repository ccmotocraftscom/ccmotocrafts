const CACHE_NAME = 'cc-motocrafts-pwa-v9';
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './supabase-config.js',
  './app.js',
  './manifest.json',
  './app-icon-192.png',
  './app-icon-512.png',
  './logo-cc-crafts-3d.jpg',
  './certificate-master-technician.jpg',
  './hero-ecu-dyno-tuning.jpg',
  './hero-mobile-pickup-van.jpg',
  './hero-zero-damage-van-interior.jpg',
  './hero-doorstep-inspection.jpg',
  './hero-ai-hud-telemetry.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        const clone = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkRes;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});
