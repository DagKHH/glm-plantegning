// Service worker: appen virker uten nett etter første besøk. c9ea4a10a7 byttes ut av build_web.py.
const CACHE = 'plantegning-c9ea4a10a7';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
function keep(req, resp){ if(resp && (resp.ok || resp.type === 'opaque')){ const cp = resp.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return resp; }
self.addEventListener('fetch', e => {
  const req = e.request; if(req.method !== 'GET') return;
  if(req.mode === 'navigate'){ // nyeste versjon når det er nett, lagret versjon ellers
    e.respondWith(fetch(req, {cache: 'no-cache'}).then(r => keep(req, r)).catch(() => caches.match(req).then(r => r || caches.match('index.html')))); return; }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(resp => keep(req, resp))));
});
