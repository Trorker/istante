/* Local canvas artwork. No screenshots, external images or upload service. */
(function(){'use strict';
 const URL='https://ruslan-dzyuba.it/istante/';
 const QR=["0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000111111101001011011100011111110000", "0000100000100010111100111010000010000", "0000101110100111001001111010111010000", "0000101110101111100000110010111010000", "0000101110101101000000001010111010000", "0000100000101110000010010010000010000", "0000111111101010101010101011111110000", "0000000000001110010111000000000000000", "0000100010111111010001111111110010000", "0000111110001001011011100011111110000", "0000011101100000100010100111000010000", "0000000011010001101001110010110110000", "0000010001101100111101011100000100000", "0000101011001111100001100011111110000", "0000001000100101111101001000111010000", "0000110010000000010001101101000110000", "0000011010100100110101010001000100000", "0000111011001000111100000011110110000", "0000001100101110000100001000001010000", "0000000110010110101101100010000110000", "0000111110101111011001001111110010000", "0000000000001011000110001000100010000", "0000111111101111011111111010111010000", "0000100000100110010101011000100010000", "0000101110101010110011011111110000000", "0000101110100011011110110101000010000", "0000101110100000100111001100011110000", "0000100000100000010001111011110110000", "0000111111101001100101001000100100000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000", "0000000000000000000000000000000000000"];
 const sizes={square:[1080,1080],story:[1080,1920],landscape:[1920,1080],cover:[1200,630]};
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
 function draw(snapshot,format='square',options=true){
  const opt=typeof options==='boolean'?{clock:options,qr:true,date:true,sky:true}:options;
  const [w,h]=sizes[format]||sizes.square,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const c=canvas.getContext('2d');if(!c)throw Error('Canvas non disponibile');
  const light=snapshot.theme==='light',land=w>h,story=h>w*1.5,scale=w/1080;
  c.scale(scale,scale);const W=w/scale,H=h/scale,pad=70;
  const ink=light?'#28322c':'#efeee7',muted=light?'#65715f':'#a7b29f',accent=light?'#586e44':'#c0cfaa';
  c.fillStyle=light?'#f2eee5':'#141b18';c.fillRect(0,0,W,H);
  function halo(x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,W,H);}
  halo(W*.08,H*.09,700,light?'#c8d6b780':'#71905540');halo(W*.98,H*.96,580,light?'#ddc5a45e':'#bb955728');
  c.strokeStyle=light?'#64765736':'#c0cfaa28';c.lineWidth=1;c.strokeRect(24,24,W-48,H-48);
  // The real Istante mark: circle + diagonal stroke, same geometry as icon.svg.
  function logo(x,y,size){c.save();c.translate(x,y);c.strokeStyle=accent;c.lineWidth=size*3.5/192;c.beginPath();c.arc(size/2,size/2,size*52/192,0,Math.PI*2);c.stroke();c.lineCap='round';c.beginPath();c.moveTo(size*111/192,size*72/192);c.lineTo(size*81/192,size*120/192);c.stroke();c.restore();}
  logo(pad-18,31,82);c.textAlign='left';c.fillStyle=ink;c.font='43px Georgia,serif';c.fillText('istante.',pad+62,87);
  c.textAlign='right';c.fillStyle=muted;c.font='12px Arial,sans-serif';c.fillText('UN MOMENTO, PER TE.',W-pad,64);c.font='11px Arial,sans-serif';c.fillText('Un progetto di Ruslan Dzyuba',W-pad,87);
  let top=land?150:story?330:222;
  if(opt.date&&snapshot.date){c.textAlign='center';c.fillStyle=muted;c.font='17px Arial,sans-serif';c.fillText(snapshot.date,W/2,land?130:157);}
  if(opt.clock){
   if(snapshot.clockStyle==='analog'){
    const radius=land?32:story?77:48,cx=W/2,cy=land?190:story?277:225;c.save();c.translate(cx,cy);c.strokeStyle=light?'#67735960':'#cad6b850';c.lineWidth=1.3;c.beginPath();c.arc(0,0,radius,0,2*Math.PI);c.stroke();
    for(let i=0;i<12;i++){c.save();c.rotate(i*Math.PI/6);c.beginPath();c.moveTo(0,-radius+6);c.lineTo(0,-radius+11);c.stroke();c.restore();}
    for(const [angle,length,width]of [[((snapshot.hours||0)%12*30+(snapshot.minutes||0)*.5),.53,3],[(snapshot.minutes||0)*6,.77,2]]){c.save();c.rotate(angle*Math.PI/180);c.strokeStyle=ink;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(0,5);c.lineTo(0,-radius*length);c.stroke();c.restore();}c.restore();top=cy+radius+49;
   }else{c.textAlign='center';c.fillStyle=ink;c.font=(land?44:story?106:70)+'px Arial,sans-serif';c.fillText(snapshot.time||'',W/2,land?188:story?300:241);top=land?224:story?380:292;}
  }
  let extra=0;const elements=[];
  if(opt.sky&&snapshot.sky){const sky=snapshot.sky;elements.push((sky.isDay?'Il sole ti accompagna':sky.name+' \u00b7 '+Math.round(sky.fraction*100)+'% illuminata'));}
  if(opt.goal&&snapshot.goal){const goal=snapshot.goal;elements.push((goal.title||'Il mio obiettivo')+' \u00b7 '+(goal.done?'Traguardo raggiunto':goal.days+' giorni, '+goal.hours+' ore'));}
  if(opt.radio&&snapshot.station)elements.push('La mia colonna sonora \u00b7 '+snapshot.station);
  extra=elements.length*29;
  const footer=H-(land?139:202),bottom=footer-extra-38;
  let font=land?42:story?74:57,lines;const width=W-pad*2;
  do{c.font=font+'px Georgia,serif';lines=wrap(c,snapshot.phrase||'Prenditi un momento per te.',width);if(lines.length*font*1.3<=bottom-top)break;font-=1;}while(font>9);
  const lh=font*1.3,start=top+(bottom-top-lines.length*lh)/2+font;c.textAlign='center';c.fillStyle=ink;
  lines.forEach((line,i)=>c.fillText(line,W/2,start+i*lh));
  c.fillStyle=muted;c.font=(land?12:16)+'px Arial,sans-serif';elements.forEach((t,i)=>{let text=t;while(c.measureText(text).width>width&&text.length>1)text=text.slice(0,-2);if(text!==t)text+='\u2026';c.fillText(text,W/2,footer-extra+i*29);});
  if(opt.sky&&snapshot.sky&&!land){
   if(snapshot.sky.isDay){c.fillStyle=light?'#c29451':'#d6bb7c';c.beginPath();c.arc(W-pad-28,top-25,12,0,Math.PI*2);c.fill();}
   else if(window.IstanteScene){const m=document.createElement('canvas');m.width=m.height=160;window.IstanteScene.paintMoon(m,snapshot.sky.phase,light);c.globalAlpha=.82;c.drawImage(m,W-pad-66,top-68,66,66);c.globalAlpha=1;}
  }
  c.strokeStyle=light?'#6c7e5540':'#c2d4a938';c.beginPath();c.moveTo(pad,footer+8);c.lineTo(W-pad,footer+8);c.stroke();
  c.textAlign='left';c.fillStyle=muted;c.font=(land?16:22)+'px Georgia,serif';c.fillText('Un piccolo spazio, soltanto tuo.',pad,footer+(land?46:62));
  c.fillStyle=ink;c.font=(land?13:18)+'px Arial,sans-serif';c.fillText('ruslan-dzyuba.it/istante/',pad,footer+(land?74:99));
  c.fillStyle=muted;c.font='11px Arial,sans-serif';c.fillText('ISTANTE / RUSLAN DZYUBA',pad,H-43);
  if(opt.qr){
   // Matrix includes its own 4-module quiet zone. Integer physical pixels keep it scannable.
   c.save();c.setTransform(1,0,0,1,0,0);const cell=land?Math.max(2,Math.floor(3*scale)):4,side=QR.length*cell,x=Math.round(w-pad*scale-side),y=Math.round((footer+23)*scale);c.fillStyle='#fff';c.fillRect(x,y,side,side);c.fillStyle='#142019';QR.forEach((row,i)=>Array.from(row).forEach((bit,j)=>{if(bit==='1')c.fillRect(x+j*cell,y+i*cell,cell,cell);}));c.restore();
  }
  return canvas;
 }
 window.IstanteShareCard={draw,wrap,URL};
})();
