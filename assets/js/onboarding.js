/* Optional coach marks: local SVG ink arrows, no external fonts or assets. */
(function(){
 'use strict';
 function create({store,open}){
  const $=s=>document.querySelector(s),byId=id=>document.getElementById(id),M=window.IstanteMotion;
  const dialog=byId('tour-dialog'),card=byId('tour-card'),seenKey='welcome.3.10';
  let ready=false,pending=false,index=0,steps=[],raf=0,target=null,transitioning=false;
  const definitions=[
   {target:'.clock-block',fallback:'.clock-section',note:'inizia dal tuo ritmo',title:'Come vuoi vedere il tempo?',copy:"Istante può restare discreto sulla scrivania oppure diventare il centro dello schermo. Scegli subito l’orologio che ti fa stare meglio.",choices:{key:'clockStyle',items:[['digital','Digitale'],['analog','Analogico']]}},
   {target:'.thought-block',note:'una frase, al momento giusto',title:'Quanto spazio vuoi dare ai pensieri?',copy:'Puoi ricevere un nuovo pensiero al mattino e alla sera, oppure lasciarne uno con te per tutta la giornata.',choices:{key:'mode',items:[['twice','Mattina & sera'],['daily','Una al giorno']]}},
   {target:'#favorite-current',note:'questo cuore conserva',title:'Tieni vicino ciò che ti parla.',copy:'Il cuore salva i pensieri che vuoi ritrovare. La biblioteca raccoglie collezioni di Istante e le tue raccolte personali, anche da file TXT con una frase per riga.'},
   {target:'#goal-strip',note:'una direzione, senza fretta',title:'Dai un orizzonte al prossimo capitolo.',copy:'Puoi tenere il nuovo anno come riferimento oppure scegliere una distanza semplice. Se hai già una data precisa, la personalizzi subito dopo.',choices:{key:'goalPreset',items:[['year','Nuovo anno'],['3m','Tra 3 mesi'],['6m','Tra 6 mesi'],['1y','Tra 1 anno'],['custom','Data precisa']]}},
   {target:'#radio-mini',note:'un suono può cambiare la stanza',title:'Costruisci la tua atmosfera.',copy:'Radio lo-fi e suoni ambientali possono accompagnare lavoro, lettura o una pausa. Nessun audio parte da solo.'},
   {target:'#timer-open',note:'una pausa con un confine',title:'Quanto dura il tuo prossimo momento?',copy:'Scegli una durata di partenza. Potrai sempre cambiarla quando apri il timer.',choices:{key:'timerMinutes',items:[[15,'15 min'],[25,'25 min'],[45,'45 min']]}},
   {target:'#share-open',note:'un pensiero da regalare',title:"Condividi senza perdere l’atmosfera.",copy:'La cartolina riprende frase, cielo e dettagli del tuo Istante. Il QR può portare chi la riceve direttamente al pensiero condiviso.'},
   {target:'[data-open="settings"]',note:"l’ultimo tocco è tuo",title:'Scegli la luce di partenza.',copy:'Puoi lasciare che Istante segua il dispositivo oppure scegliere subito Carta o Notte. In seguito troverai tutte le regolazioni nelle impostazioni.',choices:{key:'theme',items:[['auto','Auto'],['light','Carta'],['dark','Notte']]}}
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
   card.classList.remove('tour-step-transition');dialog.classList.remove('tour-step-changing');void card.offsetWidth;card.classList.add('tour-step-transition');dialog.classList.add('tour-step-changing');
   byId('tour-step').textContent='Il tuo istante / '+(index+1)+' di '+steps.length;
   byId('tour-note').textContent=d.note;byId('tour-title').textContent=d.title;byId('tour-copy').textContent=d.copy;
   const choices=byId('tour-choices');choices.replaceChildren();choices.hidden=!d.choices;
   if(d.choices){
    const defaults={clockStyle:'digital',mode:'twice',timerMinutes:25,theme:'dark',goalPreset:'year'},saved=store.read('settings',{});
    const current=d.choices.key==='goalPreset'?(saved.goalMode==='custom'?'custom':'year'):(saved[d.choices.key]??defaults[d.choices.key]);
    for(const [value,label] of d.choices.items){
     const b=document.createElement('button');b.type='button';b.className='tour-choice';b.textContent=label;b.setAttribute('aria-pressed',String(current===value));
     if(d.choices.key==='goalPreset'&&value==='custom')b.dataset.action='custom-goal';
     b.addEventListener('click',()=>{
      if(d.choices.key==='goalPreset'&&value==='custom'){
       document.dispatchEvent(new CustomEvent('istante:onboarding-goal-custom'));return;
      }
      choices.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');
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
   byId('tour-back').disabled=index===0;byId('tour-next').innerHTML=(index===steps.length-1?'Il tempo è mio':'Avanti')+'<span class="icon">'+window.IstanteIcons.render('arrow')+'</span>';
   position();M.flash(card);setTimeout(()=>{card.classList.remove('tour-step-transition');dialog.classList.remove('tour-step-changing');},420);byId('tour-next').focus({preventScroll:true});
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
