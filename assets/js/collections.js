/* Named phrase collections, local and persistent. The standard library is read-only. */
(function(root){'use strict';
function normalize(payload,core,fallback){
 const title=String(payload?.title||payload?.name||fallback||'La mia raccolta').trim().slice(0,80),category=String(payload?.category||'Personale').slice(0,40);
 let source=Array.isArray(payload)?payload:payload?.phrases;
 if(!Array.isArray(source))throw Error('Serve un elenco di testi oppure un oggetto con "title" e "phrases".');
 source=source.map(x=>typeof x==='string'?x:x&&typeof x.text==='string'?x.text+(typeof x.author==='string'&&x.author.trim()?' \u2014 '+x.author.trim():''):x);
 const texts=core.parsePhrases(source).map(x=>x.text);return{title,category,description:String(payload?.description||'').slice(0,400),phrases:texts};
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
 const builtin={id:'original',title:'Pensieri di Istante',category:'Motivazionali',description:'I mille pensieri originali di Istante. La tua raccolta di partenza.',phrases:original.phrases||original};
 let statusFilter='all';
 const catalog=()=>root.ISTANTE_COLLECTION_CATALOG||[];
 const catalogLocalId=id=>'c-lib-'+id;
 const catalogIdFromLocal=id=>id.startsWith('c-lib-')?id.slice(6):'';
 function selected(){return state.items.find(x=>x.id===state.selected)||builtin;}
 function persist(next){if(JSON.stringify(next).length>2200000)throw Error('La biblioteca supera lo spazio previsto. Esporta o elimina una raccolta prima di aggiungerne altre.');if(!store.write('phrase-collections.v1',next))throw Error('Memoria piena o non disponibile: la raccolta non è stata modificata.');state=next;}
 function exportItem(item){const u=URL.createObjectURL(new Blob([JSON.stringify(item,null,2)+'\n'],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=(item.id||'raccolta')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);}
 function cards(){
  const remote=catalog(),remoteIds=new Set(remote.map(x=>x.id)),out=[];
  const active=state.selected;
  out.push({item:builtin,localId:'original',status:active==='original'?'active':'installed',kind:'builtin'});
  for(const item of state.items){
   const cid=catalogIdFromLocal(item.id);if(cid&&remoteIds.has(cid))continue;
   out.push({item,localId:item.id,status:active===item.id?'active':'installed',kind:'local'});
  }
  for(const item of remote){
   const localId=catalogLocalId(item.id),local=state.items.find(x=>x.id===localId);
   out.push({item:local||item,source:item,localId,status:active===localId?'active':local?'installed':'available',kind:'catalog'});
  }
  return out;
 }
 const statusLabel=status=>status==='active'?'In uso':status==='installed'?'Scaricata':'Da scaricare';
 const statusIcon=status=>status==='active'?'check':status==='installed'?'download':'cloud';
 function render(){
  const box=document.getElementById('collection-shelf');if(!box)return;box.replaceChildren();
  const activeName=document.getElementById('collection-active-name');if(activeName)activeName.textContent=selected().title;
  const query=core.normalized(document.getElementById('collection-search')?.value||'');
  document.querySelectorAll('[data-collection-status]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.collectionStatus===statusFilter)));
  const note=document.getElementById('collection-library-note');if(note)note.textContent='Ogni raccolta mostra subito se è in uso, già disponibile sul dispositivo oppure pronta da scaricare.';
  const visible=cards().filter(card=>{
   if(statusFilter!=='all'&&card.status!==statusFilter)return false;
   const x=card.item;return !query||core.normalized(x.title+' '+x.category+' '+(x.description||'')).includes(query);
  });
  for(const card of visible){
   const {item,status,localId,kind}=card,row=document.createElement('article');row.className='collection-card collection-card-'+status+(status==='active'?' is-selected':'');row.dataset.status=status;
   const top=document.createElement('div');top.className='collection-card-top';
   const meta=document.createElement('small');meta.className='collection-card-meta';meta.textContent=item.category+' · '+item.phrases.length+' frasi';
   const badge=document.createElement('span');badge.className='collection-status-badge status-'+status;badge.innerHTML='<span class="icon">'+root.IstanteIcons.render(statusIcon(status))+'</span><span>'+statusLabel(status)+'</span>';
   top.append(meta,badge);
   const name=document.createElement('strong');name.textContent=item.title;
   const desc=document.createElement('p');desc.textContent=item.description||(kind==='local'?'Una raccolta conservata su questo dispositivo.':'Una raccolta di Istante.');
   const actions=document.createElement('div');actions.className='collection-card-actions';
   const button=(label,fn,primary=false)=>{const b=document.createElement('button');b.type='button';b.className=primary?'primary-button':'secondary-button';b.textContent=label;b.addEventListener('click',fn);actions.append(b);return b;};
   if(status==='available'){const downloadButton=button('Scarica',()=>installCatalog(card.source||item),true);downloadButton.classList.add('collection-download-button');}
   else if(status==='installed')button('Usa questa raccolta',()=>select(localId),true);
   else {const current=document.createElement('span');current.className='collection-active-note';current.textContent='Questa è la raccolta attiva';actions.append(current);}
   if(status!=='available'){
    const ex=document.createElement('button');ex.type='button';ex.className='icon-button';ex.innerHTML=root.IstanteIcons.render('download');ex.title='Esporta JSON';ex.setAttribute('aria-label','Esporta '+item.title);ex.addEventListener('click',()=>exportItem(item));actions.append(ex);
    if(localId!=='original'){
     const del=document.createElement('button');del.type='button';del.className='icon-button';del.innerHTML=root.IstanteIcons.render('trash');del.title='Rimuovi dal dispositivo';del.setAttribute('aria-label','Rimuovi '+item.title+' dal dispositivo');del.addEventListener('click',()=>remove(localId,item.title));actions.append(del);
    }
   }
   row.append(top,name,desc,actions);box.append(row);
  }
  const empty=document.getElementById('collection-library-empty');if(empty){empty.hidden=box.children.length>0;empty.textContent=statusFilter==='active'?'Nessuna raccolta in uso.':statusFilter==='installed'?'Nessun’altra raccolta scaricata.':statusFilter==='available'?'Non ci sono nuove raccolte da scaricare.':'Nessuna raccolta trovata.';}
 }
 function installCatalog(item){
  try{if(state.items.length>=30)throw Error('Massimo 30 raccolte aggiunte.');const id=catalogLocalId(item.id);if(state.items.some(x=>x.id===id))return;persist({...state,items:[...state.items,{id,...normalize(item,core)}]});render();notify('Raccolta scaricata. Ora puoi usarla quando vuoi.');}catch(e){notify(e.message);}
 }
 function remove(id,title){
  if(!confirm('Rimuovere "'+title+'" da questo dispositivo?'))return;
  try{const wasActive=state.selected===id;persist({...state,selected:wasActive?'original':state.selected,items:state.items.filter(x=>x.id!==id)});if(wasActive)onChange(null);render();notify('Raccolta rimossa. Se fa parte del catalogo potrai scaricarla di nuovo.');}catch(e){notify(e.message);}
 }
 document.getElementById('collection-search')?.addEventListener('input',render);
 document.querySelectorAll('[data-collection-status]').forEach(b=>b.addEventListener('click',()=>{statusFilter=b.dataset.collectionStatus||'all';render();}));
 function select(id){try{if(id!=='original'&&!state.items.some(x=>x.id===id))return;persist({...state,selected:id});onChange(id==='original'?null:selected());render();document.dispatchEvent(new CustomEvent('istante:collection-selected',{detail:{id,title:selected().title}}));}catch(e){notify(e.message);}}
 function add(payload,fallback,mergeReceived=false){
  const item=normalize(payload,core,fallback);
  if(mergeReceived){const old=state.items.find(x=>x.title==='Pensieri ricevuti');if(old){const joined=normalize({...old,phrases:[...old.phrases,...item.phrases]},core);persist({...state,items:state.items.map(x=>x.id===old.id?{id:old.id,...joined}:x)});if(state.selected===old.id)onChange(selected());render();notify('Pensiero conservato nella biblioteca e nei preferiti.');return;}}
  const same=state.items.find(x=>JSON.stringify(x.phrases)===JSON.stringify(item.phrases));if(same){if(!mergeReceived)select(same.id);notify('Questa raccolta è già nella biblioteca.');return;}
  if(state.items.length>=30)throw Error('Puoi conservare fino a 30 raccolte personali.');
  const id='c-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);persist({...state,items:[...state.items,{id,...item}],selected:mergeReceived?state.selected:id});
  if(!mergeReceived){onChange(selected());document.dispatchEvent(new CustomEvent('istante:collection-selected',{detail:{id,title:selected().title}}));}render();notify(mergeReceived?'Pensiero conservato nella biblioteca.':'Raccolta aggiunta: '+item.phrases.length+' frasi. Le altre raccolte sono ancora qui.');
 }
 return{render,select,add,payload:()=>state.selected==='original'?null:selected(),name:()=>selected().title};
}
root.IstanteCollections={normalize,clean,create};
})(typeof window==='undefined'?globalThis:window);
