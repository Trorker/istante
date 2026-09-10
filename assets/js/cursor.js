/* Optional Istante cursor. Disabled by default; top-layer aware for dialogs. */
(function(){
 'use strict';
 const media=matchMedia('(hover:hover) and (pointer:fine)'),actionSelector='button,a,[role="button"],summary,input[type="range"],label.file-button,[tabindex]:not([tabindex="-1"])',nativeSelector='input:not([type="range"]):not([type="button"]):not([type="submit"]),textarea,[contenteditable="true"]';
 let enabled=false,dot=null,ring=null,x=-80,y=-80,raf=0,visible=false,host=null;
 function ensure(){if(dot&&ring)return;dot=document.createElement('i');ring=document.createElement('i');dot.className='istante-cursor-dot';ring.className='istante-cursor-ring';dot.setAttribute('aria-hidden','true');ring.setAttribute('aria-hidden','true');document.body.append(dot,ring);host=document.body;}
 function topHost(target){const dialog=target?.closest?.('dialog[open]');if(dialog)return dialog;const pop=target?.closest?.('[popover]');if(pop){try{if(pop.matches(':popover-open'))return pop;}catch(_){}}return document.body;}
 function mount(next){ensure();if(host===next)return;host=next;next.append(dot,ring);}
 function paint(){raf=0;if(!dot||!ring)return;dot.style.position=ring.style.position='fixed';const transform='translate3d('+x+'px,'+y+'px,0) translate(-50%,-50%)';dot.style.transform=transform;ring.style.transform=transform;}
 function schedule(){if(!raf)raf=requestAnimationFrame(paint);}
 function show(next){if(!dot||!ring||visible===next)return;visible=next;dot.classList.toggle('is-visible',next);ring.classList.toggle('is-visible',next);}
 function move(event){if(!enabled||!media.matches)return;const target=event.target instanceof Element?event.target:null;mount(topHost(target));x=event.clientX;y=event.clientY;schedule();const native=!!target?.closest(nativeSelector);show(!native);ring.classList.toggle('is-action',!native&&!!target?.closest(actionSelector));}
 function apply(next){enabled=!!next&&media.matches;document.documentElement.classList.toggle('istante-custom-cursor',enabled);if(enabled){ensure();show(false);}else{show(false);dot?.remove();ring?.remove();dot=ring=null;host=null;}}
 document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('pointerdown',event=>{if(enabled&&event.pointerType==='mouse')ring?.classList.add('is-pressed');},{passive:true});
 document.addEventListener('pointerup',()=>ring?.classList.remove('is-pressed'),{passive:true});document.addEventListener('pointercancel',()=>ring?.classList.remove('is-pressed'),{passive:true});
 document.documentElement.addEventListener('mouseleave',()=>show(false));window.addEventListener('blur',()=>show(false));
 media.addEventListener?.('change',()=>{let pref=false;try{pref=!!JSON.parse(localStorage.getItem('istante.original1.settings')||'{}').customCursor;}catch(_){}apply(pref);});
 window.IstanteCursor={apply,enabled:()=>enabled};
 let pref=false;try{pref=!!JSON.parse(localStorage.getItem('istante.original1.settings')||'{}').customCursor;}catch(_){}apply(pref);
})();
