/* Web Share is used only from a user gesture, with the PNG prepared beforehand. */
(function(){'use strict';
 function create({getSnapshot,open,notify}){
  const $=id=>document.getElementById(id),card=window.IstanteShareCard;
  let format='square',snapshot=null,file=null,previewURL='',generation=0,busy=false;
  const status=text=>$('share-status').textContent=text;
  function download(){if(!file)return;const a=document.createElement('a'),url=URL.createObjectURL(file);a.href=url;a.download=file.name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);status('Immagine pronta. Aggiungi il link quando la pubblichi.');}
  function canShareFile(){try{return !!file&&typeof navigator.share==='function'&&!!navigator.canShare?.({files:[file]});}catch(_){return false;}}
  function render(){
   const ticket=++generation;file=null;$('share-send').disabled=true;$('share-download').disabled=true;$('share-preview').parentElement.setAttribute('aria-busy','true');status('Preparo il tuo istante...');
   try{
    const options=Object.fromEntries(['clock','qr','date','sky','goal','radio'].map(k=>[k,$('share-'+k).checked&&!$('share-'+k).disabled]));const canvas=card.draw(snapshot,format,options);
    canvas.toBlob(blob=>{
     if(ticket!==generation)return;if(!blob){$('share-preview').parentElement.setAttribute('aria-busy','false');status('Immagine non disponibile. Puoi comunque condividere il link.');return;}
     file=new File([blob],'istante-'+format+'.png',{type:'image/png'});
     const old=previewURL;previewURL=URL.createObjectURL(blob);$('share-preview').src=previewURL;$('share-preview').hidden=false;if(old)URL.revokeObjectURL(old);
     $('share-preview').parentElement.setAttribute('aria-busy','false');$('share-send').disabled=false;$('share-download').disabled=false;
     status(canShareFile()?'La tua cartolina, pronta da condividere.':'Questo browser non condivide immagini direttamente: puoi salvarla e inviarla dalla tua app.');
    },'image/png');
   }catch(_){$('share-preview').parentElement.setAttribute('aria-busy','false');status('Immagine non disponibile in questo browser. Il link resta condivisibile.');}
  }
  async function copy(){
   try{if(!navigator.clipboard)throw Error('clipboard');await navigator.clipboard.writeText((snapshot?.shareURL||card.URL));notify('Link del pensiero copiato.');}
   catch(_){const area=document.createElement('textarea');area.value=(snapshot?.shareURL||card.URL);area.style.cssText='position:fixed;opacity:0;left:0;top:0';document.body.append(area);area.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}area.remove();notify(ok?'Link del pensiero copiato.':'Link: '+(snapshot?.shareURL||card.URL));}
  }
  function link(){
   if(typeof navigator.share!=='function'){void copy();return;}
   navigator.share({title:'Istante - Un momento, per te.',text:'Una dashboard per prenderti un momento: frasi, musica e piccoli obiettivi.',url:(snapshot?.shareURL||card.URL)}).catch(e=>{if(e.name!=='AbortError'){status('Condivisione non disponibile. Usa Copia link.');}});
  }
  $('share-open').addEventListener('click',open);['clock','qr','date','sky','goal','radio'].forEach(k=>$('share-'+k).addEventListener('change',render));
  document.querySelectorAll('[data-share-format]').forEach(b=>b.addEventListener('click',()=>{format=b.dataset.shareFormat;document.querySelectorAll('[data-share-format]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  $('share-download').addEventListener('click',download);$('share-copy').addEventListener('click',()=>void copy());$('share-link').addEventListener('click',link);
  $('share-send').addEventListener('click',()=>{
   if(busy||!file)return;if(!canShareFile()){download();return;}
   busy=true;$('share-send').disabled=true;
   // No awaited generation here: iOS needs this call inside the original tap.
   navigator.share({files:[file],title:'Il tuo istante.',text:snapshot.phrase+'\nUn momento, per te.',url:(snapshot?.shareURL||card.URL)}).then(()=>status('Il tuo istante e\u0300 passato alla condivisione.')).catch(e=>{if(e.name!=='AbortError')status('Condivisione non riuscita. Puoi salvare l\u2019immagine o condividere solo il link.');}).finally(()=>{busy=false;$('share-send').disabled=!file;});
  });
  $('share-dialog').addEventListener('close',()=>{generation++;if(previewURL){URL.revokeObjectURL(previewURL);previewURL='';}file=null;$('share-preview').hidden=true;$('share-preview').removeAttribute('src');});
  return{prepare(){snapshot=getSnapshot();snapshot.shareURL=window.IstanteShareLink.make(snapshot.phrase);for(const key of ['goal','radio']){$('share-'+key).checked=false;const available=key==='goal'?!!snapshot.goal:!!snapshot.station;$('share-'+key).disabled=!available;$('share-'+key).closest('label').classList.toggle('is-unavailable',!available);}render();}};
 }
 window.IstanteShare={create};
})();
