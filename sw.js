/* Atomic shell version. External data/photo caches are independently controlled. */
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const VERSION=PREFIX+'original-1.2.0';
const FILES=['./icons.js?v=original-1.2','./typing.js?v=original-1.2','./effects.js?v=original-1.2','./radio.js?v=original-1.2','./refinements.css?v=original-1.2','./','./index.html','./style.css?v=original-1.2','./original.css?v=original-1.2','./core.js?v=original-1.2','./solar.js?v=original-1.2','./controls.js?v=original-1.2','./experience.js?v=original-1.2','./main.js?v=original-1.2','./data/phrases.js','./data/frasi_motivazionali_700.json','./manifest.webmanifest','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png'];
const ALLOWED=new Set(FILES.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!ALLOWED.has(event.request.url))return;
 event.respondWith((async()=>{let cache,saved;try{cache=await caches.open(VERSION);saved=await cache.match(event.request);}catch(_){}if(saved)return saved;try{const r=await fetch(event.request);if(r.ok&&cache){try{await cache.put(event.request,r.clone());}catch(_){}}return r;}catch(_){return new Response('Risorsa non ancora salvata. Apri il sito online una prima volta.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});}})());
});
