/* Search and catalogue editing live in a separate, compact modal. */
(function(){'use strict';
 function create({library,icon,notify}){
  const $=s=>document.querySelector(s);let filter=false;
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  function render(){
   const list=$('#station-manager-list'),q=$('#station-manager-search').value.trim().toLocaleLowerCase('it'),current=$('#radio-station')?.value||'';list.replaceChildren();
   const stations=library.list().filter(s=>(!filter||library.favorite(s.id))&&s.name.toLocaleLowerCase('it').includes(q));
   for(const [stationIndex,s] of stations.entries()){
    const row=node('article','station-manager-row'+(s.id===current?' is-current':'')),title=node('div','station-manager-title');if(s.id===current)row.setAttribute('aria-current','true');title.append(node('strong',null,s.name),node('small',null,s.custom?'Aggiunta da te':s.provider));row.append(title);
    const reorder=node('div','station-reorder');for(const [direction,label,disabled] of [[-1,'Sposta più in alto',stationIndex===0],[1,'Sposta più in basso',stationIndex===stations.length-1]]){const b=node('button','icon-button station-move-button');b.type='button';b.innerHTML='<span aria-hidden="true" class="station-move-glyph">'+(direction<0?'↑':'↓')+'</span>';b.setAttribute('aria-label',label+': '+s.name);b.disabled=disabled;b.addEventListener('click',()=>library.move(s.id,direction));reorder.append(b);}row.append(reorder);
    for(const [glyph,label,action,pressed]of [['heart',library.favorite(s.id)?'Rimuovi dai preferiti':'Aggiungi ai preferiti',()=>library.toggleFavorite(s.id),library.favorite(s.id)],['trash','Elimina stazione',()=>{library.remove(s.id);notify('Stazione eliminata. Puoi annullare dalla gestione stazioni.');},null]]){
     const b=node('button','icon-button');b.type='button';b.innerHTML='<span class="icon">'+icon(glyph)+'</span>';b.setAttribute('aria-label',label+': '+s.name);if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));b.addEventListener('click',action);row.append(b);
    }list.append(row);
   }
   $('#station-manager-empty').hidden=stations.length>0;$('#station-manager-count').textContent=stations.length+' stazioni';$('#station-undo').hidden=!library.canUndo();$('#station-restore').hidden=!library.hiddenCount();$('#station-filter').setAttribute('aria-pressed',String(filter));$('#station-filter').setAttribute('aria-label',filter?'Mostra tutte le stazioni':'Mostra solo le stazioni preferite');
  }
  $('#station-manager-search').addEventListener('input',render);$('#radio-station')?.addEventListener('change',render);$('#station-filter').addEventListener('click',()=>{filter=!filter;render();});$('#station-undo').addEventListener('click',()=>library.undo());$('#station-restore').addEventListener('click',()=>{library.restore();notify('Stazioni del catalogo ripristinate.');});
  $('#station-add-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget,msg=$('#station-add-error');try{library.add(form.elements.stationName.value,form.elements.stationUrl.value,form.elements.stationPage.value);form.reset();msg.hidden=true;$('#station-add-details').open=false;notify('La tua stazione \u00e8 nel catalogo.');}catch(err){msg.textContent=err.message;msg.hidden=false;}});
  document.addEventListener('istante:stations-changed',()=>{library.syncSelects();render();});
  library.syncSelects();render();return{render};
 }
 window.IstanteStationManager={create};
})();
