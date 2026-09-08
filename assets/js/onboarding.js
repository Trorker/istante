/* Optional coach marks: local SVG ink arrows, no external fonts or assets. */
(function(){
 'use strict';
 function create({store,open}){
  const $=s=>document.querySelector(s),byId=id=>document.getElementById(id),M=window.IstanteMotion;
  const dialog=byId('tour-dialog'),card=byId('tour-card'),seenKey='welcome.illustrated.v1';
  let ready=false,pending=false,index=0,steps=[],raf=0,target=null,transitioning=false;
  const definitions=[
   {target:'.clock-block',fallback:'.clock-section',note:'prima di tutto, rallenta',title:'Il tempo, dalla tua parte.',copy:'Digitale o analogico: scegli come guardarlo. Puoi lasciare Istante aperto mentre lavori, leggi o ti prendi una pausa.'},
   {target:'.thought-block',note:'un pensiero da tenere vicino',title:'Non serve correre.',copy:'Mille frasi originali, scelte a caso senza ripetersi prima di completare il giro. Decidi tu quando cambiarle, o lascia che arrivino mattina e sera.'},
   {target:'#favorite-current',note:'questo cuore conserva',title:'Ritrova quello che ti somiglia.',copy:'Salva una frase con il cuore. La biblioteca, in basso a sinistra, conserva la raccolta originale, i tuoi JSON personali e i preferiti. Le frecce incrociate ne scelgono un altro.'},
   {target:'#goal-strip',note:'una direzione, senza fretta',title:'Il tuo prossimo capitolo.',copy:'Un viaggio, una data importante, qualcosa che aspetti: nelle impostazioni puoi dare un nome al traguardo e vedere il tempo che ti avvicina.'},
   {target:'#radio-mini',note:'scegli cosa ti fa compagnia',title:'Ascolta il tuo momento.',copy:'Apri il player: Radio per le dirette, Ambiente per rumore rosa, marrone, pioggia o vento, anche offline. Premi Play: nessun suono parte da solo.'},
   {target:'#timer-open',note:'uno spazio solo tuo',title:'Concediti una pausa.',copy:'Imposta un timer e scegli se ascoltare la radio durante la pausa. Il suono finale e le altre preferenze sono nelle impostazioni.'},
   {target:'#calendar-open',note:'spazio ai tuoi giorni',title:'Il calendario, con calma.',copy:'Una seconda pagina per importare i tuoi file ICS o leggere un calendario condiviso. Anno, mese, settimana e agenda, senza cambiare il tuo screensaver.'},
   {target:'#share-open',note:'un piccolo pensiero da regalare',title:'Porta questo istante altrove.',copy:'Crea una cartolina con frase, orologio e cielo. Scegli se includere il QR: il nuovo link e la firma restano sul bordo.'},
   {target:'[data-open="settings"]',note:'qui lo rendi davvero tuo',title:'Il resto, al tuo ritmo.',copy:'Foto, tema, effetti, traguardo e radio sono divisi in sezioni. Qui trovi anche il backup JSON e questa guida, da rivedere quando vuoi.'}
  ];
  function visible(el){if(!el||el.hidden||el.closest('[hidden]'))return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=='hidden';}
  function selectSteps(){return definitions.map(d=>({...d,el:$(d.target)||$(d.fallback||'__unused__')})).filter(d=>visible(d.el));}
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
  function showStep(){
   const d=steps[index];if(!d){M.dismiss(dialog);return;}target=d.el;
   byId('tour-step').textContent='Il tuo istante / '+(index+1)+' di '+steps.length;
   byId('tour-note').textContent=d.note;byId('tour-title').textContent=d.title;byId('tour-copy').textContent=d.copy;
   byId('tour-back').disabled=index===0;byId('tour-next').innerHTML=(index===steps.length-1?'Il tempo \u00e8 mio':'Avanti')+'<span class="icon">'+window.IstanteIcons.render('arrow')+'</span>';
   position();M.flash(card);byId('tour-next').focus({preventScroll:true});
  }
  function startTour(){transitioning=true;const welcome=byId('welcome-dialog');welcome.addEventListener('close',()=>{transitioning=false;steps=selectSteps();index=0;if(!steps.length)return;document.body.classList.add('is-touring');open('tour');showStep();},{once:true});M.dismiss(welcome);}
  function showWelcome(force=false){if(!ready||!force&&store.read(seenKey,false))return;if($('dialog[open]')){pending=true;return;}pending=false;open('welcome');}
  byId('welcome-tour').addEventListener('click',startTour);
  byId('tour-next').addEventListener('click',()=>{if(index>=steps.length-1)M.dismiss(dialog);else{index++;showStep();}});
  byId('tour-back').addEventListener('click',()=>{if(index>0){index--;showStep();}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();byId('tour-next').click();}else if(e.key==='ArrowLeft'){e.preventDefault();byId('tour-back').click();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('is-touring');target=null;store.write(seenKey,true);});
  byId('welcome-dialog').addEventListener('close',()=>{store.write(seenKey,true);store.write('welcome.seen',true);});
  byId('welcome-reopen').addEventListener('click',()=>{const d=byId('settings-dialog');d.addEventListener('close',()=>showWelcome(true),{once:true});M.dismiss(d);});
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{if(pending&&!transitioning)queueMicrotask(()=>showWelcome());}));
  window.addEventListener('resize',queue,{passive:true});window.visualViewport?.addEventListener('resize',queue,{passive:true});
  return{ready(){ready=true;if(location.hash.startsWith('#p='))return;showWelcome();}};
 }
 window.IstanteOnboarding={create};
})();
