/* Two virtual views: Dashboard and Calendar. Timer is intentionally modal-only. */
(function(){'use strict';
function create({getSettings,calendar,onChange}){
 const $=id=>document.getElementById(id),home=$('app-shell'),cal=$('calendar-view'),dots=$('view-dots');
 let current='dashboard',transition=0,returnTimer=0,touch=null,mouseDrag=null,suppressClickUntil=0,lastActivity=0,initialized=false;
 const hasModal=()=>!!document.querySelector('dialog[open]:not(#tour-dialog)');
 const calendarAvailable=()=>!!getSettings().calendarEnabled;
 const lowZone=y=>{const h=window.visualViewport?.height||innerHeight;return y>=h-Math.max(155,Math.min(260,h*.29));};
 function activity(){lastActivity=Date.now();arm();}
 function arm(){clearTimeout(returnTimer);const s=getSettings();if(current!=='calendar'||!s.calendarReturn||document.hidden)return;returnTimer=setTimeout(check,s.calendarReturn*1000);}
 function check(){if(current!=='calendar')return;if(hasModal()||document.hidden){arm();return;}const s=getSettings();if(!s.calendarReturn)return;if(Date.now()-lastActivity>=s.calendarReturn*1000)show('dashboard',false);else arm();}
 function syncDots(){
  document.querySelectorAll('[data-view]').forEach(b=>{const view=b.dataset.view,ok=view==='dashboard'||view==='calendar'&&calendarAvailable();b.hidden=!ok;const active=view===current;b.toggleAttribute('disabled',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  const showDots=calendarAvailable();if(dots)dots.hidden=!showDots;document.body.classList.toggle('has-view-dots',showDots);
 }
 function focusFor(view){return view==='calendar'?$('cal-today'):$('timer-open');}
 function show(next,focus=false,preview=false){
  if(!['dashboard','calendar'].includes(next)||next==='calendar'&&!calendarAvailable()&&!preview||hasModal())return;
  if(next===current){activity();return;}clearTimeout(transition);const prev=current,isCalendar=next==='calendar';current=next;
  if(isCalendar){cal.hidden=false;cal.getBoundingClientRect();calendar.open();}
  document.body.classList.remove('is-idle','view-calendar','view-timer');document.body.classList.toggle('view-calendar',isCalendar);document.documentElement.dataset.view=next;
  home.inert=isCalendar;home.setAttribute('aria-hidden',String(isCalendar));cal.inert=!isCalendar;cal.setAttribute('aria-hidden',String(!isCalendar));syncDots();
  if(focus&&!matchMedia('(pointer:coarse)').matches)focusFor(next)?.focus({preventScroll:true});
  onChange();document.dispatchEvent(new CustomEvent('istante:view-change',{detail:{view:next,previous:prev}}));activity();
  const transitionDelay=(preview||document.body.classList.contains('is-touring'))?0:(getSettings().motion?300:0);if(!isCalendar&&transitionDelay===0)cal.hidden=true;else transition=setTimeout(()=>{if(current!=='calendar')cal.hidden=true;},transitionDelay);
 }
 function apply(){const s=getSettings();$('calendar-open').hidden=!s.calendarEnabled;$('timer-open').hidden=!s.timerEnabled;syncDots();calendar.apply();if(current==='calendar'&&!calendarAvailable()){const d=document.querySelector('dialog[open]');if(d)d.addEventListener('close',()=>show('dashboard'),{once:true});else show('dashboard');}arm();if(!initialized){initialized=true;if(location.hash==='#calendario')setTimeout(()=>{if(calendarAvailable())show('calendar');},900);}}
 $('calendar-open').addEventListener('click',()=>show('calendar',true));
 document.querySelectorAll('[data-calendar-back]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault?.();show('dashboard',true);}));
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view,true)));
 const controlTarget=e=>!!e.target.closest('button,a,input,select,textarea,[contenteditable=true],#radio-panel,.calendar-views,.calendar-toolbar,.view-dots,.bottom-bar');
 const hardCalendarTarget=e=>!!e.target.closest('dialog[open],button,a,input,select,textarea,[contenteditable=true],.calendar-toolbar,.calendar-sidebar,.view-dots');
 const calendarReturnDistance=()=>{const w=window.visualViewport?.width||innerWidth;return Math.max(170,Math.min(300,w*.42));};
 // Dashboard -> Calendar keeps the short page swipe. In Calendar, only a long right swipe returns home;
 // shorter month/week swipes are intentionally left to calendar.js so they only change period.
 document.addEventListener('touchstart',e=>{if(hasModal()||e.touches.length!==1){touch=null;return;}const t=e.touches[0];if(current==='calendar'){if(hardCalendarTarget(e)){touch=null;return;}}else if(controlTarget(e)){touch=null;return;}touch={x:t.clientX,y:t.clientY,at:Date.now(),view:current};},{passive:true,capture:true});
 document.addEventListener('touchend',e=>{if(!touch)return;const start=touch;touch=null;if(!e.changedTouches.length||hasModal())return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y,elapsed=Date.now()-start.at;if(elapsed>2200||Math.abs(dx)<32||Math.abs(dx)<Math.abs(dy)*.86)return;let next='';if(start.view==='dashboard'&&dx<0&&calendarAvailable())next='calendar';else if(start.view==='calendar'&&dx>=calendarReturnDistance())next='dashboard';if(next){suppressClickUntil=Date.now()+450;show(next);}},{passive:true});
 document.addEventListener('touchcancel',()=>touch=null,{passive:true});
 document.addEventListener('click',e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 // Optional mouse drag mirrors touch but keeps the bottom-zone rule in Calendar.
 document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||!getSettings().mouseSwipe||hasModal()||e.button!==0||controlTarget(e)){mouseDrag=null;return;}if(current==='calendar'&&!lowZone(e.clientY)){mouseDrag=null;return;}mouseDrag={x:e.clientX,y:e.clientY,at:Date.now(),id:e.pointerId,view:current};},{passive:true});
 document.addEventListener('pointerup',e=>{if(!mouseDrag||e.pointerId!==mouseDrag.id)return;const start=mouseDrag;mouseDrag=null,dx=e.clientX-start.x,dy=e.clientY-start.y;if(Date.now()-start.at>2000||Math.abs(dx)<46||Math.abs(dx)<Math.abs(dy)*.95)return;if(start.view==='dashboard'&&dx<0&&calendarAvailable())show('calendar');else if(start.view==='calendar'&&dx>0)show('dashboard');},{passive:true});
 document.addEventListener('pointercancel',()=>mouseDrag=null,{passive:true});
 for(const type of ['pointerdown','keydown','wheel','touchstart','input'])cal.addEventListener(type,activity,{passive:true});document.addEventListener('pointermove',()=>{if(current==='calendar'&&Date.now()-lastActivity>1000)activity();},{passive:true});
 document.addEventListener('keydown',e=>{if(controlTarget(e)||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==='ArrowLeft'&&current==='calendar'){e.preventDefault();show('dashboard',true);}else if(e.key==='ArrowRight'&&current==='dashboard'&&calendarAvailable()){e.preventDefault();show('calendar',true);}});
 document.addEventListener('istante:onboarding-preview-view',e=>show(e.detail?.view||'dashboard',false,true));
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',activity));document.addEventListener('visibilitychange',()=>{if(!document.hidden)activity();else clearTimeout(returnTimer);});
 apply();return{show,apply,current:()=>current};
}
window.IstantePages={create};
})();
