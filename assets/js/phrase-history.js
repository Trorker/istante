/* Istante 3.7: random choice without replacement, stable scheduled slots.
 * Local history is bounded. Imported collections and unavailable storage are supported.
 * User-selected repeats are intentional; animations and reloads never consume a draw.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstantePhraseHistory=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const KEY='phrase-history.v1',MAX_LOG=3000,MAX_SEEN=20000;
 const key=text=>String(text).toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[\p{P}\p{S}]/gu,'').replace(/\s+/g,' ').trim();
 function secureIndex(length){
  if(length<=1)return 0;
  if(typeof crypto!=='undefined'&&crypto.getRandomValues){const value=new Uint32Array(1),limit=Math.floor(4294967296/length)*length;do{crypto.getRandomValues(value);}while(value[0]>=limit);return value[0]%length;}
  return Math.floor(Math.random()*length);
 }
 function clean(raw){
  const x=raw&&typeof raw==='object'?raw:{};
  return {version:1,revision:Number.isSafeInteger(x.revision)?x.revision:0,
   cycle:Number.isSafeInteger(x.cycle)&&x.cycle>0?x.cycle:1,
   seen:Array.isArray(x.seen)?[...new Set(x.seen.filter(s=>typeof s==='string'&&s.length<=1000))].slice(-MAX_SEEN):[],
   log:Array.isArray(x.log)?x.log.filter(e=>e&&typeof e.text==='string'&&e.text.length<=1000&&Number.isFinite(e.at)).slice(-MAX_LOG):[],
   current:x.current&&typeof x.current.slot==='string'&&typeof x.current.text==='string'?x.current:null};
 }
 function create({store,index=secureIndex,now=Date.now}){
  let state=clean(store.read(KEY,null)),unsaved=false;
  function refresh(){if(unsaved)return;const raw=store.read(KEY,null);if(raw&&raw.revision>=state.revision)state=clean(raw);}
  function persist(){state.revision++;unsaved=store.write(KEY,state)===false;}
  function pool(items){const found=new Set();return items.filter(p=>{const k=key(p.text);if(found.has(k))return false;found.add(k);return true;});}
  function remember(phrase,slot,manual,reason){
   const k=key(phrase.text);if(!state.seen.includes(k))state.seen.push(k);
   state.seen=state.seen.slice(-MAX_SEEN);
   state.log.push({text:phrase.text,at:now(),reason,cycle:state.cycle});state.log=state.log.slice(-MAX_LOG);
   state.current={slot,text:phrase.text,manual};persist();return{phrase,manual};
  }
  function draw(items,slot,manual=false){
   const all=pool(items);if(!all.length)throw Error('La raccolta non contiene frasi.');
   const seen=new Set(state.seen);let eligible=all.filter(p=>!seen.has(key(p.text)));
   if(!eligible.length){state.seen=[];state.cycle++;eligible=all.filter(p=>key(p.text)!==key(state.current?.text||''));if(!eligible.length)eligible=all;}
   // Also avoid visually adjacent variants when an imported collection includes them.
   const last=state.current?.text,previous=items.find(p=>p.text===last);
   if(previous&&eligible.length>1){const different=eligible.filter(p=>p.group!==previous.group);if(different.length)eligible=different;}
   const i=Math.min(eligible.length-1,Math.max(0,Math.floor(index(eligible.length))||0));
   return remember(eligible[i],slot,manual,manual?'next':'scheduled');
  }
  return {
   resolve(items,slot){refresh();const current=state.current?.slot===slot?items.find(p=>key(p.text)===key(state.current.text)):null;return current?{phrase:current,manual:!!state.current.manual}:draw(items,slot);},
   next(items,slot){refresh();return draw(items,slot,true);},
   select(items,slot,phrase){refresh();const match=items.find(p=>p.id===phrase.id);if(!match)throw Error('Frase non presente nella raccolta.');return remember(match,slot,true,'selected');},
   stats(items){const keys=new Set(pool(items).map(p=>key(p.text)));return{seen:state.seen.filter(k=>keys.has(k)).length,total:keys.size,cycle:state.cycle,saved:!unsaved};},
   history(){return state.log.map(e=>({...e}));}
  };
 }
 return{create,key,secureIndex};
});
