/* Istante 3.14.0 - resilient verified update shell. */
const PREFIX='istante-';
const VERSION='3.14.0';
const STORAGE_SCHEMA=1;
const MIN_COMPATIBLE_STORAGE_SCHEMA=1;
const FORCE_UPDATE_ALLOWED=true;
const CACHE=PREFIX+VERSION;
const CORE=[{"url":"./assets/css/app.css","sha256":"25f00e1f1916b626af7c7675ee47f843a95c93024c6f8aca5b7cd32a5805348c"},{"url":"./assets/css/calendar.css","sha256":"048e5406d882d74d80c1db0b09d62c260b1adce28731bc8b36d8b2ec9fd0e908"},{"url":"./assets/css/evolution.css","sha256":"4003dbfb330977ecdcda7214883f1a239002cddd3dee865826adb21e64794467"},{"url":"./assets/css/fonts.css","sha256":"61375788fbd255509230f7fe6f6c6e58e538e5f6598ee1432b318f5357e2a66a"},{"url":"./assets/css/interactions.css","sha256":"db3f1fdc0689fee3e61e7ba181d1552ecc6f6a67d566df3b6b97002779bbd084"},{"url":"./assets/css/legacy-components.css","sha256":"671655df438ececefbd57b93ab535facb249762d5fbae4fa64d334a65b85269d"},{"url":"./assets/css/legacy-foundation.css","sha256":"930a2f4f3a3035bf82ce1a42cb7b3300abf0cd34b02cfb893366f51536daadb8"},{"url":"./assets/css/onboarding.css","sha256":"88b83cbca729cc48f159858ef788f699fe92049a6f9fb2649896fbc9fc6053a8"},{"url":"./assets/css/rebuild.css","sha256":"657a9e0b725f247b141dd6356674bf463451345a7d0459cb64a217409d8278e5"},{"url":"./assets/css/refinements.css","sha256":"7946df04baf101c662ff36e66344fb96ce894a5356e0330de35f29de95d72ac3"},{"url":"./assets/css/responsive.css","sha256":"6252ed0259a58f2092c1a3db51ec8a8f40c8dd47c355c9058f6d6082ddb67f89"},{"url":"./assets/css/scene.css","sha256":"851efab0075af101e93c51892b2e45ae0089b500dd14a3b92c58cb17469ef64b"},{"url":"./assets/css/sharing.css","sha256":"74282bebe55d1efcc2f2e5adc12d659586039148ee3ca0f81c52e6dff0e3896f"},{"url":"./assets/css/workspace.css","sha256":"96f16bbd239bf2130108f53ae6edc01030c92d64232053a9472d48b5135d9fda"},{"url":"./assets/icons/icon-192.png","sha256":"779f16a78f49dd09c138e306fe8ea1cf77e46ccc3beac095e387f80def9438cf"},{"url":"./assets/icons/icon-512.png","sha256":"75aa3386ca26bb1aa127a5aa1256398a96d5b331a22523f2fd2761285d5bc268"},{"url":"./assets/icons/icon.svg","sha256":"f1310ad29741fe16ba0f95b58f49ad3d9b33e14e49219a968416178344ae80df"},{"url":"./assets/icons/social/github.svg","sha256":"30500e1457b3f4fa87b4593a75dc9251f028112ee76665c468a96ca7098fd7c1"},{"url":"./assets/icons/social/instagram.svg","sha256":"defd06bcaa77a678c54cbb354811efbc43c49e4a3e8aa08bb0f6ed63cf8ab658"},{"url":"./assets/icons/social/linkedin.svg","sha256":"eb1b6c1298b0b36b56871eb70e8d51603b15e5f1d90a0202d64e4849b884ad0f"},{"url":"./assets/images/paper-grain.svg","sha256":"cdb5c18d9f278bd9766a0235b3dea3c9b2a6c7f6cd3f784a98b0123eab2c0d7a"},{"url":"./assets/js/ambient.js","sha256":"e612e7973496aa21e6edb3eabac196e5cff099097895299dadec68311d30c078"},{"url":"./assets/js/backup.js","sha256":"52e842d5b626d36c39d7a9bfdc4f4d8be9104f1d82986927b84152da83780b9f"},{"url":"./assets/js/calendar-core.js","sha256":"7ace334fc4a44bb1f2e9715989cdbed61b833344d5b06981a7e355ec048cafd5"},{"url":"./assets/js/calendar-holidays.js","sha256":"5e104a6a0cf90de592b04e858f47cec6d11cb8c3f3f5f2812edcf6e9cc1fa6af"},{"url":"./assets/js/calendar-worker.js","sha256":"1cf8547ca41d9af9281c1fb1158cab8089b11c79f65999d0531f94499117e24d"},{"url":"./assets/js/calendar.js","sha256":"373e2c2905c58dff0fa81962a4e238799378ec2cd73aa5a59124a8a35d2f7c3e"},{"url":"./assets/js/collections.js","sha256":"caf573ff3753a643e6e797eaaf0d9e581779a4cd20d5f2b19a5daa0725bc42b6"},{"url":"./assets/js/companion.js","sha256":"a347cdedf07a21943759999db70bc2f3f06efdcda7c27c91e027fdd2bc20fbdc"},{"url":"./assets/js/controls.js","sha256":"f8d111cb0332bb7f4c35ce08f54391d517869203baa1a7ccfb634713b8eef7af"},{"url":"./assets/js/core.js","sha256":"0af60084d7740c183cd63f249204fa5dab02fce7fef0c00cf8a918c623e3e0e5"},{"url":"./assets/js/cursor.js","sha256":"c678ddb231d882a34fd932ad6f383b37b4c55ed09fc6690eb57711b06125e29b"},{"url":"./assets/js/effects.js","sha256":"cf6f675d33b4381aff8b94b1413da45a3353be2b39f1d1cabad1be438cdd155e"},{"url":"./assets/js/experience.js","sha256":"6917a552d2567576cdb4f4b690273bbee9c8d49a412d7d15219d0719e0985c42"},{"url":"./assets/js/gestures.js","sha256":"321dbe7a0f0877379a715efae9fbfa7bb0db7a2e8df5cbb046017c80f8531d06"},{"url":"./assets/js/icons.js","sha256":"2874407b56720f01400c802567cee08892ccef663ecaf96303f0bdbb44c2dd32"},{"url":"./assets/js/main.js","sha256":"f181cc17b4649f5a4f8c8abbfc95bf5bfdf028794498cf58515310009ee33291"},{"url":"./assets/js/moments.js","sha256":"991846019c3253714bcee6d7cf5a6dc3c37a7c880a0e4b4de1d6a9a65bf58270"},{"url":"./assets/js/motion.js","sha256":"bf137615317195e87dcd5b4c201305e7c0bfc9fccefdae83c59ff8644d6c4518"},{"url":"./assets/js/onboarding.js","sha256":"75ee472a6a6741a599ce41347e5e65fb114dbeb0f6ab0a748c2b4f7f15a74d07"},{"url":"./assets/js/pages.js","sha256":"758bf72803b4b15331e241e6e5cfb8b294a64a3df3f9b9cd55643e6104686e75"},{"url":"./assets/js/phrase-history.js","sha256":"1c56acf23bd47a10a19878982c91f98eefa94ea707f7d053eb5ee210e3b9aa52"},{"url":"./assets/js/qr.js","sha256":"87df97506a082422331d68164a91a40615246a3e8677aba31b429fad69d0096b"},{"url":"./assets/js/radio.js","sha256":"c9c1734b8508589480c9025cf600d1dfb08b38a3a6e43c7d963122c46d3ad56e"},{"url":"./assets/js/scene-snapshot.js","sha256":"b3f64f3786356f5968f93e9854d986e1a670d03f7de92e3670d7d14a17eeeccd"},{"url":"./assets/js/scene.js","sha256":"f751e401cff764f62cfe3bdff58645f7cc23577c2d456ebdf3dda5014ceaa706"},{"url":"./assets/js/schedules.js","sha256":"1ffcade222cd2eaa0f2442e8ada98da9a57b9c7f96317bb9eb478bb1079ac497"},{"url":"./assets/js/share-card.js","sha256":"5ed36d365d076935539f9c892d56e3a964909a36fd596ad263a6e1ac1edee3b1"},{"url":"./assets/js/share-link.js","sha256":"d936a70ac9e82d6baa7a9166419e41a62bf409a7b9a67d8d754cc24173914707"},{"url":"./assets/js/share.js","sha256":"cb7b4075a13a7327eab8e3aa8f528bfb7e015880a79bab6e6485b5189e90ac54"},{"url":"./assets/js/solar.js","sha256":"546452b006a49d63d7f1359389aa8de00c5ebd930de97c93c5fbef3d96d6638b"},{"url":"./assets/js/station-library.js","sha256":"2e060f533edac16038b7ef74f05ec25bd0ea46ee7997751dd8f84b0dde5c60b9"},{"url":"./assets/js/station-manager.js","sha256":"063a1b4596c1562040199e7631180416d1c76b7a4c57bfb73a71768bf94826fb"},{"url":"./assets/js/time-core.js","sha256":"c969c03e2fb50978a8a55162028d81a8fa41eb36d7e2a0a97f5826f051573170"},{"url":"./assets/js/tooltips.js","sha256":"ae08fa97033ccd474fe848d164cb52ab4446b438dac45e72c5e71ac15fea3c43"},{"url":"./assets/js/touch-feedback.js","sha256":"28c75094f9fe112f7f29f6a1fcdfed53a865d6ca9c4e542f11d303f146670c53"},{"url":"./assets/js/typing.js","sha256":"502040e9c0c6609682209b2fe598e2d199de79aade16a314a2f34363144233de"},{"url":"./assets/js/updates.js","sha256":"1b101607dc9a854edfeaca4defa664bfccc25ebf44f98ec251b2c46e23580755"},{"url":"./assets/js/weather-scene.js","sha256":"d5df7836c77379e8484e2f5747d1c9dd4289f9222c1b1bc9b516cc67c0ddf2f0"},{"url":"./data/collection-catalog.js","sha256":"51c211d0ecffdd583beba409758f94cdfc78433aa086d1a1b1e31771e201dadb"},{"url":"./data/phrases.js","sha256":"4b586304637d37f5d3de44ab5d5139c576a75082761eab5429542716a4e6944c"},{"url":"./data/stations.js","sha256":"a201774280a086d233f1eac04d888b09cf1f709eefe510c552b16e538114e020"},{"url":"./index.html","sha256":"753d15607b5e023c043c8e60a8af6995342236293817ec3621381e01f1e6090d"},{"url":"./manifest.webmanifest","sha256":"48598e3de42617c37dc5f841a447938e7bd68db2da47fa145a6638c6f2f5e9e0"},{"url":"./version.json","sha256":"05a6fbb9425c7caaa9a13e7e61f549f822091795e661dddf2a86fd26bee29899"}];
const OPTIONAL=["./leggi.html","./README.md","./CHANGELOG.md","./docs/release/v3.14.0.md","./docs/LICENZA.md","./docs/TERZE-PARTI.md","./docs/VISIONE-E-DESIGN.md","./assets/css/documents.css","./assets/js/documents.js","./assets/vendor/fonts/excalifont/NOTICE.md","./assets/vendor/fonts/libre-baskerville/NOTICE.md"];
const scope=new URL(self.registration.scope);
const coreSpecs=CORE.map(spec=>({...spec,abs:new URL(spec.url,scope).href}));
const coreByPath=new Map(coreSpecs.map(spec=>[new URL(spec.abs).pathname,spec]));
let preparing=null;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function hex(buffer){return [...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,'0')).join('');}
async function fetchVerified(spec,attempt=0){
 const network=new URL(spec.abs);network.searchParams.set('__istante_update',VERSION+'-'+attempt+'-'+Date.now());
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6500);
 try{
  const response=await fetch(new Request(network.href,{cache:'no-store',credentials:'same-origin',redirect:'follow',signal:controller.signal}));
  if(!response.ok)throw Error('HTTP '+response.status);
  const digest=hex(await crypto.subtle.digest('SHA-256',await response.clone().arrayBuffer()));
  if(digest!==spec.sha256)throw Error('integrity');
  return response;
 }finally{clearTimeout(timer);}
}
async function missingCore(cache){const missing=[];for(const spec of coreSpecs)if(!(await cache.match(spec.abs)))missing.push(spec);return missing;}
async function prepareCore(attempts=4){
 const cache=await caches.open(CACHE);let missing=await missingCore(cache);
 const waits=[0,1000,3000,6500,10000];
 for(let attempt=0;missing.length&&attempt<attempts;attempt++){
  if(waits[attempt])await sleep(waits[attempt]);
  for(let i=0;i<missing.length;i+=6){
   const batch=missing.slice(i,i+6);
   await Promise.allSettled(batch.map(async spec=>{try{const response=await fetchVerified(spec,attempt);await cache.put(spec.abs,response);}catch(_){}}));
  }
  missing=await missingCore(cache);
 }
 return{complete:missing.length===0,missing:missing.length,missingFiles:missing.map(x=>x.url),files:coreSpecs.length};
}
function runPrepare(attempts=4){if(preparing)return preparing;preparing=prepareCore(attempts).finally(()=>{preparing=null;});return preparing;}
async function coreStatus(){const cache=await caches.open(CACHE),missing=await missingCore(cache);return{complete:missing.length===0,missing:missing.length,missingFiles:missing.map(x=>x.url),files:coreSpecs.length};}
async function seedOptional(){
 const cache=await caches.open(CACHE);
 await Promise.allSettled(OPTIONAL.map(async rel=>{const canonical=new URL(rel,scope).href;if(await cache.match(canonical))return;try{const url=new URL(canonical);url.searchParams.set('__istante_optional',VERSION);const response=await fetch(new Request(url.href,{cache:'no-store',credentials:'same-origin'}));if(response.ok)await cache.put(canonical,response);}catch(_){}}));
}
self.addEventListener('install',event=>event.waitUntil((async()=>{await runPrepare(4);await seedOptional();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
function info(status){return{version:VERSION,...status,storageSchema:STORAGE_SCHEMA,minCompatibleStorageSchema:MIN_COMPATIBLE_STORAGE_SCHEMA,forceUpdateAllowed:FORCE_UPDATE_ALLOWED};}
self.addEventListener('message',event=>{
 const type=event.data?.type;
 if(type==='GET_VERSION')event.waitUntil((async()=>{let status=await coreStatus();if(!status.complete){const task=runPrepare(1);status=await Promise.race([task,sleep(2100).then(()=>coreStatus())]);}event.ports[0]?.postMessage(info(status));})());
 if(type==='PREPARE_UPDATE')event.waitUntil((async()=>{const status=await runPrepare(4);event.ports[0]?.postMessage(info(status));})());
 if(type==='SKIP_WAITING')event.waitUntil((async()=>{const status=await coreStatus();if(!status.complete){event.ports[0]?.postMessage({ok:false,reason:'La nuova copia non è ancora completa. Riprova tra poco.',...info(status)});return;}const clientSchema=Number(event.data?.clientStorageSchema||1),incompatible=clientSchema<MIN_COMPATIBLE_STORAGE_SCHEMA;if(incompatible&&!event.data?.force){event.ports[0]?.postMessage({ok:false,reason:'La nuova versione richiede una configurazione più recente. Puoi scegliere Aggiorna comunque.',...info(status)});return;}event.ports[0]?.postMessage({ok:true,...info(status)});await self.skipWaiting();})());
});
function managedRuntime(url){const rel=url.pathname.slice(scope.pathname.length);return rel==='leggi.html'||rel==='README.md'||rel==='CHANGELOG.md'||rel==='assets/js/documents.js'||rel==='assets/css/documents.css'||rel.startsWith('docs/')||rel.startsWith('data/collections/')||rel.startsWith('assets/vendor/fonts/');}
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(url.pathname===new URL('./version.json',scope).pathname&&url.searchParams.has('check'))return;
 const indexPath=new URL('./index.html',scope).pathname,rootPath=scope.pathname,readerPath=new URL('./leggi.html',scope).pathname;
 const isIndex=request.mode==='navigate'&&(url.pathname===rootPath||url.pathname===indexPath);
 const isReader=request.mode==='navigate'&&url.pathname===readerPath;
 const spec=coreByPath.get(url.pathname);
 if(!isIndex&&!isReader&&!spec&&!managedRuntime(url))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const key=isIndex?new URL('./index.html',scope).href:isReader?new URL('./leggi.html',scope).href:spec?.abs||new URL(url.pathname,scope.origin).href;
  const hit=await cache.match(key);if(hit)return hit;
  try{
   let response;
   if(spec)response=await fetchVerified(spec,0);else response=await fetch(new Request(request,{cache:'no-store'}));
   if(response.ok)await cache.put(key,response.clone());
   return response;
  }catch(_){
   if(request.mode==='navigate'){const fallback=await cache.match(new URL('./index.html',scope).href);if(fallback)return fallback;}
   return new Response('Risorsa non disponibile offline. Riapri Istante con una connessione.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
 })());
});
