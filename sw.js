/* Istante 3.7.0 - complete verified offline shell; updates wait for consent. */
'use strict';
const VERSION='3.7.0';
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION+'-067d35119293';
const FILES=[
  {
    "url": "./CHANGELOG.md",
    "integrity": "sha256-c312YFbumIJTqmGaEHBLq8umZlonP6Uzid7EE5HLzrc="
  },
  {
    "url": "./README.md",
    "integrity": "sha256-dXpOpg+0DLsZSkq6/hqDjM/fzmhi4rS2q/EBYotKKtg="
  },
  {
    "url": "./assets/css/app.css?v=3.7.0",
    "integrity": "sha256-clZTSwnALiJrtMiF6cnPZZtnmIb6VchIaaEg9GYs8b0="
  },
  {
    "url": "./assets/css/documents.css?v=3.7.0",
    "integrity": "sha256-w30+osfEFz4kpIUwSQSM0yBdD9dbBPcs7d3AbDDQt1U="
  },
  {
    "url": "./assets/css/interactions.css?v=3.7.0",
    "integrity": "sha256-8MepLjLfIYmfrajvDlkVYRQkBTJNoHD3IlKlt1XmDL4="
  },
  {
    "url": "./assets/css/refinements.css?v=3.7.0",
    "integrity": "sha256-ie4hEuKO1al0lkVsNvOAzvs5RA8mMRfX5E8ufntSrvU="
  },
  {
    "url": "./assets/css/scene.css?v=3.7.0",
    "integrity": "sha256-ZLFKQ5TEbqLjsSWBuuludpWwBnV19X7dG2aH5coKbcI="
  },
  {
    "url": "./assets/css/sharing.css?v=3.7.0",
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
    "url": "./assets/images/istante-social-v3.7.0.jpg",
    "integrity": "sha256-qlaR+QWnZvnnxTQ8jQJrif/Qkpr+9Wx53VSCHHXjLKI="
  },
  {
    "url": "./assets/js/controls.js?v=3.7.0",
    "integrity": "sha256-DfVaRPd7eFCFOELOtwGQ+zRsQB9b2R1rs75f+kuSAaY="
  },
  {
    "url": "./assets/js/core.js?v=3.7.0",
    "integrity": "sha256-ADsO9J5C6i7scxsL8NyLNQ62r6mOBRzYMzpIZzPYTgo="
  },
  {
    "url": "./assets/js/documents.js?v=3.7.0",
    "integrity": "sha256-tEM7/ktHPc6AJh6zpC5E8jpjp0VV+orBmOCdO9ZUESo="
  },
  {
    "url": "./assets/js/effects.js?v=3.7.0",
    "integrity": "sha256-txRcwvBh/a6VHFKuvw5XZuPrWZ1Czm103qAKGAzJqq8="
  },
  {
    "url": "./assets/js/experience.js?v=3.7.0",
    "integrity": "sha256-3uPFSNTpL4SXxeymHy0x9RgXDCs4g2UoOmCmUEsD8rw="
  },
  {
    "url": "./assets/js/icons.js?v=3.7.0",
    "integrity": "sha256-H2mvktAcIDQYhBOQxSvpFU+X0I7yY1eEQaGjHFiWSOM="
  },
  {
    "url": "./assets/js/main.js?v=3.7.0",
    "integrity": "sha256-a6w1AsN0JoK5/Ig+kkCoYWp3nzZdQz5RyBO5/4o0/oA="
  },
  {
    "url": "./assets/js/moments.js?v=3.7.0",
    "integrity": "sha256-T8TzMcLg1mqiCfVR7+0Uz28OonpHKcLeabNVgt5zJQM="
  },
  {
    "url": "./assets/js/motion.js?v=3.7.0",
    "integrity": "sha256-EYsXgVZsHUVRZFrAVOM5awdpav/T/rn4fL//FGJ6HhA="
  },
  {
    "url": "./assets/js/phrase-history.js?v=3.7.0",
    "integrity": "sha256-HFas8jvUehChmHiYLJH5ju+pTqcH99BT617iEOO5qlI="
  },
  {
    "url": "./assets/js/radio.js?v=3.7.0",
    "integrity": "sha256-OBmiG4nrQvnudkC/pg2QuUbRzmQ/hlNA5AlwMRDWTzM="
  },
  {
    "url": "./assets/js/scene.js?v=3.7.0",
    "integrity": "sha256-pcW1ldaAa4RoTbIwWfKxvudOqcggf+do3nKrbgJGpcw="
  },
  {
    "url": "./assets/js/schedules.js?v=3.7.0",
    "integrity": "sha256-H/yt4iLNLqoPJELoramNqaV7nH+WMXu560eLsQeaxJc="
  },
  {
    "url": "./assets/js/share-card.js?v=3.7.0",
    "integrity": "sha256-BmDJq3d37h6hFOiko0I2/Z1l1XyWucpjpX3NMZtsevE="
  },
  {
    "url": "./assets/js/share.js?v=3.7.0",
    "integrity": "sha256-hW8esp01SIhv5lUpf7+/ziJdP4gwRWCMEOxS8F4mpF4="
  },
  {
    "url": "./assets/js/solar.js?v=3.7.0",
    "integrity": "sha256-VGRSsAaknWPX8TWTiaqN4AxevZMN6XyTxfvvPZbWY4s="
  },
  {
    "url": "./assets/js/station-library.js?v=3.7.0",
    "integrity": "sha256-+pTpXsXtsPCRcubkDYH2i9NtQKam99RCO3ifE8ocoUY="
  },
  {
    "url": "./assets/js/station-manager.js?v=3.7.0",
    "integrity": "sha256-wW/LaUINSn7vDVasQdOi4dFiD+QUU9mz3aE1YySOzRg="
  },
  {
    "url": "./assets/js/time-core.js?v=3.7.0",
    "integrity": "sha256-0yzXAFoEFgzglLF/3hIo44F53a1jAumLyBTrAJk8aOM="
  },
  {
    "url": "./assets/js/typing.js?v=3.7.0",
    "integrity": "sha256-UCBA6cDGYJaCIJsv5Zji0ZneeareFqMUovNDYxRCM94="
  },
  {
    "url": "./assets/js/updates.js?v=3.7.0",
    "integrity": "sha256-RYEYN3cf3amFyGdmqFJ612lxgHXWFl90Vb+ZWTilEbs="
  },
  {
    "url": "./assets/js/weather-scene.js?v=3.7.0",
    "integrity": "sha256-aVniunIq7jKQq14g0XIgNI/uKvXJPOd/kdnQxKVQ0KE="
  },
  {
    "url": "./data/phrases.js?v=3.7.0",
    "integrity": "sha256-WDq2rpwhhW+h12zcIQq9iM2fxajgt32DN1mZlKjt8+o="
  },
  {
    "url": "./data/stations.js?v=3.7.0",
    "integrity": "sha256-ogF3QoCghtIz8erATYiLCc8fcJ7v5RDFUrFuU4EU4CA="
  },
  {
    "url": "./docs/LICENZA.md",
    "integrity": "sha256-c2TFY1QtSsJxiMd/K7GXN8YHzLkVzjD1lWihoBZzIRU="
  },
  {
    "url": "./docs/TERZE-PARTI.md",
    "integrity": "sha256-4dJp9iy41l3A7r3wNHxrQ4JNoUfg2669FQz9+quWRDg="
  },
  {
    "url": "./docs/licenses/BOOTSTRAP-ICONS-LICENSE.txt",
    "integrity": "sha256-IzP3TVP5ZT5tvN27Heb5jvzv3BhMB4kcg0ge1Oof0sE="
  },
  {
    "url": "./docs/licenses/ISTANTE-LICENSE.txt",
    "integrity": "sha256-RGVIMCrNBat41eL0JSPowzIdqvLCZc4qIMlzW1JzlF0="
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
    "url": "./docs/release/v3.5.0.md",
    "integrity": "sha256-D0T7C3x/QokjyYYnpvJoPI0vmrwrxi/3HX1VI/95lfs="
  },
  {
    "url": "./docs/release/v3.6.0.md",
    "integrity": "sha256-nAEZkVdTzmlGulyMQdGGv2y88rIBDlPQrRKMy2q2qGw="
  },
  {
    "url": "./docs/release/v3.7.0.md",
    "integrity": "sha256-6iEhJJQrE2owb5qK4OrTq50wFXrgADxGX3GvrQ0dKaU="
  },
  {
    "url": "./index.html",
    "integrity": "sha256-0UpMk348cInvGsIryTCfOM/5/0U03kKl82NHnbfHkTE="
  },
  {
    "url": "./leggi.html",
    "integrity": "sha256-W3SKy0fD3tYYX0YxifDoAa7+wNhgxDzTEukpC0Qfp/w="
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
