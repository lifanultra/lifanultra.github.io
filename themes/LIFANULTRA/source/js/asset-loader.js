(function () {
  'use strict';
  var root = new URL('../', document.currentScript.src);
  var workerUrl = new URL('assets-worker.js', root).href;
  var ready = Promise.resolve();
  if ('serviceWorker' in navigator && window.isSecureContext) {
    ready = new Promise(function (resolve) {
      var timer = setTimeout(finish, 4000);
      function controlled() {
        return navigator.serviceWorker.controller && navigator.serviceWorker.controller.scriptURL === workerUrl;
      }
      function finish() {
        clearTimeout(timer);
        navigator.serviceWorker.removeEventListener('controllerchange', changed);
        resolve();
      }
      function changed() { if (controlled()) finish(); }
      navigator.serviceWorker.addEventListener('controllerchange', changed);
      navigator.serviceWorker.register(workerUrl, { scope: root.pathname, updateViaCache: 'none' })
        .then(function () { if (controlled()) finish(); })
        .catch(finish);
    });
  }
  function loadScript(url) {
    return ready.then(function () {
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = function () { reject(new Error('Script failed: ' + url)); };
        document.head.appendChild(script);
      });
    });
  }
  var queue = ready;
  window.SiteAssets = {
    ready: ready,
    loadScript: loadScript,
    script: function (url) { queue = queue.then(function () { return loadScript(url); }); return queue; },
    run: function (callback) { queue = queue.then(callback); return queue; },
    style: function (url) {
      return ready.then(function () {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      });
    }
  };
}());
