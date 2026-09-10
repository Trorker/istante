/* Timer, local alarm sounds and authorized radio schedule. No server or polling APIs. */
(function(){
 'use strict';
 function create({getSettings,getDraft,radio,ambient,notify,openTimer,icon}){
  const T=window.IstanteTime,$=s=>document.querySelector(s),M=window.IstanteMotion;
  const key='istante.original1.timer.v1';let state;
  try{state=T.cleanTimer(JSON.parse(sessionStorage.getItem(key)||'null'));}catch(_){state=T.cleanTimer(null);}
  let draftOptions=T.timerOptions(getSettings()),defaultsStamp='';
  function timerSettings(){const s={...getSettings(),...(state.state==='idle'?draftOptions:state.options||draftOptions)};if(!s.radioEnabled||!radio.station().id){if(s.timerDuring==='radio')s.timerDuring='silent';if(s.timerAction==='radio')s.timerAction='sound';}if(!s.ambientEnabled&&s.timerDuring==='ambient')s.timerDuring='silent';return s;}
  let context=null,nodes=new Set(),endSoundTimeout=0,armed=false,previousWindow=null,attempted='',signature='',scheduleOwned=false,alarmRadio=false,restored=state.state==='running',lastView='',destroyed=false;
  let soundToken=0,soundBus=[],duringOwned=false,ambientOwned=false,duringSuppressed=false;
  const save=()=>{try{sessionStorage.setItem(key,JSON.stringify(state));}catch(_){/* Session still works without browser storage. */}};
  function setDuration(ms){
   if(state.state==='idle'){state.duration=ms;state.remaining=ms;}
   const secs=Math.floor(ms/1000),minutes=Math.max(1,Math.round(ms/60000));$('#timer-hours').value=Math.floor(secs/3600);$('#timer-minutes').value=Math.floor(secs/60)%60;$('#timer-seconds').value=secs%60;
   const range=$('#timer-duration-range'),display=$('#timer-duration-display');if(range){range.value=String(Math.min(120,minutes));range.disabled=state.state!=='idle';}if(display)display.textContent=minutes<60?minutes+' minut'+(minutes===1?'o':'i'):minutes%60?Math.floor(minutes/60)+' h '+(minutes%60)+' min':Math.floor(minutes/60)+(minutes===60?' ora':' ore');
   const dial=$('#timer-duration-dial'),hand=$('#timer-dial-hand'),dialMinutes=Math.max(1,Math.min(60,minutes));if(dial){dial.setAttribute('aria-valuenow',String(dialMinutes));dial.setAttribute('aria-valuetext',dialMinutes+' '+(dialMinutes===1?'minuto':'minuti'));dial.dataset.minutes=String(dialMinutes);}if(hand)hand.style.transform='translateX(-50%) rotate('+(dialMinutes%60)*6+'deg)';document.querySelectorAll('.timer-dial-mark').forEach(mark=>mark.classList.toggle('active',Number(mark.dataset.minute)===dialMinutes));
   document.querySelectorAll('[data-duration]').forEach(b=>b.classList.toggle('active',Number(b.dataset.duration)*60000===ms));
  }
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
  function result(text,retry=false){if(text)hint('');$('#timer-result').textContent=text;$('#timer-result').hidden=!text;$('#timer-retry-audio').hidden=!retry;$('#timer-chip-time').dataset.istanteTooltip=text;}
  function describe(){
   const s=timerSettings();
   const ending=s.timerAction==='radio'?'Radio':s.timerAction==='silent'?'Avviso visivo':({chime:'Piccoli rintocchi',bell:'Campana morbida',pulse:'Segnale delicato'}[s.timerSound])+(s.timerVolume===0?' (senza audio)':'');
   $('#timer-finish-description').textContent='Alla fine \u00b7 '+ending;
   $('#timer-finish-description').dataset.istanteTooltip=s.timerAction==='radio'?radio.station().name:ending;
  }
  function hint(text){$('#timer-audio-hint').textContent=text;$('#timer-audio-hint').hidden=!text;}
  function startDuring(){
   const s=timerSettings();if(duringSuppressed)return;
   if(s.timerDuring==='ambient'&&s.ambientEnabled){
    const a=ambient.inspect();if(a.playing||a.loading)return;
    ambientOwned=true;duringOwned=false;scheduleOwned=false;
    void ambient.start('timer').then(ok=>{if(!ok&&state.state==='running')hint('Il suono non e stato autorizzato. Il timer continua.');});return;
   }
   if(s.timerDuring!=='radio'||!s.radioEnabled||!radio.station().id)return;
   if(radio.getState().wantsPlay)return;
   duringOwned=true;ambientOwned=false;scheduleOwned=false;void radio.start('timer-during');
  }
  function stopDuring(keep=false){
   if(ambientOwned){ambientOwned=false;ambient.stop(true);}
   if(!duringOwned)return;duringOwned=false;
   if(keep)return;
   if(armed&&T.windowAt(new Date(),getSettings())){scheduleOwned=true;attempted='active';return;}
   radio.stop('paused','La musica della tua pausa si ferma con il timer.');
  }
  async function prepare(armSchedule=false){
   // Both calls originate in the user's gesture, before any await.
   const sound=unlockSound(),media=getSettings().radioEnabled?radio.unlock():Promise.resolve(false);
   const [soundOK,radioOK]=await Promise.all([sound,media]);if(armSchedule){armed=radioOK;attempted='';}
   hint(soundOK||radioOK?'':'Audio non autorizzato. Resta disponibile l\u2019avviso visivo.');
   if(armSchedule){evaluate();notify(radioOK?'Audio preparato. Salva gli orari per attivare la programmazione.':'Autorizzazione audio non riuscita. Prova il pulsante Play della radio.');}
   return{soundOK,radioOK};
  }
  function startTimer(){
   if(!getSettings().timerEnabled)return;
   if(state.state==='running'){pauseTimer();return;}
   if(state.state==='paused'){void unlockSound();state.deadline=Date.now()+state.remaining;state.state='running';startDuring();save();render();return;}
   if(state.state==='done'){reset();return;}
   const duration=readDuration();if(!duration){$('#timer-error').textContent='Scegli una durata da 1 secondo a 24 ore, con minuti e secondi da 00 a 59.';$('#timer-error').hidden=false;return;}
   $('#timer-error').hidden=true;hint('');clearSound();result('');alarmRadio=false;duringSuppressed=false;void unlockSound();if(timerSettings().radioEnabled&&timerSettings().timerDuring!=='radio'&&timerSettings().timerAction==='radio')void radio.unlock();state={options:T.timerOptions(timerSettings()),state:'running',duration,remaining:duration,deadline:Date.now()+duration,id:Date.now().toString(36)+Math.random().toString(36).slice(2,6)};restored=false;startDuring();save();render();M.flash($('#timer-running'));notify('Il tuo momento \u00e8 iniziato.');
  }
  function pauseTimer(){if(state.state!=='running')return;const left=T.remaining(state);if(left<=0){finish();return;}state.remaining=left;state.state='paused';stopDuring();save();render();}
  function reset(){draftOptions=T.timerOptions(getSettings());hint('');clearSound();stopDuring();duringSuppressed=false;alarmRadio=false;state={state:'idle',duration:getSettings().timerMinutes*60000,remaining:getSettings().timerMinutes*60000,deadline:0,id:''};save();result('');$('#timer-error').hidden=true;setDuration(state.duration);render();}
  function finish(silentRestore=false){
   if(state.state!=='running')return;stopDuring(!silentRestore&&timerSettings().timerAction==='radio'&&getSettings().radioEnabled);state.state='done';state.remaining=0;save();render();
   if(silentRestore){result('Il timer \u00e8 terminato mentre la pagina non era attiva. Nessun audio avviato al ripristino.',timerSettings().timerAction!=='silent');return;}
   notify('Il tempo \u00e8 tuo. Il tuo momento \u00e8 terminato.');const s=timerSettings();
   if(!s.timerEnabled)return;
   if(s.timerAction==='radio'&&s.radioEnabled){alarmRadio=true;result('Il tempo \u00e8 terminato. Sintonizzo la tua radio...');if(radio.getState().state==='playing'){alarmRadio=false;result('Il tempo \u00e8 terminato. La tua radio sta gi\u00e0 suonando.');}else void radio.start('timer');}
   else if(s.timerAction==='silent'){result('Il tuo momento \u00e8 terminato. Prenditi ancora un respiro.');}
   else {const played=playSound(s.timerSound,s.timerVolume);result(played?'Il tuo momento \u00e8 terminato. Prenditi ancora un respiro.':'Il tempo \u00e8 terminato. Tocca per ascoltare l\u2019avviso.',!played);}
  }
  function renderOptions(active){
   const s=timerSettings();document.querySelectorAll('[data-timer-during]').forEach(b=>{
    const kind=b.dataset.timerDuring,available=kind==='silent'||kind==='radio'&&getSettings().radioEnabled&&!!radio.station().id||kind==='ambient'&&getSettings().ambientEnabled;
    b.disabled=active||!available;b.setAttribute('aria-pressed',String(kind===s.timerDuring));
    b.dataset.istanteTooltip=!available?'Attiva questa sorgente nelle impostazioni.':active?'Scelta confermata per questo timer.':kind==='ambient'?ambient.label():kind==='radio'?radio.station().name:'Nessun avvio automatico';
   });$('#timer-dialog').dataset.state=state.state;
   const source=$('#timer-source-description');
   const note=s.timerDuring==='ambient'?ambient.label()+' \u00b7 disponibile offline':s.timerDuring==='radio'?radio.station().name+' \u00b7 richiede Internet':'Solo il timer. Un audio gi\u00e0 avviato a mano non viene interrotto.';
   if(source&&source.textContent!==note)source.textContent=note;
  }
  document.querySelectorAll('[data-timer-during]').forEach(b=>b.addEventListener('click',()=>{if(state.state!=='idle')return;draftOptions=T.timerOptions({...draftOptions,timerDuring:b.dataset.timerDuring});render();}));
  function render(){
   const s=getSettings(),ms=T.remaining(state),active=state.state!=='idle';$('#timer-open').hidden=!s.timerEnabled;$('#timer-chip').hidden=!s.timerEnabled||!active;$('#timer-chip').dataset.state=state.state;
   $('#timer-duration').hidden=active;$('#timer-presets').hidden=active;document.querySelectorAll('[data-duration]').forEach(b=>b.disabled=active);$('#timer-running').hidden=!active;$('#timer-session-options').hidden=false;$('#timer-reset').hidden=!active;$('#timer-dialog').dataset.state=state.state;$('#timer-reset').textContent=state.state==='done'?'Chiudi':'Annulla';
   $('#timer-state-label').textContent=state.state==='paused'?'Il tempo pu\u00f2 aspettare.':state.state==='done'?'Un momento per te.':'Il tuo momento, in corso';
   const text=T.display(ms);$('#timer-readout').textContent=text;$('#timer-chip-time').textContent=state.state==='done'?'Tempo finito':text;$('#timer-chip-label').textContent=state.state==='paused'?'In pausa':state.state==='done'?'Prenditi un respiro':'Un tempo per te';
   $('#timer-chip-toggle').hidden=state.state==='done';$('#timer-chip-dismiss').hidden=state.state!=='done';$('#timer-chip-toggle').innerHTML='<span class="icon">'+icon(state.state==='paused'?'play':'pause')+'</span>';$('#timer-chip-toggle').setAttribute('aria-label',state.state==='paused'?'Riprendi il timer':'Metti in pausa il timer');
   const progress=state.duration?Math.max(0,Math.min(100,(1-ms/state.duration)*100)):0;$('#timer-progress').setAttribute('aria-valuenow',String(Math.round(progress)));$('#timer-progress i').style.width=progress+'%';const orbit=$('#timer-orbit');if(orbit){const elapsed=state.duration?Math.max(0,state.duration-ms):0;orbit.style.setProperty('--timer-progress',progress+'%');orbit.style.setProperty('--timer-second-angle',(elapsed/60000*360)+'deg');orbit.dataset.state=state.state;}const modalClock=$('#timer-modal-clock');if(modalClock)modalClock.textContent=T.formatTime(Date.now(),s.timeFormat);
   const view=state.state+':'+s.timerEnabled;if(lastView!==view){lastView=view;const label=state.state==='running'?'Pausa':state.state==='paused'?'Riprendi':state.state==='done'?'Nuovo timer':'Inizia';$('#timer-start').innerHTML='<span class="icon">'+icon(state.state==='running'?'pause':'play')+'</span><span>'+label+'</span>';$('#timer-start').disabled=!s.timerEnabled;}
   renderOptions(active);describe();
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
   if(current&&armed&&!attempted&&!duringOwned&&!ambientOwned){attempted='active';scheduleOwned=true;void radio.start('schedule');}
   $('#radio-program-info').hidden=!s.radioEnabled||!s.radioScheduleEnabled;
   const text=scheduleText(now,current);if($('#radio-program-status').textContent!==text)$('#radio-program-status').textContent=text;
   const hint=text+(!armed?' Le modifiche alle fasce vanno salvate.':' Il browser pu\u00f2 comunque richiedere Play.');
   if($('#schedule-settings-status').textContent!==hint)$('#schedule-settings-status').textContent=hint;
   $('#radio-program-enable').hidden=armed;$('#schedule-authorize').textContent=armed?'Audio preparato \u00b7 riabilita':'Abilita audio per questa sessione';
  }
  function apply(){
   const s=getSettings(),stamp=JSON.stringify([s.timerMinutes,T.timerOptions(s)]),changed=stamp!==defaultsStamp;
   if(state.state==='idle'&&changed){draftOptions=T.timerOptions(s);setDuration(s.timerMinutes*60000);}defaultsStamp=stamp;
   if(!s.timerEnabled&&state.state!=='idle')reset();if((!s.radioEnabled||!radio.station().id)&&duringOwned)stopDuring();if(!s.ambientEnabled&&ambientOwned)stopDuring();if(!s.radioEnabled){armed=false;if(alarmRadio){alarmRadio=false;result('Radio disattivata. Resta l\u2019avviso visivo.');}}render();evaluate();
  }
  function tick(){if(destroyed)return;if(state.state==='running'&&T.remaining(state)<=0){finish(restored);restored=false;}else restored=false;if(state.state!=='idle'||$('#timer-dialog')?.open)render();evaluate();}
  function open(){if(!getSettings().timerEnabled)return;render();openTimer();}
  function openModal(){if(!getSettings().timerEnabled)return;render();openTimer();}
  $('#timer-open').addEventListener('click',open);$('#timer-chip-open').addEventListener('click',open);$('#timer-start').addEventListener('click',startTimer);$('#timer-reset').addEventListener('click',reset);$('#timer-chip-delete')?.addEventListener('click',reset);$('#timer-chip-dismiss').addEventListener('click',reset);$('#timer-chip-toggle').addEventListener('click',()=>state.state==='running'?pauseTimer():startTimer());
  
  $('#timer-duration-range')?.addEventListener('input',event=>{if(state.state!=='idle')return;setDuration(Math.max(1,Number(event.target.value)||25)*60000);});
  function chooseDial(clientX,clientY){if(state.state!=='idle')return;const dial=$('#timer-duration-dial'),r=dial.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=clientX-cx,dy=clientY-cy;if(Math.hypot(dx,dy)<r.width*.18)return;let angle=Math.atan2(dx,-dy);if(angle<0)angle+=Math.PI*2;let minutes=Math.round(angle/(Math.PI*2)*60);if(minutes===0)minutes=60;setDuration(minutes*60000);}
  let dialDrag=false;$('#timer-duration-dial')?.addEventListener('pointerdown',e=>{if(state.state!=='idle')return;dialDrag=true;e.currentTarget.setPointerCapture?.(e.pointerId);chooseDial(e.clientX,e.clientY);});$('#timer-duration-dial')?.addEventListener('pointermove',e=>{if(dialDrag)chooseDial(e.clientX,e.clientY);});$('#timer-duration-dial')?.addEventListener('pointerup',e=>{if(dialDrag)chooseDial(e.clientX,e.clientY);dialDrag=false;});$('#timer-duration-dial')?.addEventListener('pointercancel',()=>dialDrag=false);$('#timer-duration-dial')?.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowDown','ArrowRight','ArrowUp','Home','End'].includes(e.key)||state.state!=='idle')return;e.preventDefault();if(e.key==='Home')setDuration(60000);else if(e.key==='End')setDuration(60*60000);else nudgeDuration(['ArrowLeft','ArrowDown'].includes(e.key)?-1:1);});document.querySelectorAll('.timer-dial-mark').forEach(mark=>mark.addEventListener('click',()=>{if(state.state==='idle')setDuration(Number(mark.dataset.minute)*60000);}));
  function nudgeDuration(direction){if(state.state!=='idle')return;const current=readDuration()||getSettings().timerMinutes*60000;setDuration(Math.max(60000,Math.min(86400000,current+direction*60000)));}
  $('#timer-duration-decrease')?.addEventListener('click',()=>nudgeDuration(-1));
  $('#timer-duration-increase')?.addEventListener('click',()=>nudgeDuration(1));
  ['#timer-hours','#timer-minutes','#timer-seconds'].forEach(selector=>$(selector)?.addEventListener('input',()=>{if(state.state!=='idle')return;const ms=readDuration();if(ms){const minutes=Math.max(1,Math.round(ms/60000)),range=$('#timer-duration-range'),display=$('#timer-duration-display');if(range)range.value=String(Math.min(120,minutes));if(display)display.textContent=minutes<60?minutes+' minut'+(minutes===1?'o':'i'):minutes%60?Math.floor(minutes/60)+' h '+(minutes%60)+' min':Math.floor(minutes/60)+(minutes===60?' ora':' ore');document.querySelectorAll('[data-duration]').forEach(b=>b.classList.toggle('active',Number(b.dataset.duration)*60000===ms));}}));
  function choosePreset(button,attribute){if(state.state!=='idle'||!button)return;const minutes=Number(button.dataset[attribute]);if(!Number.isFinite(minutes)||minutes<1)return;setDuration(minutes*60000);render();}
  $('#timer-presets')?.addEventListener('click',event=>{const button=event.target.closest('[data-duration]');if(!button)return;event.preventDefault();choosePreset(button,'duration');});
  $('#timer-retry-audio').addEventListener('click',async()=>{const s=timerSettings();if(s.timerAction==='radio'&&s.radioEnabled){alarmRadio=true;void radio.start('timer');}else if(s.timerAction==='silent'){result('Il timer prevede soltanto un avviso visivo.');}else{const ok=await unlockSound();const played=ok&&playSound(s.timerSound,s.timerVolume);result(played?'Prenditi ancora un respiro.':'Audio non disponibile in questo browser.',!played);}});
  $('#timer-sound-preview').addEventListener('click',async()=>{const s=getDraft();if(!s.timerEnabled||s.timerAction!=='sound')return;const ok=await unlockSound();if(!ok||!playSound(s.timerSound,s.timerVolume))notify('Il browser non ha autorizzato il suono.');else if(s.timerVolume===0)notify('Il volume del suono finale \u00e8 a zero.');});
  $('#schedule-authorize').addEventListener('click',()=>void prepare(true));$('#radio-program-enable').addEventListener('click',()=>void prepare(true));
  document.addEventListener('istante:ambient-manual',()=>{ambientOwned=false;duringOwned=false;if(state.state==='running'||state.state==='paused')duringSuppressed=true;});
  document.addEventListener('istante:radio-manual',e=>{duringOwned=false;ambientOwned=false;if(state.state==='running'||state.state==='paused')duringSuppressed=true;const current=T.windowAt(new Date(),getSettings());if(e.detail.playing)armed=true;if(current){attempted='active';scheduleOwned=true;}evaluate();});
  document.addEventListener('istante:radio-state',e=>{if(duringOwned&&state.state==='running'&&['error','offline','blocked'].includes(e.detail.state))hint('Radio non disponibile. Il timer continua.');if(!alarmRadio||state.state!=='done')return;const r=e.detail;if(r.state==='playing'){alarmRadio=false;result('Il tuo momento \u00e8 terminato. La radio ti fa compagnia.');}else if(['error','offline','blocked'].includes(r.state)){alarmRadio=false;const s=timerSettings();playSound(s.timerSound,s.timerVolume);result(r.state==='blocked'?'Il tempo \u00e8 terminato. Tocca per avviare la radio.':'Radio non disponibile. Il timer \u00e8 terminato; puoi riprovare.',true);}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});window.addEventListener('pageshow',()=>tick());
  window.addEventListener('pagehide',()=>{save();clearSound();});
  setDuration(state.state==='idle'?getSettings().timerMinutes*60000:state.duration);apply();tick();const interval=setInterval(tick,500);
  return{apply,open,prepare,clearSound,inspect:()=>({timer:{...state},armed,attempted,window:previousWindow,duringOwned,ambientOwned,duringSuppressed}),destroy(){destroyed=true;clearInterval(interval);stopDuring();clearSound();}};
 }
 window.IstanteMoments={create};
})();
