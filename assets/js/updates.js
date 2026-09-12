/* Istante 3.14.2 - automatic and forceable update controller. */
(function(){
 'use strict';
 const VERSION='3.14.2';
 const STORAGE_SCHEMA=1;
 const CHECK_INTERVAL_MS=15*60*1000;
 const WAIT_FOR_WORKER_MS=9000;
 function create({notify}={}){
  const $=id=>document.getElementById(id);
  const check=$('check-update'),apply=$('apply-update'),note=$('update-note'),badge=$('update-badge'),chip=$('update-status-chip');
  let registration=null,checking=false,lastCheck=0,reloading=false,requested=false,hadController=!!navigator.serviceWorker?.controller;
  let updateRisk=false,waitingVersion='',knownRemoteVersion='';
  const status=text=>{const el=$('update-status');if(el)el.textContent=text;};
  const setBadge=(visible,text='Aggiorna alla nuova versione')=>{
   if(!badge)return;
   badge.hidden=!visible;
   badge.textContent=text;
   badge.setAttribute('aria-label',text);
   badge.title=text;
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
  function resetReadyUI(){
   setBadge(false);if(chip)chip.hidden=true;if(apply){apply.hidden=true;apply.disabled=false;apply.textContent='Aggiorna ora';}
   updateRisk=false;waitingVersion='';
   $('settings-open')?.setAttribute('aria-label','Impostazioni');
   setSummary('Versione '+VERSION);
   if(note)note.textContent='Gli aggiornamenti compatibili vengono installati automaticamente. Se serve, puoi sempre forzarne l’attivazione.';
  }
  function cacheQualityText(info){
   const missing=Number(info?.missing||0),unverified=Number(info?.unverified||0);
   if(missing>0)return missing+' file '+(missing===1?'verrà completato':'verranno completati')+' dopo l’attivazione.';
   if(unverified>0)return unverified+' file '+(unverified===1?'è in verifica':'sono in verifica')+' e verrà ricontrollato automaticamente.';
   return 'La nuova copia locale è pronta.';
  }
  function markAvailable(info,{automatic=false}={}){
   waitingVersion=String(info?.version||knownRemoteVersion||'');updateRisk=compatibilityRisk(info);
   setBadge(true,'Aggiorna alla nuova versione');if(chip)chip.hidden=false;
   if(apply){apply.hidden=false;apply.disabled=false;apply.textContent=updateRisk?'Aggiorna comunque':'Aggiorna ora';}
   $('settings-open')?.setAttribute('aria-label','Impostazioni: nuova versione disponibile');
   setSummary('Nuova versione disponibile');
   if(updateRisk){
    status((waitingVersion?'Versione '+waitingVersion+': ':'')+'la configurazione potrebbe non essere pienamente compatibile. Puoi aggiornare comunque.');
    if(note)note.textContent='L’aggiornamento non viene bloccato: confermandolo, alcune preferenze potrebbero tornare ai valori predefiniti.';
   }else if(automatic){
    status((waitingVersion?'Versione '+waitingVersion+': ':'')+'aggiornamento automatico in corso…');
    if(note)note.textContent=cacheQualityText(info)+' Non è necessario chiudere Istante.';
   }else{
    status((waitingVersion?'Versione '+waitingVersion:'Una nuova versione')+' disponibile. Puoi aggiornarla subito.');
    if(note)note.textContent=cacheQualityText(info)+' Se l’attivazione automatica non parte, usa Aggiorna ora.';
   }
  }
  async function offlineState(){
   const info=await ask(registration?.active,{type:'GET_VERSION'},3500);
   const el=$('offline-status');if(!el)return;
   if(!info){el.textContent='Copia offline disponibile quando il browser completa la preparazione.';return;}
   if(Number(info.missing||0)>0)el.textContent='Copia offline attiva; '+info.missing+' file verranno recuperati automaticamente quando disponibili.';
   else if(Number(info.unverified||0)>0)el.textContent='Copia offline attiva; alcuni file vengono ancora ricontrollati in background.';
   else el.textContent='Copia offline pronta: interfaccia, frasi, icone ed effetti. Le radio live richiedono Internet.';
  }
  async function activateWaiting({automatic=false,force=false}={}){
   const worker=registration?.waiting;if(!worker)return false;
   const info=await ask(worker,{type:'GET_VERSION'},4000)||{version:knownRemoteVersion};
   const risk=compatibilityRisk(info);markAvailable(info,{automatic:automatic&&!risk});
   if(risk&&!force)return false;
   requested=true;if(apply)apply.disabled=true;
   status(risk?'Aggiornamento forzato in corso. Alcune preferenze potrebbero essere reimpostate.':'Aggiornamento in corso…');
   const result=await ask(worker,{type:'SKIP_WAITING',force:true,clientStorageSchema:STORAGE_SCHEMA},5000);
   if(result?.ok===false){
    if(apply)apply.disabled=false;
    status(result.reason||'L’attivazione automatica non è riuscita. Puoi riprovare con Aggiorna ora.');
    return false;
   }
   setTimeout(()=>{if(!reloading&&apply){apply.disabled=false;status('L’aggiornamento è pronto: premi Aggiorna ora per forzare l’attivazione.');}},8000);
   return true;
  }
  async function inspectWaiting(auto=true){
   if(!registration?.waiting)return false;
   const info=await ask(registration.waiting,{type:'GET_VERSION'},4500)||{version:knownRemoteVersion};
   const risk=compatibilityRisk(info);markAvailable(info,{automatic:auto&&!risk});
   if(auto&&!risk)await activateWaiting({automatic:true,force:true});
   return true;
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
   if(apply)apply.disabled=true;setBadge(true,'Aggiornamento in corso…');status('Forzo il passaggio alla nuova versione…');
   try{
    if(registration.waiting){await activateWaiting({force:true});return;}
    await registration.update();
    const worker=await waitForWaiting();
    if(worker){await activateWaiting({force:true});return;}
    const activeInfo=await ask(registration.active,{type:'GET_VERSION'},3000);
    if(activeInfo?.version&&compareVersions(activeInfo.version,VERSION)>0){
     requested=true;location.reload();return;
    }
    if(knownRemoteVersion&&compareVersions(knownRemoteVersion,VERSION)>0){
     status('La nuova release è sul server ma il browser non ha ancora sostituito il service worker. Riprova: il controllo non blocca più l’aggiornamento.');
     setBadge(true,'Aggiorna alla nuova versione');
    }else{
     resetReadyUI();status('Stai usando l’ultima versione: '+VERSION+'.');
    }
   }catch(_){status('Non riesco a completare il controllo di rete, ma la versione attuale resta utilizzabile. Riprova con Aggiorna ora.');setBadge(true,'Aggiorna alla nuova versione');}
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
    let remote=null;
    try{remote=await fetchRemoteVersion();}catch(_){}
    knownRemoteVersion=String(remote?.version||'');
    await registration.update();
    if(await inspectWaiting(true))return;
    if(knownRemoteVersion&&compareVersions(knownRemoteVersion,VERSION)>0){
     markAvailable(remote,{automatic:true});
     status('Nuova versione '+knownRemoteVersion+' rilevata. La installo automaticamente…');
     const worker=await waitForWaiting(7000);
     if(worker){await inspectWaiting(true);return;}
     if(apply){apply.hidden=false;apply.disabled=false;apply.textContent='Aggiorna ora';}
     status('Nuova versione '+knownRemoteVersion+' rilevata. Se il browser ritarda l’attivazione, premi Aggiorna ora.');
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
   status('Pubblica Istante su HTTPS per usare gli aggiornamenti automatici.');return;
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
     setBadge(true,'Aggiorna alla nuova versione');if(chip)chip.hidden=false;
     status('Nuova versione rilevata. La preparo e la attivo automaticamente…');
     worker.addEventListener('statechange',()=>{
      if(worker.state==='installed'&&navigator.serviceWorker.controller)void inspectWaiting(true);
      if(worker.state==='activated')void offlineState();
      if(worker.state==='redundant'){status('Il browser ha interrotto un tentativo di installazione. Riprovo automaticamente.');setTimeout(()=>void verify(),1500);}
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
 window.IstanteUpdates={create,version:VERSION,storageSchema:STORAGE_SCHEMA};
})();
