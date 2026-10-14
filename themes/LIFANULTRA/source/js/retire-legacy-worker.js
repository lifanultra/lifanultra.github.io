/** Ask an existing root Patch worker to load the retirement worker. Never install a new worker. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    registrations.forEach(function (registration) {
      var worker = registration.active || registration.waiting || registration.installing;
      if (!worker) return;
      var url = new URL(worker.scriptURL);
      if (url.origin === location.origin && url.pathname === '/sw.js' && registration.scope === location.origin + '/') {
        registration.update().catch(function () { /* An offline visit retries on the next page load. */ });
      }
    });
  }).catch(function () { /* Restricted contexts can disable service workers. */ });
}());
