/* Local catalogue overlay: built-ins are never mutated. Only public HTTPS streams. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstanteStationLibrary=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const KEY='istante.original1.radioLibrary';
 function url(raw){try{const u=new URL(String(raw).trim());return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch(_){return '';}}
 function clean(raw,builtins){
  const ids=new Set(builtins.map(s=>s.id)),custom=[];
  for(const r of Array.isArray(raw?.custom)?raw.custom.slice(0,100):[]){
   if(!r||!/^custom-[a-z0-9-]{1,60}$/.test(r.id)||ids.has(r.id)||!String(r.name||'').trim()||!url(r.url))continue;
   ids.add(r.id);custom.push({id:r.id,name:String(r.name).trim().slice(0,90),url:url(r.url),page:url(r.page)});
  }
  return{custom,hidden:[...new Set((Array.isArray(raw?.hidden)?raw.hidden:[]).filter(id=>builtins.some(s=>s.id===id)))],favorites:[...new Set((Array.isArray(raw?.favorites)?raw.favorites:[]).filter(id=>ids.has(id)))]};
 }
 function create(builtins,notify){
  let raw;try{raw=JSON.parse(localStorage.getItem(KEY));}catch(_){}let state=clean(raw,builtins),previous=null;
  function list(){return [...builtins.filter(s=>!state.hidden.includes(s.id)),...state.custom.map(s=>({id:s.id,name:s.name,provider:'La tua radio',page:s.page||s.url,custom:true,streams:[{url:s.url,label:'Stream personalizzato',mime:''}]}))];}
  function publish(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){notify('Catalogo modificato solo per questa sessione: memoria non disponibile.');}document.dispatchEvent(new CustomEvent('istante:stations-changed'));}
  return {list,get:id=>list().find(s=>s.id===id),favorite:id=>state.favorites.includes(id),toggleFavorite(id){if(!list().some(s=>s.id===id))return;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];publish();},
   add(name,stream,page){name=String(name).trim();if(!name||name.length>90)throw Error('Scrivi un nome da 1 a 90 caratteri.');if(!url(stream))throw Error('Inserisci un URL HTTPS pubblico per il flusso audio, senza credenziali.');if(page&&!url(page))throw Error('Il sito della stazione deve essere un URL HTTPS valido.');if(state.custom.length>=100)throw Error('Hai raggiunto il limite di 100 stazioni personali.');if(state.custom.some(s=>s.url===url(stream)))throw Error('Questo stream personale esiste gi\u00e0.');const id='custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);state.custom.push({id,name,url:url(stream),page:url(page)});publish();return id;},
   remove(id){if(!list().some(s=>s.id===id))return;previous=structuredClone(state);state.custom=state.custom.filter(s=>s.id!==id);if(builtins.some(s=>s.id===id)&&!state.hidden.includes(id))state.hidden.push(id);state.favorites=state.favorites.filter(s=>s!==id);publish();},
   undo(){if(previous){state=previous;previous=null;publish();}},canUndo:()=>!!previous,
   restore(){state.hidden=[];publish();},hiddenCount:()=>state.hidden.length,
   syncSelects(){document.querySelectorAll('#radio-station,[name="radioStation"]').forEach(select=>{const value=select.value;select.replaceChildren();for(const [i,s]of list().entries()){const o=new Option(String(i+1).padStart(2,'0')+'  '+s.name,s.id);o.dataset.favorite=String(state.favorites.includes(s.id));select.add(o);}if(!select.options.length)select.add(new Option('Nessuna stazione: aggiungine una',''));if([...select.options].some(o=>o.value===value))select.value=value;select.dataset.stations='true';});window.IstanteControls?.refresh();}
  };
 }
 return{create,clean,url};
});
