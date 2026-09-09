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
 const builtin={id:'original',title:'Pensieri di Istante',category:'Motivazionali',phrases:original.phrases||original};
 function selected(){return state.items.find(x=>x.id===state.selected)||builtin;}
 function persist(next){if(JSON.stringify(next).length>2200000)throw Error('La biblioteca supera lo spazio previsto. Esporta o elimina una raccolta prima di aggiungerne altre.');if(!store.write('phrase-collections.v1',next))throw Error('Memoria piena o non disponibile: la raccolta non \u00e8 stata modificata.');state=next;}
 let tab='mine';
 const catalog=()=>root.ISTANTE_COLLECTION_CATALOG||[];
 const installed=id=>state.items.some(x=>x.id==='c-lib-'+id);
 function exportItem(item){const u=URL.createObjectURL(new Blob([JSON.stringify(item,null,2)+'\n'],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=(item.id||'raccolta')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);}
 function render(){
  const box=document.getElementById('collection-shelf');if(!box)return;box.replaceChildren();document.getElementById('collection-active-name').textContent=selected().title;
  const query=core.normalized(document.getElementById('collection-search').value);
  document.querySelectorAll('[data-collection-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.collectionTab===tab)));
  document.getElementById('collection-library-note').textContent=tab==='mine'?'Scegli una raccolta da usare. Puoi importare JSON o TXT ed esportare le raccolte in JSON.':'Scarica nella tua biblioteca: i testi sono inclusi in Istante e disponibili anche senza connessione. Il download non cambia la raccolta attiva.';
  const list=tab==='mine'?[builtin,...state.items]:catalog();
  for(const item of list.filter(x=>!query||core.normalized(x.title+' '+x.category+' '+(x.description||'')).includes(query))){
   const row=document.createElement('article');row.className='collection-card'+(item.id===state.selected?' is-selected':'');
   const name=document.createElement('strong'),meta=document.createElement('small'),desc=document.createElement('p'),actions=document.createElement('div');actions.className='collection-card-actions';
   name.textContent=item.title;meta.textContent=item.category+' \u00b7 '+item.phrases.length+' frasi';desc.textContent=item.description||(item.id==='original'?'I mille pensieri originali di Istante. La tua raccolta di partenza.':'Una raccolta conservata su questo dispositivo.');
   const btn=(label,fn)=>{const b=document.createElement('button');b.type='button';b.className='secondary-button';b.textContent=label;b.onclick=fn;actions.append(b);return b;};
   if(tab==='catalog'){
    if(installed(item.id)){const id='c-lib-'+item.id;if(state.selected===id){const active=document.createElement('span');active.textContent='In uso';actions.append(active);}else btn('Usa questa raccolta',()=>select(id));}
    else btn('Scarica raccolta',()=>{try{if(state.items.length>=30)throw Error('Massimo 30 raccolte aggiunte.');persist({...state,items:[...state.items,{id:'c-lib-'+item.id,...normalize(item,core)}]});render();notify('Raccolta salvata. Premi Usa questa raccolta per attivarla.');}catch(e){notify(e.message);}});
   }else if(item.id===state.selected){const n=document.createElement('span');n.textContent='In uso';actions.append(n);}else btn('Usa questa raccolta',()=>select(item.id));
   const ex=document.createElement('button');ex.type='button';ex.className='icon-button';ex.innerHTML=root.IstanteIcons.render('download');ex.title='Esporta JSON';ex.setAttribute('aria-label','Esporta '+item.title);ex.onclick=()=>exportItem(item);actions.append(ex);
   if(tab==='mine'&&item.id!=='original'){const del=document.createElement('button');del.type='button';del.className='icon-button';del.innerHTML=root.IstanteIcons.render('trash');del.setAttribute('aria-label','Elimina '+item.title);del.title='Elimina raccolta';del.onclick=()=>{if(!confirm('Eliminare "'+item.title+'" da questo dispositivo?'))return;try{const active=state.selected===item.id;persist({...state,selected:active?'original':state.selected,items:state.items.filter(x=>x.id!==item.id)});if(active)onChange(null);render();notify('Raccolta rimossa. I preferiti restano salvati e le raccolte del catalogo si possono riscaricare.');}catch(e){notify(e.message);}};actions.append(del);}
   row.append(meta,name,desc,actions);box.append(row);
  }
  document.getElementById('collection-library-empty').hidden=box.children.length>0;
 }
 document.getElementById('collection-search').addEventListener('input',render);
 document.querySelectorAll('[data-collection-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.collectionTab;render();}));
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
