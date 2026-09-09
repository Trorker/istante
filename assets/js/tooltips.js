/* Istante custom tooltips. Native title bubbles are removed and hover timers cancel immediately. */
(function(){'use strict';
 const supportsHover=matchMedia('(hover:hover) and (pointer:fine)');
 const HOVER_DELAY=2000,FOCUS_DELAY=850;
 let tip=null,active=null,raf=0,showTimer=0,pending=null,hideTimer=0;
 function ensure(){if(tip)return tip;tip=document.createElement('div');tip.className='istante-tooltip';tip.id='istante-tooltip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.append(tip);return tip;}
 function tooltipText(el){return (el?.dataset?.istanteTooltip||((el?.classList?.contains('icon-button')||el?.classList?.contains('collection-link'))?el?.getAttribute?.('aria-label'):'')||'').trim();}
 function absorb(el){if(!el||el.nodeType!==1)return;const title=el.getAttribute('title');if(title&&!el.dataset.istanteTooltip)el.dataset.istanteTooltip=title;if(el.hasAttribute('title'))el.removeAttribute('title');if(!el.dataset.istanteTooltip&&(el.classList.contains('icon-button')||el.classList.contains('collection-link'))){const aria=(el.getAttribute('aria-label')||'').trim();if(aria)el.dataset.istanteTooltip=aria;}}
 function prepare(root=document){if(root.nodeType===1)absorb(root);root.querySelectorAll?.('[title],.icon-button[aria-label],.collection-link[aria-label],[data-istante-tooltip]').forEach(absorb);}
 function place(el){const t=ensure(),r=el.getBoundingClientRect(),pad=9,w=t.offsetWidth,h=t.offsetHeight;let x=r.left+r.width/2-w/2,y=r.top-h-10,side='top';if(y<pad){y=r.bottom+10;side='bottom';}x=Math.max(pad,Math.min(innerWidth-w-pad,x));y=Math.max(pad,Math.min(innerHeight-h-pad,y));t.style.left=Math.round(x)+'px';t.style.top=Math.round(y)+'px';t.dataset.side=side;}
 function cancelPending(el=null){if(el&&pending!==el)return;clearTimeout(showTimer);showTimer=0;pending=null;}
 function reveal(el){if(!el?.isConnected||pending!==el)return;pending=null;const text=tooltipText(el);if(!text)return;active=el;const t=ensure();clearTimeout(hideTimer);t.textContent=text;t.hidden=false;t.classList.remove('is-visible');cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{if(active!==el)return;place(el);t.classList.add('is-visible');el.setAttribute('aria-describedby',t.id);});}
 function schedule(el,delay){const text=tooltipText(el);if(!text)return;absorb(el);cancelPending();if(active&&active!==el)hide(active,true);pending=el;showTimer=setTimeout(()=>reveal(el),delay);}
 function hide(el=active,immediate=false){cancelPending();if(!tip){active=null;return;}if(active&&el&&el!==active)return;active?.removeAttribute('aria-describedby');active=null;tip.classList.remove('is-visible');clearTimeout(hideTimer);hideTimer=setTimeout(()=>{if(tip&&!active&&!pending)tip.hidden=true;},immediate?0:120);}
 document.addEventListener('DOMContentLoaded',()=>prepare());
 const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='attributes'){absorb(r.target);continue;}for(const n of r.addedNodes)if(n.nodeType===1)prepare(n);}});
 observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['title']});
 document.addEventListener('pointerover',e=>{const el=e.target.closest?.('[data-istante-tooltip],[title],.icon-button[aria-label],.collection-link[aria-label]');if(!el)return;absorb(el);if(!supportsHover.matches)return;if(el!==active&&el!==pending)schedule(el,HOVER_DELAY);},true);
 document.addEventListener('pointerout',e=>{const watched=pending||active;if(!watched)return;if(!watched.contains(e.target))return;if(e.relatedTarget&&watched.contains(e.relatedTarget))return;if(watched===pending)cancelPending(watched);if(watched===active)hide(watched);},true);
 document.addEventListener('pointermove',e=>{if(pending&&!pending.contains(e.target))cancelPending(pending);if(active&&!active.contains(e.target)&&!tip?.contains(e.target))hide(active);},{passive:true,capture:true});
 document.addEventListener('focusin',e=>{if(!supportsHover.matches)return;const el=e.target.closest?.('[data-istante-tooltip],[title],.icon-button[aria-label],.collection-link[aria-label]');if(el){absorb(el);schedule(el,FOCUS_DELAY);}});
 document.addEventListener('focusout',e=>{const el=e.target.closest?.('[data-istante-tooltip]');if(el){if(el===pending)cancelPending(el);if(el===active)hide(el);}});
 document.addEventListener('pointerdown',()=>hide(undefined,true),{passive:true,capture:true});
 document.addEventListener('pointercancel',()=>hide(undefined,true),{passive:true,capture:true});
 document.addEventListener('close',()=>hide(undefined,true),true);document.addEventListener('istante:view-change',()=>hide(undefined,true));document.addEventListener('keydown',e=>{if(e.key==='Escape')hide(undefined,true);});
 addEventListener('blur',()=>hide(undefined,true));addEventListener('resize',()=>{if(active)place(active);},{passive:true});addEventListener('scroll',()=>{if(active)place(active);},{passive:true,capture:true});
})();
