/* Offline-first shell. New releases wait for an explicit user action. */
(function(){
 'use strict';
 const VERSION='3.13.22';
 function create({notify}){
  const $=id=>document.getElementById(id),check=$('check-update'),apply=$('apply-update');
  let registration=null,checking=false,lastCheck=0,reloading=false,requested=false,hadController=!!navigator.serviceWorker?.controller;
  const status=text=>$('update-status').textContent=text;
  function ask(worker,message){return new Promise(resolve=>{
   if(!worker){resolve(null);return;}const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();resolve(null);},3000);
   channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data);};worker.postMessage(message,[channel.port2]);
  });}
  async function showWaiting(){
   const worker=registration?.waiting;if(!worker)return false;
   const info=await ask(worker,{type:'GET_VERSION'});if(registration.waiting!==worker)return false;
   if(!info||info.complete!==true){status('La nuova copia non risulta completa. Mantengo la versione attuale; riprova la verifica con una connessione.');return false;}
   const version=info.version;
   $('update-badge').hidden=false;$('update-status-chip').hidden=false;apply.hidden=false;apply.disabled=false;
   $('settings-open').setAttribute('aria-label','Impostazioni: nuova versione disponibile');
   $('section-about').querySelector('[data-summary]').textContent='Nuova versione disponibile';
   status((version?'Versione '+version:'Una nuova versione')+' pronta. Aggiorna quando preferisci.');
   return true;
  }
  async function offlineState(){
   const info=await ask(registration?.active,{type:'GET_VERSION'});
   $('offline-status').textContent=info?.complete?'Copia offline pronta: interfaccia, frasi, icone ed effetti. Le radio live richiedono Internet.':'La copia offline non \u00e8 ancora completa. Riapri questa sezione dopo il primo caricamento online.';
  }
  async function verify(manual=false){
   if(checking)return;if(navigator.onLine===false){status('Sei offline. La verifica riprender\u00e0 quando torna la connessione.');return;}
   checking=true;check.disabled=true;lastCheck=Date.now();if(manual)status('Verifico se c\u2019\u00e8 un nuovo istante...');
   try{
    if(!registration)throw Error('not-ready');
    if(await showWaiting())return;
    await registration.update();
    if(await showWaiting())return;
    if(registration.installing){status('Sto preparando la nuova versione, senza interromperti.');return;}
    // Bypass application and HTTP caches; the file is only a release indicator.
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),6000);let data;
    try{const r=await fetch('./version.json?check='+Date.now(),{cache:'no-store',credentials:'same-origin',signal:controller.signal});if(!r.ok)throw Error('version');data=await r.json();}finally{clearTimeout(timeout);}
    if(data.version!==VERSION){status('Aggiornamento rilevato. La copia offline si sta preparando; riprova tra poco.');setTimeout(()=>void registration.update().catch(()=>{}),4000);}
    else status('Stai usando l\u2019ultima versione: '+VERSION+'.');
   }catch(_){status('Verifica non disponibile. La versione attuale continua a funzionare.');}
   finally{checking=false;check.disabled=false;}
  }
  check.addEventListener('click',()=>void verify(true));
  apply.addEventListener('click',()=>{
   if(!registration?.waiting){status('Nessun aggiornamento pronto. Premi Verifica aggiornamenti.');apply.hidden=true;return;}
   requested=true;apply.disabled=true;status('Aggiornamento in corso. Ritroverai le tue preferenze.');
   registration.waiting.postMessage({type:'SKIP_WAITING'});
   setTimeout(()=>{if(!reloading){apply.disabled=false;status('Il browser non ha ancora attivato l\u2019aggiornamento. Riprova oppure chiudi e riapri tutte le schede di Istante.');}},10000);
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
     worker.addEventListener('statechange',()=>{
      if(worker.state==='installed'){if(navigator.serviceWorker.controller){void showWaiting();}else status('Istante \u00e8 pronto. Versione '+VERSION+'.');}
      if(worker.state==='activated')void offlineState();
      if(worker.state==='redundant')status('Nuova copia non completa. Mantengo la versione attuale: puoi riprovare.');
     });
    });
    navigator.serviceWorker.ready.then(()=>void offlineState());
    if(!(await showWaiting()))await verify();
   }catch(_){$('offline-status').textContent='Il browser non ha consentito il salvataggio offline. Istante rimane utilizzabile online.';status('Controlla HTTPS, spazio disponibile e autorizzazioni del browser.');}
  }
  if(document.readyState==='complete')void register();else window.addEventListener('load',register,{once:true});
  window.addEventListener('online',()=>void verify());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastCheck>300000)void verify();});
  setInterval(()=>{if(!document.hidden)void verify();},3600000);
  document.getElementById('section-about').addEventListener('toggle',()=>{if(document.getElementById('section-about').open&&registration)void offlineState();});
 }
 window.IstanteUpdates={create,version:VERSION};
})();
