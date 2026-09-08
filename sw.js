/* Istante 3.10.4 - complete verified offline shell; updates wait for consent. */
'use strict';
const VERSION='3.10.4';
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION+'-bb0caa6fdb5e';
const FILES=[
  {
    "url": "./CHANGELOG.md",
    "integrity": "sha256-L1ZVnTA1au6sc9efa9XrYWDtK3kGNhDgiYTZfk2vQNo="
  },
  {
    "url": "./README.md",
    "integrity": "sha256-n/o7A6ieTS5LIC26ukDehPBEAbKHFlkOGwA2p+PuvnY="
  },
  {
    "url": "./assets/css/app.css?v=3.10.4",
    "integrity": "sha256-lSyiJGzsfNAFGToTmEd7o7lS+zVW2VdZ8x7QYpWYWbE="
  },
  {
    "url": "./assets/css/calendar.css?v=3.10.4",
    "integrity": "sha256-Fyyj1xdqDw8e1J9UjkxsxPfqL2vFWg6aR/igdm8He7s="
  },
  {
    "url": "./assets/css/documents.css?v=3.10.4",
    "integrity": "sha256-w30+osfEFz4kpIUwSQSM0yBdD9dbBPcs7d3AbDDQt1U="
  },
  {
    "url": "./assets/css/evolution.css?v=3.10.4",
    "integrity": "sha256-+RhSkH7u6HgB+XgDyNlNiWvP9t6+2z1Fgtr0+D2v9fY="
  },
  {
    "url": "./assets/css/interactions.css?v=3.10.4",
    "integrity": "sha256-8MepLjLfIYmfrajvDlkVYRQkBTJNoHD3IlKlt1XmDL4="
  },
  {
    "url": "./assets/css/onboarding.css?v=3.10.4",
    "integrity": "sha256-+RRTEg1buamrOT5Lztk5/5bH9EvQjYS4c8FpxwvEOoI="
  },
  {
    "url": "./assets/css/refinements.css?v=3.10.4",
    "integrity": "sha256-+ZV+G5/C7EGi07PGbQbBXR2fkpexaMTpUwLc5n1hvtM="
  },
  {
    "url": "./assets/css/scene.css?v=3.10.4",
    "integrity": "sha256-DfUZpZ+I3yME216MiDOL/k5fvN2dr03DKSvP80KA9KQ="
  },
  {
    "url": "./assets/css/sharing.css?v=3.10.4",
    "integrity": "sha256-FJTrhrsSOd1+HA/NdayJFqxbBcrltgLpg72rKuKR5rM="
  },
  {
    "url": "./assets/css/workspace.css?v=3.10.4",
    "integrity": "sha256-4pMIzp5QMeTT2nAbzbQq3p5G4JAwstTDDgz+F1MCUWw="
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
    "url": "./assets/images/istante-social-v3.10.4.jpg",
    "integrity": "sha256-pHlWSJAC1qd0KYKTuEOLchRF35ISDBdjWUzdFM2TgH8="
  },
  {
    "url": "./assets/images/paper-grain.svg",
    "integrity": "sha256-zbXBjZ8ni9l2agI1s96jybKmx/bNP3hKmLASPqssDXo="
  },
  {
    "url": "./assets/js/ambient.js?v=3.10.4",
    "integrity": "sha256-OSphAoVvB4/k6AF/TANJFU1ICauFTc907GV0566ycmk="
  },
  {
    "url": "./assets/js/backup.js?v=3.10.4",
    "integrity": "sha256-L1VLgSTliCysBEraN3YVzKcfAJcbo23TuBzxBr8dASA="
  },
  {
    "url": "./assets/js/calendar-core.js?v=3.10.4",
    "integrity": "sha256-0PSRzkTpt6QT+HTkNXbcI9iDZxq6FkNiz9MX1TPWmrQ="
  },
  {
    "url": "./assets/js/calendar-holidays.js?v=3.10.4",
    "integrity": "sha256-ch+AHSlypIKxJ6PY3UWiV6McdR0itvGLz3hgKBeuTlo="
  },
  {
    "url": "./assets/js/calendar-worker.js?v=3.10.4",
    "integrity": "sha256-0RndHPa/jRrB+zvdj2EPgjf1UlKAwsHZ4ltejGLBnEY="
  },
  {
    "url": "./assets/js/calendar.js?v=3.10.4",
    "integrity": "sha256-woZhTpNaiNlijBf5wClzYrLjj7XoNKVvb/mvTV7YNdo="
  },
  {
    "url": "./assets/js/collections.js?v=3.10.4",
    "integrity": "sha256-D7uhXdurOKG06LQkmB8tR0qiVK/P7v2kSdeVf0Zk2tw="
  },
  {
    "url": "./assets/js/companion.js?v=3.10.4",
    "integrity": "sha256-o0fN7fB6IZQ3WZmdtwvC8/Bu/c2nwnyR4Cf90rwg+9w="
  },
  {
    "url": "./assets/js/controls.js?v=3.10.4",
    "integrity": "sha256-eeDDRIYj+E4W7htYHpvTEd5VYgoQwqi5iiupTY//rdw="
  },
  {
    "url": "./assets/js/core.js?v=3.10.4",
    "integrity": "sha256-fdkO04TN+kEdynGCX4P+znLcXZfC2garSUM+U6K1Qq4="
  },
  {
    "url": "./assets/js/documents.js?v=3.10.4",
    "integrity": "sha256-9CbaMUMPFHvEwcyhFMsKvsWt5QjcLpt5on1X51ztCbs="
  },
  {
    "url": "./assets/js/effects.js?v=3.10.4",
    "integrity": "sha256-Xf9mQNZxkhqXttz2RgY6t+yfykyF50qI5MXpj9d+WTc="
  },
  {
    "url": "./assets/js/experience.js?v=3.10.4",
    "integrity": "sha256-5pVzdK98mdRP8++xOaucql2gEKWFrP9oa+C2LCF0kxk="
  },
  {
    "url": "./assets/js/icons.js?v=3.10.4",
    "integrity": "sha256-x7NVb11DGeABuAfrSHkbWGgReras/k9+krDOQVC0A6E="
  },
  {
    "url": "./assets/js/main.js?v=3.10.4",
    "integrity": "sha256-/8narTmZ4cAydfUUOMvizWW88JDInqtjWZRw0zIqhWY="
  },
  {
    "url": "./assets/js/moments.js?v=3.10.4",
    "integrity": "sha256-b2EJ5dOk/APnodmzsarAW/lUVQqg/dk6zHOHVPD/cYY="
  },
  {
    "url": "./assets/js/motion.js?v=3.10.4",
    "integrity": "sha256-uaJ08OCTx10XRq2Ej8bT8VFxyUtkUJHxv0iM6c0nClk="
  },
  {
    "url": "./assets/js/onboarding.js?v=3.10.4",
    "integrity": "sha256-3GI2Up2vFTCVBjQl4RdXXEAR+W/5wmuDmBt3yHZ1oQs="
  },
  {
    "url": "./assets/js/pages.js?v=3.10.4",
    "integrity": "sha256-kVscfnwILeGzIDlgRmyKlSUAVFwoSlPiojfMbej4aUo="
  },
  {
    "url": "./assets/js/phrase-history.js?v=3.10.4",
    "integrity": "sha256-HFas8jvUehChmHiYLJH5ju+pTqcH99BT617iEOO5qlI="
  },
  {
    "url": "./assets/js/qr.js?v=3.10.4",
    "integrity": "sha256-h9+XUGoIJCIzHWgWSpGkBhUkaj6Gd6ujG0KfrWnQCWs="
  },
  {
    "url": "./assets/js/radio.js?v=3.10.4",
    "integrity": "sha256-6jEDfvtzthJMkLGArpxW5nTHji83skRw3NtJYxu4W1w="
  },
  {
    "url": "./assets/js/scene-snapshot.js?v=3.10.4",
    "integrity": "sha256-ytNaUE8kU82gRKrgvL2p5ogZxaEcdlbGFqotDljv64o="
  },
  {
    "url": "./assets/js/scene.js?v=3.10.4",
    "integrity": "sha256-37ebveSHbRvFN7Om1b1PgBsTKBVA+/mmrjs/Tv2VTvs="
  },
  {
    "url": "./assets/js/schedules.js?v=3.10.4",
    "integrity": "sha256-H/yt4iLNLqoPJELoramNqaV7nH+WMXu560eLsQeaxJc="
  },
  {
    "url": "./assets/js/share-card.js?v=3.10.4",
    "integrity": "sha256-DdtcnH3IWJH5m6wOeKJGxEyYk+HQ3u9pJYhqya29LWY="
  },
  {
    "url": "./assets/js/share-link.js?v=3.10.4",
    "integrity": "sha256-2TanCsnoLWuqepFmQZ5Bpiv0Cae5pn2NdUzCQXORRwc="
  },
  {
    "url": "./assets/js/share.js?v=3.10.4",
    "integrity": "sha256-8NsFgrUTeIKgIdy2JyT/pjDy8hCt/o78o8wx9K8MAjk="
  },
  {
    "url": "./assets/js/solar.js?v=3.10.4",
    "integrity": "sha256-VGRSsAaknWPX8TWTiaqN4AxevZMN6XyTxfvvPZbWY4s="
  },
  {
    "url": "./assets/js/station-library.js?v=3.10.4",
    "integrity": "sha256-+pTpXsXtsPCRcubkDYH2i9NtQKam99RCO3ifE8ocoUY="
  },
  {
    "url": "./assets/js/station-manager.js?v=3.10.4",
    "integrity": "sha256-wW/LaUINSn7vDVasQdOi4dFiD+QUU9mz3aE1YySOzRg="
  },
  {
    "url": "./assets/js/time-core.js?v=3.10.4",
    "integrity": "sha256-yWnAPi+1CXiopVFiAo2BqPpB6zbX4qCpf1gm8FFXMXA="
  },
  {
    "url": "./assets/js/typing.js?v=3.10.4",
    "integrity": "sha256-UCBA6cDGYJaCIJsv5Zji0ZneeareFqMUovNDYxRCM94="
  },
  {
    "url": "./assets/js/updates.js?v=3.10.4",
    "integrity": "sha256-5rGptV2wQv5C5JGCtGJ6OXslNLDvgIM8a7IX5N4wb5Q="
  },
  {
    "url": "./assets/js/weather-scene.js?v=3.10.4",
    "integrity": "sha256-aVniunIq7jKQq14g0XIgNI/uKvXJPOd/kdnQxKVQ0KE="
  },
  {
    "url": "./calendario.html",
    "integrity": "sha256-8okFN75a6paAn6Qr/NBqRx5DtTct/hWZxQ5t/+in/l4="
  },
  {
    "url": "./data/collection-catalog.js?v=3.10.4",
    "integrity": "sha256-UcIR0Oz/3Vg766QJdY+Uzfx4QzqghtGhseMXceIB2ts="
  },
  {
    "url": "./data/collections/classici-10.json",
    "integrity": "sha256-yDXL7jWREGetNiVY20BiLk/GQwM+2NPkwILwWukGqTQ="
  },
  {
    "url": "./data/collections/passi-nuovi-500.json",
    "integrity": "sha256-MZqp1iriiXiJza6ik+zNBNARBGokwPZQk7OnKZ3cYmA="
  },
  {
    "url": "./data/collections/piccole-poesie-60.json",
    "integrity": "sha256-lcOQFEdF35LWHEz2YMTjbM0vZYXO8sSMH+DRna+ZtFU="
  },
  {
    "url": "./data/phrases.js?v=3.10.4",
    "integrity": "sha256-Yzud8cnxyGv0CWhVo7/uf8WaKIL4Lmx2m6LtY9ES/P0="
  },
  {
    "url": "./data/stations.js?v=3.10.4",
    "integrity": "sha256-ogF3QoCghtIz8erATYiLCc8fcJ7v5RDFUrFuU4EU4CA="
  },
  {
    "url": "./docs/FONTI-CITAZIONI.md",
    "integrity": "sha256-qaF7Rfl0nm2yAwDOzbOh+jruUvUg9bPflLr7cSsfync="
  },
  {
    "url": "./docs/LICENZA.md",
    "integrity": "sha256-I4Fq0NKoJncCfwouYRbN2Zo2gT7mCV7HIqRrOx+OkZE="
  },
  {
    "url": "./docs/TERZE-PARTI.md",
    "integrity": "sha256-7fGJ4Sd3IEwpJtLop3uAw0XsrdnvA8dRIwg/yQ92I5g="
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
    "url": "./docs/licenses/PYTHON-QRCODE-LICENSE.txt",
    "integrity": "sha256-QN+5A8lO4/eJUAExMRGGVI7Lpc79NVdiPXcA4lIquZQ="
  },
  {
    "url": "./docs/licenses/SUNCALC-LICENSE.txt",
    "integrity": "sha256-LJgsWk3SiStt+NonyzMKybQE3T/9B6OexzTOZlx5r6U="
  },
  {
    "url": "./docs/licenses/UNICODE-LICENSE.txt",
    "integrity": "sha256-4njwelQt/KqqeRiW/ajV5szqs+YO9CVnYFCCdzaaPtE="
  },
  {
    "url": "./docs/release/v3.10.0.md",
    "integrity": "sha256-hMQCqrIWCcmVX9ar3jWlZECRSRxUGZvAMaltJXx4kUc="
  },
  {
    "url": "./docs/release/v3.10.1.md",
    "integrity": "sha256-lQlWff6g5CVzsRE1ix89zcdtEJ6FOy6ZatlvvQ3KBKQ="
  },
  {
    "url": "./docs/release/v3.10.2.md",
    "integrity": "sha256-jnCa8YzqSdfkOaprJvNXt34xlbaDWUP6budDsM03aC0="
  },
  {
    "url": "./docs/release/v3.10.3.md",
    "integrity": "sha256-4ye3ViHsImrkxI+tvmSfeLDk8VsCS3gb2LSYHnL18h4="
  },
  {
    "url": "./docs/release/v3.10.4.md",
    "integrity": "sha256-h9pklskfWDwPHViLSbaP7QXjptFCF4hBBAAZA2gRrYg="
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
    "url": "./docs/release/v3.9.0.md",
    "integrity": "sha256-590YEow56KkzSQvgk3mZtOCvXgpbOTqvziTQ4KzuiO4="
  },
  {
    "url": "./index.html",
    "integrity": "sha256-shdsJIdLH2Tn3WOaL6oMV2KRo1Kj3J6PviCXov3tBfc="
  },
  {
    "url": "./leggi.html",
    "integrity": "sha256-+cGxZ2fQAYdoiGLObg+kjYEtBZyMeOG4Bn0RToEsVj8="
  },
  {
    "url": "./manifest.webmanifest",
    "integrity": "sha256-SFmOPeQmF8N9xfhBpEeTjnvWjbLaR/oUWmY4xvL16eA="
  },
  {
    "url": "./version.json",
    "integrity": "sha256-b1dMr6Sn3ER28xxdBklfyDJ3hq7VR2E/W+DeSu9aTiQ="
  }
];
const ABS=FILES.map(f=>({...f,url:new URL(f.url,self.registration.scope).href}));
const URLS=new Set(ABS.map(f=>f.url));
self.addEventListener('install',event=>event.waitUntil((async()=>{
 try{const cache=await caches.open(CACHE);await cache.addAll(ABS.map(f=>new Request(f.url,{cache:'reload',integrity:f.integrity})));}
 catch(error){await caches.delete(CACHE);throw error;}
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
 const calendar=r.mode==='navigate'&&url.pathname===root.pathname+'calendario.html';
 if(!entry&&!reader&&!calendar&&!URLS.has(url.href))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),key=entry?new URL('index.html',root).href:reader?new URL('leggi.html',root).href:calendar?new URL('calendario.html',root).href:r.url;
  const hit=await cache.match(key);if(hit)return hit;
  const spec=ABS.find(f=>f.url===key);
  try{const response=await fetch(new Request(key,{cache:'reload',integrity:spec?.integrity||''}));if(response.ok)await cache.put(key,response.clone());return response;}
  catch(_){return new Response('Risorsa non disponibile offline. Riapri Istante con una connessione.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}
 })());
});
