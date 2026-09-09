(function(){
 'use strict';
 const media=matchMedia('(hover:hover) and (pointer:fine)');
 if(!media.matches)return;
 const dot=document.createElement('i'),ring=document.createElement('i');
 dot.className='istante-cursor-dot';ring.className='istante-cursor-ring';
 dot.setAttribute('aria-hidden','true');ring.setAttribute('aria-hidden','true');
 document.body.append(dot,ring);document.documentElement.classList.add('istante-custom-cursor');
 const actionSelector='button,a,[role="button"],summary,input[type="range"],label.file-button,[tabindex]:not([tabindex="-1"])';
 const nativeSelector='input:not([type="range"]):not([type="button"]):not([type="submit"]),textarea,[contenteditable="true"]';
 let x=-80,y=-80,raf=0,visible=false;
 function paint(){raf=0;const transform='translate3d('+x+'px,'+y+'px,0) translate(-50%,-50%)';dot.style.transform=transform;ring.style.transform=transform;}
 function schedule(){if(!raf)raf=requestAnimationFrame(paint);}
 function show(next){if(visible===next)return;visible=next;dot.classList.toggle('is-visible',next);ring.classList.toggle('is-visible',next);}
 function move(event){
  x=event.clientX;y=event.clientY;schedule();
  const target=event.target instanceof Element?event.target:null,native=!!target?.closest(nativeSelector);
  show(!native);ring.classList.toggle('is-action',!native&&!!target?.closest(actionSelector));
 }
 document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'){ring.classList.add('is-pressed');}}, {passive:true});
 document.addEventListener('pointerup',()=>ring.classList.remove('is-pressed'),{passive:true});
 document.addEventListener('pointercancel',()=>ring.classList.remove('is-pressed'),{passive:true});
 document.documentElement.addEventListener('mouseleave',()=>show(false));
 window.addEventListener('blur',()=>show(false));
 media.addEventListener?.('change',event=>{if(!event.matches){document.documentElement.classList.remove('istante-custom-cursor');dot.remove();ring.remove();}});
})();
