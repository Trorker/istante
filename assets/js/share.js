/* Web Share is used only from a user gesture, with the PNG prepared beforehand. */
(function(){'use strict';
 const OPTION_KEYS=['clock','qr','date','sky','weather','goal','radio'];

 function create({getSnapshot,open,notify}){
  const $=id=>document.getElementById(id),card=window.IstanteShareCard;
  let format='square',snapshot=null,file=null,previewURL='',generation=0,busy=false;

  const status=text=>{$('share-status').textContent=text;};
  const optionNode=key=>$('share-'+key);
  const optionValues=()=>{
   const available={clock:!!snapshot?.time,qr:true,date:!!snapshot?.date,sky:!!snapshot?.sky?.celestialEnabled,weather:!!snapshot?.weather?.available,goal:!!snapshot?.goal,radio:!!snapshot?.station};
   return Object.fromEntries(OPTION_KEYS.map(key=>{const input=optionNode(key);return[key,!!(available[key]&&input?.checked&&!input.disabled)];}));
  };

  function setAvailability(key,{available,checked}){
   const input=optionNode(key);if(!input)return;
   const row=input.closest('label');
   input.disabled=!available;
   if(typeof checked==='boolean')input.checked=checked;
   if(row){row.hidden=!available;row.classList.toggle('is-unavailable',!available);}
  }

  function download(){
   if(!file)return;
   const a=document.createElement('a'),url=URL.createObjectURL(file);
   a.href=url;a.download=file.name;document.body.append(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),60000);
   status('Immagine pronta. Aggiungi il link quando la pubblichi.');
  }

  function canShareFile(){
   try{return !!file&&typeof navigator.share==='function'&&!!navigator.canShare?.({files:[file]});}
   catch(_){return false;}
  }

  function render(){
   const ticket=++generation,started=performance.now(),preview=$('share-preview'),wrap=preview.parentElement,pre=$('share-preloader');
   file=null;
   $('share-send').disabled=true;
   $('share-download').disabled=true;
   wrap.setAttribute('aria-busy','true');
   wrap.classList.add('is-generating');
   if(pre)pre.hidden=false;
   preview.hidden=true;
   status('Preparo il tuo istante...');

   try{
    const canvas=card.draw(snapshot,format,optionValues());
    canvas.toBlob(blob=>{
     if(ticket!==generation)return;
     if(!blob){
      wrap.setAttribute('aria-busy','false');wrap.classList.remove('is-generating');if(pre)pre.hidden=true;
      status('Immagine non disponibile. Puoi comunque condividere il link.');return;
     }
     file=new File([blob],'istante-'+format+'.png',{type:'image/png'});
     const old=previewURL;previewURL=URL.createObjectURL(blob);preview.src=previewURL;if(old)URL.revokeObjectURL(old);
     const finish=()=>{
      if(ticket!==generation)return;
      wrap.setAttribute('aria-busy','false');wrap.classList.remove('is-generating');if(pre)pre.hidden=true;
      preview.hidden=false;$('share-send').disabled=false;$('share-download').disabled=false;
      status(canShareFile()?'La tua cartolina, pronta da condividere.':'Questo browser non condivide immagini direttamente: puoi salvarla e inviarla dalla tua app.');
     };
     setTimeout(finish,Math.max(0,260-(performance.now()-started)));
    },'image/png');
   }catch(_){
    wrap.setAttribute('aria-busy','false');wrap.classList.remove('is-generating');if(pre)pre.hidden=true;
    status('Immagine non disponibile in questo browser. Il link resta condivisibile.');
   }
  }

  async function copy(){
   const url=snapshot?.shareURL||card.URL;
   try{
    if(!navigator.clipboard)throw Error('clipboard');
    await navigator.clipboard.writeText(url);notify('Link del pensiero copiato.');
   }catch(_){
    const area=document.createElement('textarea');area.value=url;area.style.cssText='position:fixed;opacity:0;left:0;top:0';
    document.body.append(area);area.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}area.remove();
    notify(ok?'Link del pensiero copiato.':'Link: '+url);
   }
  }

  function shareLink(){
   if(typeof navigator.share!=='function'){void copy();return;}
   navigator.share({title:'Istante - Un momento, per te.',text:'Una dashboard per prenderti un momento: frasi, musica e piccoli obiettivi.',url:snapshot?.shareURL||card.URL})
    .catch(error=>{if(error.name!=='AbortError')status('Condivisione non disponibile. Usa Copia link.');});
  }

  $('share-open').addEventListener('click',open);
  OPTION_KEYS.forEach(key=>optionNode(key)?.addEventListener('change',render));
  document.querySelectorAll('[data-share-format]').forEach(button=>button.addEventListener('click',()=>{
   format=button.dataset.shareFormat;
   document.querySelectorAll('[data-share-format]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
   render();
  }));
  $('share-download').addEventListener('click',download);
  $('share-copy').addEventListener('click',()=>void copy());
  $('share-link').addEventListener('click',shareLink);
  $('share-send').addEventListener('click',()=>{
   if(busy||!file)return;
   if(!canShareFile()){download();return;}
   busy=true;$('share-send').disabled=true;
   // No awaited generation here: iOS needs this call inside the original tap.
   navigator.share({files:[file],title:'Il tuo istante.',text:snapshot.phrase+'\nUn momento, per te.',url:snapshot?.shareURL||card.URL})
    .then(()=>status('Il tuo istante e\u0300 passato alla condivisione.'))
    .catch(error=>{if(error.name!=='AbortError')status('Condivisione non riuscita. Puoi salvare l\u2019immagine o condividere solo il link.');})
    .finally(()=>{busy=false;$('share-send').disabled=!file;});
  });
  $('share-dialog').addEventListener('close',()=>{
   generation++;
   if(previewURL){URL.revokeObjectURL(previewURL);previewURL='';}
   file=null;
   const preview=$('share-preview');preview.hidden=true;preview.removeAttribute('src');preview.parentElement.classList.remove('is-generating');
   const pre=$('share-preloader');if(pre)pre.hidden=true;
  });

  return{
   prepare(){
    snapshot=getSnapshot();
    snapshot.shareURL=window.IstanteShareLink.make(snapshot.phrase);
    setAvailability('clock',{available:!!snapshot.time});
    setAvailability('date',{available:!!snapshot.date});
    setAvailability('sky',{available:!!snapshot.sky?.celestialEnabled});
    setAvailability('weather',{available:!!snapshot.weather?.available,checked:!!snapshot.weather?.available});
    setAvailability('goal',{available:!!snapshot.goal,checked:false});
    setAvailability('radio',{available:!!snapshot.station,checked:false});
    if(snapshot.fontStyle==='excalifont'&&document.fonts?.load){
     status('Preparo il carattere della tua cartolina...');
     document.fonts.load('24px Excalifont').catch(()=>{}).finally(render);
    }else render();
   }
  };
 }
 window.IstanteShare={create};
})();
