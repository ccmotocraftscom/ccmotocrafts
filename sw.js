/**
 * CC MOTOCRAFTS AI ENGINE LABS SERVICE - OFFLINE-FIRST PWA SERVICE WORKER
 * Caches the entire Customer App, Pricing, Saved Profile, and Portfolio Images
 * so customers can open the installed app and book even without internet!
 */

const CACHE_NAME = 'cc-motocrafts-pwa-v8';
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
  './hero-ai-hud-telemetry.jpg',
  './portfolio-superbike-inline4-rebuild.jpg',
  './portfolio-ducati-trellis-rebuild.jpg',
  './portfolio-aprilia-superbike-overhaul.jpg',
  './portfolio-kawasaki-z900-exhaust.jpg',
  './portfolio-cylinder-head-valve-care.jpg',
  './portfolio-crankcase-precision-assembly.jpg',
  './portfolio-fi-ecu-troubleshooting.jpg',
  './portfolio-adventure-obd-scan.jpg',
  './portfolio-bmw-g310r-diagnostics.jpg',
  './portfolio-himalayan-suspension-forks.jpg',
  './portfolio-royal-enfield-general.jpg',
  './portfolio-cruiser-brake-service.jpg',
  './portfolio-commuter-sport-red.jpg',
  './portfolio-clutch-transmission-bay.jpg',
  './portfolio-retro-electrical-wiring.jpg',
  './portfolio-scooter-vespa-yellow.jpg',
  './portfolio-scooter-cvt-drivetrain.jpg',
  './portfolio-scooter-vespa-red.jpg'
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
