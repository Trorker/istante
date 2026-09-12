/* Versioned, validated JSON backups. No networking. Only known Istante keys
 * are written. A failed commit rolls those keys back before reporting failure.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstanteBackup=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const PREFIX='istante.original1.',MAX_BYTES=4*1024*1024,BACKUP_SCHEMA=2;
 const isRecord=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
 function listOfText(x,name,limit=10000){if(!Array.isArray(x)||x.length>limit||x.some(s=>typeof s!=='string'||!s.trim()||s.length>1000))throw Error(name+': elenco non valido.');return [...new Set(x)];}
 function cleanHistory(x){
  if(x==null)return null;if(!isRecord(x))throw Error('Storico delle frasi non valido.');
  const seen=listOfText(x.seen||[],'Storico',20000),logs=x.log||[];
  if(!Array.isArray(logs)||logs.length>3000)throw Error('Storico troppo grande.');
  const log=logs.map(e=>{if(!isRecord(e)||typeof e.text!=='string'||e.text.length>1000||!Number.isFinite(e.at))throw Error('Una voce dello storico non valida.');return{text:e.text,at:e.at,reason:['next','scheduled','selected'].includes(e.reason)?e.reason:'selected',cycle:Number.isSafeInteger(e.cycle)&&e.cycle>0?e.cycle:1};});
  let current=null;
  if(x.current!=null){const c=x.current;if(!isRecord(c)||typeof c.slot!=='string'||c.slot.length>200||typeof c.text!=='string'||c.text.length>1000)throw Error('Frase corrente nello storico non valida.');current={slot:c.slot,text:c.text,manual:!!c.manual};}
  return{version:1,revision:0,cycle:Number.isSafeInteger(x.cycle)&&x.cycle>0?x.cycle:1,seen,log,current};
 }
 function portableCalendars(input,calendar){return calendar.cleanSources(input).map(source=>source.url?{id:source.id,name:source.name,url:source.url,enabled:source.enabled,color:source.color,updatedAt:0}:{...source});}
 function validate(payload,{core,library,builtins,solar,collections,calendar}){
  if(!isRecord(payload)||payload.format!=='istante-backup'||![1,2].includes(payload.schemaVersion)||!isRecord(payload.data))throw Error('Questo file non contiene un backup Istante compatibile (schema 1 o 2).');
  const d=payload.data;if(!isRecord(d.settings))throw Error('Le preferenze sono mancanti o non valide.');
  const settings=core.cleanSettings(d.settings),favorites=listOfText(d.favorites,'Frasi preferite');
  if(!isRecord(d.radioLibrary)||!Array.isArray(d.radioLibrary.custom)||!Array.isArray(d.radioLibrary.hidden)||!Array.isArray(d.radioLibrary.favorites))throw Error('Catalogo radio mancante o non valido.');
  const radioLibrary=library.clean(d.radioLibrary,builtins);
  if(radioLibrary.custom.length!==d.radioLibrary.custom.length)throw Error('Una stazione personale non valida: servono nome, identificativo e URL HTTPS senza credenziali.');
  const known=new Set([...builtins,...radioLibrary.custom].map(x=>x.id)),radioUrls={};
  if(d.radioUrls!=null&&!isRecord(d.radioUrls))throw Error('Configurazione stream non valida.');
  for(const [id,raw]of Object.entries(d.radioUrls||{})){
   if(!known.has(id))continue;const value=library.url(raw);if(!value)throw Error('Un indirizzo radio non valido: sono ammessi solo stream HTTPS senza credenziali.');radioUrls[id]=value;
  }
  let collection=null;
  if(d.collection!=null){const parsed=core.parsePhrases(d.collection);collection={version:'1.0',language:'it',count:parsed.length,phrases:parsed.map(x=>x.text)};}
  const includesCollections=Object.hasOwn(d,'phraseCollections'),includesCalendars=Object.hasOwn(d,'calendars');
  const phraseCollections=includesCollections?collections.clean(d.phraseCollections,core):null;
  const calendars=includesCalendars?calendar.cleanSources(d.calendars):null;
  if(phraseCollections&&JSON.stringify(phraseCollections).length>2200000)throw Error('Biblioteca oltre il limite di memoria.');
  if(calendars&&JSON.stringify(calendars).length>2000000)throw Error('Calendari oltre il limite di memoria.');
  if(phraseCollections){const active=phraseCollections.items.find(x=>x.id===phraseCollections.selected);collection=active?{version:'1.0',language:'it',count:active.phrases.length,phrases:active.phrases}:null;}
  let place=null;const includesPlace=Object.hasOwn(d,'place');
  if(includesPlace&&d.place!=null){if(!solar.validPlace(d.place))throw Error('Coordinate nel backup non valide.');place={lat:d.place.lat,lon:d.place.lon,name:String(d.place.name||'La mia posizione').slice(0,80),zone:solar.validZone(d.place.zone)};}
  const available=[...builtins.filter(s=>!radioLibrary.hidden.includes(s.id)),...radioLibrary.custom];
  if(!available.some(s=>s.id===settings.radioStation))settings.radioStation=available[0]?.id||'';
  if(!available.length){settings.radioScheduleEnabled=false;settings.timerDuring='silent';if(settings.timerAction==='radio')settings.timerAction='sound';}
  // A personal photo is deliberately not part of a portable configuration backup.
  const photoFallback=settings.background==='photo';if(photoFallback)settings.background='ambient';
  return{settings,favorites,radioLibrary,radioUrls,collection,phraseCollections,includesCollections,calendars,includesCalendars,history:cleanHistory(d.phraseHistory),includesPlace,place,photoFallback,exportedAt:typeof payload.exportedAt==='string'?payload.exportedAt:'',schemaVersion:payload.schemaVersion};
 }
 function commit(storage,entries){
  const previous={};for(const key of Object.keys(entries))previous[key]=storage.getItem(PREFIX+key);
  try{for(const [key,value]of Object.entries(entries))if(value===null)storage.removeItem(PREFIX+key);else storage.setItem(PREFIX+key,JSON.stringify(value));}
  catch(error){let rollback=true;for(const [key,value]of Object.entries(previous))try{if(value===null)storage.removeItem(PREFIX+key);else storage.setItem(PREFIX+key,value);}catch(_){rollback=false;}
   throw Error(rollback?'Memoria non disponibile o piena. Nessun dato modificato: il ripristino non \u00e8 stato applicato.':'Memoria non disponibile. Ripristino incompleto: mantieni il backup e ricarica la pagina prima di riprovare.');
  }
 }
 function create({store,core,builtins,getSettings,notify,open,onRestored}){
  const $=id=>document.getElementById(id);let pending=null,importToken=0;
  const dependencies={core,builtins,library:window.IstanteStationLibrary,solar:window.IstanteSolar,collections:window.IstanteCollections,calendar:window.IstanteCalendarCore};
  function exportBackup(){
   try{
    const data={settings:core.cleanSettings(store.read('settings',getSettings())),favorites:store.read('favorites',[]),radioLibrary:window.IstanteStationLibrary.clean(store.read('radioLibrary',{}),builtins),radioUrls:store.read('radioUrls',{}),collection:store.read('collection',null),phraseHistory:store.read('phrase-history.v1',null)};
    data.phraseCollections=window.IstanteCollections.clean(store.read('phrase-collections.v1',{}),core);
    if($('backup-calendars').checked)data.calendars=portableCalendars(store.read('calendars.v1',[]),window.IstanteCalendarCore);
    if($('backup-place').checked)data.place=store.read('place',null);
    const payload={format:'istante-backup',schemaVersion:BACKUP_SCHEMA,appVersion:'3.14.1',exportedAt:new Date().toISOString(),sourceOrigin:location.origin,data};
    validate(payload,dependencies);
    const text=JSON.stringify(payload,null,2)+'\n',blob=new Blob([text],{type:'application/json;charset=utf-8'});
    if(blob.size>MAX_BYTES)throw Error('Il backup supera 4 MB. Esporta separatamente la raccolta di frasi.');
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='istante-backup-'+new Date().toISOString().slice(0,19).replace(/[T:]/g,'-')+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);notify('Backup pronto. Conservalo: contiene le tue preferenze personali.');
   }catch(e){notify(e.message||'Impossibile preparare il backup.');}
  }
  function preview(data,name){
   pending=data;$('backup-confirm').checked=false;$('backup-restore').disabled=true;$('backup-error').hidden=true;$('backup-file-name').textContent=name;
   const values=[['Traguardo',data.settings.goalMode==='custom'?data.settings.goalTitle||'Il mio traguardo':data.settings.goalMode==='off'?'Disattivato':'Il prossimo anno'],['Frasi preferite',data.favorites.length],['Stazioni personali',data.radioLibrary.custom.length],['Radio preferite',data.radioLibrary.favorites.length],['Fasce radio',data.settings.radioSchedules.length],['Raccolta',data.collection?data.collection.count+' frasi personali':'1.000 frasi originali'],['Storico',data.history?.log.length||0]];
   values.push(['Raccolte personali',data.includesCollections?data.phraseCollections.items.length:'Backup precedente: migrazione della raccolta attiva']);if(data.includesCalendars){const links=data.calendars.filter(x=>x.url).length,files=data.calendars.length-links;values.push(['Calendari',data.calendars.length+(links?' · '+links+' link':'')+(files?' · '+files+' file':'')]);}else values.push(['Calendari','Non inclusi: restano quelli attuali']);
   const summary=$('backup-summary');summary.replaceChildren();for(const [key,value]of values){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=String(value);row.append(dt,dd);summary.append(row);}
   const linkedCalendars=data.includesCalendars?data.calendars.filter(x=>x.url).length:0;$('backup-extra-note').textContent=(data.includesPlace?data.place?'Questo backup include la localit\u00e0 salvata.':'La localit\u00e0 verr\u00e0 rimossa.':'La localit\u00e0 attuale non verr\u00e0 modificata.')+(data.photoFallback?' Lo sfondo personale verr\u00e0 sostituito dall\u2019atmosfera: il backup non include fotografie.':'')+(linkedCalendars?' I calendari collegati verranno risincronizzati dal loro link al primo avvio online.':'')+' Nessun audio o programmazione si avvia dopo il ripristino: serve una nuova autorizzazione.';
   open();
  }
  $('backup-export').addEventListener('click',exportBackup);
  $('backup-import').addEventListener('click',()=>$('backup-file').click());
  $('backup-file').addEventListener('change',async e=>{
   const file=e.target.files[0],token=++importToken;if(!file)return;
   try{if(file.size>MAX_BYTES)throw Error('Scegli un backup JSON non superiore a 4 MB.');const payload=JSON.parse(await file.text());if(token!==importToken)return;preview(validate(payload,dependencies),file.name);}
   catch(e){notify(e instanceof SyntaxError?'Il file non contiene JSON valido. Nessun dato modificato.':e.message);}finally{e.target.value='';}
  });
  $('backup-confirm').addEventListener('change',e=>$('backup-restore').disabled=!e.target.checked||!pending);
  $('backup-restore').addEventListener('click',()=>{
   if(!pending||!$('backup-confirm').checked)return;
   const d=pending,entries={settings:d.settings,favorites:d.favorites,radioLibrary:d.radioLibrary,radioUrls:d.radioUrls,collection:d.collection,'phrase-history.v1':d.history};
   if(d.includesCollections){entries['phrase-collections.v1']=d.phraseCollections;entries['collections-migrated']=true;}else if(d.collection){entries['phrase-collections.v1']={version:1,selected:'c-backup',items:[{id:'c-backup',title:'Raccolta dal backup',category:'Personale',phrases:d.collection.phrases}]};entries['collections-migrated']=true;}else{entries['phrase-collections.v1']={version:1,selected:'original',items:[]};entries['collections-migrated']=true;}
   if(d.includesCalendars)entries['calendars.v1']=d.calendars;
   if(d.includesPlace){entries.place=d.place;entries.forecast=null;}
   const effectivePlace=d.includesPlace?d.place:store.read('place',null);
   if(!effectivePlace&&entries.settings.theme==='solar')entries.settings={...entries.settings,theme:'auto'};
   try{commit(localStorage,entries);$('backup-restore').disabled=true;notify('Il tuo istante \u00e8 stato ripristinato. Riapro la pagina.');onRestored();}
   catch(e){$('backup-error').textContent=e.message;$('backup-error').hidden=false;}
  });
  $('backup-dialog').addEventListener('close',()=>{pending=null;$('backup-confirm').checked=false;});
  return{exportBackup};
 }
 return{create,validate,cleanHistory,portableCalendars,commit,MAX_BYTES,BACKUP_SCHEMA};
});
