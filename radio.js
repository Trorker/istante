/* Direct live radio from the broadcaster's documented external-player URLs.
 * No autoplay, proxy, hidden video, track downloads or persistent audio cache.
 */
(function(){'use strict';
const STATIONS={
 chillhop:{name:'ChillHop',sub:'lo-fi beats',path:'chillhop',page:'https://www.fluxfm.de/channels/e3d6cb48-55bb-41c5-ab72-9def83aa3ca8'},
 chillout:{name:'Electronic Chillout',sub:'downtempo',path:'electronic-chillout',externalFirst:true,page:'https://www.fluxfm.de/empfang'},
 lounge:{name:'FluxLounge',sub:'suoni morbidi',path:'flux-lounge',page:'https://www.fluxfm.de/empfang'}
};
function create({getSettings,save,icon,notify}){
 const $=s=>document.querySelector(s),audio=new Audio();audio.preload='none';let state='idle',token=0,timeout=0,current='',attempt=0,wantsPlay=false,lastVolume=45;
 const mini=$('#radio-mini'),panel=$('#radio-panel'),play=$('#radio-play'),status=$('#radio-status'),detail=$('#radio-detail');
 const station=()=>STATIONS[getSettings().radioStation]||STATIONS.chillhop;
 const labels={idle:()=>station().name+' \u00b7 FluxFM',loading:()=> 'Sintonizzazione...',playing:()=>station().name+' \u00b7 Live',paused:()=> 'In pausa',error:()=> 'Non disponibile',offline:()=> 'Senza connessione'};
 function render(note){mini.dataset.state=state;status.textContent=labels[state]();play.innerHTML='<span class="icon">'+icon(wantsPlay?'pause':'play')+'</span>';play.setAttribute('aria-label',wantsPlay?'Ferma la radio':'Ascolta la radio');play.setAttribute('aria-pressed',String(state==='playing'));if(note)detail.textContent=note;
  $('#radio-source').href=station().page;$('#radio-station').value=getSettings().radioStation;$('#radio-volume').value=getSettings().radioVolume;$('#radio-volume-value').textContent=getSettings().radioVolume+'%';$('#radio-mute').setAttribute('aria-pressed',String(audio.muted));$('#radio-mute').setAttribute('aria-label',audio.muted?'Riattiva audio':'Disattiva audio');$('#radio-mute .icon').innerHTML=icon(audio.muted?'mute':'volume');window.IstanteControls?.refresh();
  if('mediaSession' in navigator){try{navigator.mediaSession.playbackState=state==='playing'?'playing':state==='paused'?'paused':'none';}catch(_){}}
 }
 function clearAudio(){clearTimeout(timeout);audio.pause();audio.removeAttribute('src');audio.load();}
 function stop(next='paused',note){wantsPlay=false;token++;clearAudio();state=next;render(note||'Premi Play per tornare alla diretta.');}
 function start(fallback=false){if(!getSettings().radioEnabled)return;if(navigator.onLine===false){stop('offline','La radio richiede Internet. Orologio e frasi continuano normalmente.');return;}
  clearAudio();wantsPlay=true;const id=++token;attempt=fallback?1:0;current=getSettings().radioStation;state='loading';render('Collegamento alla diretta '+station().name+'...');audio.volume=Math.max(0,Math.min(1,getSettings().radioVolume/100));
  audio.src='https://channels.fluxfm.de/'+(station().externalFirst?'externalembedflxhp/'+station().path:station().path+'/externalembedflxhp')+'/stream.'+(fallback?'aac':'mp3');
  timeout=setTimeout(()=>{if(id===token&&wantsPlay)stop('error','La stazione non risponde. Premi Play per riprovare o scegli un\'altra stazione.');},14000);
  const promise=audio.play();if(promise?.catch)promise.catch(e=>{if(id!==token)return;if(e.name==='NotAllowedError')stop('paused','Il browser richiede un nuovo tocco su Play per consentire l\'audio.');else if(e.name!=='AbortError'&&!attempt){start(true);}else if(e.name!=='AbortError')stop('error','Stream non disponibile. Puoi riprovare o aprire la stazione ufficiale.');});
 }
 audio.addEventListener('playing',()=>{if(!wantsPlay)return;clearTimeout(timeout);state='playing';render('Stai ascoltando '+station().name+' in diretta.');if('mediaSession' in navigator&&typeof MediaMetadata!=='undefined')try{navigator.mediaSession.metadata=new MediaMetadata({title:station().name,artist:'FluxFM \u00b7 Radio live',album:'Istante'});}catch(_){}});
 audio.addEventListener('waiting',()=>{if(!wantsPlay)return;state='loading';render('La rete sta rallentando. Attendo lo stream...');clearTimeout(timeout);const id=token;timeout=setTimeout(()=>{if(id===token)stop('error','Diretta interrotta. Premi Play per riprovare.');},14000);});
 audio.addEventListener('ended',()=>{if(wantsPlay)stop('error','La diretta si \u00e8 interrotta. Premi Play per riconnetterti.');});
 audio.addEventListener('error',()=>{if(!wantsPlay)return;if(!attempt){start(true);return;}stop('error','La stazione non risponde o lo stream non \u00e8 supportato. Premi Play per riprovare.');});
 function close(){panel.hidden=true;$('#radio-disclosure').setAttribute('aria-expanded','false');mini.classList.remove('is-open');}
 function toggle(){panel.hidden=!panel.hidden;$('#radio-disclosure').setAttribute('aria-expanded',String(!panel.hidden));mini.classList.toggle('is-open',!panel.hidden);if(!panel.hidden)$('#radio-close').focus({preventScroll:true});}
 play.addEventListener('click',()=>wantsPlay?stop():start());$('#radio-disclosure').addEventListener('click',toggle);$('#radio-expand').addEventListener('click',toggle);$('#radio-close').addEventListener('click',()=>{close();$('#radio-disclosure').focus();});
 $('#radio-station').addEventListener('change',e=>{if(!STATIONS[e.target.value])return;save('radioStation',e.target.value);if(wantsPlay)start();else render('Stazione scelta. Premi Play per ascoltare.');});
 $('#radio-volume').addEventListener('input',e=>{const volume=Number(e.target.value);save('radioVolume',volume);audio.volume=volume/100;audio.muted=false;render();});
 $('#radio-mute').addEventListener('click',()=>{audio.muted=!audio.muted;render();});
 document.addEventListener('pointerdown',e=>{if(!mini.contains(e.target)&&!e.target.closest('.control-popup'))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden&&!document.querySelector('.control-popup[open]')){close();$('#radio-disclosure').focus();}});
 window.addEventListener('offline',()=>{if(wantsPlay)stop('offline','Connessione assente. La radio \u00e8 ferma; lo screensaver continua.');});window.addEventListener('online',()=>{if(state==='offline'){state='paused';render('La connessione \u00e8 tornata. Premi Play per riprendere.');}});window.addEventListener('pagehide',()=>stop());
 if('mediaSession' in navigator){for(const [action,fn] of [['play',()=>start()],['pause',()=>stop()],['stop',()=>stop()]])try{navigator.mediaSession.setActionHandler(action,fn);}catch(_){}}
 function apply(){const s=getSettings();mini.hidden=!s.radioEnabled;if(!s.radioEnabled){close();if(wantsPlay)stop();}audio.volume=s.radioVolume/100;if(current&&current!==s.radioStation&&wantsPlay)start();else render();}
 apply();if(/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))$('#radio-volume').title='Su iPhone e iPad il volume pu\u00f2 essere controllato dai tasti del dispositivo.';
 return{apply,close};
}
window.IstanteRadio={create};})();
