/* Timer, local alarm sounds and authorized radio schedule. No server or polling APIs. */
(function(){
 'use strict';
 function create({getSettings,getDraft,radio,notify,openTimer,icon}){
  const T=window.IstanteTime,$=s=>document.querySelector(s),M=window.IstanteMotion;
  const key='istante.original1.timer.v1';let state;
  try{state=T.cleanTimer(JSON.parse(sessionStorage.getItem(key)||'null'));}catch(_){state=T.cleanTimer(null);}
  let context=null,nodes=new Set(),endSoundTimeout=0,armed=false,previousWindow=null,attempted='',signature='',scheduleOwned=false,alarmRadio=false,restored=state.state==='running',lastView='',destroyed=false;
  let soundToken=0,soundBus=[],duringOwned=false,duringSuppressed=false;
  const save=()=>{try{sessionStorage.setItem(key,JSON.stringify(state));}catch(_){/* Session still works without browser storage. */}};
  function setDuration(ms){const secs=Math.floor(ms/1000);$('#timer-hours').value=Math.floor(secs/3600);$('#timer-minutes').value=Math.floor(secs/60)%60;$('#timer-seconds').value=secs%60;document.querySelectorAll('[data-duration]').forEach(b=>b.classList.toggle('active',Number(b.dataset.duration)*60000===ms));}
  function readDuration(){const h=+$('#timer-hours').value,m=+$('#timer-minutes').value,s=+$('#timer-seconds').value;if(![h,m,s].every(Number.isInteger)||h<0||h>24||m<0||m>59||s<0||s>59)return 0;const ms=(h*3600+m*60+s)*1000;return ms>=1000&&ms<=86400000?ms:0;}
  function clearSound(){soundToken++;clearTimeout(endSoundTimeout);for(const node of nodes){try{node.stop();}catch(_){}try{node.disconnect();}catch(_){}}nodes.clear();soundBus.forEach(n=>{try{n.disconnect();}catch(_){}});soundBus=[];}
  async function unlockSound(){
   try{const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return false;if(!context||context.state==='closed')context=new AudioContext();if(context.state==='suspended')await Promise.race([context.resume(),new Promise(resolve=>setTimeout(resolve,2500))]);return context.state==='running';}catch(_){return false;}
  }
  function playSound(kind,volume){
   clearSound();if(volume<=0)return true;if(!context||context.state!=='running')return false;
   const t=context.currentTime+.025,master=context.createGain(),compressor=context.createDynamicsCompressor();master.gain.value=Number(volume)/100*.38;compressor.threshold.value=-8;compressor.ratio.value=4;master.connect(compressor);compressor.connect(context.destination);soundBus=[master,compressor];
   const notes=kind==='bell'?[[523.25,0,2.5],[783.99,.5,2.4],[1046.5,1.05,3.1]]:kind==='pulse'?[[660,0,.32],[660,.5,.32],[880,1.1,.65],[660,2.4,.32],[880,2.9,.9]]:[[523.25,0,1.3],[659.25,.27,1.4],[783.99,.6,1.7],[1046.5,1.05,2.2],[783.99,2.6,1.6]];
   for(const [frequency,delay,duration]of notes){
    const osc=context.createOscillator(),gain=context.createGain();osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,t+delay);gain.gain.exponentialRampToValueAtTime(.45,t+delay+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+delay+duration);osc.connect(gain);gain.connect(master);nodes.add(osc);osc.onended=()=>{nodes.delete(osc);osc.disconnect();gain.disconnect();};osc.start(t+delay);osc.stop(t+delay+duration+.05);
   }
   endSoundTimeout=setTimeout(()=>{master.disconnect();compressor.disconnect();soundBus=[];},5500);return true;
  }
  function result(text,retry=false){$('#timer-result').textContent=text;$('#timer-result').hidden=!text;$('#timer-retry-audio').hidden=!retry;$('#timer-chip-time').title=text;}
  function describe(){
   const s=getSettings();
   const ending=s.timerAction==='radio'&&s.radioEnabled?'Alla fine: '+radio.station().name:s.timerAction==='silent'?'Alla fine: un avviso visivo.':'Alla fine: '+({chime:'piccoli rintocchi',bell:'campana morbida',pulse:'segnale delicato'}[s.timerSound])+(s.timerVolume===0?' (volume a zero).':'.');
   $('#timer-finish-description').textContent=(s.timerDuring==='radio'&&s.radioEnabled?'Durante: '+radio.station().name+'. ':'')+ending;
  }
  function startDuring(){
   const s=getSettings();if(s.timerDuring!=='radio'||!s.radioEnabled||!radio.station().id||duringSuppressed)return;
   // Already playing music belongs to its original owner, not to this timer.
   if(radio.getState().wantsPlay)return;
   duringOwned=true;scheduleOwned=false;void radio.start('timer-during');
  }
  function stopDuring(keep=false){
   if(!duringOwned)return;duringOwned=false;
   if(keep)return;
   // A still-active, explicitly authorized schedule may take over without a cut.
   if(armed&&T.windowAt(new Date(),getSettings())){scheduleOwned=true;attempted='active';return;}
   radio.stop('paused','La musica della tua pausa si ferma con il timer.');
  }
  async function prepare(armSchedule=false){
   // Both calls originate in the user's gesture, before any await.
   const sound=unlockSound(),media=getSettings().radioEnabled?radio.unlock():Promise.resolve(false);
   const [soundOK,radioOK]=await Promise.all([sound,media]);if(armSchedule){armed=radioOK;attempted='';}
   $('#timer-audio-hint').textContent=soundOK||radioOK?'Audio preparato per questa sessione. La pagina deve restare aperta; lo standby pu\u00f2 ritardare gli avvisi.':'Il browser non ha autorizzato l\u2019audio. Resta sempre disponibile l\u2019avviso visivo.';
   if(armSchedule){evaluate();notify(radioOK?'Audio preparato. Salva gli orari per attivare la programmazione.':'Autorizzazione audio non riuscita. Prova il pulsante Play della radio.');}
   return{soundOK,radioOK};
  }
  function startTimer(){
   if(!getSettings().timerEnabled)return;
   if(state.state==='running'){pauseTimer();return;}
   if(state.state==='paused'){void unlockSound();state.deadline=Date.now()+state.remaining;state.state='running';startDuring();save();render();return;}
   if(state.state==='done'){reset();return;}
   const duration=readDuration();if(!duration){$('#timer-error').textContent='Scegli una durata da 1 secondo a 24 ore, con minuti e secondi da 00 a 59.';$('#timer-error').hidden=false;return;}
   $('#timer-error').hidden=true;clearSound();result('');alarmRadio=false;duringSuppressed=false;void unlockSound();if(getSettings().timerDuring!=='radio')void radio.unlock();state={state:'running',duration,remaining:duration,deadline:Date.now()+duration,id:Date.now().toString(36)+Math.random().toString(36).slice(2,6)};restored=false;startDuring();save();render();M.flash($('#timer-running'));notify('Il tuo momento \u00e8 iniziato.');
  }
  function pauseTimer(){if(state.state!=='running')return;const left=T.remaining(state);if(left<=0){finish();return;}state.remaining=left;state.state='paused';stopDuring();save();render();}
  function reset(){clearSound();stopDuring();duringSuppressed=false;alarmRadio=false;state={state:'idle',duration:getSettings().timerMinutes*60000,remaining:getSettings().timerMinutes*60000,deadline:0,id:''};save();result('');$('#timer-error').hidden=true;setDuration(state.duration);render();}
  function finish(silentRestore=false){
   if(state.state!=='running')return;stopDuring(!silentRestore&&getSettings().timerAction==='radio'&&getSettings().radioEnabled);state.state='done';state.remaining=0;save();render();
   if(silentRestore){result('Il timer \u00e8 terminato mentre la pagina non era attiva. Nessun audio avviato al ripristino.',getSettings().timerAction!=='silent');return;}
   notify('Il tempo \u00e8 tuo. Il tuo momento \u00e8 terminato.');const s=getSettings();
   if(!s.timerEnabled)return;
   if(s.timerAction==='radio'&&s.radioEnabled){alarmRadio=true;result('Il tempo \u00e8 terminato. Sintonizzo la tua radio...');if(radio.getState().state==='playing'){alarmRadio=false;result('Il tempo \u00e8 terminato. La tua radio sta gi\u00e0 suonando.');}else void radio.start('timer');}
   else if(s.timerAction==='silent'){result('Il tuo momento \u00e8 terminato. Prenditi ancora un respiro.');}
   else {const played=playSound(s.timerSound,s.timerVolume);result(played?'Il tuo momento \u00e8 terminato. Prenditi ancora un respiro.':'Il tempo \u00e8 terminato. Tocca per ascoltare l\u2019avviso.',!played);}
  }
  function render(){
   const s=getSettings(),ms=T.remaining(state),active=state.state!=='idle';$('#timer-open').hidden=!s.timerEnabled;$('#timer-chip').hidden=!s.timerEnabled||!active;$('#timer-chip').dataset.state=state.state;
   $('#timer-duration').hidden=active;$('#timer-presets').hidden=active;$('#timer-running').hidden=!active;$('#timer-reset').hidden=!active;$('#timer-reset').textContent=state.state==='done'?'Chiudi avviso':'Annulla timer';
   $('#timer-state-label').textContent=state.state==='paused'?'Il tempo pu\u00f2 aspettare.':state.state==='done'?'Un momento per te.':'Il tuo momento, in corso';
   const text=T.display(ms);$('#timer-readout').textContent=text;$('#timer-chip-time').textContent=state.state==='done'?'Tempo finito':text;$('#timer-chip-label').textContent=state.state==='paused'?'In pausa':state.state==='done'?'Prenditi un respiro':'Un tempo per te';
   $('#timer-chip-toggle').hidden=state.state==='done';$('#timer-chip-dismiss').hidden=state.state!=='done';$('#timer-chip-toggle').innerHTML='<span class="icon">'+icon(state.state==='paused'?'play':'pause')+'</span>';$('#timer-chip-toggle').setAttribute('aria-label',state.state==='paused'?'Riprendi il timer':'Metti in pausa il timer');
   const progress=state.duration?Math.max(0,Math.min(100,(1-ms/state.duration)*100)):0;$('#timer-progress').setAttribute('aria-valuenow',String(Math.round(progress)));$('#timer-progress i').style.width=progress+'%';
   const view=state.state+':'+s.timerEnabled;if(lastView!==view){lastView=view;const label=state.state==='running'?'Metti in pausa':state.state==='paused'?'Riprendi il tuo momento':state.state==='done'?'Un nuovo momento':'Inizia il tuo momento';$('#timer-start').innerHTML='<span class="icon">'+icon(state.state==='running'?'pause':'play')+'</span><span>'+label+'</span>';$('#timer-start').disabled=!s.timerEnabled;}
   describe();
  }
  function scheduleText(now,current){
   const s=getSettings();if(!s.radioEnabled||!s.radioScheduleEnabled)return 'Programmazione disattivata.';
   const count=T.rows(s).filter(r=>r.enabled).length;
   if(!armed)return count+(count===1?' fascia salvata.':' fasce salvate.')+' Tocca Abilita per questa sessione.';
   if(current)return 'In programma fino alle '+T.formatTime(current.end,s.timeFormat)+'.';
   const next=T.nextStart(now,s);return next?'Prossimo avvio: '+new Intl.DateTimeFormat('it-IT',{weekday:'short'}).format(new Date(next))+' '+T.formatTime(next,s.timeFormat)+'.':'Nessuna fascia attiva.';
  }
  function evaluate(){
   const s=getSettings(),now=new Date(),current=T.windowAt(now,s),nextSignature=JSON.stringify([s.radioEnabled,s.radioScheduleEnabled,s.radioSchedules]);
   if(signature!==nextSignature){
    if(scheduleOwned&&!current&&!duringOwned){radio.stop('paused','Programmazione disattivata o fascia modificata.');scheduleOwned=false;}
    signature=nextSignature;attempted=current&&radio.getState().wantsPlay?'active':'';
   }
   if(previousWindow&&(!current||current.start>=previousWindow.end)){if(scheduleOwned&&!duringOwned)radio.stop('paused','La fascia programmata \u00e8 terminata.');scheduleOwned=false;attempted='';}
   if(!current)attempted='';previousWindow=current;
   if(current&&armed&&!attempted&&!duringOwned){attempted='active';scheduleOwned=true;void radio.start('schedule');}
   $('#radio-program-info').hidden=!s.radioEnabled||!s.radioScheduleEnabled;
   const text=scheduleText(now,current);if($('#radio-program-status').textContent!==text)$('#radio-program-status').textContent=text;
   const hint=text+(!armed?' Le modifiche alle fasce vanno salvate.':' Il browser pu\u00f2 comunque richiedere Play.');
   if($('#schedule-settings-status').textContent!==hint)$('#schedule-settings-status').textContent=hint;
   $('#radio-program-enable').hidden=armed;$('#schedule-authorize').textContent=armed?'Audio preparato \u00b7 riabilita':'Abilita audio per questa sessione';
  }
  function apply(){
   const s=getSettings();if(!s.timerEnabled&&state.state!=='idle')reset();if(!s.radioEnabled||s.timerDuring!=='radio')stopDuring();if(!s.radioEnabled){armed=false;if(alarmRadio){alarmRadio=false;result('Radio disattivata. Resta l\u2019avviso visivo.');}}if(state.state==='idle')setDuration(s.timerMinutes*60000);render();evaluate();
  }
  function tick(){if(destroyed)return;if(state.state==='running'&&T.remaining(state)<=0){finish(restored);restored=false;}else restored=false;if(state.state!=='idle')render();evaluate();}
  function open(){if(!getSettings().timerEnabled)return;render();openTimer();}
  $('#timer-open').addEventListener('click',open);$('#timer-chip-open').addEventListener('click',open);$('#timer-start').addEventListener('click',startTimer);$('#timer-reset').addEventListener('click',reset);$('#timer-chip-dismiss').addEventListener('click',reset);$('#timer-chip-toggle').addEventListener('click',()=>state.state==='running'?pauseTimer():startTimer());
  document.querySelectorAll('[data-duration]').forEach(b=>b.addEventListener('click',()=>{if(state.state==='idle')setDuration(Number(b.dataset.duration)*60000);}));
  $('#timer-retry-audio').addEventListener('click',async()=>{const s=getSettings();if(s.timerAction==='radio'&&s.radioEnabled){alarmRadio=true;void radio.start('timer');}else if(s.timerAction==='silent'){result('Il timer prevede soltanto un avviso visivo.');}else{const ok=await unlockSound();const played=ok&&playSound(s.timerSound,s.timerVolume);result(played?'Prenditi ancora un respiro.':'Audio non disponibile in questo browser.',!played);}});
  $('#timer-sound-preview').addEventListener('click',async()=>{const s=getDraft();if(!s.timerEnabled||s.timerAction!=='sound')return;const ok=await unlockSound();if(!ok||!playSound(s.timerSound,s.timerVolume))notify('Il browser non ha autorizzato il suono.');else if(s.timerVolume===0)notify('Il volume del suono finale \u00e8 a zero.');});
  $('#schedule-authorize').addEventListener('click',()=>void prepare(true));$('#radio-program-enable').addEventListener('click',()=>void prepare(true));
  document.addEventListener('istante:radio-manual',e=>{duringOwned=false;if(state.state==='running'||state.state==='paused')duringSuppressed=true;const current=T.windowAt(new Date(),getSettings());if(e.detail.playing)armed=true;if(current){attempted='active';scheduleOwned=true;}evaluate();});
  document.addEventListener('istante:radio-state',e=>{if(duringOwned&&state.state==='running'&&['error','offline','blocked'].includes(e.detail.state))$('#timer-audio-hint').textContent='Radio non disponibile. Il timer continua; puoi premere Play per riprovare.';if(!alarmRadio||state.state!=='done')return;const r=e.detail;if(r.state==='playing'){alarmRadio=false;result('Il tuo momento \u00e8 terminato. La radio ti fa compagnia.');}else if(['error','offline','blocked'].includes(r.state)){alarmRadio=false;const s=getSettings();playSound(s.timerSound,s.timerVolume);result(r.state==='blocked'?'Il tempo \u00e8 terminato. Tocca per avviare la radio.':'Radio non disponibile. Il timer \u00e8 terminato; puoi riprovare.',true);}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});window.addEventListener('pageshow',()=>tick());
  window.addEventListener('pagehide',()=>{save();clearSound();});
  setDuration(state.state==='idle'?getSettings().timerMinutes*60000:state.duration);apply();tick();const interval=setInterval(tick,500);
  return{apply,open,prepare,clearSound,inspect:()=>({timer:{...state},armed,attempted,window:previousWindow,duringOwned,duringSuppressed}),destroy(){destroyed=true;clearInterval(interval);clearSound();}};
 }
 window.IstanteMoments={create};
})();
