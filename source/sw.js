/** Retire the previous site's Patch PWA worker and its own caches. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (names) {
    return Promise.all(names.filter(function (name) { return /^patch-v\d+$/.test(name); }).map(function (name) { return caches.delete(name); }));
  }).then(function () { return self.clients.claim(); }).then(function () { return self.registration.unregister(); }));
});
// No fetch handler: every request uses the network normally.
