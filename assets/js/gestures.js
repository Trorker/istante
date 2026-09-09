/* Optional touch/mouse audio gestures in the right edge. Disabled by default. */
(function(){'use strict';
 let start=null,lastTap=0,lastTapX=0,lastTapY=0;
 function read(){try{return JSON.parse(localStorage.getItem('istante.original1.settings')||'{}')||{};}catch(_){return{};}}
 function blocked(target){return !!target.closest?.('dialog[open],#radio-panel,input,select,textarea,[contenteditable=true],button,a,.control-popup,.bottom-bar,.view-dots,.calendar-toolbar,.timer-page-controls,.topbar');}
 function metrics(){const w=visualViewport?.width||innerWidth,h=visualViewport?.height||innerHeight;return{w,h,edge:Math.min(190,Math.max(118,w*.24))};}
 function inZone(x,y){const {w,h,edge}=metrics();return x>=w-edge&&y>=Math.min(92,h*.12)&&y<=h-Math.max(34,h*.045);}
 function resetTap(){lastTap=0;lastTapX=0;lastTapY=0;}
 document.addEventListener('touchstart',e=>{
  const s=read();if(!s.audioVolumeGesture||e.touches.length!==1||blocked(e.target)){start=null;return;}
  const t=e.touches[0];if(!inZone(t.clientX,t.clientY)){start=null;return;}
  start={x:t.clientX,y:t.clientY,at:Date.now()};
 },{passive:true});
 document.addEventListener('touchend',e=>{
  if(!start||!e.changedTouches.length){start=null;return;}const a=start;start=null;const t=e.changedTouches[0],dx=t.clientX-a.x,dy=t.clientY-a.y,elapsed=Date.now()-a.at;
  if(elapsed<=650&&Math.abs(dx)<24&&Math.abs(dy)<24){const now=Date.now();if(lastTap&&now-lastTap<540&&Math.hypot(t.clientX-lastTapX,t.clientY-lastTapY)<52){resetTap();document.dispatchEvent(new CustomEvent('istante:audio-zone-toggle'));return;}lastTap=now;lastTapX=t.clientX;lastTapY=t.clientY;return;}
  resetTap();if(elapsed>1600||Math.abs(dy)<50||Math.abs(dy)<Math.abs(dx)*1.2)return;
  const steps=Math.max(1,Math.min(5,Math.round(Math.abs(dy)/64))),delta=(dy<0?1:-1)*steps*5;
  document.dispatchEvent(new CustomEvent('istante:volume-gesture',{detail:{delta}}));
 },{passive:true});
 document.addEventListener('touchcancel',()=>{start=null;resetTap();},{passive:true});
 document.addEventListener('dblclick',e=>{const s=read();if(!s.audioVolumeGesture||blocked(e.target)||!inZone(e.clientX,e.clientY))return;e.preventDefault();resetTap();document.dispatchEvent(new CustomEvent('istante:audio-zone-toggle'));});
})();
