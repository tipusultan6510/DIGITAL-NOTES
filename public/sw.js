// Minimal service worker — required for Android "Install app" eligibility.
// It doesn't cache anything special; it just passes requests through.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {})
