/* Local decorative effects. No assets, timers or network required when disabled. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstanteEffects=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function weatherKind(code,isDay){if([95,96,99].includes(code))return'storm';if([71,73,75,77,85,86].includes(code))return'snow';if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return'rain';if([45,48].includes(code))return'fog';if([2,3].includes(code))return'clouds';if([0,1].includes(code))return isDay?'sun':'clear-night';return'off';}
function resolve(settings,sun,weather,now=Date.now(),theme='dark'){
 let phase=theme==='light'?'day':'night',progress=.5;
 if(settings.effectSunSync&&sun){if(sun.rise&&sun.set){progress=Math.max(0,Math.min(1,(now-sun.rise)/(sun.set-sun.rise)));const window=45*60000;if(Math.abs(now-sun.rise)<window)phase='dawn';else if(Math.abs(now-sun.set)<window)phase='dusk';else phase=sun.isDay?'day':'night';}else phase=sun.isDay?'day':'night';}
 let weatherEffect=settings.weatherFX||'off';if(weatherEffect==='auto'){const fresh=weather&&Number.isFinite(weather.time)&&now-weather.time*1000<45*60000&&now-weather.time*1000>=-60000;weatherEffect=fresh?weatherKind(weather.weather_code,sun?sun.isDay:weather.is_day===1):'off';}
 return{phase,progress,weather:weatherEffect,effect:settings.effect||'halos'};
}
function create({getSettings}){
 const layer=document.querySelector('#ambient-fx'),canvas=document.querySelector('#fx-canvas'),ctx=canvas.getContext('2d');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let scene={phase:'night',effect:'halos',weather:'off'},particles=[],frame=0,last=0,width=1,height=1,lastKind='',running=false,context={sun:null,weather:null,now:new Date()};
 function size(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);particles=[];lastKind='';}
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;running=false;layer.classList.add('fx-paused');}
 function wanted(){const s=getSettings();return s.effectsEnabled&&s.motion&&!reduced.matches&&!document.hidden&&!document.querySelector('dialog[open]');}
 function seed(){const kind=scene.weather==='snow'?'snow':['rain','storm'].includes(scene.weather)?'rain':scene.effect==='particles'?'dust':'';if(kind===lastKind&&particles.length)return;lastKind=kind;particles=[];if(!kind)return;
  const count=kind==='rain'?Math.min(64,Math.max(20,Math.floor(width/22))):kind==='snow'?Math.min(40,Math.max(15,Math.floor(width/38))):Math.min(32,Math.max(12,Math.floor(width/48)));
  for(let i=0;i<count;i++)particles.push({x:Math.random()*width,y:Math.random()*height,r:kind==='snow'?.8+Math.random()*1.5:kind==='rain'?7+Math.random()*14:.7+Math.random()*1.7,v:kind==='rain'?170+Math.random()*180:kind==='snow'?9+Math.random()*17:3+Math.random()*7,a:.12+Math.random()*.36,t:Math.random()*6.28});
 }
 function draw(stamp){if(!wanted()){stop();return;}frame=requestAnimationFrame(draw);if(last&&stamp-last<32)return;const dt=Math.min(.07,last?(stamp-last)/1000:.033);last=stamp;if(!ctx)return;ctx.clearRect(0,0,width,height);seed();if(!particles.length)return;
  const s=getSettings(),speed=s.effectSpeed/60,intensity=s.effectIntensity/60,isLight=document.documentElement.dataset.theme==='light'&&document.body.dataset.background!=='photo';
  ctx.strokeStyle=isLight?'#5f7167':'#c3d7dc';ctx.fillStyle=isLight?'#617968':'#d2dac8';ctx.lineWidth=.7;
  for(const p of particles){p.t+=dt*.35;p.y+=(lastKind==='dust'?-1:1)*p.v*dt*speed;p.x+=dt*speed*(lastKind==='rain'?-22:Math.sin(p.t)*6);if(p.y>height+25)p.y=-25;if(p.y< -30)p.y=height+25;if(p.x< -30)p.x=width+25;if(p.x>width+30)p.x=-25;
   // More motion at the edges. Preserve text contrast at the center.
   const central=Math.abs(p.x-width/2)<width*.34&&p.y>height*.16&&p.y<height*.8;ctx.globalAlpha=p.a*intensity*(central?.16:1);
   ctx.beginPath();if(lastKind==='rain'){ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-2.4,p.y+p.r);ctx.stroke();}else{ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}
  }ctx.globalAlpha=1;
 }
 function restart(){stop();if(!wanted())return;layer.classList.remove('fx-paused');running=true;frame=requestAnimationFrame(draw);}
 function sync(input){
  if(input)context=input;const {sun=null,weather=null}=context,now=input?.now||new Date();
  const s=getSettings();scene=resolve(s,sun,weather,+now,document.documentElement.dataset.theme);layer.hidden=!s.effectsEnabled||!s.motion||reduced.matches;layer.dataset.effect=scene.effect;layer.dataset.weather=scene.weather;layer.dataset.phase=scene.phase;
  layer.style.setProperty('--fx-intensity',String(s.effectIntensity/100));layer.style.setProperty('--fx-speed',(60/s.effectSpeed).toFixed(2));layer.style.setProperty('--sun-x',(18+scene.progress*64).toFixed(2)+'%');
  const [hue,sat]=scene.phase==='dawn'?[34,62]:scene.phase==='dusk'?[22,58]:scene.phase==='day'?[48,42]:[204,35];layer.style.setProperty('--fx-hue',hue);layer.style.setProperty('--fx-saturation',sat+'%');
  if(wanted()){if(!running)restart();}else stop();
 }
 const observer=new MutationObserver(()=>{if(wanted()){if(!running)restart();}else stop();});observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 window.addEventListener('resize',()=>{size();});document.addEventListener('visibilitychange',()=>sync());reduced.addEventListener?.('change',()=>sync());window.addEventListener('pagehide',stop);size();
 return{sync,stop};
}
return{resolve,weatherKind,create};});
