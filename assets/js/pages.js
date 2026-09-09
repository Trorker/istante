/* Three virtual views, one document, one audio/timer instance. */
(function(){'use strict';
function create({getSettings,calendar,onChange}){
 const $=id=>document.getElementById(id),home=$('app-shell'),cal=$('calendar-view'),timer=$('timer-page'),dots=$('view-dots');
 let current='dashboard',transition=0,returnTimer=0,touch=null,mouseDrag=null,suppressClickUntil=0,lastActivity=0,initialized=false;
 const hasModal=()=>!!document.querySelector('dialog[open]');
 const timerAvailable=()=>{const s=getSettings();return !!(s.timerEnabled&&s.timerDisplay==='page');};
 const calendarAvailable=()=>!!getSettings().calendarEnabled;
 const available=view=>view==='dashboard'||view==='calendar'&&calendarAvailable()||view==='timer'&&timerAvailable();
 const lowZone=y=>y>=(window.visualViewport?.height||innerHeight)-Math.max(92,Math.min(150,(window.visualViewport?.height||innerHeight)*.15));
 function activity(){lastActivity=Date.now();arm();}
 function arm(){clearTimeout(returnTimer);const s=getSettings();if(current!=='calendar'||!s.calendarReturn||document.hidden)return;returnTimer=setTimeout(check,s.calendarReturn*1000);}
 function check(){if(current!=='calendar')return;if(hasModal()||document.hidden){arm();return;}const s=getSettings();if(!s.calendarReturn)return;if(Date.now()-lastActivity>=s.calendarReturn*1000)show('dashboard',false);else arm();}
 function syncDots(){
  document.querySelectorAll('[data-view]').forEach(b=>{const view=b.dataset.view,ok=available(view);b.hidden=!ok&&view!=='dashboard';const active=view===current;b.toggleAttribute('disabled',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  const extras=Number(calendarAvailable())+Number(timerAvailable());dots.hidden=extras===0;document.body.classList.toggle('has-view-dots',extras>0);
 }
 function focusFor(view){if(view==='calendar')return $('cal-today');if(view==='timer')return $('timer-page-toggle');return timerAvailable()?$('timer-open'):$('calendar-open');}
 function show(next,focus=false){
  if(!['timer','dashboard','calendar'].includes(next)||!available(next))return;if(hasModal())return;
  if(next===current){activity();return;}clearTimeout(transition);
  const prev=current;current=next;const isCalendar=next==='calendar',isTimer=next==='timer';
  if(isCalendar){cal.hidden=false;cal.getBoundingClientRect();calendar.open();}
  if(isTimer){timer.hidden=false;timer.getBoundingClientRect();document.dispatchEvent(new CustomEvent('istante:timer-page-visible'));}
  document.body.classList.remove('is-idle','view-calendar','view-timer');document.body.classList.toggle('view-calendar',isCalendar);document.body.classList.toggle('view-timer',isTimer);
  document.documentElement.dataset.view=next;
  home.inert=next!=='dashboard';home.setAttribute('aria-hidden',String(next!=='dashboard'));
  cal.inert=!isCalendar;cal.setAttribute('aria-hidden',String(!isCalendar));
  timer.inert=!isTimer;timer.setAttribute('aria-hidden',String(!isTimer));
  syncDots();
  if(focus){const node=focusFor(next);if(node&&!matchMedia('(pointer:coarse)').matches)node.focus({preventScroll:true});}
  onChange();document.dispatchEvent(new CustomEvent('istante:view-change',{detail:{view:next,previous:prev}}));activity();
  transition=setTimeout(()=>{if(current!=='calendar')cal.hidden=true;if(current!=='timer')timer.hidden=true;},getSettings().motion?360:0);
 }
 function apply(){
  const s=getSettings();$('calendar-open').hidden=!s.calendarEnabled;$('timer-open').hidden=!s.timerEnabled;syncDots();calendar.apply();
  if(!available(current)&&current!=='dashboard'){
   const d=document.querySelector('dialog[open]');if(d)d.addEventListener('close',()=>show('dashboard'),{once:true});else show('dashboard');
  }
  arm();if(!initialized){initialized=true;if(location.hash==='#calendario')setTimeout(()=>{if(calendarAvailable())show('calendar');},1200);}
 }
 $('calendar-open').addEventListener('click',()=>show('calendar',true));
 document.querySelectorAll('[data-calendar-back]').forEach(b=>b.addEventListener('click',()=>show('dashboard',true)));
 document.querySelectorAll('[data-timer-page-back]').forEach(b=>b.addEventListener('click',()=>show('dashboard',true)));
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view,true)));
 document.addEventListener('istante:timer-page-request',()=>show('timer',true));
 const controlTarget=e=>!!e.target.closest('button,a,input,select,textarea,[contenteditable=true],#radio-panel,.calendar-views,.calendar-toolbar,.view-dots,.bottom-bar,.timer-page-controls');
 document.addEventListener('touchstart',e=>{
  if(hasModal()||e.touches.length!==1||controlTarget(e)){touch=null;return;}const t=e.touches[0];
  // On Calendar/Timer, cross-page gestures only begin in the bottom return zone.
  if(current!=='dashboard'&&!lowZone(t.clientY)){touch=null;return;}
  touch={x:t.clientX,y:t.clientY,at:Date.now(),view:current};
 },{passive:true});
 document.addEventListener('touchend',e=>{
  if(!touch)return;const start=touch;touch=null;if(!e.changedTouches.length||hasModal())return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;
  if(Date.now()-start.at>=1200||Math.abs(dx)<=70||Math.abs(dx)<=Math.abs(dy)*1.6)return;
  let next='';if(start.view==='dashboard'){if(dx<0&&calendarAvailable())next='calendar';else if(dx>0&&timerAvailable())next='timer';}
  else if(start.view==='calendar'&&dx>0)next='dashboard';else if(start.view==='timer'&&dx<0)next='dashboard';
  if(next){suppressClickUntil=Date.now()+600;show(next);}
 },{passive:true});
 document.addEventListener('click',e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 document.addEventListener('touchcancel',()=>touch=null,{passive:true});
 document.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='mouse'||!getSettings().mouseSwipe||hasModal()||e.button!==0||controlTarget(e)){mouseDrag=null;return;}
  if(current!=='dashboard'&&!lowZone(e.clientY)){mouseDrag=null;return;}mouseDrag={x:e.clientX,y:e.clientY,at:Date.now(),id:e.pointerId,view:current};
 },{passive:true});
 document.addEventListener('pointerup',e=>{
  if(!mouseDrag||e.pointerId!==mouseDrag.id)return;const start=mouseDrag;mouseDrag=null;const dx=e.clientX-start.x,dy=e.clientY-start.y;
  if(Date.now()-start.at>=1400||Math.abs(dx)<=95||Math.abs(dx)<=Math.abs(dy)*1.7)return;
  if(start.view==='dashboard'){if(dx<0&&calendarAvailable())show('calendar');else if(dx>0&&timerAvailable())show('timer');}
  else if(start.view==='calendar'&&dx>0)show('dashboard');else if(start.view==='timer'&&dx<0)show('dashboard');
 },{passive:true});
 document.addEventListener('pointercancel',()=>mouseDrag=null,{passive:true});
 for(const type of ['pointerdown','keydown','wheel','touchstart','input'])cal.addEventListener(type,activity,{passive:true});
 document.addEventListener('pointermove',()=>{if(current==='calendar'&&Date.now()-lastActivity>1000)activity();},{passive:true});
 document.addEventListener('keydown',e=>{
  if(controlTarget(e)||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='ArrowLeft'){
   if(current==='calendar'){e.preventDefault();show('dashboard',true);}else if(current==='dashboard'&&timerAvailable()){e.preventDefault();show('timer',true);}
  }else if(e.key==='ArrowRight'){
   if(current==='timer'){e.preventDefault();show('dashboard',true);}else if(current==='dashboard'&&calendarAvailable()){e.preventDefault();show('calendar',true);}
  }
 });
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',activity));document.addEventListener('visibilitychange',()=>{if(!document.hidden)activity();else clearTimeout(returnTimer);});
 apply();return{show,apply,current:()=>current};
}
window.IstantePages={create};
})();
