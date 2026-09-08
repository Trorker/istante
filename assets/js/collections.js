/* Named phrase collections, local and persistent. The standard library is read-only. */
(function(root){'use strict';
function normalize(payload,core,fallback){
 const title=String(payload?.title||payload?.name||fallback||'La mia raccolta').trim().slice(0,80),category=String(payload?.category||'Personale').slice(0,40);
 let source=Array.isArray(payload)?payload:payload?.phrases;
 if(!Array.isArray(source))throw Error('Serve un elenco di testi oppure un oggetto con "title" e "phrases".');
 source=source.map(x=>typeof x==='string'?x:x&&typeof x.text==='string'?x.text+(typeof x.author==='string'&&x.author.trim()?' \u2014 '+x.author.trim():''):x);
 const texts=core.parsePhrases(source).map(x=>x.text);return{title,category,phrases:texts};
}
function clean(value,core){
 const raw=value&&typeof value==='object'?value:{},items=[];if(raw.items!=null&&(!Array.isArray(raw.items)||raw.items.length>30))throw Error("La biblioteca deve contenere al massimo 30 raccolte.");
 for(const x of (Array.isArray(raw.items)?raw.items:[]).slice(0,30)){
  if(!x||typeof x.id!=='string'||!/^c-[a-z0-9-]{1,60}$/.test(x.id))throw Error('Identificativo della raccolta non valido.');
  if(items.some(i=>i.id===x.id))throw Error('Raccolte duplicate nel backup.');items.push({id:x.id,...normalize(x,core)});
 }
 return{version:1,items,selected:raw.selected==='original'||items.some(i=>i.id===raw.selected)?raw.selected:'original'};
}
function create({store,core,original,legacy,notify,onChange}){
 let state;try{state=clean(store.read('phrase-collections.v1',{}),core);}catch(_){state={version:1,selected:'original',items:[]};}
 if(legacy&&!state.items.length&&!store.read('collections-migrated',false)){
  try{const old=normalize(legacy,core,'La mia raccolta');state.items.push({id:'c-migrata',...old});state.selected='c-migrata';}catch(_){}
 }
 if(store.write('phrase-collections.v1',state))store.write('collections-migrated',true);
 const builtin={id:'original',title:'Pensieri di Istante',category:'Motivazionali',phrases:original.phrases||original};
 function selected(){return state.items.find(x=>x.id===state.selected)||builtin;}
 function persist(next){if(JSON.stringify(next).length>2200000)throw Error('La biblioteca supera lo spazio previsto. Esporta o elimina una raccolta prima di aggiungerne altre.');if(!store.write('phrase-collections.v1',next))throw Error('Memoria piena o non disponibile: la raccolta non \u00e8 stata modificata.');state=next;}
 function render(){
  const box=document.getElementById('collection-shelf');if(!box)return;box.replaceChildren();document.getElementById('collection-active-name').textContent=selected().title;
  for(const item of [builtin,...state.items]){
   const row=document.createElement('div');row.className='collection-row';
   const b=document.createElement('button');b.type='button';b.className='collection-choice';b.setAttribute('aria-pressed',String(item.id===state.selected));
   const name=document.createElement('strong'),meta=document.createElement('small');name.textContent=item.title;meta.textContent=item.category+' \u00b7 '+item.phrases.length+' frasi';b.append(name,meta);b.onclick=()=>select(item.id);row.append(b);
   if(item.id!=='original'){const del=document.createElement('button');del.type='button';del.className='icon-button';del.innerHTML=root.IstanteIcons.render('trash');del.setAttribute('aria-label','Elimina '+item.title);del.title='Elimina raccolta';del.onclick=()=>{if(!confirm('Eliminare "'+item.title+'" da questo dispositivo? Puoi prima esportarla.'))return;try{const active=state.selected===item.id;persist({...state,selected:active?'original':state.selected,items:state.items.filter(x=>x.id!==item.id)});if(active)onChange(null);render();notify('Raccolta eliminata. Le altre sono rimaste nella biblioteca.');}catch(e){notify(e.message);}};row.append(del);}
   box.append(row);
  }
 }
 function select(id){try{if(id!=='original'&&!state.items.some(x=>x.id===id))return;persist({...state,selected:id});onChange(id==='original'?null:selected());render();}catch(e){notify(e.message);}}
 function add(payload,fallback,mergeReceived=false){
  const item=normalize(payload,core,fallback);
  if(mergeReceived){const old=state.items.find(x=>x.title==='Pensieri ricevuti');if(old){const joined=normalize({...old,phrases:[...old.phrases,...item.phrases]},core);persist({...state,items:state.items.map(x=>x.id===old.id?{id:old.id,...joined}:x)});if(state.selected===old.id)onChange(selected());render();notify('Pensiero conservato nella biblioteca e nei preferiti.');return;}}
  const same=state.items.find(x=>JSON.stringify(x.phrases)===JSON.stringify(item.phrases));if(same){if(!mergeReceived)select(same.id);notify('Questa raccolta \u00e8 gi\u00e0 nella biblioteca.');return;}
  if(state.items.length>=30)throw Error('Puoi conservare fino a 30 raccolte personali.');
  const id='c-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);persist({...state,items:[...state.items,{id,...item}],selected:mergeReceived?state.selected:id});
  if(!mergeReceived)onChange(selected());render();notify(mergeReceived?'Pensiero conservato nella biblioteca.':'Raccolta aggiunta: '+item.phrases.length+' frasi. Le altre raccolte sono ancora qui.');
 }
 return{render,select,add,payload:()=>state.selected==='original'?null:selected(),name:()=>selected().title};
}
root.IstanteCollections={normalize,clean,create};
})(typeof window==='undefined'?globalThis:window);
