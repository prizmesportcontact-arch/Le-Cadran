// Garde le site en mémoire pour qu'il s'ouvre vite (et sans internet pour les parties « sur cet appareil »).
const CACHE = "boite-a-jeux-v7";
const FICHIERS = [
  "./", "index.html", "manifest.webmanifest",
  "commun/commun.css?v=5", "commun/commun.js?v=5", "commun/avatars.js?v=3", "commun/ambiance.js?v=1",
  "fonts/bangers.woff2", "fonts/comic-neue-700.woff2", "qrcode.min.js", "realtime.min.js",
  "cadran/", "imposteur/", "plus-ou-moins/", "gribouillage/",
  "icones/icone-192.png", "icones/icone-512.png", "icones/icone-180.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(cles => Promise.all(cles.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Pages : internet d'abord (pour avoir la dernière version), la copie gardée si on est hors ligne.
// Le reste : la copie gardée tout de suite, mise à jour en arrière-plan pour la fois suivante.
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(rep => { if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(r, copie)); } return rep; })
      .catch(() => caches.match(r, { ignoreSearch: true }).then(g => g || caches.match("./"))));
    return;
  }
  e.respondWith(caches.open(CACHE).then(async c => {
    const garde = await c.match(r);
    const frais = fetch(r).then(rep => { if (rep && rep.ok) c.put(r, rep.clone()); return rep; }).catch(() => garde);
    return garde || frais;
  }));
});
