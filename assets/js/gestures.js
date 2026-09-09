/* Optional touch-only audio volume gesture in the right edge. Disabled by default. */
(function(){'use strict';
 let start=null;
 function read(){try{return JSON.parse(localStorage.getItem('istante.original1.settings')||'{}')||{};}catch(_){return{};}}
 function blocked(target){return !!target.closest?.('dialog[open],#radio-panel,input,select,textarea,[contenteditable=true],.control-popup,.bottom-bar,.view-dots,.calendar-toolbar,.timer-page-controls');}
 document.addEventListener('touchstart',e=>{
  const s=read();if(!s.audioVolumeGesture||e.touches.length!==1||blocked(e.target)){start=null;return;}
  const t=e.touches[0],w=visualViewport?.width||innerWidth;if(t.clientX<w-Math.min(150,w*.22)){start=null;return;}
  start={x:t.clientX,y:t.clientY,at:Date.now()};
 },{passive:true});
 document.addEventListener('touchend',e=>{
  if(!start||!e.changedTouches.length){start=null;return;}const a=start;start=null;const t=e.changedTouches[0],dx=t.clientX-a.x,dy=t.clientY-a.y;
  if(Date.now()-a.at>1400||Math.abs(dy)<58||Math.abs(dy)<Math.abs(dx)*1.35)return;
  const steps=Math.max(1,Math.min(4,Math.round(Math.abs(dy)/70))),delta=(dy<0?1:-1)*steps*5;
  document.dispatchEvent(new CustomEvent('istante:volume-gesture',{detail:{delta}}));
 },{passive:true});
 document.addEventListener('touchcancel',()=>start=null,{passive:true});
})();
