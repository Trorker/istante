const CACHE='istante-v4.0.0-alpha.1'
const CORE=['/','/index.html','/manifest.webmanifest','/version.json','/config/runtime.js','/data/phrases.json','/data/stations.json','/icons/icon.svg','/icons/icon-192.png','/icons/icon-512.png','/fonts/libre-baskerville/LibreBaskerville-VariableFont_wght.ttf','/fonts/libre-baskerville/LibreBaskerville-Italic-VariableFont_wght.ttf','/fonts/excalifont/Excalifont-Regular.woff2']
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())))
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())))
self.addEventListener('fetch',e=>{
  const r=e.request
  if(r.method!=='GET') return
  const u=new URL(r.url)
  if(u.origin!==location.origin) return
  if(u.pathname.startsWith('/config/')||u.pathname==='/version.json'){e.respondWith(fetch(r,{cache:'no-store'}).catch(()=>caches.match(r)));return}
  if(u.pathname.startsWith('/assets/')||u.pathname.startsWith('/fonts/')||u.pathname.startsWith('/icons/')||u.pathname.startsWith('/data/')){e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res})));return}
  if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match('/index.html')));return}
})
