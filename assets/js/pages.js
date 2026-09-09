/* Two virtual views, one document, one audio/timer instance. */
(function(){'use strict';
function create({getSettings,calendar,onChange}){
 const $=id=>document.getElementById(id),home=$('app-shell'),cal=$('calendar-view'),dots=$('view-dots');
 let current='dashboard',transition=0,returnTimer=0,touch=null,mouseDrag=null,suppressClickUntil=0,lastActivity=0,initialized=false;
 const hasModal=()=>!!document.querySelector('dialog[open]');
 function activity(){lastActivity=Date.now();arm();}
 function arm(){clearTimeout(returnTimer);const s=getSettings();if(current!=='calendar'||!s.calendarReturn||document.hidden)return;returnTimer=setTimeout(check,s.calendarReturn*1000);}
 function check(){if(current!=='calendar')return;if(hasModal()||document.hidden){arm();return;}const s=getSettings();if(!s.calendarReturn)return;if(Date.now()-lastActivity>=s.calendarReturn*1000)show('dashboard',false);else arm();}
 function show(next,focus=false){
  if(!['dashboard','calendar'].includes(next)||next==='calendar'&&!getSettings().calendarEnabled)return;
  if(hasModal())return;
  if(next===current){activity();return;}clearTimeout(transition);current=next;const isCalendar=next==='calendar';
  if(isCalendar){cal.hidden=false;cal.getBoundingClientRect();calendar.open();}
  document.body.classList.remove('is-idle');document.body.classList.toggle('view-calendar',isCalendar);
  document.documentElement.dataset.view=next;home.inert=isCalendar;home.setAttribute('aria-hidden',String(isCalendar));cal.inert=!isCalendar;cal.setAttribute('aria-hidden',String(!isCalendar));
  document.querySelectorAll('[data-view]').forEach(b=>{if(b.dataset.view===next)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  if(focus)(isCalendar?$('cal-today'):$('calendar-open')).focus({preventScroll:true});
  onChange();document.dispatchEvent(new CustomEvent('istante:view-change',{detail:{view:next}}));activity();
  if(!isCalendar)transition=setTimeout(()=>{if(current==='dashboard')cal.hidden=true;},getSettings().motion?360:0);
 }
 function apply(){const s=getSettings();$('calendar-open').hidden=!s.calendarEnabled;dots.hidden=!s.calendarEnabled;document.body.classList.toggle('has-view-dots',s.calendarEnabled);calendar.apply();if(!s.calendarEnabled&&current==='calendar'){
   // Saving settings closes its dialog just after apply. Defer navigation until close.
   const d=document.querySelector('dialog[open]');if(d)d.addEventListener('close',()=>show('dashboard'),{once:true});else show('dashboard');
  }arm();if(!initialized){initialized=true;if(location.hash==='#calendario')setTimeout(()=>{if(getSettings().calendarEnabled)show('calendar');},1200);}}
 $('calendar-open').addEventListener('click',()=>show('calendar',true));document.querySelectorAll('[data-calendar-back]').forEach(b=>b.addEventListener('click',()=>show('dashboard',true)));document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view,true)));
 const skip=e=>hasModal()||!!e.target.closest('button,a,input,select,textarea,[contenteditable=true],#radio-panel,.calendar-views');
 document.addEventListener('touchstart',e=>{if(!getSettings().calendarEnabled||hasModal()||e.target.closest('input,select,textarea,a,[contenteditable=true],#radio-panel,.calendar-toolbar,.view-dots,.bottom-bar')||e.touches.length!==1){touch=null;return;}const t=e.touches[0];touch={x:t.clientX,y:t.clientY,at:Date.now()};},{passive:true});
 document.addEventListener('touchend',e=>{if(!touch)return;const start=touch;touch=null;if(!e.changedTouches.length||hasModal())return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;if(Date.now()-start.at<1200&&Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.6){if(dx<0&&current==='dashboard'){suppressClickUntil=Date.now()+600;show('calendar');}else if(dx>0&&current==='calendar'){suppressClickUntil=Date.now()+600;show('dashboard');}}},{passive:true});
 document.addEventListener('click',e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 document.addEventListener('touchcancel',()=>touch=null,{passive:true});
 document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||!getSettings().mouseSwipe||!getSettings().calendarEnabled||hasModal()||e.button!==0||skip(e)){mouseDrag=null;return;}mouseDrag={x:e.clientX,y:e.clientY,at:Date.now(),id:e.pointerId};},{passive:true});
 document.addEventListener('pointerup',e=>{if(!mouseDrag||e.pointerId!==mouseDrag.id)return;const start=mouseDrag;mouseDrag=null;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Date.now()-start.at<1400&&Math.abs(dx)>95&&Math.abs(dx)>Math.abs(dy)*1.7){if(dx<0&&current==='dashboard')show('calendar');else if(dx>0&&current==='calendar')show('dashboard');}},{passive:true});
 document.addEventListener('pointercancel',()=>mouseDrag=null,{passive:true});
 for(const type of ['pointerdown','keydown','wheel','touchstart','input'])cal.addEventListener(type,activity,{passive:true});
 document.addEventListener('pointermove',()=>{if(current==='calendar'&&Date.now()-lastActivity>1000)activity();},{passive:true});
 document.addEventListener('keydown',e=>{if(!getSettings().calendarEnabled||skip(e)||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==='ArrowLeft'&&current==='calendar'){e.preventDefault();show('dashboard',true);}else if(e.key==='ArrowRight'&&current==='dashboard'){e.preventDefault();show('calendar',true);}});
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',activity));document.addEventListener('visibilitychange',()=>{if(!document.hidden)activity();else clearTimeout(returnTimer);});
 apply();return{show,apply,current:()=>current};
}
window.IstantePages={create};
})();
