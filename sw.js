/* Istante 4.1.0 - offline shell for Vue architecture. */
'use strict';
const VERSION="4.1.0";
const CACHE='istante-'+encodeURIComponent(self.registration.scope)+'-'+VERSION+'-b964cae4b57d';
const FILES=[
  "./index.html",
  "./leggi.html",
  "./manifest.webmanifest",
  "./version.json",
  "./config/runtime.js",
  "./vendor/vue.global.prod.js",
  "./assets/css/documents.css",
  "./assets/css/istante.css",
  "./assets/css/responsive.css",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon.svg",
  "./assets/icons/social/github.svg",
  "./assets/icons/social/instagram.svg",
  "./assets/icons/social/linkedin.svg",
  "./assets/images/istante-social-v3.11.0.jpg",
  "./assets/images/istante-social-v3.11.1.jpg",
  "./assets/images/istante-social-v3.12.0.jpg",
  "./assets/images/istante-social-v3.12.1.jpg",
  "./assets/images/paper-grain.svg",
  "./assets/js/ambient.js",
  "./assets/js/backup.js",
  "./assets/js/calendar-core.js",
  "./assets/js/calendar-holidays.js",
  "./assets/js/calendar-worker.js",
  "./assets/js/calendar.js",
  "./assets/js/collections.js",
  "./assets/js/companion.js",
  "./assets/js/controls.js",
  "./assets/js/core.js",
  "./assets/js/cursor.js",
  "./assets/js/documents.js",
  "./assets/js/effects.js",
  "./assets/js/experience.js",
  "./assets/js/gestures.js",
  "./assets/js/icons.js",
  "./assets/js/main.js",
  "./assets/js/moments.js",
  "./assets/js/motion.js",
  "./assets/js/onboarding.js",
  "./assets/js/pages.js",
  "./assets/js/phrase-history.js",
  "./assets/js/qr.js",
  "./assets/js/radio.js",
  "./assets/js/scene-snapshot.js",
  "./assets/js/scene.js",
  "./assets/js/schedules.js",
  "./assets/js/share-card.js",
  "./assets/js/share-link.js",
  "./assets/js/share.js",
  "./assets/js/solar.js",
  "./assets/js/station-library.js",
  "./assets/js/station-manager.js",
  "./assets/js/time-core.js",
  "./assets/js/tooltips.js",
  "./assets/js/touch-feedback.js",
  "./assets/js/typing.js",
  "./assets/js/updates.js",
  "./assets/js/weather-scene.js",
  "./assets/vue/istante-docs-vue.js",
  "./assets/vue/istante-vue.js",
  "./data/collection-catalog.js",
  "./data/collections/classici-10.json",
  "./data/collections/passi-nuovi-500.json",
  "./data/collections/piccole-poesie-60.json",
  "./data/phrases.js",
  "./data/stations.js"
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('istante-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  const data=event.data||{};
  if(data.type==='SKIP_WAITING'){
    self.skipWaiting();
    return;
  }
  if(data.type==='GET_VERSION'){
    const reply={version:VERSION,complete:true};
    if(event.ports&&event.ports[0]) event.ports[0].postMessage(reply);
  }
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  // Cross-origin feeds/API/radio are never stored by the service worker.
  if(url.origin!==self.location.origin) return;
  if(url.pathname.includes('/api/')) return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{
      const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res;
    }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>{
    const fresh=fetch(req).then(res=>{
      if(res&&res.ok) caches.open(CACHE).then(c=>c.put(req,res.clone()));
      return res;
    }).catch(()=>cached);
    return cached||fresh;
  }));
});
