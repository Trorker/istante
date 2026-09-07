/* Small, cancellable UI transitions. Background effects have their own controls. */
(function () {
 'use strict';
 const active = new WeakMap();
 const allowed = () => !document.body.classList.contains('no-motion') && !matchMedia('(prefers-reduced-motion: reduce)').matches;
 function cancel(node) { const a=active.get(node); if(a){a.cancel();active.delete(node);} node.classList.remove('is-leaving'); }
 function animate(node, frames, duration, done) {
  cancel(node);
  if(!allowed() || !node.animate){done?.(); return;}
  const a=node.animate(frames,{duration,easing:'cubic-bezier(.2,.7,.2,1)',fill:'none'}); active.set(node,a);
  a.onfinish=()=>{if(active.get(node)!==a)return;active.delete(node);done?.();};
 }
 function present(node) { cancel(node);if(!node.open)node.showModal();animate(node,[{opacity:0,transform:'translateY(18px) scale(.975)'},{opacity:1,transform:'translateY(0) scale(1)'}],310); }
 function dismiss(node) { if(!node?.open)return;animate(node,[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(12px) scale(.985)'}],190,()=>{node.classList.remove('is-leaving');node.close();});if(active.has(node))node.classList.add('is-leaving'); }
 function show(node) { cancel(node);node.hidden=false;animate(node,[{opacity:0,transform:'translateY(-8px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],260); }
 function hide(node) { if(node.hidden)return;animate(node,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],170,()=>{node.hidden=true;}); }
 function flash(node) { if(node)animate(node,[{opacity:.25,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],260); }
 function accordion(section) {
  const summary=section.querySelector(':scope > summary'),content=section.querySelector(':scope > .settings-section-body');
  if(!summary||!content)return;
  section.removeAttribute('name');
  section._setOpen=function(open){
   if(section._intent===open&&section.open===open)return;section._intent=open;cancel(content);
   if(open){section.open=true;animate(content,[{height:'0px',opacity:0},{height:content.scrollHeight+'px',opacity:1}],270,()=>content.style.removeProperty('overflow'));content.style.overflow='hidden';}
   else if(section.open){animate(content,[{height:content.scrollHeight+'px',opacity:1},{height:'0px',opacity:0}],200,()=>{section.open=false;content.style.removeProperty('overflow');});content.style.overflow='hidden';}
  };
  summary.addEventListener('click',e=>{e.preventDefault();const open=!(section._intent??section.open);if(open)document.querySelectorAll('.settings-section').forEach(other=>{if(other!==section)other._setOpen?.(false);});section._setOpen(open);});
 }
 window.IstanteMotion={allowed,present,dismiss,show,hide,flash,accordion,cancel};
})();
