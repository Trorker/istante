/* Freeze only local decoration, never wallpaper, photographs, text or dialogs.
 * CSS gradients are painted from their computed values (color, opacity, geometry,
 * current animation transform). Celestial and particle canvases are copied as-is.
 * A different card ratio preserves normalized anchors; Screen preserves geometry.
 */
(function(){'use strict';
 const MAX_SURFACE=2048,TAU=Math.PI*2;
 let wallpaperImage=null;
 const grainImage=new Image();
 grainImage.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity=".5"/></svg>');
 function split(value,delimiter=','){
  const out=[];let depth=0,part='';for(const ch of value){if(ch==='(')depth++;if(ch===')')depth--;if(ch===delimiter&&depth===0){out.push(part.trim());part='';}else part+=ch;}if(part.trim())out.push(part.trim());return out;
 }
 function visible(n){if(!n)return false;for(let x=n;x&&x!==document.body;x=x.parentElement){const s=getComputedStyle(x);if(x.hidden||s.display==='none'||s.visibility==='hidden')return false;}return true;}
 function opacity(n){let alpha=1;for(let x=n;x&&x!==document.body;x=x.parentElement){const a=Number(getComputedStyle(x).opacity);alpha*=Number.isFinite(a)?a:1;}return alpha;}
 const pos=(s,size)=>s?.endsWith('%')?parseFloat(s)*size/100:s==='left'||s==='top'?0:s==='right'||s==='bottom'?size:s==='center'?size/2:Number.isFinite(parseFloat(s))?parseFloat(s):size/2;
 function stops(parts,extent){
  const out=parts.map(s=>{const m=s.match(/\s+(-?[\d.]+)(%|px)\s*$/);return{color:m?s.slice(0,m.index).trim():s,p:m?(m[2]==='%'?+m[1]/100:+m[1]/extent):null};});
  if(!out.length)return[];if(out[0].p===null)out[0].p=0;if(out[out.length-1].p===null)out[out.length-1].p=1;
  let last=0;for(let i=1;i<out.length;i++){if(out[i].p===null)continue;out[i].p=Math.max(out[last].p,out[i].p);for(let j=last+1;j<i;j++)out[j].p=out[last].p+(out[i].p-out[last].p)*(j-last)/(i-last);last=i;}
  return out;
 }
 function addStops(g,parts,extent){for(const s of stops(parts,extent))try{g.addColorStop(Math.max(0,Math.min(1,s.p)),s.color);}catch(_){return false;}return true;}
 function paintGradient(c,raw,w,h){
  const m=/^(radial-gradient|linear-gradient)\((.*)\)$/.exec(raw);if(!m)return;
  const parts=split(m[2]);let spec='';if(/^(ellipse|circle|at |to |[+-]?[\d.]+(?:deg|turn|rad)\b)/.test(parts[0]))spec=parts.shift();
  c.save();
  if(m[1]==='radial-gradient'){
   const at=/\bat\s+(.+)$/.exec(spec),xy=(at?at[1]:'50% 50%').trim().split(/\s+/),x=pos(xy[0],w),y=pos(xy[1]||'50%',h);
   let rx,ry;
   if(spec.startsWith('circle')){rx=ry=Math.max(...[0,w].flatMap(a=>[0,h].map(b=>Math.hypot(a-x,b-y))));}
   else{rx=Math.max(Math.abs(x),Math.abs(w-x),1);ry=Math.max(Math.abs(y),Math.abs(h-y),1);const f=Math.max(...[0,w].flatMap(a=>[0,h].map(b=>Math.hypot((a-x)/rx,(b-y)/ry))));rx*=f;ry*=f;}
   c.translate(x,y);c.scale(rx,ry);const g=c.createRadialGradient(0,0,0,0,0,1);if(addStops(g,parts,Math.max(rx,ry))){c.fillStyle=g;c.fillRect(-x/rx,-y/ry,w/rx,h/ry);}
  }else{
   let angle=180;if(spec.startsWith('to ')){const dirs=spec.slice(3);angle=dirs==='top'?0:dirs==='right'?90:dirs==='left'?270:dirs==='bottom'?180:dirs.includes('top')?(dirs.includes('left')?315:45):(dirs.includes('left')?225:135);}
   else if(spec){angle=parseFloat(spec);if(spec.endsWith('turn'))angle*=360;else if(spec.endsWith('rad'))angle=angle*180/Math.PI;}
   const a=angle*Math.PI/180,dx=Math.sin(a),dy=-Math.cos(a),length=Math.abs(w*dx)+Math.abs(h*dy),x=w/2,y=h/2;
   const g=c.createLinearGradient(x-dx*length/2,y-dy*length/2,x+dx*length/2,y+dy*length/2);if(addStops(g,parts,length)){c.fillStyle=g;c.fillRect(0,0,w,h);}
  }
  c.restore();
 }
 function raster(n){
  const style=getComputedStyle(n),w=n.offsetWidth,h=n.offsetHeight;if(!w||!h)return null;
  const image=style.backgroundImage;if(!image||image==='none'||image.includes('url('))return null;
  const canvas=document.createElement('canvas'),scale=Math.min(1,MAX_SURFACE/w,MAX_SURFACE/h);canvas.width=Math.ceil(w*scale);canvas.height=Math.ceil(h*scale);
  const c=canvas.getContext('2d');if(!c)return null;c.scale(scale,scale);
  for(const part of split(image).reverse())paintGradient(c,part,w,h);
  const box=n.getBoundingClientRect();let a=1,b=0,cc=0,d=1;
  try{const Matrix=window.DOMMatrixReadOnly||window.DOMMatrix;if(Matrix&&style.transform!=='none'){const t=new Matrix(style.transform);a=t.a;b=t.b;cc=t.c;d=t.d;}}catch(_){}
  // Recover the transformed local origin from its four bounding corners.
  const minX=Math.min(0,a*w,cc*h,a*w+cc*h),minY=Math.min(0,b*w,d*h,b*w+d*h);
  return{canvas,width:w,height:h,matrix:[a,b,cc,d,box.left-minX,box.top-minY]};
 }
 function setWallpaper(image){wallpaperImage=image&&image.naturalWidth&&image.naturalHeight?image:null;}
 function wallpaperLayer(w,h){
  if(document.body.dataset.background!=='photo'||!wallpaperImage)return null;
  const node=document.querySelector('.wallpaper.photo-active');if(!visible(node)||opacity(node)<.001)return null;
  const box=node.getBoundingClientRect(),iw=wallpaperImage.naturalWidth,ih=wallpaperImage.naturalHeight;
  if(!iw||!ih||box.width<=0||box.height<=0)return null;
  const fit=Math.max(box.width/iw,box.height/ih),dw=iw*fit,dh=ih*fit;
  const dx=box.left+(box.width-dw)/2,dy=box.top+(box.height-dh)/2;
  const scale=Math.min(1,MAX_SURFACE/w,MAX_SURFACE/h),canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.ceil(w*scale));canvas.height=Math.max(1,Math.ceil(h*scale));
  const c=canvas.getContext('2d');if(!c)return null;c.scale(scale,scale);c.drawImage(wallpaperImage,dx,dy,dw,dh);
  return{kind:'wallpaper',group:'background',alpha:opacity(node),canvas,rect:{x:0,y:0,w:1,h:1}};
 }
 function capture(info,settings){
  const w=innerWidth,h=innerHeight,layers=[],root=getComputedStyle(document.documentElement),light=document.documentElement.dataset.theme==='light';
  function css(n,group='background'){if(!visible(n)||opacity(n)<.001)return;const r=raster(n);if(r)layers.push({kind:'css',group,alpha:opacity(n),...r});}
  function copy(selector,kind,group='effects'){const n=document.querySelector(selector);if(!visible(n)||!n.width||!n.height||opacity(n)<.001)return;const out=document.createElement('canvas');out.width=n.width;out.height=n.height;const c=out.getContext('2d');if(!c)return;c.drawImage(n,0,0);const box=n.getBoundingClientRect();layers.push({kind,group,alpha:opacity(n),canvas:out,rect:{x:box.x/w,y:box.y/h,w:box.width/w,h:box.height/h}});}
  css(document.querySelector('.backdrop>.ambient'),'background');css(document.querySelector('.breathing-light'),'background');
  const wallpaper=wallpaperLayer(w,h);if(wallpaper)layers.push(wallpaper);
  css(document.querySelector('.photo-shade'),'background');
  // Equal z-index layers follow DOM order: environmental effects, then the sky.
  const fx=document.getElementById('ambient-fx');if(visible(fx)){fx.querySelectorAll('.fx-halos i,.fx-aurora,.fx-weather-light,.fx-clouds').forEach(n=>css(n,'effects'));copy('#fx-canvas','field','effects');}
  const sky=document.getElementById('celestial-sky');if(visible(sky)){copy('#sky-stars','field','sky');css(sky.querySelector('.sky-halo'),'sky');const orb=document.getElementById('sky-body'),mirror=document.getElementById('sky-body-snapshot');if(orb&&mirror&&mirror.width&&mirror.height&&opacity(orb)>.001){const out=document.createElement('canvas');out.width=mirror.width;out.height=mirror.height;out.getContext('2d')?.drawImage(mirror,0,0);const box=orb.getBoundingClientRect();layers.push({kind:'orb',group:'sky',alpha:opacity(orb),canvas:out,rect:{x:box.x/w,y:box.y/h,w:box.width/w,h:box.height/h}});}css(sky.querySelector('.sky-weather-veil'),'sky');css(sky.querySelector('.sky-twilight'),'sky');}
  // The transition in progress is also an on-screen decorative layer.
  css(document.querySelector('#celestial-transition .transition-horizon'),'sky');
  let grain=null;
  if(settings.grain&&grainImage.complete&&grainImage.naturalWidth){grain=document.createElement('canvas');grain.width=grain.height=160;grain.getContext('2d').drawImage(grainImage,0,0);}
  return{...info,capture:{width:w,height:h,background:root.getPropertyValue('--bg').trim()||(light?'#f1eee7':'#131615'),light,layers,grain,grainOpacity:opacity(document.querySelector('.paper-grain')),capturedAt:Date.now()},celestialEnabled:!!settings.celestialSky};
 }
 function transformFor(s,W,H,fit='cover'){
  const scale=fit==='contain'?Math.min(W/s.width,H/s.height):Math.max(W/s.width,H/s.height);
  return{fit,scale,offsetX:(W-s.width*scale)/2,offsetY:(H-s.height*scale)/2,sourceWidth:s.width,sourceHeight:s.height};
 }
 function draw(c,info,W,H,options={}){const s=info.capture;if(!s)return null;
  const t=transformFor(s,W,H,options.fit||'cover');
  c.save();c.beginPath();c.rect(0,0,W,H);c.clip();
  for(const layer of s.layers){if(options.includeSky===false&&layer.group==='sky')continue;c.save();c.globalAlpha=layer.alpha;
   if(layer.kind==='css'){c.translate(t.offsetX,t.offsetY);c.scale(t.scale,t.scale);c.transform(...layer.matrix);c.drawImage(layer.canvas,0,0,layer.width,layer.height);}
   else{const r=layer.rect,rx=r.x*s.width,ry=r.y*s.height,rw=r.w*s.width,rh=r.h*s.height;if(layer.kind==='orb'){const side=Math.min(rw,rh)*t.scale;c.drawImage(layer.canvas,t.offsetX+(rx+rw/2)*t.scale-side/2,t.offsetY+(ry+rh/2)*t.scale-side/2,side,side);}else c.drawImage(layer.canvas,t.offsetX+rx*t.scale,t.offsetY+ry*t.scale,rw*t.scale,rh*t.scale);}
   c.restore();
  }
  if(s.grain){c.save();c.translate(t.offsetX,t.offsetY);c.scale(t.scale,t.scale);c.globalAlpha=s.grainOpacity;c.fillStyle=c.createPattern(s.grain,'repeat');c.fillRect(0,0,s.width,s.height);c.restore();}
  c.restore();return t;
 }
 window.IstanteSceneSnapshot={capture,draw,setWallpaper,transformFor};
})();
