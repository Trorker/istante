/* Presentation-only coach marks. No preference is changed by the wizard. */
(function(){
 'use strict';
 function create({store,open}){
  const $=s=>document.querySelector(s),byId=id=>document.getElementById(id),M=window.IstanteMotion;
  const dialog=byId('tour-dialog'),card=byId('tour-card'),seenKey='welcome.3.10';
  let ready=false,pending=false,index=0,steps=[],raf=0,target=null,transitioning=false,simulations=[],originView='dashboard';
  const definitions=[
   {target:'.clock-block',fallback:'.clock-section',note:'inizia dal tuo ritmo',title:'Il tempo resta al centro.',copy:'Orologio e data sono pensati per essere leggibili da vicino e da lontano, senza trasformare Istante in una schermata piena di indicatori.'},
   {target:'.thought-block',note:'una frase, al momento giusto',title:'Un pensiero che lascia spazio.',copy:'Le frasi accompagnano la giornata senza chiederti di configurare nulla durante questa guida. Tutte le preferenze restano nelle Impostazioni.'},
   {target:'#environment-line',fallback:'#active-info-strip',force:true,simulateWeather:true,note:'il cielo resta leggero',title:'Meteo, alba e tramonto quando servono.',copy:'Se il meteo non è ancora configurato, qui ne vedi una simulazione. Nessuna posizione viene richiesta o salvata dalla guida.'},
   {target:'#goal-strip',note:'una direzione, senza fretta',title:'Il prossimo capitolo resta vicino.',copy:'Un traguardo può vivere nella barra inferiore senza diventare una lista di cose da fare.'},
   {target:'.collection-link',note:'qui ritrovi le tue parole',title:'La biblioteca conserva ciò che conta.',copy:'Raccolte, preferiti e pensieri personali restano insieme e sempre raggiungibili dalla dashboard.'},
   {target:'#next-phrase',note:'quando vuoi cambiare aria',title:'Un altro pensiero, subito.',copy:'Questo comando cambia la frase corrente senza toccare il resto della tua esperienza.'},
   {target:'#favorite-current',note:'questo cuore conserva',title:'Tieni vicino ciò che ti parla.',copy:'Il cuore salva il pensiero corrente tra i preferiti.'},
   {target:'#timer-open',force:true,note:'una pausa con un confine',title:'Il timer resta vicino.',copy:'La durata si sceglie dal quadrante e il timer resta in una sola modale ottimizzata anche per touch.'},
   {target:'.stage-main-slot',fallback:'#main',note:'gesti pensati per il touch',title:'Doppio tap e swipe, senza cercare pulsanti.',copy:'Sulla dashboard, doppio tap nella zona destra per Play/Pausa. Uno swipe verticale nella stessa zona cambia il volume a passi di 10.'},
   {view:'calendar',target:'#cal-title',fallback:'#calendar-view',note:'i tuoi giorni, senza rumore',title:'Anche il calendario fa parte di Istante.',copy:'Anno, mese, settimana, giorno e agenda vivono nello stesso spazio. Le tue giornate si aprono dal comando in alto a destra.'},
   {view:'calendar',target:'#calendar-sidebar',fallback:'#cal-sidebar-toggle',previewSidebar:true,note:'tutto a portata di mano',title:'Le tue giornate si aprono da destra.',copy:'Il pannello dei calendari arriva dallo stesso lato del suo pulsante. In fondo trovi Gestisci calendari.'},
   {view:'dashboard',target:'#share-open',note:'un pensiero da regalare',title:'Porta con te questo istante.',copy:'Puoi condividere una cartolina o un link senza cambiare la schermata principale.'},
   {target:'#fullscreen',note:'quando vuoi togliere il resto',title:'Uno schermo, un solo momento.',copy:'Schermo intero rende Istante più immersivo su monitor, tablet o uno schermo dedicato.'},
   {target:'#settings-open',note:'l’ultimo tocco è tuo',title:'Le configurazioni vivono tutte qui.',copy:'La guida presenta soltanto Istante. Aspetto, meteo, calendario, audio, timer e comportamento dello screensaver si cambiano dalle Impostazioni.'},
   {target:'#radio-mini',fallback:'#settings-open',note:'un suono può cambiare la stanza',title:'Costruisci la tua atmosfera.',copy:'Radio lo-fi e suoni ambientali possono accompagnare lavoro, lettura o una pausa. Nessun audio parte da solo.'}
  ];
  function visible(el){if(!el||el.hidden||el.closest('[hidden]'))return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=='hidden';}
  function snapshotNode(el){return el?{el,hidden:el.hidden,text:el.textContent,html:el.innerHTML,tooltip:el.dataset.istanteTooltip||''}:null;}
  function simulateWeather(){
   const env=byId('environment-line'),weather=byId('weather-line'),solar=byId('solar-line');if(!env||!weather)return;
   const nodes=[env,weather,solar,byId('weather-icon'),byId('weather-text'),byId('weather-condition'),byId('weather-place'),byId('weather-age'),byId('sunrise-time'),byId('sunset-time'),byId('solar-note')].map(snapshotNode).filter(Boolean);
   simulations.push(nodes);env.hidden=false;weather.hidden=false;if(solar)solar.hidden=false;env.classList.add('tour-simulated-weather');
   const icon=byId('weather-icon');if(icon)icon.innerHTML=window.IstanteIcons?.render?.('sun')||'';
   if(byId('weather-text'))byId('weather-text').textContent='18 deg';if(byId('weather-condition'))byId('weather-condition').textContent='Sereno';if(byId('weather-place'))byId('weather-place').textContent='La tua città';if(byId('weather-age'))byId('weather-age').textContent='';if(byId('sunrise-time'))byId('sunrise-time').textContent='07:30';if(byId('sunset-time'))byId('sunset-time').textContent='18:45';if(byId('solar-note'))byId('solar-note').textContent='Esempio';
  }
  function restoreSimulation(){for(const nodes of simulations){for(const snap of nodes){const el=snap.el;if(!el?.isConnected)continue;el.hidden=snap.hidden;el.textContent=snap.text;el.innerHTML=snap.html;if(snap.tooltip)el.dataset.istanteTooltip=snap.tooltip;else delete el.dataset.istanteTooltip;el.classList.remove('tour-simulated-weather');}}simulations=[];}
  function setSidebarPreview(openIt){const cal=byId('calendar-view'),button=byId('cal-sidebar-toggle');if(!cal||!button)return;cal.classList.toggle('sidebar-open',!!openIt);button.setAttribute('aria-expanded',String(!!openIt));}
  function selectSteps(){return definitions.slice();}
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
   const d=steps[index];if(!d){M.dismiss(dialog);return;}setSidebarPreview(false);document.dispatchEvent(new CustomEvent('istante:onboarding-preview-view',{detail:{view:d.view||'dashboard'}}));if(d.previewSidebar)setSidebarPreview(true);
   if(d.simulateWeather&&!visible(byId('weather-line')))simulateWeather();target=$(d.target);if(!visible(target))target=$(d.fallback||'__unused__');if(!visible(target))target=d.view==='calendar'?byId('calendar-view'):byId('app-shell');
   card.classList.remove('tour-step-transition');dialog.classList.remove('tour-step-changing');void card.offsetWidth;card.classList.add('tour-step-transition');dialog.classList.add('tour-step-changing');dialog.dataset.step=String(index+1);byId('tour-step').textContent='Il tuo istante / '+(index+1)+' di '+steps.length;byId('tour-note').textContent=d.note;byId('tour-title').textContent=d.title;byId('tour-copy').textContent=d.copy;const choices=byId('tour-choices');choices.replaceChildren();choices.hidden=true;byId('tour-back').disabled=index===0;byId('tour-next').innerHTML=(index===steps.length-1?'Il tempo è mio':'Avanti')+'<span class="icon">'+window.IstanteIcons.render('arrow')+'</span>';requestAnimationFrame(position);M.flash(card);setTimeout(()=>{card.classList.remove('tour-step-transition');dialog.classList.remove('tour-step-changing');},420);byId('tour-next').focus({preventScroll:true});
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
