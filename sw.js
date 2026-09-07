/* Istante v3.1.0: versioned app shell only. Streams and third-party APIs are never intercepted. */
'use strict';
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'3.1.0';
const VERSION='?v=3.1.0';
const FILES=['./','./index.html','./manifest.webmanifest',
 './assets/icons/icon.svg','./assets/icons/icon-192.png','./assets/icons/icon-512.png',
 './assets/css/app.css'+VERSION,'./data/phrases.js'+VERSION,'./data/stations.js'+VERSION,
 ...['core','solar','icons','typing','effects','radio','controls','experience','main'].map(n=>'./assets/js/'+n+'.js'+VERSION)];
const URLS=new Set(FILES.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(FILES);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const r=event.request;if(r.method!=='GET')return;const url=new URL(r.url),root=new URL(self.registration.scope);
 if(url.origin!==root.origin)return;
 const entry=r.mode==='navigate'&&(url.pathname===root.pathname||url.pathname===root.pathname+'index.html');
 if(!entry&&!URLS.has(url.href))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),key=entry?new URL('index.html',root).href:r;
  const hit=await cache.match(key);if(hit)return hit;
  try{const response=await fetch(r);if(response.ok)await cache.put(key,response.clone());return response;}catch(_){return new Response('Risorsa non disponibile offline. Riapri il sito con una connessione.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}
 })());
});
