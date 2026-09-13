/* Istante 4.0.0 — generated service worker. */
'use strict';
const VERSION="4.0.0";
const CACHE_PREFIX='istante-';
const CACHE=CACHE_PREFIX+VERSION;
const ASSETS=["/CHANGELOG.md","/CNAME","/README.md","/assets/app/app/App.js","/assets/app/app/device-profile.js","/assets/app/app/version.js","/assets/app/app/vue.js","/assets/app/components/calendar/AgendaView.js","/assets/app/components/calendar/CalendarHeader.js","/assets/app/components/calendar/DayView.js","/assets/app/components/calendar/EventChip.js","/assets/app/components/calendar/EventPanel.js","/assets/app/components/calendar/MonthView.js","/assets/app/components/calendar/WeekView.js","/assets/app/components/calendar/YearView.js","/assets/app/components/calendar/date-utils.js","/assets/app/components/common/AppIcon.js","/assets/app/components/common/AppModal.js","/assets/app/components/common/OnboardingWizard.js","/assets/app/components/common/ReceivedPhrasePanel.js","/assets/app/components/common/SharePanel.js","/assets/app/components/common/ToastHost.js","/assets/app/components/common/UpdateBadge.js","/assets/app/components/dashboard/BackdropScene.js","/assets/app/components/dashboard/ClockWidget.js","/assets/app/components/dashboard/ControlBar.js","/assets/app/components/dashboard/GoalPanel.js","/assets/app/components/dashboard/GoalWidget.js","/assets/app/components/dashboard/NextEventWidget.js","/assets/app/components/dashboard/PhraseWidget.js","/assets/app/components/dashboard/WeatherWidget.js","/assets/app/components/library/LibraryPanel.js","/assets/app/components/radio/RadioMini.js","/assets/app/components/radio/RadioPanel.js","/assets/app/components/settings/CalendarManager.js","/assets/app/components/settings/RadioScheduleEditor.js","/assets/app/components/settings/SettingsPanel.js","/assets/app/components/timer/TimerPanel.js","/assets/app/components/weather/WeatherPanel.js","/assets/app/composables/useCalendarInteraction.js","/assets/app/composables/useCustomCursor.js","/assets/app/composables/useDashboardGestures.js","/assets/app/composables/useIdleChrome.js","/assets/app/composables/useViewport.js","/assets/app/composables/useVolumeGesture.js","/assets/app/data/icons.js","/assets/app/main.js","/assets/app/services/appearance/celestial-service.js","/assets/app/services/audio/ambient-service.js","/assets/app/services/audio/chime-service.js","/assets/app/services/audio/radio-service.js","/assets/app/services/audio/schedule-service.js","/assets/app/services/audio/sound-generators.js","/assets/app/services/audio/touch-feedback.js","/assets/app/services/backup/backup-service.js","/assets/app/services/calendar/calendar-service.js","/assets/app/services/calendar/holidays.js","/assets/app/services/calendar/ics-core.js","/assets/app/services/data-loader.js","/assets/app/services/phrase-core.js","/assets/app/services/share/qr.js","/assets/app/services/share/share-card-service.js","/assets/app/services/share/share-link.js","/assets/app/services/storage/storage.js","/assets/app/services/typing/typing-service.js","/assets/app/services/updates/update-service.js","/assets/app/services/updates/version.js","/assets/app/services/weather/weather-service.js","/assets/app/stores/app-store.js","/assets/app/stores/appearance-store.js","/assets/app/stores/audio-store.js","/assets/app/stores/calendar-store.js","/assets/app/stores/phrase-store.js","/assets/app/stores/settings-store.js","/assets/app/stores/station-store.js","/assets/app/stores/timer-store.js","/assets/app/stores/ui-store.js","/assets/app/stores/weather-store.js","/assets/app/views/CalendarView.js","/assets/app/views/DashboardView.js","/assets/app.css","/assets/fonts/README.md","/assets/fonts/excalifont/Excalifont-Regular.woff2","/assets/fonts/excalifont/NOTICE.md","/assets/fonts/libre-baskerville/LibreBaskerville-Italic-VariableFont_wght.ttf","/assets/fonts/libre-baskerville/LibreBaskerville-VariableFont_wght.ttf","/assets/fonts/libre-baskerville/NOTICE.md","/assets/icons/icon-192.png","/assets/icons/icon-512.png","/assets/icons/icon.svg","/assets/icons/social/github.svg","/assets/icons/social/instagram.svg","/assets/icons/social/linkedin.svg","/assets/images/istante-social-v3.12.1.jpg","/assets/images/paper-grain.svg","/assets/vendor/vue.global.prod.js","/data/collection-catalog.json","/data/collections/classici-10.json","/data/collections/passi-nuovi-500.json","/data/collections/piccole-poesie-60.json","/data/phrases.json","/data/stations.json","/docs/ARCHITETTURA-V4.md","/docs/FONTI-CITAZIONI.md","/docs/LICENZA.md","/docs/TERZE-PARTI.md","/docs/VISIONE-E-DESIGN.md","/docs/licenses/BOOTSTRAP-ICONS-LICENSE.txt","/docs/licenses/EXCALIFONT-NOTICE.txt","/docs/licenses/ISTANTE-LICENSE.txt","/docs/licenses/LIBRE-BASKERVILLE-NOTICE.txt","/docs/licenses/MATERIAL-ICONS-LICENSE.txt","/docs/licenses/MATERIAL-ICONS-NOTICE.txt","/docs/licenses/PYTHON-QRCODE-LICENSE.txt","/docs/licenses/SIL-OFL-1.1.txt","/docs/licenses/SUNCALC-LICENSE.txt","/docs/licenses/UNICODE-LICENSE.txt","/docs/licenses/VUE-LICENSE.txt","/docs/release/v4.0.0.md","/index.html","/manifest.webmanifest","/version.json","/sw-manifest.json"];
const CORE=['/','/index.html','/assets/app.css','/assets/vendor/vue.global.prod.js','/assets/app/main.js','/data/phrases.json','/data/stations.json'];

async function cacheNetwork(url,cacheName=CACHE){
  try{
    const response=await fetch(url,{cache:'no-store'});
    if(response.ok)(await caches.open(cacheName)).put(url,response.clone());
    return response.ok;
  }catch(_){return false;}
}

async function findCached(request){
  const current=await caches.open(CACHE);
  const hit=await current.match(request);
  if(hit)return hit;
  const names=(await caches.keys()).filter(name=>name.startsWith(CACHE_PREFIX)&&name!==CACHE).reverse();
  for(const name of names){
    const old=await caches.open(name);
    const fallback=await old.match(request);
    if(fallback)return fallback;
  }
  return null;
}

async function coreStatus(){
  const missing=[];
  for(const url of CORE)if(!await findCached(url))missing.push(url);
  return missing;
}

async function repairCurrentCache(){
  const cache=await caches.open(CACHE);
  for(const url of ASSETS){
    if(await cache.match(url))continue;
    await cacheNetwork(url);
  }
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    await caches.open(CACHE);
    for(const url of ASSETS)await cacheNetwork(url);
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=(await caches.keys()).filter(key=>key.startsWith(CACHE_PREFIX));
    const older=keys.filter(key=>key!==CACHE);
    const keepPrevious=older.length?older[older.length-1]:null;
    for(const key of older)if(key!==keepPrevious)await caches.delete(key);
    await self.clients.claim();
    repairCurrentCache().catch(()=>{});
  })());
});

self.addEventListener('message',event=>{
  const data=event.data||{};
  if(data.type==='ACTIVATE_UPDATE'||data.type==='SKIP_WAITING'){
    event.waitUntil((async()=>{
      const missing=await coreStatus();
      await self.skipWaiting();
      event.ports?.[0]?.postMessage({ok:true,version:VERSION,complete:missing.length===0,missing:missing.length,unverified:0});
    })());
    return;
  }
  if(data.type==='GET_VERSION'){
    event.waitUntil((async()=>{
      const missing=await coreStatus();
      event.ports?.[0]?.postMessage({version:VERSION,complete:missing.length===0,missing:missing.length,unverified:0,storageSchema:4,minCompatibleStorageSchema:1,autoActivate:false});
    })());
  }
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  if(url.pathname==='/version.json'){
    event.respondWith(fetch(event.request,{cache:'no-store'}));
    return;
  }
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(event.request);
        if(response.ok)(await caches.open(CACHE)).put('/index.html',response.clone());
        return response;
      }catch(_){
        return await findCached('/index.html')||await findCached('/')||new Response('Istante non disponibile offline.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cached=await findCached(event.request);
    if(cached){
      event.waitUntil(cacheNetwork(event.request).catch(()=>{}));
      return cached;
    }
    try{
      const response=await fetch(event.request);
      if(response.ok)(await caches.open(CACHE)).put(event.request,response.clone());
      return response;
    }catch(_){
      return new Response('',{status:504,statusText:'Offline'});
    }
  })());
});
