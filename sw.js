/* Istante 3.14.6 - resilient shell with user-first updates and a 3-day deadline. */
const PREFIX='istante-';
const VERSION='3.14.6';
const STORAGE_SCHEMA=1;
const MIN_COMPATIBLE_STORAGE_SCHEMA=1;
const FORCE_UPDATE_ALLOWED=true;
const AUTO_ACTIVATE=false;
const AUTO_UPDATE_DELAY_MS=3*24*60*60*1000;
const CACHE=PREFIX+VERSION;
const CORE=[{"url":"./assets/css/app.css","sha256":"25f00e1f1916b626af7c7675ee47f843a95c93024c6f8aca5b7cd32a5805348c"},{"url":"./assets/css/calendar.css","sha256":"fb040840d97c6c4cacac8e369e8714c6708d83e77966b45fb0c9796b16476fc7"},{"url":"./assets/css/evolution.css","sha256":"4003dbfb330977ecdcda7214883f1a239002cddd3dee865826adb21e64794467"},{"url":"./assets/css/fonts.css","sha256":"61375788fbd255509230f7fe6f6c6e58e538e5f6598ee1432b318f5357e2a66a"},{"url":"./assets/css/interactions.css","sha256":"db3f1fdc0689fee3e61e7ba181d1552ecc6f6a67d566df3b6b97002779bbd084"},{"url":"./assets/css/legacy-components.css","sha256":"6688980c89e40e345a0812b417b1725a10992825cd1ad9cf7c0c93333a13b6d2"},{"url":"./assets/css/legacy-foundation.css","sha256":"6f16d3707272860f3c871b767aeceeb422dc5816c76574a27f368fefc8cb5f90"},{"url":"./assets/css/onboarding.css","sha256":"88b83cbca729cc48f159858ef788f699fe92049a6f9fb2649896fbc9fc6053a8"},{"url":"./assets/css/rebuild.css","sha256":"3037e793bc728e938561c61078f103db59049ba3e0e1657e6c5d651654fc0441"},{"url":"./assets/css/refinements.css","sha256":"7946df04baf101c662ff36e66344fb96ce894a5356e0330de35f29de95d72ac3"},{"url":"./assets/css/responsive.css","sha256":"7873b420671f27c324cd88b31cf9219840f23256b45556efe7a215a3ded9ccc6"},{"url":"./assets/css/scene.css","sha256":"851efab0075af101e93c51892b2e45ae0089b500dd14a3b92c58cb17469ef64b"},{"url":"./assets/css/sharing.css","sha256":"74282bebe55d1efcc2f2e5adc12d659586039148ee3ca0f81c52e6dff0e3896f"},{"url":"./assets/css/workspace.css","sha256":"64bc32bc999511de17a301a1ec781a1d679e32d07a74e9febd95aa106c0b96ae"},{"url":"./assets/icons/icon-192.png","sha256":"779f16a78f49dd09c138e306fe8ea1cf77e46ccc3beac095e387f80def9438cf"},{"url":"./assets/icons/icon-512.png","sha256":"75aa3386ca26bb1aa127a5aa1256398a96d5b331a22523f2fd2761285d5bc268"},{"url":"./assets/icons/icon.svg","sha256":"f1310ad29741fe16ba0f95b58f49ad3d9b33e14e49219a968416178344ae80df"},{"url":"./assets/icons/social/github.svg","sha256":"30500e1457b3f4fa87b4593a75dc9251f028112ee76665c468a96ca7098fd7c1"},{"url":"./assets/icons/social/instagram.svg","sha256":"defd06bcaa77a678c54cbb354811efbc43c49e4a3e8aa08bb0f6ed63cf8ab658"},{"url":"./assets/icons/social/linkedin.svg","sha256":"eb1b6c1298b0b36b56871eb70e8d51603b15e5f1d90a0202d64e4849b884ad0f"},{"url":"./assets/images/paper-grain.svg","sha256":"cdb5c18d9f278bd9766a0235b3dea3c9b2a6c7f6cd3f784a98b0123eab2c0d7a"},{"url":"./assets/js/ambient.js","sha256":"e612e7973496aa21e6edb3eabac196e5cff099097895299dadec68311d30c078"},{"url":"./assets/js/backup.js","sha256":"4ba1ee33f6aa3f8dbc94bdcfbf411b0487f85113d73fe4672c7435979f998cd8"},{"url":"./assets/js/calendar-core.js","sha256":"7ace334fc4a44bb1f2e9715989cdbed61b833344d5b06981a7e355ec048cafd5"},{"url":"./assets/js/calendar-holidays.js","sha256":"5e104a6a0cf90de592b04e858f47cec6d11cb8c3f3f5f2812edcf6e9cc1fa6af"},{"url":"./assets/js/calendar-worker.js","sha256":"2084bc9888d40ac4bb93f3db026666271a97c427341a4cef44a9c8f276e7ca68"},{"url":"./assets/js/calendar.js","sha256":"75108da54d436a0d4ef9f0337e5ea6f861dc63f6b3fdd1bba08485c0bc95fd9d"},{"url":"./assets/js/collections.js","sha256":"caf573ff3753a643e6e797eaaf0d9e581779a4cd20d5f2b19a5daa0725bc42b6"},{"url":"./assets/js/companion.js","sha256":"a347cdedf07a21943759999db70bc2f3f06efdcda7c27c91e027fdd2bc20fbdc"},{"url":"./assets/js/controls.js","sha256":"f8d111cb0332bb7f4c35ce08f54391d517869203baa1a7ccfb634713b8eef7af"},{"url":"./assets/js/core.js","sha256":"0af60084d7740c183cd63f249204fa5dab02fce7fef0c00cf8a918c623e3e0e5"},{"url":"./assets/js/cursor.js","sha256":"c678ddb231d882a34fd932ad6f383b37b4c55ed09fc6690eb57711b06125e29b"},{"url":"./assets/js/effects.js","sha256":"cf6f675d33b4381aff8b94b1413da45a3353be2b39f1d1cabad1be438cdd155e"},{"url":"./assets/js/experience.js","sha256":"6917a552d2567576cdb4f4b690273bbee9c8d49a412d7d15219d0719e0985c42"},{"url":"./assets/js/gestures.js","sha256":"321dbe7a0f0877379a715efae9fbfa7bb0db7a2e8df5cbb046017c80f8531d06"},{"url":"./assets/js/icons.js","sha256":"2874407b56720f01400c802567cee08892ccef663ecaf96303f0bdbb44c2dd32"},{"url":"./assets/js/main.js","sha256":"f6a26d1e80dd9a453b159fa2cc0b8d7b5d113d7c4dc414fc42d56921cf1ab861"},{"url":"./assets/js/moments.js","sha256":"991846019c3253714bcee6d7cf5a6dc3c37a7c880a0e4b4de1d6a9a65bf58270"},{"url":"./assets/js/motion.js","sha256":"bf137615317195e87dcd5b4c201305e7c0bfc9fccefdae83c59ff8644d6c4518"},{"url":"./assets/js/onboarding.js","sha256":"75ee472a6a6741a599ce41347e5e65fb114dbeb0f6ab0a748c2b4f7f15a74d07"},{"url":"./assets/js/pages.js","sha256":"758bf72803b4b15331e241e6e5cfb8b294a64a3df3f9b9cd55643e6104686e75"},{"url":"./assets/js/phrase-history.js","sha256":"1c56acf23bd47a10a19878982c91f98eefa94ea707f7d053eb5ee210e3b9aa52"},{"url":"./assets/vendor/js/qrcode-engine.js","sha256":"87df97506a082422331d68164a91a40615246a3e8677aba31b429fad69d0096b"},{"url":"./assets/js/radio.js","sha256":"c9c1734b8508589480c9025cf600d1dfb08b38a3a6e43c7d963122c46d3ad56e"},{"url":"./assets/js/scene-snapshot.js","sha256":"b3f64f3786356f5968f93e9854d986e1a670d03f7de92e3670d7d14a17eeeccd"},{"url":"./assets/js/scene.js","sha256":"f751e401cff764f62cfe3bdff58645f7cc23577c2d456ebdf3dda5014ceaa706"},{"url":"./assets/js/schedules.js","sha256":"1ffcade222cd2eaa0f2442e8ada98da9a57b9c7f96317bb9eb478bb1079ac497"},{"url":"./assets/js/share-card.js","sha256":"5ed36d365d076935539f9c892d56e3a964909a36fd596ad263a6e1ac1edee3b1"},{"url":"./assets/js/share-link.js","sha256":"d936a70ac9e82d6baa7a9166419e41a62bf409a7b9a67d8d754cc24173914707"},{"url":"./assets/js/share.js","sha256":"cb7b4075a13a7327eab8e3aa8f528bfb7e015880a79bab6e6485b5189e90ac54"},{"url":"./assets/vendor/js/suncalc-solar.js","sha256":"546452b006a49d63d7f1359389aa8de00c5ebd930de97c93c5fbef3d96d6638b"},{"url":"./assets/js/station-library.js","sha256":"2e060f533edac16038b7ef74f05ec25bd0ea46ee7997751dd8f84b0dde5c60b9"},{"url":"./assets/js/station-manager.js","sha256":"063a1b4596c1562040199e7631180416d1c76b7a4c57bfb73a71768bf94826fb"},{"url":"./assets/js/time-core.js","sha256":"c969c03e2fb50978a8a55162028d81a8fa41eb36d7e2a0a97f5826f051573170"},{"url":"./assets/js/tooltips.js","sha256":"ae08fa97033ccd474fe848d164cb52ab4446b438dac45e72c5e71ac15fea3c43"},{"url":"./assets/js/touch-feedback.js","sha256":"28c75094f9fe112f7f29f6a1fcdfed53a865d6ca9c4e542f11d303f146670c53"},{"url":"./assets/js/typing.js","sha256":"502040e9c0c6609682209b2fe598e2d199de79aade16a314a2f34363144233de"},{"url":"./assets/js/updates.js","sha256":"9adb18fb644b92131e36a8b9f8da1939cb65d7e3f3169c083e9409db91269334"},{"url":"./assets/js/weather-scene.js","sha256":"d5df7836c77379e8484e2f5747d1c9dd4289f9222c1b1bc9b516cc67c0ddf2f0"},{"url":"./data/collection-catalog.js","sha256":"51c211d0ecffdd583beba409758f94cdfc78433aa086d1a1b1e31771e201dadb"},{"url":"./data/phrases.js","sha256":"4b586304637d37f5d3de44ab5d5139c576a75082761eab5429542716a4e6944c"},{"url":"./data/stations.js","sha256":"a201774280a086d233f1eac04d888b09cf1f709eefe510c552b16e538114e020"},{"url":"./index.html","sha256":"1f219e588dbb99d94d3dda356df980076f42e21c696b2b50b59bcefba7e92542"},{"url":"./manifest.webmanifest","sha256":"48598e3de42617c37dc5f841a447938e7bd68db2da47fa145a6638c6f2f5e9e0"},{"url":"./version.json","sha256":"5fc73255ac8a06616d62b0d7c3a05692911ef1bb9d691dd99a234403ec0117c4"}];
const OPTIONAL=["./leggi.html","./README.md","./CHANGELOG.md","./docs/release/v3.14.6.md","./docs/LICENZA.md","./docs/TERZE-PARTI.md","./docs/VISIONE-E-DESIGN.md","./assets/css/documents.css","./assets/js/documents.js","./assets/vendor/fonts/excalifont/Excalifont-Regular.woff2","./assets/vendor/fonts/libre-baskerville/LibreBaskerville-VariableFont_wght.ttf","./assets/vendor/fonts/libre-baskerville/LibreBaskerville-Italic-VariableFont_wght.ttf","./assets/vendor/fonts/excalifont/NOTICE.md","./assets/vendor/fonts/libre-baskerville/NOTICE.md","./assets/vendor/js/README.md"];
const scope=new URL(self.registration.scope);
const coreSpecs=CORE.map(spec=>({...spec,abs:new URL(spec.url,scope).href}));
const coreByPath=new Map(coreSpecs.map(spec=>[new URL(spec.abs).pathname,spec]));
const legacyGetHistory=new Map();
let preparing=null;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function hex(buffer){return [...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,'0')).join('');}
function markerFor(spec){const u=new URL('./__istante_verified__',scope);u.searchParams.set('v',VERSION);u.searchParams.set('f',spec.url);return u.href;}
function detectedMarker(){const u=new URL('./__istante_update_detected__',scope);u.searchParams.set('v',VERSION);return u.href;}
async function ensureDetectedAt(){
 const cache=await caches.open(CACHE),key=detectedMarker();
 const hit=await cache.match(key);
 if(hit){const n=Number(await hit.text());if(Number.isFinite(n)&&n>0)return n;}
 const now=Date.now();await cache.put(key,new Response(String(now),{headers:{'Content-Type':'text/plain','Cache-Control':'no-store'}}));return now;
}
async function fetchNetwork(spec,attempt=0){
 const network=new URL(spec.abs);network.searchParams.set('__istante_update',VERSION+'-'+attempt+'-'+Date.now());
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
 try{
  const response=await fetch(new Request(network.href,{cache:'no-store',credentials:'same-origin',redirect:'follow',signal:controller.signal,headers:{'Cache-Control':'no-cache'}}));
  if(!response.ok)throw Error('HTTP '+response.status);
  const digest=hex(await crypto.subtle.digest('SHA-256',await response.clone().arrayBuffer()));
  return{response,verified:digest===spec.sha256};
 }finally{clearTimeout(timer);}
}
async function cacheSpec(cache,spec,attempt=0){
 const {response,verified}=await fetchNetwork(spec,attempt);
 await cache.put(spec.abs,response.clone());
 if(verified)await cache.put(markerFor(spec),new Response('ok',{headers:{'Content-Type':'text/plain','Cache-Control':'no-store'}}));
 else await cache.delete(markerFor(spec));
 return verified;
}
async function rawCoreStatus(){
 const cache=await caches.open(CACHE),missing=[],unverified=[];
 for(const spec of coreSpecs){
  const hit=await cache.match(spec.abs);
  if(!hit){missing.push(spec);continue;}
  if(!(await cache.match(markerFor(spec))))unverified.push(spec);
 }
 return{cache,missing,unverified};
}
async function prepareCore(attempts=3){
 let state=await rawCoreStatus();const waits=[0,700,1800,4000,7000];
 for(let attempt=0;attempt<attempts&&(state.missing.length||state.unverified.length);attempt++){
  if(waits[attempt])await sleep(waits[attempt]);
  const targets=[...new Map([...state.missing,...state.unverified].map(spec=>[spec.url,spec])).values()];
  for(let i=0;i<targets.length;i+=6)await Promise.allSettled(targets.slice(i,i+6).map(spec=>cacheSpec(state.cache,spec,attempt)));
  state=await rawCoreStatus();
 }
 return{missing:state.missing.length,unverified:state.unverified.length,missingFiles:state.missing.map(x=>x.url),unverifiedFiles:state.unverified.map(x=>x.url),files:coreSpecs.length};
}
function runPrepare(attempts=3){if(preparing)return preparing;preparing=prepareCore(attempts).finally(()=>{preparing=null;});return preparing;}
async function coreStatus(){const state=await rawCoreStatus();return{missing:state.missing.length,unverified:state.unverified.length,missingFiles:state.missing.map(x=>x.url),unverifiedFiles:state.unverified.map(x=>x.url),files:coreSpecs.length};}
async function seedOptional(){
 const cache=await caches.open(CACHE);
 await Promise.allSettled(OPTIONAL.map(async rel=>{
  const canonical=new URL(rel,scope).href;if(await cache.match(canonical))return;
  try{const url=new URL(canonical);url.searchParams.set('__istante_optional',VERSION+'-'+Date.now());const response=await fetch(new Request(url.href,{cache:'no-store',credentials:'same-origin',headers:{'Cache-Control':'no-cache'}}));if(response.ok)await cache.put(canonical,response);}catch(_){}
 }));
}
function parseVersion(key){return key.slice(PREFIX.length).split('.').map(n=>Number(n)||0);}
function compareVersions(a,b){const aa=parseVersion(a),bb=parseVersion(b);for(let i=0;i<Math.max(aa.length,bb.length);i++){const d=(aa[i]||0)-(bb[i]||0);if(d)return d;}return 0;}
async function trimOldCaches(){const old=(await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE).sort((a,b)=>compareVersions(b,a));await Promise.all(old.slice(1).map(k=>caches.delete(k)));return old.slice(0,1);}
async function previousCacheNames(){return (await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE).sort((a,b)=>compareVersions(b,a));}
async function previousHit(key){for(const name of await previousCacheNames()){const hit=await (await caches.open(name)).match(key);if(hit)return hit;}return null;}
async function buildInfo(status){
 const detectedAt=await ensureDetectedAt(),missing=Number(status?.missing||0),unverified=Number(status?.unverified||0);
 return{version:VERSION,complete:true,activationReady:true,cacheComplete:missing===0,verified:missing===0&&unverified===0,missing,unverified,missingFiles:status?.missingFiles||[],unverifiedFiles:status?.unverifiedFiles||[],files:status?.files||coreSpecs.length,storageSchema:STORAGE_SCHEMA,minCompatibleStorageSchema:MIN_COMPATIBLE_STORAGE_SCHEMA,forceUpdateAllowed:FORCE_UPDATE_ALLOWED,autoActivate:AUTO_ACTIVATE,autoUpdateDelayMs:AUTO_UPDATE_DELAY_MS,detectedAt};
}
function trackLegacyGet(event){
 if(event.data?.clientVersion)return;
 const id=event.source?.id||'legacy',now=Date.now(),recent=(legacyGetHistory.get(id)||[]).filter(t=>now-t<12000);recent.push(now);legacyGetHistory.set(id,recent);
}
function legacyLooksAutomatic(event){
 const id=event.source?.id||'legacy',now=Date.now(),recent=(legacyGetHistory.get(id)||[]).filter(t=>now-t<12000);legacyGetHistory.set(id,recent);return recent.length>=2;
}
self.addEventListener('install',event=>event.waitUntil((async()=>{try{await ensureDetectedAt();await runPrepare(2);}catch(_){}if(AUTO_ACTIVATE)await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await trimOldCaches();await self.clients.claim();try{await runPrepare(1);}catch(_){}try{await Promise.race([seedOptional(),sleep(2500)]);}catch(_){}})()));
self.addEventListener('message',event=>{
 const type=event.data?.type;
 if(type==='GET_VERSION')event.waitUntil((async()=>{trackLegacyGet(event);let status=await coreStatus();if(status.missing||status.unverified){const task=runPrepare(1);status=await Promise.race([task,sleep(1800).then(()=>coreStatus())]);}event.ports[0]?.postMessage(await buildInfo(status));})());
 if(type==='PREPARE_UPDATE')event.waitUntil((async()=>{let status;try{status=await runPrepare(3);}catch(_){status=await coreStatus();}event.ports[0]?.postMessage(await buildInfo(status));})());
 if(type==='SKIP_WAITING')event.waitUntil((async()=>{
  const status=await coreStatus(),info=await buildInfo(status),clientSchema=Number(event.data?.clientStorageSchema||1),incompatible=clientSchema<MIN_COMPATIBLE_STORAGE_SCHEMA;
  const age=Math.max(0,Date.now()-Number(info.detectedAt||Date.now())),deadlineReached=age>=AUTO_UPDATE_DELAY_MS;
  const activation=String(event.data?.activation||'');
  const modernClient=!!event.data?.clientVersion;
  if(incompatible&&!event.data?.force){event.ports[0]?.postMessage({ok:false,reason:'La nuova versione può modificare alcune preferenze. Conferma Aggiorna comunque per proseguire.',...info});return;}
  if(modernClient&&activation==='deadline'&&!deadlineReached){event.ports[0]?.postMessage({ok:false,reason:'L’aggiornamento automatico partirà dopo 3 giorni dalla prima rilevazione.',...info});return;}
  if(!modernClient&&legacyLooksAutomatic(event)&&!deadlineReached){legacyGetHistory.set(event.source?.id||'legacy',[]);event.ports[0]?.postMessage({ok:false,reason:'Nuova versione disponibile. Aggiorna quando vuoi; dopo 3 giorni partirà automaticamente.',...info});return;}
  event.ports[0]?.postMessage({ok:true,...info});await self.skipWaiting();
 })());
});
function managedRuntime(url){const rel=url.pathname.slice(scope.pathname.length);return rel==='leggi.html'||rel==='README.md'||rel==='CHANGELOG.md'||rel==='assets/js/documents.js'||rel==='assets/css/documents.css'||rel.startsWith('docs/')||rel.startsWith('data/collections/')||rel.startsWith('assets/vendor/');}
async function serveCore(spec,request){
 const cache=await caches.open(CACHE),hit=await cache.match(spec.abs),verified=!!(hit&&await cache.match(markerFor(spec)));
 if(verified)return hit;
 try{const result=await fetchNetwork(spec,0);await cache.put(spec.abs,result.response.clone());if(result.verified)await cache.put(markerFor(spec),new Response('ok'));else await cache.delete(markerFor(spec));return result.response;}catch(_){}
 if(hit)return hit;const previous=await previousHit(spec.abs);if(previous)return previous;
 if(request.mode==='navigate'){const fallback=await cache.match(new URL('./index.html',scope).href)||await previousHit(new URL('./index.html',scope).href);if(fallback)return fallback;}
 return new Response('Risorsa temporaneamente non disponibile. Riprova con una connessione attiva.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(url.pathname===new URL('./version.json',scope).pathname&&url.searchParams.has('check'))return;
 const indexPath=new URL('./index.html',scope).pathname,rootPath=scope.pathname,readerPath=new URL('./leggi.html',scope).pathname;
 const isIndex=request.mode==='navigate'&&(url.pathname===rootPath||url.pathname===indexPath),isReader=request.mode==='navigate'&&url.pathname===readerPath;
 const spec=isIndex?coreByPath.get(indexPath):coreByPath.get(url.pathname);
 if(!isIndex&&!isReader&&!spec&&!managedRuntime(url))return;
 event.respondWith((async()=>{
  if(spec)return serveCore(spec,request);
  const cache=await caches.open(CACHE),key=isReader?new URL('./leggi.html',scope).href:new URL(url.pathname,scope.origin).href;
  const hit=await cache.match(key);if(hit)return hit;
  try{const response=await fetch(new Request(request,{cache:'no-store'}));if(response.ok)await cache.put(key,response.clone());return response;}catch(_){}
  const previous=await previousHit(key);if(previous)return previous;
  if(request.mode==='navigate'){const fallback=await cache.match(new URL('./index.html',scope).href)||await previousHit(new URL('./index.html',scope).href);if(fallback)return fallback;}
  return new Response('Risorsa non disponibile offline. Riapri Istante con una connessione.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
 })());
});
