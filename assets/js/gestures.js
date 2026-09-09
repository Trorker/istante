/* Optional touch-only audio controls in the right edge. Disabled by default. */
(function(){'use strict';
 let start=null,lastTap=0,lastTapX=0,lastTapY=0;
 function read(){try{return JSON.parse(localStorage.getItem('istante.original1.settings')||'{}')||{};}catch(_){return{};}}
 function blocked(target){return !!target.closest?.('dialog[open],#radio-panel,input,select,textarea,[contenteditable=true],.control-popup,.bottom-bar,.view-dots,.calendar-toolbar,.timer-page-controls');}
 function inZone(x){const w=visualViewport?.width||innerWidth;return x>=w-Math.min(150,w*.22);}
 document.addEventListener('touchstart',e=>{
  const s=read();if(!s.audioVolumeGesture||e.touches.length!==1||blocked(e.target)){start=null;return;}
  const t=e.touches[0];if(!inZone(t.clientX)){start=null;return;}
  start={x:t.clientX,y:t.clientY,at:Date.now()};
 },{passive:true});
 document.addEventListener('touchend',e=>{
  if(!start||!e.changedTouches.length){start=null;return;}const a=start;start=null;const t=e.changedTouches[0],dx=t.clientX-a.x,dy=t.clientY-a.y,elapsed=Date.now()-a.at;
  if(elapsed<=550&&Math.abs(dx)<18&&Math.abs(dy)<18){const now=Date.now();if(now-lastTap<360&&Math.hypot(t.clientX-lastTapX,t.clientY-lastTapY)<34){lastTap=0;document.dispatchEvent(new CustomEvent('istante:audio-zone-toggle'));return;}lastTap=now;lastTapX=t.clientX;lastTapY=t.clientY;return;}
  if(elapsed>1400||Math.abs(dy)<58||Math.abs(dy)<Math.abs(dx)*1.35)return;
  const steps=Math.max(1,Math.min(4,Math.round(Math.abs(dy)/70))),delta=(dy<0?1:-1)*steps*5;
  document.dispatchEvent(new CustomEvent('istante:volume-gesture',{detail:{delta}}));
 },{passive:true});
 document.addEventListener('touchcancel',()=>start=null,{passive:true});
 document.addEventListener('dblclick',e=>{const s=read();if(!s.audioVolumeGesture||blocked(e.target)||!inZone(e.clientX))return;e.preventDefault();document.dispatchEvent(new CustomEvent('istante:audio-zone-toggle'));});
})();
