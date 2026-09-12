/* Reliable offline-first updates. A new shell is prepared and verified while the
 * current release keeps running. Activation always remains an explicit action. */
(function(){
 'use strict';
 const VERSION='3.14.1';
 const STORAGE_SCHEMA=1;
 const PREPARE_RETRY_MS=20000;
 function create({notify}){
  const $=id=>document.getElementById(id),check=$('check-update'),apply=$('apply-update'),note=$('update-note');
  let registration=null,checking=false,lastCheck=0,reloading=false,requested=false,hadController=!!navigator.serviceWorker?.controller;
  let preparationTimer=0,updateRisk=false,waitingVersion='';
  const status=text=>{const el=$('update-status');if(el)el.textContent=text;};
  function ask(worker,message,timeoutMs=5000){return new Promise(resolve=>{
   if(!worker){resolve(null);return;}
   const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();resolve(null);},timeoutMs);
   channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data);};
   try{worker.postMessage(message,[channel.port2]);}catch(_){clearTimeout(timer);channel.port1.close();resolve(null);}
  });}
  function resetReadyUI(){
   $('update-badge').hidden=true;$('update-status-chip').hidden=true;apply.hidden=true;apply.disabled=false;apply.textContent='Aggiorna';updateRisk=false;waitingVersion='';
   $('settings-open').setAttribute('aria-label','Impostazioni');
   const summary=$('section-about')?.querySelector('[data-summary]');if(summary)summary.textContent='Versione '+VERSION;
   if(note)note.textContent='L’aggiornamento ricarica la pagina senza perdere le preferenze.';
  }
  function compatibilityRisk(info){
   const min=Number(info?.minCompatibleStorageSchema||1);
   return Number.isFinite(min)&&STORAGE_SCHEMA<min;
  }
  function markReady(info){
   clearTimeout(preparationTimer);waitingVersion=String(info?.version||'');updateRisk=compatibilityRisk(info);
   $('update-badge').hidden=false;$('update-status-chip').hidden=false;apply.hidden=false;apply.disabled=false;
   $('settings-open').setAttribute('aria-label','Impostazioni: nuova versione disponibile');
   const summary=$('section-about')?.querySelector('[data-summary]');if(summary)summary.textContent='Nuova versione disponibile';
   if(updateRisk){
    apply.textContent='Aggiorna comunque';
    status((waitingVersion?'Versione '+waitingVersion+': ':'')+'la configurazione potrebbe richiedere una migrazione. Puoi aggiornare comunque.');
    if(note)note.textContent='Attenzione: alcune preferenze potrebbero non essere compatibili e venire riportate ai valori predefiniti. I dati locali esistenti non vengono cancellati automaticamente.';
   }else{
    apply.textContent='Aggiorna';
    status((waitingVersion?'Versione '+waitingVersion:'Una nuova versione')+' pronta. Aggiorna quando preferisci.');
    if(note)note.textContent='La nuova copia è completa e verificata. L’aggiornamento ricarica la pagina senza perdere le preferenze.';
   }
  }
  function schedulePreparationRetry(){
   clearTimeout(preparationTimer);
   preparationTimer=setTimeout(()=>{if(registration?.waiting&&!document.hidden&&navigator.onLine!==false)void inspectWaiting(true);},PREPARE_RETRY_MS);
  }
  async function inspectWaiting(prepare=true){
   const worker=registration?.waiting;if(!worker)return 'none';
   let info=await ask(worker,{type:'GET_VERSION'});
   if(registration.waiting!==worker)return 'none';
   if(info?.complete===true){markReady(info);return 'ready';}
   apply.hidden=true;apply.disabled=false;$('update-badge').hidden=false;$('update-status-chip').hidden=false;
   const missing=Number(info?.missing||0);
   if(prepare&&navigator.onLine!==false){
    status('Nuova versione rilevata. Completo e verifico i file necessari senza interromperti...');
    const prepared=await ask(worker,{type:'PREPARE_UPDATE'},12000);
    if(registration.waiting!==worker)return 'none';
    if(prepared?.complete===true){markReady(prepared);return 'ready';}
    info=prepared||info;
   }
   const remaining=Number(info?.missing||missing||0);
   status('La nuova versione non è ancora completa'+(remaining?' ('+remaining+' file da verificare)':'')+'. Mantengo la versione attuale e riprovo automaticamente.');
   if(note)note.textContent='Puoi continuare a usare Istante. La nuova versione verrà proposta solo quando i file essenziali saranno disponibili e verificati.';
   schedulePreparationRetry();return 'pending';
  }
  async function offlineState(){
   const info=await ask(registration?.active,{type:'GET_VERSION'});
   $('offline-status').textContent=info?.complete?'Copia offline pronta: interfaccia, frasi, icone ed effetti. Le radio live richiedono Internet.':'La copia offline essenziale non è ancora completa. Riapri questa sezione dopo il primo caricamento online.';
  }
  async function verify(manual=false){
   if(checking)return;
   if(navigator.onLine===false){status('Sei offline. La verifica riprenderà quando torna la connessione.');return;}
   checking=true;check.disabled=true;lastCheck=Date.now();if(manual)status('Verifico se c’è un nuovo istante...');
   try{
    if(!registration)throw Error('not-ready');
    const waiting=await inspectWaiting(true);if(waiting!=='none')return;
    await registration.update();
    const after=await inspectWaiting(true);if(after!=='none')return;
    if(registration.installing){status('Sto preparando la nuova versione, senza interromperti.');return;}
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),7000);let data;
    try{const r=await fetch('./version.json?check='+Date.now(),{cache:'no-store',credentials:'same-origin',signal:controller.signal});if(!r.ok)throw Error('version');data=await r.json();}finally{clearTimeout(timeout);}
    if(data.version!==VERSION){status('Aggiornamento rilevato. Preparo la nuova copia offline; puoi continuare a usare questa versione.');setTimeout(()=>void registration.update().catch(()=>{}),2500);}
    else{resetReadyUI();status('Stai usando l’ultima versione: '+VERSION+'.');}
   }catch(_){status('Verifica non disponibile. La versione attuale continua a funzionare.');}
   finally{checking=false;check.disabled=false;}
  }
  check.addEventListener('click',()=>void verify(true));
  apply.addEventListener('click',async()=>{
   const worker=registration?.waiting;if(!worker){status('Nessun aggiornamento pronto. Premi Verifica aggiornamenti.');apply.hidden=true;return;}
   const info=await ask(worker,{type:'GET_VERSION'});
   if(!info?.complete){status('La nuova copia non è ancora completa. La preparo di nuovo prima di aggiornare.');void inspectWaiting(true);return;}
   if(updateRisk){
    const ok=window.confirm('Questa versione potrebbe non essere pienamente compatibile con la configurazione attuale. Puoi aggiornare comunque, ma alcune preferenze potrebbero tornare ai valori predefiniti. Continuare?');
    if(!ok)return;
   }
   requested=true;apply.disabled=true;status(updateRisk?'Aggiornamento forzato in corso. I dati locali esistenti restano nel browser.':'Aggiornamento in corso. Ritroverai le tue preferenze.');
   const result=await ask(worker,{type:'SKIP_WAITING',force:updateRisk,clientStorageSchema:STORAGE_SCHEMA},5000);
   if(result?.ok===false){apply.disabled=false;status(result.reason||'La nuova versione non può ancora essere attivata. Riprova tra poco.');return;}
   setTimeout(()=>{if(!reloading){apply.disabled=false;status('Il browser non ha ancora attivato l’aggiornamento. Riprova oppure chiudi e riapri tutte le schede di Istante.');}},10000);
  });
  if(!('serviceWorker' in navigator)||!window.isSecureContext||!/^https?:$/.test(location.protocol)){
   check.disabled=true;$('offline-status').textContent='Cache del sito disponibile su HTTPS o localhost. Con file:// funzionano le risorse locali, ma non gli aggiornamenti automatici.';
   status('Pubblica Istante su HTTPS per usare la verifica degli aggiornamenti.');return;
  }
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
   if((hadController||requested)&&!reloading){reloading=true;location.reload();return;}hadController=true;void offlineState();
  });
  async function register(){
   try{
    registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
    registration.addEventListener('updatefound',()=>{
     const worker=registration.installing;if(!worker)return;
     status('Preparo la nuova versione in modo sicuro...');
     worker.addEventListener('statechange',()=>{
      if(worker.state==='installed'){if(navigator.serviceWorker.controller){void inspectWaiting(true);}else status('Istante è pronto. Versione '+VERSION+'.');}
      if(worker.state==='activated')void offlineState();
      if(worker.state==='redundant'){status('Il tentativo di aggiornamento è stato interrotto. La versione attuale resta attiva e puoi riprovare senza perdere dati.');setTimeout(()=>void verify(),PREPARE_RETRY_MS);}
     });
    });
    navigator.serviceWorker.ready.then(()=>void offlineState());
    const waiting=await inspectWaiting(true);if(waiting==='none')await verify();
   }catch(_){$('offline-status').textContent='Il browser non ha consentito il salvataggio offline. Istante rimane utilizzabile online.';status('Controlla HTTPS, spazio disponibile e autorizzazioni del browser.');}
  }
  if(document.readyState==='complete')void register();else window.addEventListener('load',register,{once:true});
  window.addEventListener('online',()=>void verify());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastCheck>300000)void verify();});
  setInterval(()=>{if(!document.hidden)void verify();},3600000);
  document.getElementById('section-about').addEventListener('toggle',()=>{if(document.getElementById('section-about').open&&registration){void offlineState();void inspectWaiting(true);}});
 }
 window.IstanteUpdates={create,version:VERSION,storageSchema:STORAGE_SCHEMA};
})();
