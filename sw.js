/* Istante 3.8.0 - complete verified offline shell; updates wait for consent. */
'use strict';
const VERSION='3.8.0';
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION+'-ec795f8a70ee';
const FILES=[
  {
    "url": "./CHANGELOG.md",
    "integrity": "sha256-bs9wuRrWmunsxoNP9wKTiZzhn/2IS16lHhE/aMf/7Gk="
  },
  {
    "url": "./README.md",
    "integrity": "sha256-id9aMsF8toeAWx7PbS2uC0vmxcH7tukbZRkJoS09xoc="
  },
  {
    "url": "./assets/css/app.css?v=3.8.0",
    "integrity": "sha256-aFnVAkNSeEWGO9B7XrCksckOwpIqabK8X8Jf6YQlO2s="
  },
  {
    "url": "./assets/css/documents.css?v=3.8.0",
    "integrity": "sha256-w30+osfEFz4kpIUwSQSM0yBdD9dbBPcs7d3AbDDQt1U="
  },
  {
    "url": "./assets/css/interactions.css?v=3.8.0",
    "integrity": "sha256-8MepLjLfIYmfrajvDlkVYRQkBTJNoHD3IlKlt1XmDL4="
  },
  {
    "url": "./assets/css/onboarding.css?v=3.8.0",
    "integrity": "sha256-AQ4H3dUnR1GsaqTsb3YB0S8u1BT74DFWXQo25fyZR5M="
  },
  {
    "url": "./assets/css/refinements.css?v=3.8.0",
    "integrity": "sha256-ie4hEuKO1al0lkVsNvOAzvs5RA8mMRfX5E8ufntSrvU="
  },
  {
    "url": "./assets/css/scene.css?v=3.8.0",
    "integrity": "sha256-DfUZpZ+I3yME216MiDOL/k5fvN2dr03DKSvP80KA9KQ="
  },
  {
    "url": "./assets/css/sharing.css?v=3.8.0",
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
    "url": "./assets/images/istante-social-v3.8.0.jpg",
    "integrity": "sha256-pHlWSJAC1qd0KYKTuEOLchRF35ISDBdjWUzdFM2TgH8="
  },
  {
    "url": "./assets/js/ambient.js?v=3.8.0",
    "integrity": "sha256-nTH7n3lmNjUC6bRBQaz3MtORLoiffPwRT3iidv8hJ/0="
  },
  {
    "url": "./assets/js/backup.js?v=3.8.0",
    "integrity": "sha256-b+gPYAOv+4na3N4/H/X2YeOAb+HQOmWWtkDyKZybl+o="
  },
  {
    "url": "./assets/js/controls.js?v=3.8.0",
    "integrity": "sha256-DfVaRPd7eFCFOELOtwGQ+zRsQB9b2R1rs75f+kuSAaY="
  },
  {
    "url": "./assets/js/core.js?v=3.8.0",
    "integrity": "sha256-wF/ZVvaoqEsgUb8XvuFgoJ+2LA/JeVI5u4tORbz2KvA="
  },
  {
    "url": "./assets/js/documents.js?v=3.8.0",
    "integrity": "sha256-AIoJJW8KoenXbHNv8C6aQldIXDbk/Le8CKbVI3WYOyY="
  },
  {
    "url": "./assets/js/effects.js?v=3.8.0",
    "integrity": "sha256-txRcwvBh/a6VHFKuvw5XZuPrWZ1Czm103qAKGAzJqq8="
  },
  {
    "url": "./assets/js/experience.js?v=3.8.0",
    "integrity": "sha256-2sZT1oCFqkeUY23vurwaD9Nn2pjnrv+Y5OapK8paTS8="
  },
  {
    "url": "./assets/js/icons.js?v=3.8.0",
    "integrity": "sha256-AZ180OtxBKxG3SAQCFvRIZO+5rPeJ0sEluBj62/FWvs="
  },
  {
    "url": "./assets/js/main.js?v=3.8.0",
    "integrity": "sha256-i9u/709R533jXZxyFULH8wQltrb/7iRGQmZGWdTdl9Y="
  },
  {
    "url": "./assets/js/moments.js?v=3.8.0",
    "integrity": "sha256-T8TzMcLg1mqiCfVR7+0Uz28OonpHKcLeabNVgt5zJQM="
  },
  {
    "url": "./assets/js/motion.js?v=3.8.0",
    "integrity": "sha256-uaJ08OCTx10XRq2Ej8bT8VFxyUtkUJHxv0iM6c0nClk="
  },
  {
    "url": "./assets/js/onboarding.js?v=3.8.0",
    "integrity": "sha256-4/r7KfV8oi9mmuVK8OpG3bjmw5wDNCbHl5vmSV6Yrak="
  },
  {
    "url": "./assets/js/phrase-history.js?v=3.8.0",
    "integrity": "sha256-HFas8jvUehChmHiYLJH5ju+pTqcH99BT617iEOO5qlI="
  },
  {
    "url": "./assets/js/radio.js?v=3.8.0",
    "integrity": "sha256-6jEDfvtzthJMkLGArpxW5nTHji83skRw3NtJYxu4W1w="
  },
  {
    "url": "./assets/js/scene.js?v=3.8.0",
    "integrity": "sha256-Dm87hKa6M3trQDsWabs+2WoImscorME8+4T4mxDJTNw="
  },
  {
    "url": "./assets/js/schedules.js?v=3.8.0",
    "integrity": "sha256-H/yt4iLNLqoPJELoramNqaV7nH+WMXu560eLsQeaxJc="
  },
  {
    "url": "./assets/js/share-card.js?v=3.8.0",
    "integrity": "sha256-DKFJhOtk8AD95zGXnxh802MpPhtmXugQuybWAD+9zJA="
  },
  {
    "url": "./assets/js/share.js?v=3.8.0",
    "integrity": "sha256-hW8esp01SIhv5lUpf7+/ziJdP4gwRWCMEOxS8F4mpF4="
  },
  {
    "url": "./assets/js/solar.js?v=3.8.0",
    "integrity": "sha256-VGRSsAaknWPX8TWTiaqN4AxevZMN6XyTxfvvPZbWY4s="
  },
  {
    "url": "./assets/js/station-library.js?v=3.8.0",
    "integrity": "sha256-+pTpXsXtsPCRcubkDYH2i9NtQKam99RCO3ifE8ocoUY="
  },
  {
    "url": "./assets/js/station-manager.js?v=3.8.0",
    "integrity": "sha256-wW/LaUINSn7vDVasQdOi4dFiD+QUU9mz3aE1YySOzRg="
  },
  {
    "url": "./assets/js/time-core.js?v=3.8.0",
    "integrity": "sha256-0yzXAFoEFgzglLF/3hIo44F53a1jAumLyBTrAJk8aOM="
  },
  {
    "url": "./assets/js/typing.js?v=3.8.0",
    "integrity": "sha256-UCBA6cDGYJaCIJsv5Zji0ZneeareFqMUovNDYxRCM94="
  },
  {
    "url": "./assets/js/updates.js?v=3.8.0",
    "integrity": "sha256-E5XYdi5OVEhaM+D/Rdd4oRMfXeZJh4X9L1ynbAfhp3w="
  },
  {
    "url": "./assets/js/weather-scene.js?v=3.8.0",
    "integrity": "sha256-aVniunIq7jKQq14g0XIgNI/uKvXJPOd/kdnQxKVQ0KE="
  },
  {
    "url": "./data/phrases.js?v=3.8.0",
    "integrity": "sha256-j/f7nkU3p9vAcYp+7e8VWDjPp7KncDUssidsObboka4="
  },
  {
    "url": "./data/stations.js?v=3.8.0",
    "integrity": "sha256-ogF3QoCghtIz8erATYiLCc8fcJ7v5RDFUrFuU4EU4CA="
  },
  {
    "url": "./docs/LICENZA.md",
    "integrity": "sha256-I4Fq0NKoJncCfwouYRbN2Zo2gT7mCV7HIqRrOx+OkZE="
  },
  {
    "url": "./docs/TERZE-PARTI.md",
    "integrity": "sha256-fpxfWGuClDlcsspHGYXZLYQFQuyieSPvRoE5bMUmQ3Q="
  },
  {
    "url": "./docs/licenses/BOOTSTRAP-ICONS-LICENSE.txt",
    "integrity": "sha256-IzP3TVP5ZT5tvN27Heb5jvzv3BhMB4kcg0ge1Oof0sE="
  },
  {
    "url": "./docs/licenses/ISTANTE-LICENSE.txt",
    "integrity": "sha256-Ktg1do9Q2jHUIx9cMXaw/SNBir9RQS0dl8VWAiZaTRc="
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
    "url": "./docs/release/v3.8.0.md",
    "integrity": "sha256-jr86HSz0+Hux7yC7uvGuaRHu0xD0sQDvc7p4hWaPDG0="
  },
  {
    "url": "./index.html",
    "integrity": "sha256-I/1rjyHP0QirIm1Tus1hkgfiLLkaBjgTtDmYzPe9AuU="
  },
  {
    "url": "./leggi.html",
    "integrity": "sha256-wTRiYz310icLY5Bmx5pSUyR0iJ93OaqsZtE0R3xf8rk="
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
