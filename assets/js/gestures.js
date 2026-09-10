/* Touch/mouse audio gestures in the right edge. Enabled by default on the dashboard. */
(function(){'use strict';
 let start=null,lastTap=0,lastTapX=0,lastTapY=0,touchToggleAt=0,touchToggleX=0,touchToggleY=0;
 function read(){try{const s=JSON.parse(localStorage.getItem('istante.original1.settings')||'{}')||{};if(typeof s.audioVolumeGesture!=='boolean')s.audioVolumeGesture=true;return s;}catch(_){return{audioVolumeGesture:true};}}
 function blocked(target){return !!target.closest?.('dialog[open],#radio-panel,input,select,textarea,[contenteditable=true],button,a,.control-popup,.bottom-bar,.view-dots,.calendar-toolbar,.topbar,#calendar-view');}
 function metrics(){const w=visualViewport?.width||innerWidth,h=visualViewport?.height||innerHeight;return{w,h,edge:Math.min(240,Math.max(136,w*.32))};}
 function inZone(x,y){const {w,h,edge}=metrics();return x>=w-edge&&y>=Math.min(72,h*.085)&&y<=h-Math.max(24,h*.028);}
 function resetTap(){lastTap=0;lastTapX=0;lastTapY=0;}
 function toggle(){if(typeof window.IstanteAudioZoneToggle==='function')return window.IstanteAudioZoneToggle();document.dispatchEvent(new CustomEvent('istante:audio-zone-toggle'));return true;}
 document.addEventListener('pointerdown',e=>{
  if(!['touch','pen'].includes(e.pointerType))return;const s=read();if(!s.audioVolumeGesture||!e.isPrimary||blocked(e.target)||!inZone(e.clientX,e.clientY)){start=null;return;}
  start={x:e.clientX,y:e.clientY,at:Date.now(),id:e.pointerId};
 },{passive:true,capture:true});
 document.addEventListener('pointerup',e=>{
  if(!start||e.pointerId!==start.id)return;const a=start;start=null;const dx=e.clientX-a.x,dy=e.clientY-a.y,elapsed=Date.now()-a.at;
  if(elapsed<=760&&Math.abs(dx)<40&&Math.abs(dy)<40){const now=Date.now();if(lastTap&&now-lastTap<=760&&Math.hypot(e.clientX-lastTapX,e.clientY-lastTapY)<=88){e.preventDefault();resetTap();touchToggleAt=now;touchToggleX=e.clientX;touchToggleY=e.clientY;toggle();return;}lastTap=now;lastTapX=e.clientX;lastTapY=e.clientY;return;}
  resetTap();if(elapsed>1900||Math.abs(dy)<44||Math.abs(dy)<Math.abs(dx)*1.04)return;const delta=dy<0?10:-10;document.dispatchEvent(new CustomEvent('istante:volume-gesture',{detail:{delta}}));
 },{passive:false,capture:true});
 document.addEventListener('pointercancel',()=>{start=null;resetTap();},{passive:true,capture:true});
 document.addEventListener('dblclick',e=>{const now=Date.now();if(touchToggleAt&&now-touchToggleAt<950&&Math.hypot(e.clientX-touchToggleX,e.clientY-touchToggleY)<120){e.preventDefault();e.stopImmediatePropagation();touchToggleAt=0;return;}const s=read();if(!s.audioVolumeGesture||blocked(e.target)||!inZone(e.clientX,e.clientY))return;e.preventDefault();resetTap();toggle();},{capture:true});
})();
