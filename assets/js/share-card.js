/* Local, resolution-independent share artwork. It freezes the visible dashboard scene, including the active wallpaper when available, and reuses the app typography. */
(function(){'use strict';
 const URL='https://istante.ruslan-dzyuba.it/';
 // QR has a four-module quiet zone on each side. Keep the matrix unmodified.

 const sizes={square:[1080,1080],story:[1080,1920],landscape:[1920,1080],cover:[1200,630]};
 const TAU=Math.PI*2;
 function fontSet(snapshot){
  const editorial=snapshot?.fontStyle==='excalifont';
  return{
   display:editorial?"'Excalifont','Segoe Print','Bradley Hand',cursive":"'Istante Classic','Iowan Old Style','Palatino Linotype','Book Antiqua',Palatino,Georgia,serif",
   ui:"-apple-system,BlinkMacSystemFont,'Helvetica Neue','Segoe UI',Arial,sans-serif"
  };
 }
 function wrap(ctx,text,width){
  const lines=[];
  for(const paragraph of String(text).split(/\n/)){
   let line='';
   for(const word of paragraph.trim().split(/\s+/).filter(Boolean)){
    const candidate=line?line+' '+word:word;
    if(ctx.measureText(candidate).width<=width){line=candidate;continue;}
    if(line){lines.push(line);line='';}
    if(ctx.measureText(word).width>width){
     for(const ch of Array.from(word)){
      if(line&&ctx.measureText(line+ch).width>width){lines.push(line);line='';}
      line+=ch;
     }
    }else line=word;
   }
   lines.push(line);
  }
  return lines;
 }
 function palette(light,isDay){
  if(light)return {background:'#f1eee5',ink:'#303b33',muted:'#687461',accent:'#697f55',line:'#75836636'};
  return {background:'#141c19',ink:'#efece2',muted:'#a2b29f',accent:'#beccaa',line:'#bacbab30'};
 }
 function disk(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);}
 function haze(c,x,y,r,color,W,H){
  const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,color.slice(0,7)+'00');c.fillStyle=g;c.fillRect(0,0,W,H);
 }
 function mark(c,x,y,size,color){
  c.save();c.translate(x,y);c.strokeStyle=color;c.lineWidth=size*3.5/192;c.lineCap='round';
  disk(c,size/2,size/2,size*52/192);c.stroke();c.beginPath();c.moveTo(size*111/192,size*72/192);c.lineTo(size*81/192,size*120/192);c.stroke();c.restore();
 }
 function sky(c,info,W,H,showSky=true){
  if(!info?.capture)return null;
  /* The export reuses the captured Dashboard scene verbatim. In particular the
     celestial body is the same rendered Sun/Moon, at the same orbit position,
     transformed only by the card's cover crop. */
  return window.IstanteSceneSnapshot.draw(c,info,W,H,{includeSky:showSky,fit:'cover'});
 }
 function analog(c,x,y,r,snapshot,P){
  c.save();c.translate(x,y);c.strokeStyle=P.line;c.lineWidth=1.4;disk(c,0,0,r);c.stroke();
  for(let i=0;i<12;i++){c.save();c.rotate(i*Math.PI/6);c.strokeStyle=i%3===0?P.muted:P.line;c.beginPath();c.moveTo(0,-r+5);c.lineTo(0,-r+(i%3===0?13:9));c.stroke();c.restore();}
  const h=Number(snapshot.hours)||0,m=Number(snapshot.minutes)||0;
  for(const [angle,length,width]of [[h%12*30+m*.5,.51,3], [m*6,.75,2]]){
   c.save();c.rotate(angle*Math.PI/180);c.strokeStyle=P.ink;c.lineCap='round';c.lineWidth=width;c.beginPath();c.moveTo(0,5);c.lineTo(0,-r*length);c.stroke();c.restore();
  }
  c.fillStyle=P.accent;disk(c,0,0,2.5);c.fill();c.restore();
 }
 function fitLine(c,text,width){
  if(c.measureText(text).width<=width)return text;
  const chars=Array.from(text);while(chars.length&&c.measureText(chars.join('')+'\u2026').width>width)chars.pop();return chars.join('')+'\u2026';
 }

 function cardMetadata(snapshot,opt){
  const rows=[];
  if(opt.sky&&snapshot.sky){
   const skyInfo=snapshot.sky,atmosphere=skyInfo.atmosphere;
   if(opt.weather){
    rows.push(skyInfo.isDay?'Luce del giorno.':skyInfo.name||'Un momento, sotto le stelle.');
   }else{
    rows.push(atmosphere?.label?(atmosphere.source==='manual'?'Atmosfera: ':'')+atmosphere.label+(skyInfo.isDay?'':' · '+(skyInfo.name||'Notte')):skyInfo.isDay?'Sotto la stessa luce.':skyInfo.name||'Un momento, sotto le stelle.');
   }
  }
  if(opt.weather&&snapshot.weather?.available){
   const weather=snapshot.weather;
   const row=['Meteo',weather.temperature,weather.condition,weather.place].filter(Boolean).join(' · ');
   if(row)rows.push(row);
  }
  if(opt.goal&&snapshot.goal){
   const goal=snapshot.goal;
   rows.push((goal.title||'Il mio obiettivo')+' · '+(goal.done?'Traguardo raggiunto':goal.days+' giorni, '+goal.hours+' ore'));
  }
  if(opt.radio&&snapshot.station)rows.push('In ascolto · '+snapshot.station);
  return rows;
 }
 function draw(snapshot,format='square',options=true){
  snapshot=snapshot||{};
  const opt=typeof options==='boolean'?{clock:options,qr:true,date:true,sky:true}:options||{};
  const [w,h]=sizes[format]||sizes.square,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const c=canvas.getContext('2d');if(!c)throw Error('Canvas non disponibile');
  const scale=w/1080,W=1080,H=h/scale,land=w>h,story=h>w*1.5,pad=72,light=snapshot.theme==='light';
  const P=palette(light,snapshot.sky?!!snapshot.sky.isDay:true),F=fontSet(snapshot);
  if(snapshot.sky?.capture)P.background=snapshot.sky.capture.background;
  const qrMatrix=opt.qr?window.IstanteQR.matrix(snapshot.shareURL||URL):null,qrTotal=qrMatrix?qrMatrix.length+8:0;
  const qrTarget=(format==='landscape'?96:format==='square'?112:148)*scale;
  const qrCell=qrMatrix?Math.max(2,Math.floor(qrTarget/qrTotal)):0,qrSide=qrTotal*qrCell;
  c.scale(scale,scale);c.fillStyle=P.background;c.fillRect(0,0,W,H);
  if(!snapshot.sky?.capture){haze(c,W*.04,H*.05,650,light?'#b5c8a137':'#6d91552c',W,H);haze(c,W*.88,H*.92,540,light?'#d7c39732':'#9d845221',W,H);}
  if(snapshot.sky)sky(c,snapshot.sky,W,H,!!opt.sky);
  c.strokeStyle=P.line;c.lineWidth=1;c.strokeRect(24,24,W-48,H-48);
  // Header: the same Istante mark, no repeated author credit.
  mark(c,pad-16,28,75,P.accent);c.textAlign='left';c.fillStyle=P.ink;c.font='42px '+F.display;c.fillText('istante.',pad+59,80);
  c.font='11px '+F.ui;c.fillStyle=P.muted;c.textAlign='right';c.fillText('UN MOMENTO, PER TE.',W-pad,66);
  // One vertical signature only, outside the text column and the QR quiet zone.
  c.save();c.translate(W-40,H*.50);c.rotate(-Math.PI/2);
  const credit='by  \u2661  Ruslan Dzyuba \u00b7 istante.ruslan-dzyuba.it';
  let creditSize=land?10:12;c.font=creditSize+'px '+F.ui;
  while(c.measureText(credit).width>H-105&&creditSize>7){creditSize-=.25;c.font=creditSize+'px '+F.ui;}
  c.fillStyle=P.muted;c.textAlign='center';c.fillText(credit,0,0);c.restore();
  if(opt.date&&snapshot.date){c.textAlign='center';c.fillStyle=P.muted;c.font=(land?13:16)+'px '+F.ui;c.fillText(fitLine(c,snapshot.date,630),W/2,land?130:153);}
  let top=land?165:story?325:205;
  if(opt.clock){
   if(snapshot.clockStyle==='analog'){
    const r=land?35:story?82:54,y=land?186:story?290:248;
    analog(c,W/2,y,r,snapshot,P);top=y+r+(land?24:55);
   }else{
    c.textAlign='center';c.fillStyle=P.ink;c.font=(land?48:story?102:78)+'px '+F.display;
    const y=land?193:story?304:259;c.fillText(snapshot.time||'',W/2,y);top=y+(land?25:56);
   }
  }
  const footer=H-Math.max(land?182:207,qrSide/scale+45),metadata=cardMetadata(snapshot,opt);
  const rowH=land?22:30,metaSpace=metadata.length?metadata.length*rowH+22:0,bottom=footer-35-metaSpace;
  let font=land?44:story?78:61,lines;
  do{c.font=font+'px '+F.display;lines=wrap(c,snapshot.phrase||'Prenditi un momento per te.',W-pad*2-60);if(lines.length*font*1.32<=bottom-top)break;font--;}while(font>8);
  const lineH=font*1.32,start=top+(bottom-top-lines.length*lineH)/2+font;
  c.textAlign='center';c.fillStyle=P.ink;lines.forEach((text,i)=>c.fillText(text,W/2,start+i*lineH));
  c.fillStyle=P.muted;c.font=(land?12:15)+'px '+F.ui;
  metadata.forEach((text,i)=>c.fillText(fitLine(c,text,W-pad*2-60),W/2,footer-24-(metadata.length-1-i)*rowH));
  // Footer is balanced independently of whether the QR is included.
  c.strokeStyle=P.line;c.beginPath();c.moveTo(pad,footer);c.lineTo(W-pad,footer);c.stroke();
  c.textAlign=opt.qr?'left':'center';const footX=opt.qr?pad:W/2;
  c.fillStyle=P.ink;c.font=(land?18:26)+'px '+F.display;c.fillText('Prenditi il tuo tempo.',footX,footer+(land?43:64));
  c.fillStyle=P.muted;c.font=(land?12:16)+'px '+F.ui;c.fillText('Un piccolo spazio, tutto tuo.',footX,footer+(land?72:104));
  if(opt.qr){
   // Same hue family as the artwork, dark modules on a uniformly light field.
   // Integer device pixels and an intact quiet zone keep the code sharp.
   c.save();c.setTransform(1,0,0,1,0,0);
   const matrix=qrMatrix,quiet=4,total=qrTotal,cell=qrCell,side=qrSide;
   const x=Math.round(w-pad*scale-side),y=Math.round((footer+(land?18:15))*scale);
   const isDay=snapshot.sky?.isDay!==false;
   // Transparent quiet zone: by day the code follows the ink colour; by night it becomes paper white.
   // A very light translucent plate keeps contrast on animated/weather backgrounds without becoming a card.
   const platePad=Math.max(3,Math.round(5*scale));c.save();c.globalAlpha=isDay?.12:.08;c.fillStyle=isDay?'#f1eee5':'#f1eee5';
   if(typeof c.roundRect==='function'){c.beginPath();c.roundRect(x-platePad,y-platePad,side+platePad*2,side+platePad*2,Math.max(5,8*scale));c.fill();}else c.fillRect(x-platePad,y-platePad,side+platePad*2,side+platePad*2);c.restore();
   c.fillStyle=isDay?P.ink:'#f1eee5';
   matrix.forEach((row,i)=>row.forEach((bit,j)=>{if(bit)c.fillRect(x+(j+quiet)*cell,y+(i+quiet)*cell,cell,cell);}));
   c.restore();
  }
  return canvas;
 }
 window.IstanteShareCard={draw,wrap,URL};
})();
