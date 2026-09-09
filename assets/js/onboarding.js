/* Optional coach marks: local SVG ink arrows, no external fonts or assets. */
(function(){
 'use strict';
 function create({store,open}){
  const $=s=>document.querySelector(s),byId=id=>document.getElementById(id),M=window.IstanteMotion;
  const dialog=byId('tour-dialog'),card=byId('tour-card'),seenKey='welcome.3.10';
  let ready=false,pending=false,index=0,steps=[],raf=0,target=null,transitioning=false,revealed=[],simulations=[],pendingStepApply=null;
  const definitions=[
   {target:'.clock-block',fallback:'.clock-section',note:'inizia dal tuo ritmo',title:'Come vuoi vedere il tempo?',copy:"Istante può restare discreto sulla scrivania oppure diventare il centro dello schermo. Scegli l’orologio che ti fa stare meglio.",choices:{key:'clockStyle',items:[['digital','Digitale'],['analog','Analogico']]}},
   {target:'.thought-block',note:'una frase, al momento giusto',title:'Quanto spazio vuoi dare ai pensieri?',copy:'Puoi ricevere un nuovo pensiero al mattino e alla sera, oppure lasciarne uno con te per tutta la giornata.',choices:{key:'mode',items:[['twice','Mattina & sera'],['daily','Una al giorno']]}},
   {target:'#environment-line',fallback:'#active-info-strip',force:true,simulate:'weather',note:'il cielo resta leggero',title:'Meteo, alba e tramonto quando servono.',copy:'Puoi attivare il meteo e usare la posizione del dispositivo, oppure continuare senza configurarlo.'},
   {target:'#goal-strip',note:'una direzione, senza fretta',title:'Dai un orizzonte al prossimo capitolo.',copy:'Scegli la fine dell’anno oppure imposta subito un titolo e una data importante.',choices:{key:'goalPreset',items:[['year','Fine anno'],['custom','Titolo e data']]}},
   {target:'.collection-link',note:'qui ritrovi le tue parole',title:'La mia raccolta apre la biblioteca.',copy:'Frasi, preferiti e raccolte personali restano insieme. Puoi creare una raccolta tua e aggiungere i pensieri uno alla volta.'},
   {target:'#next-phrase',note:'quando vuoi cambiare aria',title:'Un altro pensiero, subito.',copy:'Questo tasto cambia frase senza modificare la tua programmazione automatica.'},
   {target:'#favorite-current',note:'questo cuore conserva',title:'Tieni vicino ciò che ti parla.',copy:'Il cuore salva il pensiero corrente tra i preferiti, così puoi ritrovarlo nella biblioteca.'},
   {target:'#timer-open',force:true,simulate:'timer',note:'una pausa con un confine',title:'Dove vuoi usare il timer?',copy:'Puoi aprirlo in una finestra oppure dedicargli una pagina intera. La durata la scegli quando lo apri.'},
   {target:'#calendar-open',force:true,simulate:'calendar',note:'i tuoi giorni, senza rumore',title:'Il calendario è sempre raggiungibile.',copy:'Decidi se abilitarlo adesso. Se vuoi collegare un calendario ICS, apri la pagina Calendario e usa Gestisci.'},
   {target:'#share-open',note:'un pensiero da regalare',title:'Porta con te questo istante.',copy:'Condividi una cartolina o un link. Scegli formato e dettagli senza cambiare la schermata principale.'},
   {target:'#fullscreen',note:'quando vuoi togliere il resto',title:'Uno schermo, un solo momento.',copy:'Schermo intero rende Istante più immersivo su monitor, tablet o uno schermo dedicato.'},
   {target:'#settings-open',note:'l’ultimo tocco è tuo',title:'Tutto il resto vive qui.',copy:'Aspetto, dimensione dei caratteri, meteo, calendario, audio, timer e comportamento dello screensaver restano configurabili nelle impostazioni.',choices:{key:'theme',items:[['auto','Auto'],['light','Carta'],['dark','Notte']]}},
   {target:'#radio-mini',fallback:'#settings-open',note:'un suono può cambiare la stanza',title:'Costruisci la tua atmosfera.',copy:'Radio lo-fi e suoni ambientali possono accompagnare lavoro, lettura o una pausa. Nessun audio parte da solo.'}
  ];
  function visible(el){if(!el||el.hidden||el.closest('[hidden]'))return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=='hidden';}
  function snapshotNode(el){return el?{el,hidden:el.hidden,text:el.textContent,html:el.innerHTML,tooltip:el.dataset.istanteTooltip||''}:null;}
  function simulateWeather(){
   const env=byId('environment-line'),weather=byId('weather-line'),solar=byId('solar-line');if(!env||!weather)return;
   const nodes=[env,weather,solar,byId('weather-icon'),byId('weather-text'),byId('weather-condition'),byId('weather-place'),byId('weather-age'),byId('sunrise-time'),byId('sunset-time'),byId('solar-note')].map(snapshotNode).filter(Boolean);
   simulations.push({type:'weather',nodes});
   env.hidden=false;weather.hidden=false;if(solar)solar.hidden=false;env.classList.add('tour-simulated-weather');
   const icon=byId('weather-icon');if(icon)icon.innerHTML=window.IstanteIcons?.render?.('sun')||'☀';
   const text=byId('weather-text'),condition=byId('weather-condition'),place=byId('weather-place'),age=byId('weather-age');if(text)text.textContent='18°';if(condition)condition.textContent='Sereno';if(place)place.textContent='La tua città';if(age)age.textContent='';
   const rise=byId('sunrise-time'),set=byId('sunset-time'),note=byId('solar-note');if(rise)rise.textContent='07:30';if(set)set.textContent='18:45';if(note)note.textContent='Esempio';
  }
  function selectSteps(){
   revealed=[];simulations=[];
   return definitions.map(d=>{
    const primary=$(d.target);
    if(primary&&d.force&&!visible(primary)&&primary.hidden){revealed.push({el:primary,hidden:true});primary.hidden=false;primary.classList.add('tour-temporary-target');}
    if(d.simulate==='weather'&&primary&&!visible(byId('weather-line')))simulateWeather();
    const fallback=$(d.fallback||'__unused__');return{...d,el:visible(primary)?primary:fallback};
   }).filter(d=>visible(d.el));
  }
  function restoreRevealed(){
   const saved=store.read('settings',{});
   for(const sim of simulations){for(const snap of sim.nodes){const el=snap.el;if(!el?.isConnected)continue;el.hidden=snap.hidden;el.textContent=snap.text;el.innerHTML=snap.html;if(snap.tooltip)el.dataset.istanteTooltip=snap.tooltip;else delete el.dataset.istanteTooltip;el.classList.remove('tour-simulated-weather');}}
   simulations=[];
   for(const item of revealed){
    const el=item.el;el.classList.remove('tour-temporary-target');
    if(el.id==='calendar-open')el.hidden=saved.calendarEnabled===false;
    else if(el.id==='timer-open')el.hidden=saved.timerEnabled===false;
    else el.hidden=item.hidden;
   }
   revealed=[];
  }
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function rectPath(x,y,w,h){const r=Math.min(16,w/3,h/3);return `M ${x+r} ${y} Q ${x+w*.55} ${y-2} ${x+w-r} ${y} Q ${x+w+1} ${y-1} ${x+w} ${y+r} L ${x+w} ${y+h-r} Q ${x+w+2} ${y+h+1} ${x+w-r} ${y+h} Q ${x+w*.4} ${y+h+2} ${x+r} ${y+h} Q ${x-1} ${y+h} ${x} ${y+h-r} L ${x} ${y+r} Q ${x-2} ${y-1} ${x+r} ${y}`;}
  function position(){
   raf=0;if(!dialog.open||!target)return;
   const W=window.visualViewport?.width||innerWidth,H=window.visualViewport?.height||innerHeight;
   byId('tour-sketch').setAttribute('viewBox',`0 0 ${W} ${H}`);
   const raw=target.getBoundingClientRect(),margin=10;
   const r={x:clamp(raw.x-6,4,W-4),y:clamp(raw.y-6,4,H-4),w:Math.min(raw.width+12,W-8),h:Math.min(raw.height+12,H-8)};
   r.w=Math.min(r.w,W-4-r.x);r.h=Math.min(r.h,H-4-r.y);
   card.style.width=Math.min(380,W-28,H<450?Math.max(240,W*.50):380)+'px';card.style.maxHeight=Math.max(140,H-28)+'px';
   const ch=card.offsetHeight,cw=card.offsetWidth,cx=r.x+r.w/2,cy=r.y+r.h/2,gap=48;
   const spots=[{x:cx-cw/2,y:r.y+r.h+gap},{x:cx-cw/2,y:r.y-ch-gap},{x:r.x+r.w+gap,y:cy-ch/2},{x:r.x-cw-gap,y:cy-ch/2}];
   function scored(p){const x=clamp(p.x,14,W-cw-14),y=clamp(p.y,14,H-ch-14),ox=Math.max(0,Math.min(x+cw,r.x+r.w+margin)-Math.max(x,r.x-margin)),oy=Math.max(0,Math.min(y+ch,r.y+r.h+margin)-Math.max(y,r.y-margin));return{x,y,score:ox*oy*100+Math.abs(x-p.x)+Math.abs(y-p.y)};}
   const chosen=spots.map(scored).sort((a,b)=>a.score-b.score)[0];card.style.left=chosen.x+'px';card.style.top=chosen.y+'px';
   const cut=byId('tour-cutout');for(const [k,v]of Object.entries({x:r.x,y:r.y,width:r.w,height:r.h}))cut.setAttribute(k,v);
   byId('tour-outline').setAttribute('d',rectPath(r.x,r.y,r.w,r.h));
   const ccx=chosen.x+cw/2,ccy=chosen.y+ch/2,dx=cx-ccx,dy=cy-ccy;let sx,sy,ex,ey;
   if(Math.abs(dx)/(cw/2)>Math.abs(dy)/(ch/2)){sx=dx>0?chosen.x+cw:chosen.x;sy=clamp(cy,chosen.y+25,chosen.y+ch-25);ex=dx>0?r.x-5:r.x+r.w+5;ey=cy;}
   else{sx=clamp(cx,chosen.x+30,chosen.x+cw-30);sy=dy>0?chosen.y+ch:chosen.y;ex=cx;ey=dy>0?r.y-5:r.y+r.h+5;}
   const vx=ex-sx,vy=ey-sy,len=Math.max(1,Math.hypot(vx,vy)),nx=-vy/len,ny=vx/len,bend=Math.min(35,len*.2);
   const c1x=sx+vx*.28+nx*bend,c1y=sy+vy*.28+ny*bend,c2x=sx+vx*.74+nx*bend*.7,c2y=sy+vy*.74+ny*bend*.7;
   const path=`M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
   byId('tour-arrow').setAttribute('d',path);byId('tour-arrow-shadow').setAttribute('d',path);byId('tour-arrow-shadow').setAttribute('transform','translate(1.1 -1.1)');
   const a=Math.atan2(ey-c2y,ex-c2x),tip=11;byId('tour-arrow-tip').setAttribute('d',`M ${ex-tip*Math.cos(a-.48)} ${ey-tip*Math.sin(a-.48)} Q ${ex-2} ${ey+1} ${ex} ${ey} L ${ex-tip*Math.cos(a+.48)} ${ey-tip*Math.sin(a+.48)}`);
  }
  function queue(){if(!raf)raf=requestAnimationFrame(position);}
  function localDateTime(d){const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'T'+z(d.getHours())+':'+z(d.getMinutes());}
  function renderGoalEditor(host){
   let box=host.querySelector('.tour-goal-editor');if(box){box.hidden=false;position();return;}
   const saved=store.read('settings',{}),now=new Date(),fallback=new Date(now.getFullYear()+1,0,1,0,0);
   box=document.createElement('div');box.className='tour-goal-editor';
   box.innerHTML='<label>Titolo<input maxlength="90" type="text" placeholder="Il mio prossimo capitolo"></label><label>Data<input type="datetime-local"></label><button type="button" class="secondary-button">Usa questo traguardo</button>';
   const title=box.querySelector('input[type=text]'),end=box.querySelector('input[type=datetime-local]');title.value=saved.goalTitle||'Il mio prossimo capitolo';end.value=saved.goalEnd||localDateTime(fallback);
   box.querySelector('button').addEventListener('click',()=>{const endDate=new Date(end.value);if(!title.value.trim()||!Number.isFinite(+endDate)||endDate<=new Date()){if(!matchMedia('(pointer:coarse)').matches)end.focus();return;}const patch={goalMode:'custom',goalTitle:title.value.trim(),goalStart:localDateTime(new Date()),goalEnd:end.value};store.write('settings',{...store.read('settings',{}),...patch});document.dispatchEvent(new CustomEvent('istante:onboarding-setting',{detail:{key:'goalPreset',value:'custom',patch}}));host.querySelectorAll('button[data-action=custom-goal]').forEach(b=>b.setAttribute('aria-pressed','true'));M.flash(box);});
   host.append(box);requestAnimationFrame(()=>{if(!matchMedia('(pointer:coarse)').matches)title.focus({preventScroll:true});position();});
  }
  function renderWeatherSetup(host){
   let box=host.querySelector('.tour-inline-setup');if(box){box.hidden=false;position();return;}box=document.createElement('div');box.className='tour-inline-setup tour-weather-setup';box.innerHTML='<div class="tour-setup-actions tour-weather-actions"><button type="button" class="primary-button" data-weather-action="locate">Attiva il meteo</button><button type="button" class="text-button" data-weather-action="later">Non ora</button></div><p class="field-note" data-weather-status>Per attivarlo Istante chiederà la posizione del dispositivo. La posizione resta nel browser.</p>';host.append(box);
   const status=box.querySelector('[data-weather-status]'),locate=box.querySelector('[data-weather-action=locate]');
   locate.onclick=()=>{locate.disabled=true;status.textContent='Attendo la posizione…';document.dispatchEvent(new CustomEvent('istante:onboarding-weather-locate',{detail:{done(ok,message){locate.disabled=false;status.textContent=message|| (ok?'Meteo attivato.':'Posizione non disponibile.');if(ok){locate.textContent='Meteo attivato';locate.setAttribute('aria-pressed','true');}position();}}}));};
   box.querySelector('[data-weather-action=later]').onclick=()=>{store.write('settings',{...store.read('settings',{}),weather:false});document.dispatchEvent(new CustomEvent('istante:onboarding-setting',{detail:{key:'weather',value:false}}));status.textContent='Va bene. Puoi attivarlo più tardi dalle impostazioni.';position();};position();
  }
  function renderTimerSetup(host){
   let box=host.querySelector('.tour-timer-setup');if(box){box.hidden=false;position();return;}const saved=store.read('settings',{}),current=saved.timerDisplay==='page'?'page':'modal';box=document.createElement('div');box.className='tour-timer-setup';box.innerHTML='<span class="tour-inline-label">Come vuoi aprirlo?</span><div class="tour-mini-tabs" role="group" aria-label="Apertura timer"><button type="button" data-timer-display="modal">Finestra</button><button type="button" data-timer-display="page">Pagina</button></div>';
   box.querySelectorAll('[data-timer-display]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.timerDisplay===current));b.onclick=()=>{box.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');const value=b.dataset.timerDisplay;store.write('settings',{...store.read('settings',{}),timerDisplay:value});document.dispatchEvent(new CustomEvent('istante:onboarding-setting',{detail:{key:'timerDisplay',value}}));M.flash(b);};});host.append(box);position();
  }
  function renderCalendarSetup(host){
   let box=host.querySelector('.tour-inline-setup');if(box){box.hidden=false;position();return;}const saved=store.read('settings',{});let chosen=saved.calendarEnabled!==false;box=document.createElement('div');box.className='tour-inline-setup tour-calendar-setup';box.innerHTML='<span class="tour-inline-label">Vuoi usare il calendario?</span><div class="tour-mini-tabs" role="group" aria-label="Attivazione calendario"><button type="button" data-calendar-enabled="true">Attivo</button><button type="button" data-calendar-enabled="false">Non ora</button></div><button type="button" class="text-button tour-calendar-open-link">Apri il calendario per collegare un ICS <span aria-hidden="true">→</span></button><p class="field-note">La scelta viene applicata quando premi Avanti.</p>';host.append(box);
   const sync=()=>box.querySelectorAll('[data-calendar-enabled]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.calendarEnabled==='true')===chosen)));sync();
   box.querySelectorAll('[data-calendar-enabled]').forEach(b=>b.onclick=()=>{chosen=b.dataset.calendarEnabled==='true';sync();M.flash(b);});
   pendingStepApply=()=>{store.write('settings',{...store.read('settings',{}),calendarEnabled:chosen});document.dispatchEvent(new CustomEvent('istante:onboarding-setting',{detail:{key:'calendarEnabled',value:chosen}}));};
   box.querySelector('.tour-calendar-open-link').onclick=()=>{pendingStepApply?.();pendingStepApply=null;M.dismiss(dialog);setTimeout(()=>document.dispatchEvent(new CustomEvent('istante:onboarding-open-calendar')),120);};position();
  }
  function showStep(){
   pendingStepApply=null;const d=steps[index];if(!d){M.dismiss(dialog);return;}target=d.el;
   card.classList.remove('tour-step-transition');dialog.classList.remove('tour-step-changing');void card.offsetWidth;card.classList.add('tour-step-transition');dialog.classList.add('tour-step-changing');
   dialog.dataset.step=String(index+1);byId('tour-step').textContent='Il tuo istante / '+(index+1)+' di '+steps.length;
   byId('tour-note').textContent=d.note;byId('tour-title').textContent=d.title;byId('tour-copy').textContent=d.copy;
   const choices=byId('tour-choices');choices.replaceChildren();choices.hidden=!d.choices&&!d.simulate;
   if(d.choices){
    const defaults={clockStyle:'digital',mode:'twice',timerMinutes:25,theme:'dark',goalPreset:'year',calendarEnabled:true,weather:true},saved=store.read('settings',{});
    const current=d.choices.key==='goalPreset'?(saved.goalMode==='custom'?'custom':'year'):(saved[d.choices.key]??defaults[d.choices.key]);
    for(const [value,label] of d.choices.items){
     const b=document.createElement('button');b.type='button';b.className='tour-choice';b.textContent=label;b.setAttribute('aria-pressed',String(current===value));
     if(d.choices.key==='goalPreset'&&value==='custom')b.dataset.action='custom-goal';
     b.addEventListener('click',()=>{
      choices.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');
      if(d.choices.key==='goalPreset'&&value==='custom'){renderGoalEditor(choices);M.flash(b);return;}
      if(d.choices.key==='goalPreset'){
       const now=new Date(),patch={goalMode:'year'};
       if(value!=='year'){
        const end=new Date(now);if(value.endsWith('m'))end.setMonth(end.getMonth()+Number(value.slice(0,-1)));else end.setFullYear(end.getFullYear()+Number(value.slice(0,-1)));
        const local=x=>{const z=n=>String(n).padStart(2,'0');return x.getFullYear()+'-'+z(x.getMonth()+1)+'-'+z(x.getDate())+'T'+z(x.getHours())+':'+z(x.getMinutes());};
        patch.goalMode='custom';patch.goalTitle='Il mio prossimo capitolo';patch.goalStart=local(now);patch.goalEnd=local(end);
       }
       store.write('settings',{...store.read('settings',{}),...patch});document.dispatchEvent(new CustomEvent('istante:onboarding-setting',{detail:{key:'goalPreset',value,patch}}));
      }else{
       const nowSettings=store.read('settings',{});store.write('settings',{...nowSettings,[d.choices.key]:value});document.dispatchEvent(new CustomEvent('istante:onboarding-setting',{detail:{key:d.choices.key,value}}));
      }
      M.flash(b);
     });choices.append(b);
    }
   }
   if(d.simulate==='weather')renderWeatherSetup(choices);else if(d.simulate==='calendar')renderCalendarSetup(choices);else if(d.simulate==='timer')renderTimerSetup(choices);
   byId('tour-back').disabled=index===0;byId('tour-next').innerHTML=(index===steps.length-1?'Il tempo è mio':'Avanti')+'<span class="icon">'+window.IstanteIcons.render('arrow')+'</span>';
   position();M.flash(card);setTimeout(()=>{card.classList.remove('tour-step-transition');dialog.classList.remove('tour-step-changing');},420);byId('tour-next').focus({preventScroll:true});
  }
  function startTour(){transitioning=true;const welcome=byId('welcome-dialog');welcome.addEventListener('close',()=>{transitioning=false;steps=selectSteps();index=0;if(!steps.length)return;document.body.classList.add('is-touring');open('tour');showStep();},{once:true});M.dismiss(welcome);}
  function showWelcome(force=false){if(!ready||!force&&store.read(seenKey,false))return;if($('dialog[open]')){pending=true;return;}pending=false;open('welcome');}
  byId('welcome-tour').addEventListener('click',startTour);
  byId('tour-next').addEventListener('click',()=>{if(pendingStepApply){pendingStepApply();pendingStepApply=null;}if(index>=steps.length-1)M.dismiss(dialog);else{index++;showStep();}});
  byId('tour-back').addEventListener('click',()=>{pendingStepApply=null;if(index>0){index--;showStep();}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();byId('tour-next').click();}else if(e.key==='ArrowLeft'){e.preventDefault();byId('tour-back').click();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('is-touring');target=null;restoreRevealed();store.write(seenKey,true);});
  byId('welcome-dialog').addEventListener('close',()=>{store.write(seenKey,true);store.write('welcome.seen',true);});
  byId('welcome-reopen').addEventListener('click',()=>{const d=byId('settings-dialog');d.addEventListener('close',()=>showWelcome(true),{once:true});M.dismiss(d);});
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{if(pending&&!transitioning)queueMicrotask(()=>showWelcome());}));
  window.addEventListener('resize',queue,{passive:true});window.visualViewport?.addEventListener('resize',queue,{passive:true});
  return{ready(){ready=true;if(location.hash.startsWith('#p='))return;showWelcome();}};
 }
 window.IstanteOnboarding={create};
})();
