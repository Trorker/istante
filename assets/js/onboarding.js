/* Istante onboarding: presentation-first. Only the device position can be configured here. */
(function(){
 'use strict';
 function create({store,open}){
  const $=s=>document.querySelector(s),byId=id=>document.getElementById(id),M=window.IstanteMotion;
  const dialog=byId('tour-dialog'),card=byId('tour-card'),seenKey='welcome.3.10';
  let ready=false,pending=false,index=0,steps=[],raf=0,target=null,transitioning=false,simulations=[],originView='dashboard';
  const isTouch=()=>navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches;
  const definitions=[
   {target:'.clock-block',fallback:'.clock-section',note:'inizia dal tuo ritmo',title:'Il tempo resta al centro.',copy:'Orologio e data sono la base di Istante: leggibili da vicino e da lontano, senza riempire lo schermo di informazioni inutili.'},
   {target:'.thought-block',note:'una frase, al momento giusto',title:'Un pensiero che lascia spazio.',copy:'Le frasi accompagnano la giornata e possono cambiare nel tempo senza trasformare Istante in una lista di notifiche o attività.'},
   {target:'#environment-line',fallback:'#active-info-strip',force:true,simulateWeather:true,locationSetup:true,note:'il cielo resta leggero',title:'Meteo e luce della giornata.',copy:'Qui puoi vedere temperatura, condizioni, alba e tramonto. Se non hai ancora impostato una località, durante la guida vengono mostrati dati di esempio; la posizione è l’unica configurazione che puoi fare direttamente qui.'},
   {target:'#goal-strip',note:'una direzione, senza fretta',title:'Il prossimo capitolo resta vicino.',copy:'Un traguardo e il suo avanzamento rimangono visibili nella parte bassa della dashboard, così hai una direzione senza trasformarla in una scadenza invadente.'},
   {target:'.collection-link',note:'qui ritrovi le tue parole',title:'La biblioteca conserva ciò che conta.',copy:'Da qui ritrovi raccolte, preferiti e pensieri personali. Puoi costruire nel tempo una biblioteca tutta tua.'},
   {target:'#next-phrase',note:'quando vuoi cambiare aria',title:'Un altro pensiero, subito.',copy:'Questo comando cambia soltanto la frase corrente quando vuoi qualcosa di diverso, senza modificare il resto della dashboard.'},
   {target:'#favorite-current',note:'questo cuore conserva',title:'Tieni vicino ciò che ti parla.',copy:'Il cuore salva il pensiero corrente tra i preferiti, così puoi ritrovarlo più avanti nella tua biblioteca.'},
   {target:'#timer-open',force:true,note:'una pausa con un confine',title:'Il timer crea uno spazio per te.',copy:'Scegli una durata dal quadrante, avvia una pausa e segui il tempo che passa. Puoi usarlo in silenzio, con la radio o con un suono rilassante.'},
   {target:'#calendar-open',force:true,note:'i tuoi giorni sono a un tocco',title:'Questo tasto apre il Calendario.',copy:'Da qui passi dalla dashboard al Calendario di Istante, dove puoi vedere gli impegni con viste diverse senza uscire dall’esperienza.'},
   {target:'#share-open',note:'un pensiero da regalare',title:'Condividi questo istante.',copy:'Puoi creare una cartolina o condividere un link con il pensiero che stai vedendo, mantenendo il resto della tua esperienza personale sul dispositivo.'},
   {target:'#fullscreen',note:'quando vuoi togliere il resto',title:'Istante può occupare tutto lo schermo.',copy:'La modalità a schermo intero rende la dashboard più immersiva su monitor, tablet o schermi dedicati.'},
   {target:'#settings-open',note:'quasi tutto può diventare tuo',title:'Personalizza quasi ogni cosa.',copy:'Dalle Impostazioni puoi cambiare aspetto, caratteri, cielo, meteo, calendario, frasi, audio, timer, comportamento dello screensaver e molti altri dettagli.'},
   {target:'#radio-mini',fallback:'#settings-open',note:'un suono può cambiare la stanza',title:'Il player crea la tua atmosfera.',copy:'Radio lo-fi e suoni ambientali possono accompagnare lavoro, lettura o una pausa. Dal mini player controlli rapidamente la sorgente attiva.'},
   {target:'.stage-main-slot',fallback:'#main',touchOnly:true,note:'gesti pensati per il touch',title:'Sul touch, il lato destro diventa un controllo.',copy:'Solo nella zona destra della dashboard: doppio tap per Play/Pausa e swipe verticale per aumentare o diminuire il volume di 10. Nel Calendario queste gesture audio sono disattivate.'},
   {view:'calendar',calendarView:'year',target:'#cal-content',fallback:'#calendar-view',note:'prima guarda l’insieme',title:'Il Calendario si apre dalla vista Anno.',copy:'La vista Anno ti dà subito una panoramica completa. Da qui puoi poi avvicinarti al periodo che ti interessa.'},
   {view:'calendar',calendarView:'year',target:'.calendar-views',fallback:'#calendar-view',note:'scegli quanto vicino guardare',title:'Cambia vista quando ti serve.',copy:'Anno, Mese, Settimana, Giorno e Agenda mostrano gli stessi calendari con livelli di dettaglio diversi.'},
   {view:'calendar',calendarView:'year',target:'#cal-sidebar-toggle',fallback:'#calendar-view',note:'porta qui i tuoi calendari',title:'Da qui apri Le tue giornate.',copy:'Il tasto Calendari apre il pannello da destra. Da Gestisci calendari puoi importare un file ICS oppure collegare un calendario condiviso.'}
  ];
  function visible(el){if(!el||el.hidden||el.closest('[hidden]'))return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=='hidden';}
  function snapshotNode(el){return el?{el,hidden:el.hidden,text:el.textContent,html:el.innerHTML,tooltip:el.dataset.istanteTooltip||''}:null;}
  function hasPlace(){const p=store.read('place',null);return !!(p&&Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lon)));}
  function simulateWeather(){
   if(hasPlace())return;
   const env=byId('environment-line'),weather=byId('weather-line'),solar=byId('solar-line');if(!env||!weather||env.classList.contains('tour-simulated-weather'))return;
   const nodes=[env,weather,solar,byId('weather-icon'),byId('weather-text'),byId('weather-condition'),byId('weather-place'),byId('weather-age'),byId('sunrise-time'),byId('sunset-time'),byId('solar-note')].map(snapshotNode).filter(Boolean);
   simulations.push(nodes);env.hidden=false;weather.hidden=false;if(solar)solar.hidden=false;env.classList.add('tour-simulated-weather');
   const icon=byId('weather-icon');if(icon)icon.innerHTML=window.IstanteIcons?.render?.('sun')||'';
   if(byId('weather-text'))byId('weather-text').textContent='18°';if(byId('weather-condition'))byId('weather-condition').textContent='Sereno';if(byId('weather-place'))byId('weather-place').textContent='Esempio';if(byId('weather-age'))byId('weather-age').textContent='';if(byId('sunrise-time'))byId('sunrise-time').textContent='07:30';if(byId('sunset-time'))byId('sunset-time').textContent='18:45';if(byId('solar-note'))byId('solar-note').textContent='Simulazione';
  }
  function restoreSimulation(){for(const nodes of simulations){for(const snap of nodes){const el=snap.el;if(!el?.isConnected)continue;el.hidden=snap.hidden;el.textContent=snap.text;el.innerHTML=snap.html;if(snap.tooltip)el.dataset.istanteTooltip=snap.tooltip;else delete el.dataset.istanteTooltip;el.classList.remove('tour-simulated-weather');}}simulations=[];}
  function renderLocationSetup(host){
   host.replaceChildren();host.hidden=false;const p=store.read('place',null);const box=document.createElement('div');box.className='tour-inline-setup tour-location-setup';
   if(p&&Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lon))){box.innerHTML='<p class="field-note"><strong>Posizione già configurata.</strong> Istante userà la località salvata per cielo, alba, tramonto e meteo.</p>';host.append(box);return;}
   box.innerHTML='<div class="tour-setup-actions tour-location-actions"><button type="button" class="primary-button" data-location-action="locate"><span class="icon">'+window.IstanteIcons.render('location')+'</span>Usa la mia posizione</button><button type="button" class="text-button" data-location-action="later">Più tardi</button></div><p class="field-note" data-location-status>La posizione resta salvata soltanto in questo browser. Puoi anche cercare una città o inserire coordinate dalle Impostazioni.</p>';
   host.append(box);const status=box.querySelector('[data-location-status]'),locate=box.querySelector('[data-location-action=locate]');
   locate.addEventListener('click',()=>{locate.disabled=true;status.textContent='Attendo la posizione del dispositivo…';document.dispatchEvent(new CustomEvent('istante:onboarding-location-locate',{detail:{done(ok,message){locate.disabled=false;status.textContent=message||(ok?'Posizione salvata.':'Posizione non disponibile.');if(ok){locate.innerHTML='<span class="icon">'+window.IstanteIcons.render('check')+'</span>Posizione salvata';locate.setAttribute('aria-pressed','true');const place=byId('weather-place');if(place)place.textContent='La mia posizione';}queue();}}}));});
   box.querySelector('[data-location-action=later]').addEventListener('click',()=>{status.textContent='Va bene. La potrai impostare in qualsiasi momento dalle Impostazioni.';queue();});
  }
  function setSidebarPreview(openIt){const cal=byId('calendar-view'),button=byId('cal-sidebar-toggle');if(!cal||!button)return;cal.classList.toggle('sidebar-open',!!openIt);button.setAttribute('aria-expanded',String(!!openIt));}
  function selectSteps(){return definitions.filter(d=>!d.touchOnly||isTouch());}
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function rectPath(x,y,w,h){const r=Math.min(16,w/3,h/3);return `M ${x+r} ${y} Q ${x+w*.55} ${y-2} ${x+w-r} ${y} Q ${x+w+1} ${y-1} ${x+w} ${y+r} L ${x+w} ${y+h-r} Q ${x+w+2} ${y+h+1} ${x+w-r} ${y+h} Q ${x+w*.4} ${y+h+2} ${x+r} ${y+h} Q ${x-1} ${y+h} ${x} ${y+h-r} L ${x} ${y+r} Q ${x-2} ${y-1} ${x+r} ${y}`;}
  function position(){
   raf=0;if(!dialog.open||!target)return;const W=window.visualViewport?.width||innerWidth,H=window.visualViewport?.height||innerHeight;byId('tour-sketch').setAttribute('viewBox',`0 0 ${W} ${H}`);
   const raw=target.getBoundingClientRect(),margin=10,r={x:clamp(raw.x-6,4,W-4),y:clamp(raw.y-6,4,H-4),w:Math.min(raw.width+12,W-8),h:Math.min(raw.height+12,H-8)};r.w=Math.min(r.w,W-4-r.x);r.h=Math.min(r.h,H-4-r.y);
   const cardWidth=W<=740?Math.min(334,W-18):Math.min(380,W-28,H<450?Math.max(240,W*.46):380);card.style.width=cardWidth+'px';card.style.maxHeight=Math.max(130,H-(W<=740?14:28))+'px';
   const ch=card.offsetHeight,cw=card.offsetWidth,cx=r.x+r.w/2,cy=r.y+r.h/2,gap=48,spots=[{x:cx-cw/2,y:r.y+r.h+gap},{x:cx-cw/2,y:r.y-ch-gap},{x:r.x+r.w+gap,y:cy-ch/2},{x:r.x-cw-gap,y:cy-ch/2}];
   function scored(p){const x=clamp(p.x,14,W-cw-14),y=clamp(p.y,14,H-ch-14),ox=Math.max(0,Math.min(x+cw,r.x+r.w+margin)-Math.max(x,r.x-margin)),oy=Math.max(0,Math.min(y+ch,r.y+r.h+margin)-Math.max(y,r.y-margin));return{x,y,score:ox*oy*100+Math.abs(x-p.x)+Math.abs(y-p.y)};}
   const chosen=spots.map(scored).sort((a,b)=>a.score-b.score)[0];card.style.left=chosen.x+'px';card.style.top=chosen.y+'px';const cut=byId('tour-cutout');for(const [k,v]of Object.entries({x:r.x,y:r.y,width:r.w,height:r.h}))cut.setAttribute(k,v);byId('tour-outline').setAttribute('d',rectPath(r.x,r.y,r.w,r.h));
   const ccx=chosen.x+cw/2,ccy=chosen.y+ch/2,dx=cx-ccx,dy=cy-ccy;let sx,sy,ex,ey;if(Math.abs(dx)/(cw/2)>Math.abs(dy)/(ch/2)){sx=dx>0?chosen.x+cw:chosen.x;sy=clamp(cy,chosen.y+25,chosen.y+ch-25);ex=dx>0?r.x-5:r.x+r.w+5;ey=cy;}else{sx=clamp(cx,chosen.x+30,chosen.x+cw-30);sy=dy>0?chosen.y+ch:chosen.y;ex=cx;ey=dy>0?r.y-5:r.y+r.h+5;}
   const vx=ex-sx,vy=ey-sy,len=Math.max(1,Math.hypot(vx,vy)),nx=-vy/len,ny=vx/len,bend=Math.min(35,len*.2),c1x=sx+vx*.28+nx*bend,c1y=sy+vy*.28+ny*bend,c2x=sx+vx*.74+nx*bend*.7,c2y=sy+vy*.74+ny*bend*.7,path=`M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;byId('tour-arrow').setAttribute('d',path);byId('tour-arrow-shadow').setAttribute('d',path);byId('tour-arrow-shadow').setAttribute('transform','translate(1.1 -1.1)');const a=Math.atan2(ey-c2y,ex-c2x),tip=11;byId('tour-arrow-tip').setAttribute('d',`M ${ex-tip*Math.cos(a-.48)} ${ey-tip*Math.sin(a-.48)} Q ${ex-2} ${ey+1} ${ex} ${ey} L ${ex-tip*Math.cos(a+.48)} ${ey-tip*Math.sin(a+.48)}`);
  }
  function queue(){if(!raf)raf=requestAnimationFrame(position);}
  function showStep(){
   const d=steps[index];if(!d){M.dismiss(dialog);return;}setSidebarPreview(false);document.dispatchEvent(new CustomEvent('istante:onboarding-preview-view',{detail:{view:d.view||'dashboard'}}));if(d.calendarView)document.dispatchEvent(new CustomEvent('istante:onboarding-calendar-view',{detail:{view:d.calendarView}}));
   if(d.simulateWeather)simulateWeather();target=$(d.target);if(!visible(target))target=$(d.fallback||'__unused__');if(!visible(target))target=d.view==='calendar'?byId('calendar-view'):byId('app-shell');
   card.classList.remove('tour-step-transition');dialog.classList.remove('tour-step-changing');void card.offsetWidth;card.classList.add('tour-step-transition');dialog.classList.add('tour-step-changing');dialog.dataset.step=String(index+1);byId('tour-step').textContent='Il tuo istante / '+(index+1)+' di '+steps.length;byId('tour-note').textContent=d.note;byId('tour-title').textContent=d.title;byId('tour-copy').textContent=d.copy;const choices=byId('tour-choices');choices.replaceChildren();choices.hidden=true;if(d.locationSetup)renderLocationSetup(choices);byId('tour-back').disabled=index===0;byId('tour-next').innerHTML=(index===steps.length-1?'Il tempo è mio':'Avanti')+'<span class="icon">'+window.IstanteIcons.render('arrow')+'</span>';requestAnimationFrame(position);M.flash(card);setTimeout(()=>{card.classList.remove('tour-step-transition');dialog.classList.remove('tour-step-changing');},420);byId('tour-next').focus({preventScroll:true});
  }
  function launchTour(){steps=selectSteps();index=0;if(!steps.length)return;originView=document.body.classList.contains('view-calendar')?'calendar':'dashboard';document.body.classList.add('is-touring');open('tour');showStep();}
  function startTour(){transitioning=true;const welcome=byId('welcome-dialog');welcome.addEventListener('close',()=>{transitioning=false;launchTour();},{once:true});M.dismiss(welcome);}
  function showWelcome(force=false){if(!ready||!force&&store.read(seenKey,false))return;if($('dialog[open]')){pending=true;return;}pending=false;open('welcome');}
  byId('welcome-tour').addEventListener('click',startTour);byId('tour-next').addEventListener('click',()=>{if(index>=steps.length-1)M.dismiss(dialog);else{index++;showStep();}});byId('tour-back').addEventListener('click',()=>{if(index>0){index--;showStep();}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();byId('tour-next').click();}else if(e.key==='ArrowLeft'){e.preventDefault();byId('tour-back').click();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('is-touring');target=null;setSidebarPreview(false);restoreSimulation();document.dispatchEvent(new CustomEvent('istante:onboarding-preview-view',{detail:{view:originView}}));store.write(seenKey,true);});
  byId('welcome-dialog').addEventListener('close',()=>{store.write(seenKey,true);store.write('welcome.seen',true);});byId('welcome-reopen').addEventListener('click',()=>{const d=byId('settings-dialog');d.addEventListener('close',()=>showWelcome(true),{once:true});M.dismiss(d);});
  const brand=document.querySelector('.topbar .brand-home-link');brand?.addEventListener('click',e=>{e.preventDefault();if(document.querySelector('dialog[open]'))return;launchTour();});
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{if(pending&&!transitioning)queueMicrotask(()=>showWelcome());}));window.addEventListener('resize',queue,{passive:true});window.visualViewport?.addEventListener('resize',queue,{passive:true});
  return{ready(){ready=true;if(location.hash.startsWith('#p='))return;showWelcome();},start:launchTour};
 }
 window.IstanteOnboarding={create};
})();
