/* Istante 3.14.6 - user-first updates with a three-day automatic deadline. */
(function(){
 'use strict';
 const VERSION='3.14.6';
 const STORAGE_SCHEMA=1;
 const CHECK_INTERVAL_MS=15*60*1000;
 const WAIT_FOR_WORKER_MS=9000;
 const AUTO_UPDATE_DELAY_MS=3*24*60*60*1000;
 const FIRST_SEEN_PREFIX='istante:update:first-seen:';
 function create({notify}={}){
  const $=id=>document.getElementById(id);
  const check=$('check-update'),apply=$('apply-update'),note=$('update-note'),badge=$('update-badge'),chip=$('update-status-chip');
  let registration=null,checking=false,lastCheck=0,reloading=false,requested=false,hadController=!!navigator.serviceWorker?.controller;
  let updateRisk=false,waitingVersion='',knownRemoteVersion='',autoTimer=0;
  const memoryFirstSeen=new Map();
  const status=text=>{const el=$('update-status');if(el)el.textContent=text;};
  const setBadge=(visible,text='Update now')=>{
   if(!badge)return;
   badge.hidden=!visible;
   badge.textContent=text;
   const accessible=text==='Update now'?'Aggiorna alla nuova versione':(text==='Updating…'?'Aggiornamento in corso':text);
   badge.setAttribute('aria-label',accessible);
   badge.title=accessible;
  };
  function ask(worker,message,timeoutMs=5000){return new Promise(resolve=>{
   if(!worker){resolve(null);return;}
   const channel=new MessageChannel(),timer=setTimeout(()=>{try{channel.port1.close();}catch(_){}resolve(null);},timeoutMs);
   channel.port1.onmessage=e=>{clearTimeout(timer);try{channel.port1.close();}catch(_){}resolve(e.data);};
   try{worker.postMessage(message,[channel.port2]);}catch(_){clearTimeout(timer);try{channel.port1.close();}catch(__){}resolve(null);}
  });}
  function compareVersions(a,b){
   const pa=String(a||'').split('.').map(n=>Number.parseInt(n,10)||0),pb=String(b||'').split('.').map(n=>Number.parseInt(n,10)||0);
   for(let i=0;i<Math.max(pa.length,pb.length);i++){const d=(pa[i]||0)-(pb[i]||0);if(d)return d;}
   return 0;
  }
  function compatibilityRisk(info){
   const min=Number(info?.minCompatibleStorageSchema||1);
   return Number.isFinite(min)&&STORAGE_SCHEMA<min;
  }
  function setSummary(text){const summary=$('section-about')?.querySelector('[data-summary]');if(summary)summary.textContent=text;}
  function firstSeenKey(version){return FIRST_SEEN_PREFIX+String(version||'unknown');}
  function validTimestamp(value){const n=Number(value);return Number.isFinite(n)&&n>0?n:0;}
  function rememberFirstSeen(version,candidate=Date.now()){
   version=String(version||'').trim();if(!version)return Date.now();
   const key=firstSeenKey(version),now=Date.now();let stored=0;
   try{stored=validTimestamp(localStorage.getItem(key));}catch(_){}
   const memory=validTimestamp(memoryFirstSeen.get(version));
   const detected=validTimestamp(candidate)||now;
   const values=[stored,memory,detected].filter(Boolean);
   const first=Math.min(...(values.length?values:[now]));
   memoryFirstSeen.set(version,first);
   try{localStorage.setItem(key,String(first));}catch(_){}
   return first;
  }
  function timingFor(info){
   const version=String(info?.version||knownRemoteVersion||waitingVersion||'').trim();
   const firstSeen=rememberFirstSeen(version,validTimestamp(info?.detectedAt)||Date.now());
   const elapsed=Math.max(0,Date.now()-firstSeen),remaining=Math.max(0,AUTO_UPDATE_DELAY_MS-elapsed);
   return{version,firstSeen,remaining,due:remaining<=0};
  }
  function remainingText(ms){
   const hours=Math.max(1,Math.ceil(ms/(60*60*1000)));
   if(hours>=48)return 'tra circa '+Math.ceil(hours/24)+' giorni';
   if(hours>=24)return 'tra circa 1 giorno';
   if(hours===1)return 'tra circa 1 ora';
   return 'tra circa '+hours+' ore';
  }
  function clearAutoTimer(){if(autoTimer){clearTimeout(autoTimer);autoTimer=0;}}
  function resetReadyUI(){
   clearAutoTimer();
   setBadge(false);if(chip)chip.hidden=true;if(apply){apply.hidden=true;apply.disabled=false;apply.textContent='Aggiorna ora';}
   updateRisk=false;waitingVersion='';
   $('settings-open')?.setAttribute('aria-label','Impostazioni');
   setSummary('Versione '+VERSION);
   if(note)note.textContent='Quando è disponibile una nuova versione scegli tu quando installarla. Se non intervieni, dopo 3 giorni l’aggiornamento parte automaticamente.';
  }
  function cacheQualityText(info){
   const missing=Number(info?.missing||0),unverified=Number(info?.unverified||0);
   if(missing>0)return missing+' file '+(missing===1?'verrà completato':'verranno completati')+' durante l’aggiornamento.';
   if(unverified>0)return unverified+' file '+(unverified===1?'è ancora in verifica':'sono ancora in verifica')+' e verrà ricontrollato automaticamente.';
   return 'La nuova copia locale è pronta.';
  }
  function markAvailable(info,{timing=null,automatic=false}={}){
   waitingVersion=String(info?.version||knownRemoteVersion||waitingVersion||'');updateRisk=compatibilityRisk(info);
   const when=timing||timingFor(info);
   setBadge(true,'Update now');if(chip)chip.hidden=false;
   if(apply){apply.hidden=false;apply.disabled=false;apply.textContent=updateRisk?'Aggiorna comunque':'Aggiorna ora';}
   $('settings-open')?.setAttribute('aria-label','Impostazioni: nuova versione disponibile');
   setSummary('Nuova versione disponibile');
   if(automatic){
    status((waitingVersion?'Versione '+waitingVersion+': ':'')+'aggiornamento automatico in corso…');
    if(note)note.textContent=cacheQualityText(info)+' Sono trascorsi 3 giorni dalla prima rilevazione.';
   }else if(updateRisk){
    status((waitingVersion?'Versione '+waitingVersion+': ':'')+'nuova versione disponibile. Puoi aggiornare quando vuoi.');
    if(note)note.textContent='La configurazione potrebbe non essere pienamente compatibile. Puoi aggiornare comunque; senza intervento, l’aggiornamento automatico partirà '+(when.due?'ora':remainingText(when.remaining))+'.';
   }else{
    status((waitingVersion?'Versione '+waitingVersion:'Una nuova versione')+' disponibile. Premi Aggiorna ora quando vuoi installarla.');
    if(note)note.textContent=cacheQualityText(info)+' Se non aggiorni manualmente, l’installazione automatica partirà '+(when.due?'ora':remainingText(when.remaining))+'.';
   }
  }
  async function offlineState(){
   const info=await ask(registration?.active,{type:'GET_VERSION',clientVersion:VERSION},3500);
   const el=$('offline-status');if(!el)return;
   if(!info){el.textContent='Copia offline disponibile quando il browser completa la preparazione.';return;}
   if(Number(info.missing||0)>0)el.textContent='Copia offline attiva; '+info.missing+' file verranno recuperati automaticamente quando disponibili.';
   else if(Number(info.unverified||0)>0)el.textContent='Copia offline attiva; alcuni file vengono ancora ricontrollati in background.';
   else el.textContent='Copia offline pronta: interfaccia, frasi, icone ed effetti. Le radio live richiedono Internet.';
  }
  async function activateWaiting({automatic=false,force=false,info=null}={}){
   const worker=registration?.waiting;if(!worker)return false;
   info=info||await ask(worker,{type:'GET_VERSION',clientVersion:VERSION},4000)||{version:knownRemoteVersion};
   const when=timingFor(info),risk=compatibilityRisk(info);
   markAvailable(info,{timing:when,automatic});
   if(automatic&&!when.due){scheduleAutoActivation(info);return false;}
   if(risk&&!force&&!automatic)return false;
   requested=true;if(apply)apply.disabled=true;clearAutoTimer();
   status(risk&&!automatic?'Aggiornamento forzato in corso. Alcune preferenze potrebbero essere reimpostate.':'Aggiornamento in corso…');
   const result=await ask(worker,{type:'SKIP_WAITING',force:true,clientStorageSchema:STORAGE_SCHEMA,clientVersion:VERSION,activation:automatic?'deadline':'user'},5000);
   if(result?.ok===false){
    requested=false;if(apply)apply.disabled=false;
    status(result.reason||'L’attivazione non è riuscita. Puoi riprovare con Aggiorna ora.');
    if(automatic)setTimeout(()=>void inspectWaiting(true),60000);else scheduleAutoActivation(info);
    return false;
   }
   setTimeout(()=>{if(!reloading&&apply){apply.disabled=false;status('L’aggiornamento è pronto: premi Aggiorna ora per completare il passaggio.');}},8000);
   return true;
  }
  function scheduleAutoActivation(info){
   clearAutoTimer();
   const when=timingFor(info);
   if(when.due){setTimeout(()=>void activateWaiting({automatic:true,force:true,info}),0);return;}
   autoTimer=setTimeout(()=>{autoTimer=0;void inspectWaiting(true);},Math.min(when.remaining+500,2147483000));
  }
  async function inspectWaiting(allowAuto=true){
   if(!registration?.waiting)return false;
   const info=await ask(registration.waiting,{type:'GET_VERSION',clientVersion:VERSION},4500)||{version:knownRemoteVersion};
   const when=timingFor(info);markAvailable(info,{timing:when});
   if(allowAuto&&when.due){await activateWaiting({automatic:true,force:true,info});return true;}
   scheduleAutoActivation(info);return true;
  }
  function waitForWaiting(timeoutMs=WAIT_FOR_WORKER_MS){return new Promise(resolve=>{
   const started=Date.now();
   const tick=()=>{
    if(registration?.waiting){resolve(registration.waiting);return;}
    if(Date.now()-started>=timeoutMs){resolve(null);return;}
    setTimeout(tick,180);
   };tick();
  });}
  async function forceNewest(){
   if(!registration)return;
   if(updateRisk){
    const ok=window.confirm('Questa versione potrebbe non essere pienamente compatibile con la configurazione attuale. L’aggiornamento può comunque proseguire, ma alcune preferenze potrebbero tornare ai valori predefiniti. Continuare?');
    if(!ok)return;
   }
   if(apply)apply.disabled=true;setBadge(true,'Updating…');status('Avvio l’aggiornamento richiesto…');
   try{
    if(registration.waiting){await activateWaiting({force:true});return;}
    await registration.update();
    const worker=await waitForWaiting();
    if(worker){await activateWaiting({force:true});return;}
    const activeInfo=await ask(registration.active,{type:'GET_VERSION',clientVersion:VERSION},3000);
    if(activeInfo?.version&&compareVersions(activeInfo.version,VERSION)>0){requested=true;location.reload();return;}
    if(knownRemoteVersion&&compareVersions(knownRemoteVersion,VERSION)>0){
     status('La nuova release è sul server ma il browser non ha ancora preparato il service worker. Riprova con Aggiorna ora.');setBadge(true,'Update now');
    }else{resetReadyUI();status('Stai usando l’ultima versione: '+VERSION+'.');}
   }catch(_){status('Non riesco a completare il controllo di rete, ma la versione attuale resta utilizzabile. Riprova con Aggiorna ora.');setBadge(true,'Update now');}
   finally{if(apply)apply.disabled=false;}
  }
  async function fetchRemoteVersion(){
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6500);
   try{
    const r=await fetch('./version.json?check='+Date.now(),{cache:'no-store',credentials:'same-origin',signal:controller.signal,headers:{'Cache-Control':'no-cache'}});
    if(!r.ok)throw Error('version');return await r.json();
   }finally{clearTimeout(timer);}
  }
  async function verify(manual=false){
   if(checking||!registration)return;
   if(navigator.onLine===false){status('Sei offline. Il controllo riprenderà appena torna la connessione.');return;}
   checking=true;if(check)check.disabled=true;lastCheck=Date.now();if(manual)status('Controllo la versione pubblicata…');
   try{
    if(await inspectWaiting(true))return;
    let remote=null;try{remote=await fetchRemoteVersion();}catch(_){}
    knownRemoteVersion=String(remote?.version||'');
    if(knownRemoteVersion&&compareVersions(knownRemoteVersion,VERSION)>0){
     const when=timingFor(remote);markAvailable(remote,{timing:when});
    }
    await registration.update();
    if(await inspectWaiting(true))return;
    if(knownRemoteVersion&&compareVersions(knownRemoteVersion,VERSION)>0){
     const when=timingFor(remote);markAvailable(remote,{timing:when});
     const worker=await waitForWaiting(7000);
     if(worker){await inspectWaiting(true);return;}
     status('Nuova versione '+knownRemoteVersion+' disponibile. Premi Aggiorna ora quando vuoi installarla.');
     return;
    }
    resetReadyUI();status('Stai usando l’ultima versione: '+VERSION+'.');
   }catch(_){status('Verifica non disponibile. Istante continua a funzionare e riproverà automaticamente.');}
   finally{checking=false;if(check)check.disabled=false;}
  }
  check?.addEventListener('click',()=>void verify(true));
  apply?.addEventListener('click',()=>void forceNewest());
  badge?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();void forceNewest();});
  if(!('serviceWorker' in navigator)||!window.isSecureContext||!/^https?:$/.test(location.protocol)){
   if(check)check.disabled=true;const offline=$('offline-status');if(offline)offline.textContent='Cache del sito disponibile su HTTPS o localhost.';
   status('Pubblica Istante su HTTPS per usare gli aggiornamenti.');return;
  }
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
   if((hadController||requested)&&!reloading){reloading=true;location.reload();return;}
   hadController=true;void offlineState();
  });
  async function register(){
   try{
    registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
    registration.addEventListener('updatefound',()=>{
     const worker=registration.installing;if(!worker)return;
     setBadge(true,'Update now');if(chip)chip.hidden=false;
     status('Nuova versione rilevata. La preparo: sarai tu a scegliere quando installarla.');
     worker.addEventListener('statechange',()=>{
      if(worker.state==='installed'&&navigator.serviceWorker.controller)void inspectWaiting(true);
      if(worker.state==='activated')void offlineState();
      if(worker.state==='redundant'){status('Il browser ha interrotto un tentativo di preparazione. Riproverò automaticamente.');setTimeout(()=>void verify(),1500);}
     });
    });
    navigator.serviceWorker.ready.then(()=>void offlineState());
    if(!(await inspectWaiting(true)))await verify();
   }catch(_){const offline=$('offline-status');if(offline)offline.textContent='Il browser non ha consentito il salvataggio offline.';status('Gli aggiornamenti richiedono HTTPS e l’accesso allo spazio locale del browser.');}
  }
  if(document.readyState==='complete')void register();else window.addEventListener('load',register,{once:true});
  window.addEventListener('online',()=>void verify());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastCheck>60000)void verify();});
  setInterval(()=>{if(!document.hidden)void verify();},CHECK_INTERVAL_MS);
  $('section-about')?.addEventListener('toggle',()=>{if($('section-about').open&&registration){void offlineState();void verify(true);}});
 }
 window.IstanteUpdates={create,version:VERSION,storageSchema:STORAGE_SCHEMA,autoUpdateDelayMs:AUTO_UPDATE_DELAY_MS};
})();
