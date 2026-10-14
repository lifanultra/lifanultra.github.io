'use strict';
importScripts('./js/asset-routes.js');

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) { event.waitUntil(self.clients.claim()); });

function remoteFor(path) {
  if (self.ASSET_CDN[path]) return self.ASSET_CDN[path];
  if (path.startsWith('lib/mathjax/')) {
    return 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/' + path.slice('lib/mathjax/'.length);
  }
  if (path.startsWith('lib/font-awesome/webfonts/')) {
    return 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/' + path.slice('lib/font-awesome/webfonts/'.length);
  }
  return null;
}

async function raceResource(request, remote) {
  var controllers = [new AbortController(), new AbortController()];
  async function download(source, index) {
    var response = index === 0
      ? await fetch(request, { signal: controllers[index].signal })
      : await fetch(remote, { mode: 'cors', credentials: 'omit', signal: controllers[index].signal });
    if (!response.ok || /text\/html/i.test(response.headers.get('content-type') || '')) {
      throw new Error('Invalid resource response: ' + response.status);
    }
    var body = await response.arrayBuffer();
    if (!body.byteLength) throw new Error('Empty resource');
    var headers = new Headers(response.headers);
    headers.delete('content-encoding');
    headers.delete('content-length');
    headers.set('X-Asset-Source', source);
    return { index: index, response: new Response(body, { status: 200, headers: headers }) };
  }
  try {
    var winner = await Promise.any([download('local', 0), download('cdn', 1)]);
    controllers[1 - winner.index].abort();
    return winner.response;
  } catch (_) {
    return Response.error();
  }
}

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  var scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  var remote = remoteFor(url.pathname.slice(scope.pathname.length));
  if (remote) event.respondWith(raceResource(event.request, remote));
});
