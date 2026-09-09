/* Istante 3.12.4 - verified offline shell; updates wait for consent. */
'use strict';
const VERSION="3.12.4";
const PREFIX='istante-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION+'-d22d70af6b31';
const FILES=[
  {
    "url": "./CHANGELOG.md",
    "integrity": "sha256-JYZOXH0ywN7SRGp/hH+TmrQVsCQG87bOTznUtOCGtyY="
  },
  {
    "url": "./README.md",
    "integrity": "sha256-NHO2mivUL2nUHe4b/tbfz5Fw/hMUF3Ukm91CA2PHwcg="
  },
  {
    "url": "./assets/css/app.css?v=3.12.4",
    "integrity": "sha256-aFnVAkNSeEWGO9B7XrCksckOwpIqabK8X8Jf6YQlO2s="
  },
  {
    "url": "./assets/css/calendar.css?v=3.12.4",
    "integrity": "sha256-pmiFW+siDlrFDBYGEwm9/tHOWAb+89dtN7sbnCzg8sw="
  },
  {
    "url": "./assets/css/documents.css?v=3.12.4",
    "integrity": "sha256-w30+osfEFz4kpIUwSQSM0yBdD9dbBPcs7d3AbDDQt1U="
  },
  {
    "url": "./assets/css/evolution.css?v=3.12.4",
    "integrity": "sha256-+RhSkH7u6HgB+XgDyNlNiWvP9t6+2z1Fgtr0+D2v9fY="
  },
  {
    "url": "./assets/css/interactions.css?v=3.12.4",
    "integrity": "sha256-8MepLjLfIYmfrajvDlkVYRQkBTJNoHD3IlKlt1XmDL4="
  },
  {
    "url": "./assets/css/onboarding.css?v=3.12.4",
    "integrity": "sha256-AQ4H3dUnR1GsaqTsb3YB0S8u1BT74DFWXQo25fyZR5M="
  },
  {
    "url": "./assets/css/polish-3.10.1.css?v=3.12.4",
    "integrity": "sha256-DpPWKaakcY8r5zAt7cGYVc2J14yr8WmLYE9xHeDDjdU="
  },
  {
    "url": "./assets/css/polish-3.10.3.css?v=3.12.4",
    "integrity": "sha256-gKPIRjN9LzniljlsEk5tIdG/B6eDYtnc0DvI+uqulCQ="
  },
  {
    "url": "./assets/css/polish-3.11.1.css?v=3.12.4",
    "integrity": "sha256-s6SmC3EuequV2sRDujxiSu60IdD2iEqeCA7hy9durvk="
  },
  {
    "url": "./assets/css/polish-3.11.css?v=3.12.4",
    "integrity": "sha256-xQhb0XcpsDL8RPdLOfQKjPoDtZuqcJv4aMToagsYC2c="
  },
  {
    "url": "./assets/css/rebuild.css?v=3.12.4",
    "integrity": "sha256-7+I1/IHVLaxUjil38ea0EWI76xzxWKz+mtLc+xIufVM="
  },
  {
    "url": "./assets/css/refinements.css?v=3.12.4",
    "integrity": "sha256-ie4hEuKO1al0lkVsNvOAzvs5RA8mMRfX5E8ufntSrvU="
  },
  {
    "url": "./assets/css/scene.css?v=3.12.4",
    "integrity": "sha256-DfUZpZ+I3yME216MiDOL/k5fvN2dr03DKSvP80KA9KQ="
  },
  {
    "url": "./assets/css/sharing.css?v=3.12.4",
    "integrity": "sha256-1PFUCBrg6C0Q930Z0Ny4EeTFe1DJDUg83GKAf98fcdA="
  },
  {
    "url": "./assets/css/workspace.css?v=3.12.4",
    "integrity": "sha256-SucOOzR4hMet+GVIRyminV6RHw1Tds/BhxKSlBxNaKY="
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
    "url": "./assets/images/istante-social-v3.12.1.jpg",
    "integrity": "sha256-pHlWSJAC1qd0KYKTuEOLchRF35ISDBdjWUzdFM2TgH8="
  },
  {
    "url": "./assets/images/paper-grain.svg",
    "integrity": "sha256-zbXBjZ8ni9l2agI1s96jybKmx/bNP3hKmLASPqssDXo="
  },
  {
    "url": "./assets/js/ambient.js?v=3.12.4",
    "integrity": "sha256-OSphAoVvB4/k6AF/TANJFU1ICauFTc907GV0566ycmk="
  },
  {
    "url": "./assets/js/backup.js?v=3.12.4",
    "integrity": "sha256-LnZamu5WgV/mf94yqn/0+dmrAJvURl9nvQarvg5Dc5M="
  },
  {
    "url": "./assets/js/calendar-core.js?v=3.12.4",
    "integrity": "sha256-0PSRzkTpt6QT+HTkNXbcI9iDZxq6FkNiz9MX1TPWmrQ="
  },
  {
    "url": "./assets/js/calendar-holidays.js?v=3.12.4",
    "integrity": "sha256-XhBKagz5DeWSsE6Fj0fOxtEcuMPz9fKBLtz26cwfpq8="
  },
  {
    "url": "./assets/js/calendar-worker.js?v=3.12.4",
    "integrity": "sha256-HvlcU/yeBiO0V7dUPBzRkwww7NTjB97Mv0m5iPTlJi4="
  },
  {
    "url": "./assets/js/calendar.js?v=3.12.4",
    "integrity": "sha256-zG4YtRyXKYxTcELYFCFouLY1nS/FAs99lhPtEW0/oi4="
  },
  {
    "url": "./assets/js/collections.js?v=3.12.4",
    "integrity": "sha256-w0M46XI11e1hi6khPWc+B/L3a9WnJM7LKY7P7lBk6FY="
  },
  {
    "url": "./assets/js/companion.js?v=3.12.4",
    "integrity": "sha256-o0fN7fB6IZQ3WZmdtwvC8/Bu/c2nwnyR4Cf90rwg+9w="
  },
  {
    "url": "./assets/js/controls.js?v=3.12.4",
    "integrity": "sha256-PJreQjWgBlLYWAIzj08jK291rKhuZ5isUL+1pz9G/Zg="
  },
  {
    "url": "./assets/js/core.js?v=3.12.4",
    "integrity": "sha256-CeOXnBK/1RU41+CYNlrfF0K+DFX/aR8f8h4hF6poSmY="
  },
  {
    "url": "./assets/js/documents.js?v=3.12.4",
    "integrity": "sha256-zCO8lYwvA/LbGZZ5cSCoi8Paw0BYyTtsIno+Ytu0G68="
  },
  {
    "url": "./assets/js/effects.js?v=3.12.4",
    "integrity": "sha256-Xf9mQNZxkhqXttz2RgY6t+yfykyF50qI5MXpj9d+WTc="
  },
  {
    "url": "./assets/js/experience.js?v=3.12.4",
    "integrity": "sha256-XN3rSmu+H70G4NY8me/ysJ7GnWFHAQwUFfvmwN96Zvc="
  },
  {
    "url": "./assets/js/icons.js?v=3.12.4",
    "integrity": "sha256-ds17M9Sz24Oj2VnIrr4kUsh9DW7oUFIZRoiSaUm41mI="
  },
  {
    "url": "./assets/js/main.js?v=3.12.4",
    "integrity": "sha256-oKtgMECBzrZvNe0ZXSH3Yq1+liB0KKSBG8NbJP4r9FM="
  },
  {
    "url": "./assets/js/moments.js?v=3.12.4",
    "integrity": "sha256-b2EJ5dOk/APnodmzsarAW/lUVQqg/dk6zHOHVPD/cYY="
  },
  {
    "url": "./assets/js/motion.js?v=3.12.4",
    "integrity": "sha256-uaJ08OCTx10XRq2Ej8bT8VFxyUtkUJHxv0iM6c0nClk="
  },
  {
    "url": "./assets/js/onboarding.js?v=3.12.4",
    "integrity": "sha256-Nl+PdObASYHKgDdvz5mdIOYEi+g3wutBfwtXN+dcd1A="
  },
  {
    "url": "./assets/js/pages.js?v=3.12.4",
    "integrity": "sha256-piY5+o40IPc3xh4ZaL81bFmgmS15fk57nkDCH7fXxbI="
  },
  {
    "url": "./assets/js/phrase-history.js?v=3.12.4",
    "integrity": "sha256-HFas8jvUehChmHiYLJH5ju+pTqcH99BT617iEOO5qlI="
  },
  {
    "url": "./assets/js/qr.js?v=3.12.4",
    "integrity": "sha256-h9+XUGoIJCIzHWgWSpGkBhUkaj6Gd6ujG0KfrWnQCWs="
  },
  {
    "url": "./assets/js/radio.js?v=3.12.4",
    "integrity": "sha256-6jEDfvtzthJMkLGArpxW5nTHji83skRw3NtJYxu4W1w="
  },
  {
    "url": "./assets/js/scene-snapshot.js?v=3.12.4",
    "integrity": "sha256-ytNaUE8kU82gRKrgvL2p5ogZxaEcdlbGFqotDljv64o="
  },
  {
    "url": "./assets/js/scene.js?v=3.12.4",
    "integrity": "sha256-LIeEvTW5DHAi0ktrQlveZ0Xc8jLDWx+fgut3ngAKAlw="
  },
  {
    "url": "./assets/js/schedules.js?v=3.12.4",
    "integrity": "sha256-H/yt4iLNLqoPJELoramNqaV7nH+WMXu560eLsQeaxJc="
  },
  {
    "url": "./assets/js/share-card.js?v=3.12.4",
    "integrity": "sha256-DdtcnH3IWJH5m6wOeKJGxEyYk+HQ3u9pJYhqya29LWY="
  },
  {
    "url": "./assets/js/share-link.js?v=3.12.4",
    "integrity": "sha256-2TanCsnoLWuqepFmQZ5Bpiv0Cae5pn2NdUzCQXORRwc="
  },
  {
    "url": "./assets/js/share.js?v=3.12.4",
    "integrity": "sha256-8NsFgrUTeIKgIdy2JyT/pjDy8hCt/o78o8wx9K8MAjk="
  },
  {
    "url": "./assets/js/solar.js?v=3.12.4",
    "integrity": "sha256-VGRSsAaknWPX8TWTiaqN4AxevZMN6XyTxfvvPZbWY4s="
  },
  {
    "url": "./assets/js/station-library.js?v=3.12.4",
    "integrity": "sha256-+pTpXsXtsPCRcubkDYH2i9NtQKam99RCO3ifE8ocoUY="
  },
  {
    "url": "./assets/js/station-manager.js?v=3.12.4",
    "integrity": "sha256-/Jq2NfeNtyhVH8wQS8fKUi/FKV3I/hpGI49XHfGic1M="
  },
  {
    "url": "./assets/js/time-core.js?v=3.12.4",
    "integrity": "sha256-yWnAPi+1CXiopVFiAo2BqPpB6zbX4qCpf1gm8FFXMXA="
  },
  {
    "url": "./assets/js/tooltips.js?v=3.12.4",
    "integrity": "sha256-kr8Qi55J94NrF0Sf81nTorzZbGdwBjnD7pPaf45wPMQ="
  },
  {
    "url": "./assets/js/touch-feedback.js?v=3.12.4",
    "integrity": "sha256-a0LMj1RjnbWjy6JVN0f5jDAfi4C0HdgOy9iOn97nxkk="
  },
  {
    "url": "./assets/js/typing.js?v=3.12.4",
    "integrity": "sha256-UCBA6cDGYJaCIJsv5Zji0ZneeareFqMUovNDYxRCM94="
  },
  {
    "url": "./assets/js/updates.js?v=3.12.4",
    "integrity": "sha256-q4Ue4WcfreZy9OrHL7HOrbTgfw+6BpsB93OoJTHg4k0="
  },
  {
    "url": "./assets/js/weather-scene.js?v=3.12.4",
    "integrity": "sha256-1d94NsdzeehITi9XR9HJ3UKJ+SIsGxvJtRbMZ8Dd8vA="
  },
  {
    "url": "./calendario.html",
    "integrity": "sha256-fMpJwxJkVA239AfHX5h+ZtJKaoTP6yQLypWRvl7aE2s="
  },
  {
    "url": "./data/collection-catalog.js?v=3.12.4",
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
    "url": "./data/phrases.js?v=3.12.4",
    "integrity": "sha256-S1hjBGN9N/XT3kSrXVE5xXanUIJ2HqtUKVQnFqTmlEw="
  },
  {
    "url": "./data/stations.js?v=3.12.4",
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
    "url": "./docs/VISIONE-E-DESIGN.md",
    "integrity": "sha256-kXQFppcWPdeO/Tl1IwShtN7EUKB6o2HK3Knhj6PQeNA="
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
    "integrity": "sha256-n0cLlh0dvAD1cnx1NDYSOdyw50n6rOQEAbBg5myn70A="
  },
  {
    "url": "./docs/release/v3.10.1.md",
    "integrity": "sha256-N8oN6ElDwKILJAwkRZ0tDXumH82/HSIH7VblMBifTX8="
  },
  {
    "url": "./docs/release/v3.10.2.md",
    "integrity": "sha256-hoOyZuniTsi6iUH/SSPKeOnN2wv790gJML3xnymFTfU="
  },
  {
    "url": "./docs/release/v3.10.3.md",
    "integrity": "sha256-HHOHb6OvcqvXBqEkk6ek/8FcGP8lJuTdd/TiryvBvOk="
  },
  {
    "url": "./docs/release/v3.11.0.md",
    "integrity": "sha256-mqvQAHMkvYIhN2h6UDLLqIJfvIVYKc0wCMFIDm7fgyo="
  },
  {
    "url": "./docs/release/v3.11.1.md",
    "integrity": "sha256-w7Ih70my+LKl8Luz1wkjYLTd10rbOYnS30bq4lV6IiA="
  },
  {
    "url": "./docs/release/v3.12.0.md",
    "integrity": "sha256-eVyXTlxXUlIk1mUVN5/udYO7GPo5W5RmpAwnkkVEM8M="
  },
  {
    "url": "./docs/release/v3.12.1.md",
    "integrity": "sha256-Q3D0WLINjzke8HRoCz7RzpGmdVE1q/YeOVJ5mDcW/Jk="
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
    "integrity": "sha256-+KgQOoHwhSA+GFU8Gqvt0IlEFsHpjdBwz6ZudQ455v4="
  },
  {
    "url": "./leggi.html",
    "integrity": "sha256-E+2LHxRa6/gyZ+CNmv8goY9tAPC6K6oT8NYr/bUtfMA="
  },
  {
    "url": "./manifest.webmanifest",
    "integrity": "sha256-SFmOPeQmF8N9xfhBpEeTjnvWjbLaR/oUWmY4xvL16eA="
  },
  {
    "url": "./assets/css/polish-3.12.1.css?v=3.12.4",
    "integrity": "sha256-gtA1u5t/+mdiZ7QBENaBKWeuQ1qCzsUaDSy0ti63IG8="
  },
  {
    "url": "./assets/css/polish-3.12.2.css?v=3.12.4",
    "integrity": "sha256-x2oPkXQSI1fxgJZikah2xwqVtMbWCsIj2PpwX1HxCVc="
  },
  {
    "url": "./docs/release/v3.12.2.md",
    "integrity": "sha256-I65lDail3f9dwzzdXo07SqgyqSzMITx9iTe3dMia9z4="
  },
  {
    "url": "./assets/css/polish-3.12.4.css?v=3.12.4",
    "integrity": "sha256-QGleBSGnjdtOqa0qTaJdDMLSKzEoPKM7wWq9HaY0WFU="
  },
  {
    "url": "./docs/release/v3.12.4.md",
    "integrity": "sha256-OWGQJnzJlIwRY62zZUJzbbfdlJPKOJbNbjnN8f9PGoA="
  },
  {
    "url": "./assets/css/polish-3.12.3.css?v=3.12.4",
    "integrity": "sha256-VX8zB1+75ZX/8GIordzyZgF34cARdPOKxB+GZjG7mCI="
  },
  {
    "url": "./docs/release/v3.12.3.md",
    "integrity": "sha256-El8rvjB5mLjmHsDpzUaqt7yuhcUc2JjhjuGDt6PvhIk="
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
