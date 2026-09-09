/* Istante custom tooltips: delayed on hover, immediate enough for keyboard focus. */
(function(){'use strict';
 const supportsHover=matchMedia('(hover:hover) and (pointer:fine)');
 const HOVER_DELAY=1900,FOCUS_DELAY=520;
 let tip=null,active=null,raf=0,showTimer=0,pending=null;
 function ensure(){if(tip)return tip;tip=document.createElement('div');tip.className='istante-tooltip';tip.id='istante-tooltip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.append(tip);return tip;}
 function eligible(el){return el&&el.matches?.('[data-istante-tooltip],button[title],a[title],.icon-button[aria-label],.collection-link[aria-label]');}
 function prepare(root=document){root.querySelectorAll?.('[title],.icon-button[aria-label],.collection-link[aria-label]').forEach(el=>{
   if(!el.dataset.istanteTooltip){const text=(el.getAttribute('title')||((el.classList.contains('icon-button')||el.classList.contains('collection-link'))?el.getAttribute('aria-label'):'')||'').trim();if(text)el.dataset.istanteTooltip=text;}
   if(el.dataset.istanteTooltip)el.removeAttribute('title');
  });}
 function place(el){const t=ensure(),r=el.getBoundingClientRect(),pad=9,w=t.offsetWidth,h=t.offsetHeight;let x=r.left+r.width/2-w/2,y=r.top-h-10,side='top';if(y<pad){y=r.bottom+10;side='bottom';}x=Math.max(pad,Math.min(innerWidth-w-pad,x));y=Math.max(pad,Math.min(innerHeight-h-pad,y));t.style.left=Math.round(x)+'px';t.style.top=Math.round(y)+'px';t.dataset.side=side;}
 function reveal(el){if(!el?.isConnected||pending!==el)return;pending=null;const text=el.dataset?.istanteTooltip;if(!text)return;active=el;const t=ensure();t.textContent=text;t.hidden=false;t.classList.remove('is-visible');cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{place(el);t.classList.add('is-visible');el.setAttribute('aria-describedby',t.id);});}
 function schedule(el,delay){const text=el?.dataset?.istanteTooltip;if(!text)return;clearTimeout(showTimer);if(active&&active!==el)hide(active);pending=el;showTimer=setTimeout(()=>reveal(el),delay);}
 function hide(el=active){clearTimeout(showTimer);showTimer=0;pending=null;if(!tip)return;if(active&&el&&el!==active)return;active?.removeAttribute('aria-describedby');active=null;tip.classList.remove('is-visible');setTimeout(()=>{if(tip&&!active&&!pending)tip.hidden=true;},120);}
 document.addEventListener('DOMContentLoaded',()=>prepare());
 const observer=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1){if(eligible(n)){const title=n.getAttribute('title'),aria=n.getAttribute('aria-label');n.dataset.istanteTooltip=n.dataset.istanteTooltip||title||aria||'';n.removeAttribute('title');}prepare(n);}})));observer.observe(document.documentElement,{childList:true,subtree:true});
 document.addEventListener('pointerover',e=>{if(!supportsHover.matches)return;const el=e.target.closest?.('[data-istante-tooltip]');if(el&&el!==active&&el!==pending)schedule(el,HOVER_DELAY);});
 document.addEventListener('pointerout',e=>{const el=e.target.closest?.('[data-istante-tooltip]');if(el&&!el.contains(e.relatedTarget)){if(el===pending){clearTimeout(showTimer);pending=null;}if(el===active)hide(el);}});
 document.addEventListener('focusin',e=>{if(!supportsHover.matches)return;const el=e.target.closest?.('[data-istante-tooltip]');if(el)schedule(el,FOCUS_DELAY);});
 document.addEventListener('focusout',e=>{const el=e.target.closest?.('[data-istante-tooltip]');if(el){if(el===pending){clearTimeout(showTimer);pending=null;}if(el===active)hide(el);}});
 document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')hide();},{passive:true,capture:true});
 document.addEventListener('close',()=>hide(),true);document.addEventListener('istante:view-change',()=>hide());
 document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});
 addEventListener('resize',()=>{if(active)place(active);},{passive:true});addEventListener('scroll',()=>{if(active)place(active);},{passive:true,capture:true});
})();
