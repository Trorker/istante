/* Istante 3.4.0 - complete verified offline shell; updates wait for consent. */
'use strict';
const VERSION='3.4.0';
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION+'-835c2dc38119';
const FILES=[
  {
    "url": "./CHANGELOG.md",
    "integrity": "sha256-v59bD4VkBOxJKoyQMvhW3MnCt+tWr17cIVo1dh4/BRg="
  },
  {
    "url": "./README.md",
    "integrity": "sha256-/XIQ6/wKaDMpjDkucw6tt/EfMOifDM4MzvOc9hNf4Rc="
  },
  {
    "url": "./assets/css/app.css?v=3.4.0",
    "integrity": "sha256-zwmGkmywuj1vyy1L5J+cRukFqD9ISALzNzRZbAyLbLk="
  },
  {
    "url": "./assets/css/documents.css?v=3.4.0",
    "integrity": "sha256-w30+osfEFz4kpIUwSQSM0yBdD9dbBPcs7d3AbDDQt1U="
  },
  {
    "url": "./assets/css/interactions.css?v=3.4.0",
    "integrity": "sha256-8MepLjLfIYmfrajvDlkVYRQkBTJNoHD3IlKlt1XmDL4="
  },
  {
    "url": "./assets/css/refinements.css?v=3.4.0",
    "integrity": "sha256-ie4hEuKO1al0lkVsNvOAzvs5RA8mMRfX5E8ufntSrvU="
  },
  {
    "url": "./assets/css/sharing.css?v=3.4.0",
    "integrity": "sha256-1PFUCBrg6C0Q930Z0Ny4EeTFe1DJDUg83GKAf98fcdA="
  },
  {
    "url": "./assets/icons/icon-192.png",
    "integrity": "sha256-d58Wp49J3QnBOOMG/o6hz3fkbMw76sCV44f4De+UOM8="
  },
  {
    "url": "./assets/icons/icon-512.png",
    "integrity": "sha256-daozhsomuxqhJ6WqElY5ipbVszGiJSPy/SdhKF1bwmg="
  },
  {
    "url": "./assets/icons/icon.svg",
    "integrity": "sha256-8TEK0pdB/ha6D5W1j0mtPZsz4U5JIZqWhBYXg0SugN8="
  },
  {
    "url": "./assets/icons/social/github.svg",
    "integrity": "sha256-MFAOFFez9PqHtFk6ddySUfAoES7nZmXEaKlspwmP18E="
  },
  {
    "url": "./assets/icons/social/instagram.svg",
    "integrity": "sha256-3v0GvKp3pnjFTLs1SBHvvEPEnko+iqCLsPbtY8+Ktlg="
  },
  {
    "url": "./assets/icons/social/linkedin.svg",
    "integrity": "sha256-6xtsEpiws2tWhx63Do1RYDsV5fHZCgIC1k5ISbiErQ8="
  },
  {
    "url": "./assets/images/istante-social-v3.4.0.jpg",
    "integrity": "sha256-TMjEWujefJ8YHqThb6ZqZFJJ9eJAX7YSxP0gWyFMXrk="
  },
  {
    "url": "./assets/js/controls.js?v=3.4.0",
    "integrity": "sha256-joK6x2HHVyT3bRJdUAveRfb648x43r8mbRyK2oPYlH0="
  },
  {
    "url": "./assets/js/core.js?v=3.4.0",
    "integrity": "sha256-3idonQQo1/TOLgnEf4LU4xTpVZe6I85rDK9lgIBTXQE="
  },
  {
    "url": "./assets/js/documents.js?v=3.4.0",
    "integrity": "sha256-IwJzQ62UtrKI72IyPxHVxXLfYirUzqm2CnLGMqdYXvY="
  },
  {
    "url": "./assets/js/effects.js?v=3.4.0",
    "integrity": "sha256-txRcwvBh/a6VHFKuvw5XZuPrWZ1Czm103qAKGAzJqq8="
  },
  {
    "url": "./assets/js/experience.js?v=3.4.0",
    "integrity": "sha256-peqx2gb4Ecblw+7mkW8lYwNqnfzzg8oA+0LaUs6pGAg="
  },
  {
    "url": "./assets/js/icons.js?v=3.4.0",
    "integrity": "sha256-H2mvktAcIDQYhBOQxSvpFU+X0I7yY1eEQaGjHFiWSOM="
  },
  {
    "url": "./assets/js/main.js?v=3.4.0",
    "integrity": "sha256-9xejHJqi8N5vymOokEXsCiIXM6rLE5HHyJiVTFDUQ0E="
  },
  {
    "url": "./assets/js/moments.js?v=3.4.0",
    "integrity": "sha256-l2nzcLNVVayhzcOnlIrwsZAKO2iTtXiTnvOzz0G2ATU="
  },
  {
    "url": "./assets/js/motion.js?v=3.4.0",
    "integrity": "sha256-EYsXgVZsHUVRZFrAVOM5awdpav/T/rn4fL//FGJ6HhA="
  },
  {
    "url": "./assets/js/radio.js?v=3.4.0",
    "integrity": "sha256-kcs5Be4YdjQh26KgbfxcyVLQ3/EsXuDWV4MwMJSmBQw="
  },
  {
    "url": "./assets/js/schedules.js?v=3.4.0",
    "integrity": "sha256-H/yt4iLNLqoPJELoramNqaV7nH+WMXu560eLsQeaxJc="
  },
  {
    "url": "./assets/js/share-card.js?v=3.4.0",
    "integrity": "sha256-TzT+kqCTWW2U7+qLczE3lNLO7b8fZ3VB6GfzJ0znRJg="
  },
  {
    "url": "./assets/js/share.js?v=3.4.0",
    "integrity": "sha256-eBzH/ZbrogXZw6mz+XXz5qcDSBNr/wQ3jCTfNzfNaQ4="
  },
  {
    "url": "./assets/js/solar.js?v=3.4.0",
    "integrity": "sha256-pkx9wok4DrRL8qsXe8NRKWg942LV0Jeif0j6vnQkYHE="
  },
  {
    "url": "./assets/js/station-library.js?v=3.4.0",
    "integrity": "sha256-+pTpXsXtsPCRcubkDYH2i9NtQKam99RCO3ifE8ocoUY="
  },
  {
    "url": "./assets/js/station-manager.js?v=3.4.0",
    "integrity": "sha256-tefAkjBCZj/RX+KzAB7PO8h8tkj1HNmomzAH9qUuCBY="
  },
  {
    "url": "./assets/js/time-core.js?v=3.4.0",
    "integrity": "sha256-NvHFLiNBKi48Rgd3uXFVBgw9qi05jN7d19w7oF/uYJ4="
  },
  {
    "url": "./assets/js/typing.js?v=3.4.0",
    "integrity": "sha256-UCBA6cDGYJaCIJsv5Zji0ZneeareFqMUovNDYxRCM94="
  },
  {
    "url": "./assets/js/updates.js?v=3.4.0",
    "integrity": "sha256-ITxzf6lEURAId14R9xkLzSKnUCosxkTTA7eun+KPzOg="
  },
  {
    "url": "./data/phrases.js?v=3.4.0",
    "integrity": "sha256-vhBBwNS7hCT522LBBvzwq0cxygENUUwc/6FRszst1oQ="
  },
  {
    "url": "./data/stations.js?v=3.4.0",
    "integrity": "sha256-ogF3QoCghtIz8erATYiLCc8fcJ7v5RDFUrFuU4EU4CA="
  },
  {
    "url": "./docs/LICENZA.md",
    "integrity": "sha256-Q6gznSi5bl6bMh2OzBE0EiQvxTjJzzzb+BN84kRZN1E="
  },
  {
    "url": "./docs/TERZE-PARTI.md",
    "integrity": "sha256-iC1Xs1ys+/LZaBQL3pkoU1EiiSOq8mxS6fbnCqJMhfc="
  },
  {
    "url": "./docs/licenses/BOOTSTRAP-ICONS-LICENSE.txt",
    "integrity": "sha256-IzP3TVP5ZT5tvN27Heb5jvzv3BhMB4kcg0ge1Oof0sE="
  },
  {
    "url": "./docs/licenses/ISTANTE-LICENSE.txt",
    "integrity": "sha256-MNapEBJdQ1HgQMsFl/JnH2VWuY3QJtru7JvZMnZY/AQ="
  },
  {
    "url": "./docs/licenses/MATERIAL-ICONS-LICENSE.txt",
    "integrity": "sha256-z8d0m5b2O9McPEK1xHG/dWgUBT6EfBDz6wA0F7xSPTA="
  },
  {
    "url": "./docs/licenses/MATERIAL-ICONS-NOTICE.txt",
    "integrity": "sha256-qGa6+xeMhXZ4sSasbOeTxTtIr7nNAQwMVHitGX9mMWQ="
  },
  {
    "url": "./docs/licenses/SUNCALC-LICENSE.txt",
    "integrity": "sha256-LJgsWk3SiStt+NonyzMKybQE3T/9B6OexzTOZlx5r6U="
  },
  {
    "url": "./docs/release/v3.4.0.md",
    "integrity": "sha256-Iyfij0NgTLddiOIOsqQTrG6Rs0UgKLcaMF4OExi+BpM="
  },
  {
    "url": "./index.html",
    "integrity": "sha256-fC5TFMKBoX04FnuPxuCosyLCSX87xKBvUTFCiExCJdQ="
  },
  {
    "url": "./leggi.html",
    "integrity": "sha256-qhx6NgY6PLs9OU3BGmmsoAdCy3PDdCwWkdl+oU0AUjg="
  },
  {
    "url": "./manifest.webmanifest",
    "integrity": "sha256-SFmOPeQmF8N9xfhBpEeTjnvWjbLaR/oUWmY4xvL16eA="
  }
];
const ABS=FILES.map(f=>({...f,url:new URL(f.url,self.registration.scope).href}));
const URLS=new Set(ABS.map(f=>f.url));
self.addEventListener('install',event=>event.waitUntil((async()=>{
 try{const cache=await caches.open(CACHE);await cache.addAll(ABS.map(f=>new Request(f.url,{cache:'reload',integrity:f.integrity})));}
 catch(error){await caches.delete(CACHE);throw error;}
 // No automatic skipWaiting: the current scene continues until Update is chosen.
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const previous=(await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE);
 for(const key of previous.slice(0,-1))await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('message',event=>{
 if(event.data?.type==='SKIP_WAITING')event.waitUntil(self.skipWaiting());
 if(event.data?.type==='GET_VERSION')event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);const complete=(await Promise.all(ABS.map(f=>cache.match(f.url)))).every(Boolean);
  event.ports[0]?.postMessage({version:VERSION,complete,files:ABS.length});
 })());
});
self.addEventListener('fetch',event=>{
 const r=event.request;if(r.method!=='GET')return;
 const url=new URL(r.url),root=new URL(self.registration.scope);
 if(url.origin!==root.origin)return;
 const entry=r.mode==='navigate'&&(url.pathname===root.pathname||url.pathname===root.pathname+'index.html');
 const reader=r.mode==='navigate'&&url.pathname===root.pathname+'leggi.html';
 if(!entry&&!reader&&!URLS.has(url.href))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),key=entry?new URL('index.html',root).href:reader?new URL('leggi.html',root).href:r.url;
  const hit=await cache.match(key);if(hit)return hit;
  const spec=ABS.find(f=>f.url===key);
  try{const response=await fetch(new Request(key,{cache:'reload',integrity:spec?.integrity||''}));if(response.ok)await cache.put(key,response.clone());return response;}
  catch(_){return new Response('Risorsa non disponibile offline. Riapri Istante con una connessione.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}
 })());
});
