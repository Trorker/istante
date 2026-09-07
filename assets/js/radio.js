/* Istante 3.1.0. No autoplay, hidden videos, proxying or audio cache.
 * Community URLs are resolved only after Play, constrained by station name/provider.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstanteRadio=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function safeURL(raw){try{const u=new URL(raw);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch(_){return '';}}
function matches(row,lookup){const url=safeURL(row.url_resolved||row.url);if(!url)return false;const host=new URL(url).hostname;return lookup.hosts.some(h=>host===h||host.endsWith('.'+h))&&lookup.names.map(normalize).includes(normalize(row.name));}
function create({getSettings,save,icon,notify}){
 const $=s=>document.querySelector(s),catalog=window.IstanteStations||[],byId=Object.fromEntries(catalog.map(s=>[s.id,s]));
 const mini=$('#radio-mini'),panel=$('#radio-panel'),play=$('#radio-play'),status=$('#radio-status'),detail=$('#radio-detail');
 let audio=null,state='idle',wantsPlay=false,token=0,timer=0,controller=null,current='',sources=[],sourceIndex=0,muted=false,activeSource=null;
 let overrides={};try{overrides=JSON.parse(localStorage.getItem('istante.original1.radioUrls')||'{}');if(!overrides||Array.isArray(overrides)||typeof overrides!=='object')overrides={};}catch(_){}
 const resolved=new Map();const station=()=>byId[getSettings().radioStation]||byId.chillhop||catalog[0];
 function persistURLs(){try{localStorage.setItem('istante.original1.radioUrls',JSON.stringify(overrides));}catch(_){notify('Indirizzo applicato solo per questa sessione.');}}
 function render(note){const s=station();const labels={idle:s.name,loading:'Sintonizzazione...',playing:s.name,paused:'In pausa \u00b7 '+s.name,error:'Diretta non disponibile',offline:'Senza connessione'};
  mini.dataset.state=state;status.textContent=labels[state]||s.name;status.title=s.name;play.innerHTML='<span class="icon">'+icon(wantsPlay?'pause':'play')+'</span>';play.setAttribute('aria-label',wantsPlay?'Ferma la radio':'Ascolta la radio');play.setAttribute('aria-pressed',String(wantsPlay));if(note)detail.textContent=note;
  $('#radio-source').href=s.page;$('#radio-provider').textContent=activeSource?.label||s.provider;$('#radio-station').value=s.id;$('#radio-volume').value=getSettings().radioVolume;$('#radio-volume-value').textContent=getSettings().radioVolume+'%';$('#radio-mute').setAttribute('aria-pressed',String(muted));$('#radio-mute').setAttribute('aria-label',muted?'Riattiva audio':'Disattiva audio');$('#radio-mute .icon').innerHTML=icon(muted?'mute':'volume');
  if(document.activeElement!==$('#radio-custom-url'))$('#radio-custom-url').value=overrides[s.id]||'';
  window.IstanteControls?.refresh();if('mediaSession' in navigator)try{navigator.mediaSession.playbackState=state==='playing'?'playing':state==='paused'?'paused':'none';}catch(_){}
 }
 function release(){clearTimeout(timer);controller?.abort();controller=null;if(audio){const old=audio;audio=null;old.pause();old.removeAttribute('src');old.load();}}
 function stop(next='paused',note){wantsPlay=false;token++;release();state=next;activeSource=null;render(note||'Premi Play per tornare alla diretta.');}
 function valid(id){return token===id&&wantsPlay;}
 async function lookupStation(s,id){if(resolved.has(s.id))return resolved.get(s.id);if(!s.lookup)return [];
  const hosts=['https://de1.api.radio-browser.info','https://nl1.api.radio-browser.info'];
  for(const host of hosts){if(!valid(id))return [];controller=new AbortController();const abort=controller;const deadline=setTimeout(()=>abort.abort(),4500);
   try{const url=host+'/json/stations/search?'+new URLSearchParams({name:s.lookup.query,limit:'100',hidebroken:'true',order:'votes',reverse:'true'});const r=await fetch(url,{signal:abort.signal,credentials:'omit',cache:'no-store'});if(!r.ok)throw new Error('Registry HTTP');const data=await r.json();if(!valid(id))return [];
    const found=(Array.isArray(data)?data:[]).filter(r=>matches(r,s.lookup));const seen=new Set();const streams=found.filter(r=>{const u=safeURL(r.url_resolved||r.url);if(seen.has(u))return false;seen.add(u);return true;}).map(r=>({url:safeURL(r.url_resolved||r.url),label:(r.codec||'Audio')+(r.bitrate?' '+r.bitrate+' kbps':''),mime:/flac/i.test(r.codec)?'audio/flac':/aac/i.test(r.codec)?'audio/aac':/opus/i.test(r.codec)?'audio/ogg; codecs="opus"':'audio/mpeg'}));
    // More than one distinct community stream can mean different stations with the same name.
    if(streams.length>1&&s.provider==='Zeno.FM')throw new Error('Identificazione ambigua');
    if(streams.length){streams.sort((a,b)=>s.id==='paradise-mellow'?(Number(/flac/i.test(b.label))-Number(/flac/i.test(a.label))):0);resolved.set(s.id,streams.slice(0,3));return streams.slice(0,3);}return [];
   }catch(e){if(!valid(id))return [];if(e.message==='Identificazione ambigua')return [];}finally{clearTimeout(deadline);if(controller===abort)controller=null;}
  }return [];
 }
 function connect(id){if(!valid(id))return;release();if(sourceIndex>=sources.length){stop('error','Stream non raggiungibile. Riprova, apri il sito della stazione oppure specifica il suo URL HTTPS.');return;}
  const src=sources[sourceIndex++],a=new Audio();audio=a;activeSource=src;a.preload='none';a.volume=getSettings().radioVolume/100;a.muted=muted;state='loading';render('Collegamento a '+station().name+' \u00b7 '+src.label+'.');
  const mine=()=>valid(id)&&audio===a;let failed=false;
  const retry=()=>{if(!mine()||failed)return;failed=true;connect(id);};
  a.addEventListener('playing',()=>{if(!mine())return;clearTimeout(timer);state='playing';render('In diretta \u00b7 '+src.label+'. '+(station().note||''));if('mediaSession' in navigator&&typeof MediaMetadata!=='undefined')try{navigator.mediaSession.metadata=new MediaMetadata({title:station().name,artist:station().provider,album:'Istante'});}catch(_){};});
  a.addEventListener('waiting',()=>{if(!mine())return;state='loading';render('Buffering: la rete sta rallentando.');clearTimeout(timer);timer=setTimeout(retry,10000);});a.addEventListener('error',retry);a.addEventListener('ended',()=>{if(mine())stop('error','La diretta si \u00e8 interrotta. Premi Play per riprovare.');});
  timer=setTimeout(retry,10000);a.src=src.url;const result=a.play();result?.catch(e=>{if(!mine())return;if(e.name==='NotAllowedError')stop('paused','Indirizzo pronto. Tocca di nuovo Play per autorizzare l\u2019audio.');else if(e.name!=='AbortError')retry();});
 }
 async function start(){if(!getSettings().radioEnabled)return;if(navigator.onLine===false){stop('offline','La radio richiede Internet. Orologio e frasi continuano.');return;}
  release();wantsPlay=true;const id=++token,s=station();current=s.id;state='loading';activeSource=null;render('Cerco la diretta di '+s.name+'...');const custom=safeURL(overrides[s.id]);
  sources=custom?[{url:custom,label:'Stream personalizzato',mime:''}]:(s.streams||[]).filter(x=>safeURL(x.url));if(!sources.length)sources=await lookupStation(s,id);if(!valid(id))return;
  if(!sources.length){stop('error','Indirizzo non trovato con certezza. Nessuna radio sostituita. Apri il sito della stazione o inserisci il suo URL HTTPS.');return;}
  const probe=new Audio();sources=sources.filter(x=>!x.mime||probe.canPlayType(x.mime)!=='');if(!sources.length){stop('error','Formato non supportato da questo browser. Apri la stazione esternamente o inserisci un flusso compatibile.');return;}sourceIndex=0;connect(id);
 }
 function close(){panel.hidden=true;for(const key of ['#radio-disclosure','#radio-expand'])$(key).setAttribute('aria-expanded','false');mini.classList.remove('is-open');}
 function toggle(){const open=panel.hidden;panel.hidden=!open;for(const key of ['#radio-disclosure','#radio-expand'])$(key).setAttribute('aria-expanded',String(open));mini.classList.toggle('is-open',open);if(open){render(wantsPlay?undefined:(station().note||'La diretta parte soltanto premendo Play.'));$('#radio-close').focus({preventScroll:true});}}
 play.addEventListener('click',()=>wantsPlay?stop():void start());$('#radio-disclosure').addEventListener('click',toggle);$('#radio-expand').addEventListener('click',toggle);$('#radio-close').addEventListener('click',()=>{close();$('#radio-expand').focus();});
 $('#radio-station').addEventListener('change',e=>{if(!byId[e.target.value])return;save('radioStation',e.target.value);if(wantsPlay)void start();else{activeSource=null;render(station().note||'Stazione scelta. Premi Play per ascoltare.');}});
 $('#radio-volume').addEventListener('input',e=>{save('radioVolume',Number(e.target.value));muted=false;if(audio){audio.volume=getSettings().radioVolume/100;audio.muted=false;}render();});$('#radio-mute').addEventListener('click',()=>{muted=!muted;if(audio)audio.muted=muted;render();});
 $('#radio-custom-save').addEventListener('click',()=>{const value=safeURL($('#radio-custom-url').value.trim());if(!value){$('#radio-custom-message').textContent='Inserisci un URL HTTPS valido, senza credenziali.';return;}overrides[station().id]=value;persistURLs();$('#radio-custom-message').textContent='Indirizzo salvato per questa stazione.';if(wantsPlay)void start();else render();});
 $('#radio-custom-reset').addEventListener('click',()=>{delete overrides[station().id];resolved.delete(station().id);persistURLs();$('#radio-custom-url').value='';$('#radio-custom-message').textContent='Ripristinata la sorgente del catalogo.';if(wantsPlay)void start();else render();});
 document.addEventListener('pointerdown',e=>{if(!mini.contains(e.target)&&!e.target.closest('.control-popup'))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden&&!document.querySelector('.control-popup[open]')){close();$('#radio-expand').focus();}});
 window.addEventListener('offline',()=>{if(wantsPlay)stop('offline','Connessione assente. La radio si ferma; lo screensaver continua.');});window.addEventListener('online',()=>{if(state==='offline'){state='paused';render('Connessione tornata. Premi Play per riprendere.');}});window.addEventListener('pagehide',()=>stop());
 if('mediaSession' in navigator)for(const[action,fn]of[['play',()=>void start()],['pause',()=>stop()],['stop',()=>stop()]])try{navigator.mediaSession.setActionHandler(action,fn);}catch(_){}
 function apply(){const s=getSettings();mini.hidden=!s.radioEnabled;if(!s.radioEnabled){close();if(wantsPlay)stop();}if(audio)audio.volume=s.radioVolume/100;if(current&&current!==s.radioStation&&wantsPlay)void start();else render();}
 apply();return{apply,close};
}
return{create,safeURL,matches,normalize};});
