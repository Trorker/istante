/* Local, resolution-independent share artwork. No fonts, images or uploads from third parties. */
(function(){'use strict';
 const URL='https://istante.ruslan-dzyuba.it/';
 // QR has a four-module quiet zone on each side. Keep the matrix unmodified.
 const QR=["0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000111111100001011100101011111110000", "0000100000101000000100000010000010000", "0000101110101101101010011010111010000", "0000101110101001101101011010111010000", "0000101110100111111100111010111010000", "0000100000100111111010001010000010000", "0000111111101010101010101011111110000", "0000000000001111110000100000000000000", "0000100000101111101101000110011100000", "0000011010011001001001010001101100000", "0000001000100110100001100011100000000", "0000010100000100101110101010110000000", "0000111101110100111010001011000010000", "0000010010001000111001011111100110000", "0000111001101101111110101000111000000", "0000010101011001011100011011101010000", "0000000110110000101001001001011000000", "0000110100000000100100011011101110000", "0000110100110111111111010010010010000", "0000100110001000001010001100100000000", "0000101101111100000111001111101110000", "0000000000001110010100111000110000000", "0000111111100111111111111010111000000", "0000100000100111110000111000100100000", "0000101110100111010010011111110110000", "0000101110100100000110101001011010000", "0000101110100100011100100111111100000", "0000100000100011000100010101111010000", "0000111111101010000001110110001000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000"];
 const sizes={square:[1080,1080],story:[1080,1920],landscape:[1920,1080],cover:[1200,630]};
 const TAU=Math.PI*2;
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
  if(light)return {background:'#f1eee5',ink:'#303b33',muted:'#687461',accent:'#697f55',line:'#75836636',halo:isDay?'#cfb56a35':'#9cb8b543',glow:isDay?'#ead1984d':'#b8cabc40',sun:'#c5a765',moon:'#6c7f73',qrBg:isDay?'#e9e3d4':'#e4e8e1',qrInk:isDay?'#3d4931':'#304840'};
  return {background:'#141c19',ink:'#efece2',muted:'#a2b29f',accent:'#beccaa',line:'#bacbab30',halo:isDay?'#b6995338':'#5b898144',glow:isDay?'#d0b06d31':'#739ba634',sun:'#eed6a3',moon:'#cddbd5',qrBg:isDay?'#e2dac5':'#d8e0d9',qrInk:isDay?'#35422e':'#243d34'};
 }
 function disk(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);}
 function haze(c,x,y,r,color,W,H){
  const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,color.slice(0,7)+'00');c.fillStyle=g;c.fillRect(0,0,W,H);
 }
 function mark(c,x,y,size,color){
  c.save();c.translate(x,y);c.strokeStyle=color;c.lineWidth=size*3.5/192;c.lineCap='round';
  disk(c,size/2,size/2,size*52/192);c.stroke();c.beginPath();c.moveTo(size*111/192,size*72/192);c.lineTo(size*81/192,size*120/192);c.stroke();c.restore();
 }
 function spaced(c,text,x,y,spacing){
  const letters=Array.from(text),width=letters.reduce((n,ch)=>n+c.measureText(ch).width,0)+Math.max(0,letters.length-1)*spacing;
  c.textAlign='left';let left=x-width/2;for(const ch of letters){c.fillText(ch,left,y);left+=c.measureText(ch).width+spacing;}
 }
 function moon(c,x,y,r,phase,P){
  // Orthographic disk: the visible terminator follows the illumination angle.
  // The illuminated hemisphere changes side between waxing and waning.
  const p=Number.isFinite(phase)?((phase%1)+1)%1:.5;
  const illumination=-Math.cos(TAU*p),side=p<=.5?1:-1;
  c.save();disk(c,x,y,r);c.clip();
  c.fillStyle=P.background;c.fillRect(x-r,y-r,r*2,r*2);
  const earth=c.createRadialGradient(x-r*.22,y-r*.28,0,x,y,r*1.3);
  earth.addColorStop(0,P.moon+'28');earth.addColorStop(1,P.moon+'0c');c.fillStyle=earth;c.fillRect(x-r,y-r,r*2,r*2);
  c.beginPath();
  const steps=128;
  for(let i=0;i<=steps;i++){
   const yy=-r+i*2*r/steps,xx=side*Math.sqrt(Math.max(0,r*r-yy*yy));
   if(i===0)c.moveTo(x+xx,y+yy);else c.lineTo(x+xx,y+yy);
  }
  for(let i=steps;i>=0;i--){const yy=-r+i*2*r/steps,xx=-side*illumination*Math.sqrt(Math.max(0,r*r-yy*yy));c.lineTo(x+xx,y+yy);}
  c.closePath();const fill=c.createRadialGradient(x+side*r*.3,y-r*.3,0,x,y,r*1.5);
  fill.addColorStop(0,P.moon);fill.addColorStop(1,P.moon+'b3');c.fillStyle=fill;c.fill();c.restore();
  c.save();c.globalAlpha=.18;c.strokeStyle=P.moon;c.lineWidth=.8;disk(c,x,y,r);c.stroke();c.restore();
 }
 function sky(c,info,P,W,H,land,story){
  const x=W*.815,y=land?145:story?246:206,r=land?22:35;
  const A=info.atmosphere||{kind:'neutral',orb:1,stars:1,clouds:0},kind=A.kind;
  c.save();c.globalAlpha=A.orb;
  haze(c,x,y,land?180:285,P.halo,W,H);haze(c,x-r,y-r,r*3,P.glow,W,H);
  if(info.isDay){
   for(const [radius,alpha]of [[r*1.43,.20],[r*2.10,.08]]){c.globalAlpha=alpha*A.orb;c.strokeStyle=P.sun;c.lineWidth=1;disk(c,x,y,radius);c.stroke();}
   c.globalAlpha=.85*A.orb;const g=c.createRadialGradient(x-r*.3,y-r*.35,0,x,y,r*1.4);
   g.addColorStop(0,P.sun);g.addColorStop(1,P.sun+'b3');c.fillStyle=g;disk(c,x,y,r);c.fill();
  }else{
   c.globalAlpha=A.orb;moon(c,x,y,r,info.phase,P);
   const rand=seeded(417);
   for(let i=0;i<70;i++){
    const xx=50+rand()*(W-100),yy=110+rand()*Math.min(H*.75,1100);
    if((xx>200&&xx<W-180&&yy>175)||Math.hypot(xx-x,yy-y)<r*1.6)continue;
    c.globalAlpha=(.14+rand()*.30)*A.stars;c.fillStyle=P.moon;disk(c,xx,yy,.6+rand()*.9);c.fill();
   }
  }
  c.globalAlpha=.25;c.strokeStyle=P.line;c.lineWidth=1;
  c.beginPath();c.ellipse(W*.82,y+10,W*.48,H*.32,-.3,.05,Math.PI*.80);c.stroke();c.restore();
  ambient(c,info,P,W,H);
  weather(c,A,P,W,H,land,story);
 }
 function seeded(seed){return()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};}
 function ambient(c,info,P,W,H){
  const effect=info.effect||'none',strength=Number.isFinite(info.intensity)?info.intensity:.35;
  c.save();c.globalAlpha=Math.min(.85,.3+strength);
  if(effect==='halos'||effect==='aurora'){
   haze(c,W*.08,H*.30,W*.5,P.halo,W,H);haze(c,W*.91,H*.68,W*.47,P.glow,W,H);
   if(effect==='aurora'){
    c.save();c.translate(W*.10,H*.32);c.rotate(-.35);c.scale(1,.24);
    haze(c,W*.3,0,W*.85,P.halo,W*1.5,H*5);c.restore();
   }
  }else if(effect==='particles'){
   const rand=seeded(957);c.fillStyle=P.accent;
   for(let i=0;i<54;i++){const x=rand()*W,y=100+rand()*(H-170),edge=x<W*.18||x>W*.82;c.globalAlpha=(edge?.25:.055)*(.6+strength);disk(c,x,y,.6+rand()*2);c.fill();}
  }
  c.restore();
 }
 function weather(c,A,P,W,H,land,story){
  const k=A.kind,rand=seeded(29371),top=100,bottom=H-190;
  c.save();
  // A real canvas layer: clouds and precipitation are encoded in the exported PNG.
  // Keep the center quieter; footer / QR are rendered afterwards on top.
  if(A.clouds>0){
   const colour=P.background==='#141c19'?'#829d9e':'#73878c';
   for(let i=0;i<9;i++){
    const x=(i%2?W*.78:W*.09)+(rand()-.5)*W*.35,y=120+rand()*(H*.6),r=140+rand()*210;
    c.save();c.translate(x,y);c.scale(1,.30+rand()*.24);c.globalAlpha=A.clouds*(k==='fog'?.19:.32);
    const g=c.createRadialGradient(0,0,2,0,0,r);g.addColorStop(0,colour+'cc');g.addColorStop(.55,colour+'50');g.addColorStop(1,colour+'00');c.fillStyle=g;c.fillRect(-r,-r,2*r,2*r);c.restore();
   }
  }
  const isRain=k==='rain'||k==='storm';
  if(isRain||k==='snow'){
   c.strokeStyle=P.muted;c.fillStyle=P.ink;c.lineCap='round';
   const count=isRain?(story?210:145):(story?140:90);
   for(let i=0;i<count;i++){
    const x=30+rand()*(W-60),y=top+rand()*Math.max(70,bottom-top),edge=x<W*.19||x>W*.81;
    c.globalAlpha=(edge?.45:.085)*( .55+rand()*.45 );
    if(isRain){const len=(land?12:22)+rand()*25;c.lineWidth=.65+rand()*.65;c.beginPath();c.moveTo(x,y);c.lineTo(x-len*.23,y+len);c.stroke();}
    else{const r=1.1+rand()*2.2;disk(c,x,y,r);c.fill();if(edge&&r>2.7){c.lineWidth=.7;c.beginPath();c.moveTo(x-r*2,y);c.lineTo(x+r*2,y);c.moveTo(x,y-r*2);c.lineTo(x,y+r*2);c.stroke();}}
   }
  }
  if(k==='storm'){
   c.globalAlpha=.35;haze(c,W*.91,H*.27,W*.21,P.glow,W,H);
   c.strokeStyle=P.muted;c.lineWidth=1.3;c.globalAlpha=.20;
   c.beginPath();c.moveTo(W*.92,top+8);c.lineTo(W*.89,top+57);c.lineTo(W*.92,top+54);c.lineTo(W*.88,top+115);c.stroke();
  }
  if(k==='sun'&&A.orb>0){c.globalAlpha=.45;haze(c,W*.9,H*.23,W*.42,P.glow,W,H);}
  c.restore();
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
 function draw(snapshot,format='square',options=true){
  snapshot=snapshot||{};
  const opt=typeof options==='boolean'?{clock:options,qr:true,date:true,sky:true}:options||{};
  const [w,h]=sizes[format]||sizes.square,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const c=canvas.getContext('2d');if(!c)throw Error('Canvas non disponibile');
  const scale=w/1080,W=1080,H=h/scale,land=w>h,story=h>w*1.5,pad=72,light=snapshot.theme==='light';
  const P=palette(light,opt.sky&&snapshot.sky?!!snapshot.sky.isDay:true);
  c.scale(scale,scale);c.fillStyle=P.background;c.fillRect(0,0,W,H);
  haze(c,W*.04,H*.05,650,light?'#b5c8a137':'#6d91552c',W,H);
  haze(c,W*.88,H*.92,540,light?'#d7c39732':'#9d845221',W,H);
  if(opt.sky&&snapshot.sky)sky(c,snapshot.sky,P,W,H,land,story);
  c.strokeStyle=P.line;c.lineWidth=1;c.strokeRect(24,24,W-48,H-48);
  // Header: the same Istante mark, no repeated author credit.
  mark(c,pad-16,28,75,P.accent);c.textAlign='left';c.fillStyle=P.ink;c.font='42px Georgia,serif';c.fillText('istante.',pad+59,80);
  c.font='11px Arial,sans-serif';c.fillStyle=P.muted;c.textAlign='right';c.fillText('UN MOMENTO, PER TE.',W-pad,66);
  // One vertical signature only, outside the text column and the QR quiet zone.
  c.save();c.translate(W-40,H*.50);c.rotate(-Math.PI/2);
  const credit='by  \u2661  Ruslan Dzyuba \u00b7 istante.ruslan-dzyuba.it';
  let creditSize=land?10:12;c.font=creditSize+'px Arial,sans-serif';
  while(c.measureText(credit).width>H-105&&creditSize>7){creditSize-=.25;c.font=creditSize+'px Arial,sans-serif';}
  c.fillStyle=P.muted;c.textAlign='center';c.fillText(credit,0,0);c.restore();
  if(opt.date&&snapshot.date){c.textAlign='center';c.fillStyle=P.muted;c.font=(land?13:16)+'px Arial,sans-serif';c.fillText(fitLine(c,snapshot.date,630),W/2,land?130:153);}
  let top=land?165:story?325:205;
  if(opt.clock){
   if(snapshot.clockStyle==='analog'){
    const r=land?35:story?82:54,y=land?186:story?290:248;
    analog(c,W/2,y,r,snapshot,P);top=y+r+(land?24:55);
   }else{
    c.textAlign='center';c.fillStyle=P.ink;c.font=(land?48:story?102:78)+'px Arial,sans-serif';
    const y=land?193:story?304:259;c.fillText(snapshot.time||'',W/2,y);top=y+(land?25:56);
   }
  }
  const footer=H-(land?182:207),metadata=[];
  if(opt.sky&&snapshot.sky){const k=snapshot.sky;const a=k.atmosphere;metadata.push(a?.label?(a.source==='manual'?'Atmosfera: ':'')+a.label+(k.isDay?'':' \u00b7 '+(k.name||'Notte')):k.isDay?'Sotto la stessa luce.':k.name||'Un momento, sotto le stelle.');}
  if(opt.goal&&snapshot.goal){const g=snapshot.goal;metadata.push((g.title||'Il mio obiettivo')+' \u00b7 '+(g.done?'Traguardo raggiunto':g.days+' giorni, '+g.hours+' ore'));}
  if(opt.radio&&snapshot.station)metadata.push('In ascolto \u00b7 '+snapshot.station);
  const rowH=land?22:30,metaSpace=metadata.length?metadata.length*rowH+22:0,bottom=footer-35-metaSpace;
  let font=land?44:story?78:61,lines;
  do{c.font=font+'px Georgia,serif';lines=wrap(c,snapshot.phrase||'Prenditi un momento per te.',W-pad*2-60);if(lines.length*font*1.32<=bottom-top)break;font--;}while(font>8);
  const lineH=font*1.32,start=top+(bottom-top-lines.length*lineH)/2+font;
  c.textAlign='center';c.fillStyle=P.ink;lines.forEach((text,i)=>c.fillText(text,W/2,start+i*lineH));
  c.fillStyle=P.muted;c.font=(land?12:15)+'px Arial,sans-serif';
  metadata.forEach((text,i)=>c.fillText(fitLine(c,text,W-pad*2-60),W/2,footer-24-(metadata.length-1-i)*rowH));
  // Footer is balanced independently of whether the QR is included.
  c.strokeStyle=P.line;c.beginPath();c.moveTo(pad,footer);c.lineTo(W-pad,footer);c.stroke();
  c.textAlign=opt.qr?'left':'center';const footX=opt.qr?pad:W/2;
  c.fillStyle=P.ink;c.font=(land?18:26)+'px Georgia,serif';c.fillText('Prenditi il tuo tempo.',footX,footer+(land?43:64));
  c.fillStyle=P.muted;c.font=(land?12:16)+'px Arial,sans-serif';c.fillText('Un piccolo spazio, tutto tuo.',footX,footer+(land?72:104));
  if(opt.qr){
   // Same hue family as the artwork, dark modules on a uniformly light field.
   // Integer device pixels and an intact quiet zone keep the code sharp.
   c.save();c.setTransform(1,0,0,1,0,0);
   const cell=land?Math.max(3,Math.floor(3.4*scale)):4,side=QR.length*cell;
   const x=Math.round(w-pad*scale-side),y=Math.round((footer+(land?18:25))*scale);
   c.fillStyle=P.qrBg;c.fillRect(x,y,side,side);c.fillStyle=P.qrInk;
   QR.forEach((row,i)=>Array.from(row).forEach((bit,j)=>{if(bit==='1')c.fillRect(x+j*cell,y+i*cell,cell,cell);}));
   c.restore();
  }
  return canvas;
 }
 window.IstanteShareCard={draw,wrap,URL};
})();
