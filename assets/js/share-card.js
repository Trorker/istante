/* Local canvas artwork. No screenshots, external images or upload service. */
(function(){'use strict';
 const URL='https://ruslan-dzyuba.it/istante/';
 const QR=["0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000111111101001011011100011111110000", "0000100000100010111100111010000010000", "0000101110100111001001111010111010000", "0000101110101111100000110010111010000", "0000101110101101000000001010111010000", "0000100000101110000010010010000010000", "0000111111101010101010101011111110000", "0000000000001110010111000000000000000", "0000100010111111010001111111110010000", "0000111110001001011011100011111110000", "0000011101100000100010100111000010000", "0000000011010001101001110010110110000", "0000010001101100111101011100000100000", "0000101011001111100001100011111110000", "0000001000100101111101001000111010000", "0000110010000000010001101101000110000", "0000011010100100110101010001000100000", "0000111011001000111100000011110110000", "0000001100101110000100001000001010000", "0000000110010110101101100010000110000", "0000111110101111011001001111110010000", "0000000000001011000110001000100010000", "0000111111101111011111111010111010000", "0000100000100110010101011000100010000", "0000101110101010110011011111110000000", "0000101110100011011110110101000010000", "0000101110100000100111001100011110000", "0000100000100000010001111011110110000", "0000111111101001100101001000100100000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000"];
 const sizes={square:[1080,1080],story:[1080,1920],cover:[1200,630]};
 function wrap(ctx,text,width){
  const lines=[];for(const paragraph of String(text).split(/\n/)){
   let line='';for(const word of paragraph.trim().split(/\s+/).filter(Boolean)){
    const test=line?line+' '+word:word;
    if(ctx.measureText(test).width<=width){line=test;continue;}
    if(line){lines.push(line);line='';}
    // Do not split normal words. Very long imported tokens still stay in the card.
    if(ctx.measureText(word).width>width){for(const char of Array.from(word)){if(ctx.measureText(line+char).width>width){lines.push(line);line='';}line+=char;}}
    else line=word;
   }lines.push(line);
  }return lines;
 }
 function draw(snapshot,format='square',showClock=true){
  const [w,h]=sizes[format]||sizes.square,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const c=canvas.getContext('2d');if(!c)throw Error('Canvas non disponibile');
  const light=snapshot.theme==='light',cover=format==='cover',story=format==='story';
  const ink=light?'#2a302b':'#eeede6',muted=light?'#6b7464':'#a9b29f',accent=light?'#657753':'#b7c89e';
  c.fillStyle=light?'#f0ede5':'#131816';c.fillRect(0,0,w,h);
  function halo(x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,w,h);}
  halo(w*.1,h*.1,w*.85,light?'#d5ddc3b0':'#60724745');halo(w*.9,h*.84,w*.66,light?'#e2d6c399':'#b19b6b18');
  const margin=cover?66:88;c.strokeStyle=light?'#78866b35':'#b3c1a322';c.lineWidth=1;c.strokeRect(24,24,w-48,h-48);
  c.textBaseline='alphabetic';c.textAlign='left';c.fillStyle=ink;c.font=(cover?'44':'48')+'px Georgia,serif';c.fillText('istante.',margin,cover?87:126);
  c.fillStyle=muted;c.font=(cover?'14':'19')+'px Arial,sans-serif';c.textAlign='right';c.fillText('UN MOMENTO, PER TE.',w-margin,cover?82:119);
  if(cover){
   c.textAlign='left';c.fillStyle=ink;c.font='64px Georgia,serif';c.fillText('Il tuo istante.',margin,242);c.fillText('Prenditi un momento per te.',margin,321);
   c.fillStyle=muted;c.font='24px Arial,sans-serif';c.fillText('Frasi, musica e il tempo verso i tuoi piccoli obiettivi.',margin,385);
  }else{
   let top=story?480:294,bottom=h-(story?395:280);
   if(showClock){c.textAlign='center';c.fillStyle=muted;c.font=(story?'100':'62')+'px Arial,sans-serif';c.fillText(snapshot.time||'',w/2,story?350:238);}
   else top-=story?140:52;
   c.textAlign='center';c.fillStyle=accent;c.font='50px Georgia,serif';c.fillText('\u201c',w/2,top-16);
   let font=story?78:60,lines;const width=w-margin*2;
   do{c.font=font+'px Georgia,serif';lines=wrap(c,snapshot.phrase,width);if(lines.length*font*1.32<=bottom-top)break;font-=1;}while(font>14);
   const lineHeight=font*1.32,start=top+(bottom-top-lines.length*lineHeight)/2+font;
   c.fillStyle=ink;for(const [i,line] of lines.entries())c.fillText(line,w/2,start+i*lineHeight);
  }
  const rule=h-(cover?156:222);c.strokeStyle=light?'#7b876145':'#b3c1a330';c.beginPath();c.moveTo(margin,rule);c.lineTo(w-margin,rule);c.stroke();
  c.textAlign='left';c.fillStyle=muted;c.font=(cover?'19':'23')+'px Georgia,serif';c.fillText('Un piccolo spazio, soltanto tuo.',margin,rule+(cover?45:65));
  c.fillStyle=ink;c.font=(cover?'18':'21')+'px Arial,sans-serif';c.fillText('ruslan-dzyuba.it/istante/',margin,rule+(cover?82:110));
  const cell=cover?3:4,side=QR.length*cell,x=w-margin-side,y=rule+(cover?12:32);c.fillStyle='#fff';c.fillRect(x,y,side,side);c.fillStyle='#162019';
  QR.forEach((row,i)=>Array.from(row).forEach((bit,j)=>{if(bit==='1')c.fillRect(x+j*cell,y+i*cell,cell,cell);}));
  return canvas;
 }
 window.IstanteShareCard={draw,wrap,URL};
})();
