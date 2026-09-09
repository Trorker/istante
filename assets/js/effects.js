/* Istante 3.1.0: a bounded, local ambient renderer shared by the scene and preview. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstanteEffects=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function weatherKind(code,isDay){if([95,96,99].includes(code))return 'storm';if([71,73,75,77,85,86].includes(code))return 'snow';if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return 'rain';if([45,48].includes(code))return 'fog';if([2,3].includes(code))return 'clouds';if([0,1].includes(code))return isDay?'sun':'clear-night';return 'off';}
function resolve(settings,sun,weather,now=Date.now(),theme='dark'){
 let phase=theme==='light'?'day':'night',progress=.5;
 if(settings.effectSunSync&&sun){if(sun.rise&&sun.set){progress=Math.max(0,Math.min(1,(now-sun.rise)/(sun.set-sun.rise)));const window=45*60000;if(Math.abs(now-sun.rise)<window)phase='dawn';else if(Math.abs(now-sun.set)<window)phase='dusk';else phase=sun.isDay?'day':'night';}else phase=sun.isDay?'day':'night';}
 let effect=settings.weatherFX||'off';if(effect==='auto'){const fresh=weather&&Number.isFinite(weather.time)&&now-weather.time*1000<45*60000&&now-weather.time*1000>=-60000;effect=fresh?weatherKind(weather.weather_code,sun?sun.isDay:weather.is_day===1):'off';}
 return{phase,progress,weather:effect,effect:settings.effect||'halos'};
}
function create({getSettings,element,preview=false,statusNode=null}){
 const layer=element||document.querySelector('#ambient-fx');if(!layer)return{sync(){},stop(){}};
 const canvas=layer.querySelector('canvas');let ctx=null;try{ctx=canvas?.getContext('2d');}catch(_){}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let context={sun:null,weather:null},scene={},particles=[],frame=0,last=0,width=0,height=0,signature='',active=false;
 const section=layer.closest('.settings-section'),panel=layer.closest('dialog');
 function isVisible(){return !document.hidden&&(!preview||!!(panel?.open&&section?.open))&&layer.getBoundingClientRect().width>0;}
 function shouldRun(){if(!preview&&document.body.classList.contains('view-calendar'))return false;return getSettings().effectsEnabled&&getSettings().motion&&isVisible()&&!reduced.matches&&(preview||!document.querySelector('dialog[open]'));}
 function resize(){const r=layer.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);if(w===width&&h===height)return;width=w;height=h;const dpr=Math.min(devicePixelRatio||1,window.IstantePerformance?.dpr||1.5);if(canvas){canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));canvas.style.width=w+'px';canvas.style.height=h+'px';}ctx?.setTransform(dpr,0,0,dpr,0,0);signature='';}
 function seed(){const key=scene.effect+'|'+scene.weather+'|'+width+'|'+height;if(signature===key)return;signature=key;particles=[];
  const add=(kind,count)=>{for(let i=0;i<Math.ceil(count*(window.IstantePerformance?.light?.55:1));i++)particles.push({kind,x:Math.random()*width,y:Math.random()*height,r:kind==='snow'?1+Math.random()*1.5:kind==='rain'?10+Math.random()*16:.9+Math.random()*1.6,v:kind==='rain'?145+Math.random()*120:kind==='snow'?10+Math.random()*15:4+Math.random()*8,a:.28+Math.random()*.45,t:Math.random()*Math.PI*2});};
  if(scene.effect==='particles')add('dust',preview?18:Math.min(48,Math.max(22,Math.floor(width/32))));
  if(['rain','storm'].includes(scene.weather))add('rain',preview?28:Math.min(70,Math.max(32,Math.floor(width/20))));
  if(scene.weather==='snow')add('snow',preview?22:Math.min(48,Math.max(25,Math.floor(width/28))));
 }
 function paint(dt){if(!ctx||!width||!height)return;ctx.clearRect(0,0,width,height);seed();const s=getSettings(),speed=s.effectSpeed/60,intensity=Math.sqrt(s.effectIntensity/100),light=document.documentElement.dataset.theme==='light'&&document.body.dataset.background!=='photo';
  ctx.strokeStyle=light?'#425a52':'#c5dce2';ctx.fillStyle=light?'#356044':'#dce6ce';ctx.lineWidth=preview?.85:1;
  for(const p of particles){p.t+=dt*.6;p.y+=(p.kind==='dust'?-1:1)*p.v*dt*speed;p.x+=dt*speed*(p.kind==='rain'?-18:Math.sin(p.t)*8);if(p.y>height+30)p.y=-25;if(p.y< -30)p.y=height+25;if(p.x< -30)p.x=width+25;if(p.x>width+30)p.x=-25;
   const middle=Math.abs(p.x-width/2)<width*.32&&p.y>height*.15&&p.y<height*.82;ctx.globalAlpha=p.a*intensity*(middle?.36:1)*(light?1.35:1);ctx.beginPath();if(p.kind==='rain'){ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-2,p.y+p.r*(preview?.65:1));ctx.stroke();}else{ctx.arc(p.x,p.y,p.r*(preview?.85:1),0,Math.PI*2);ctx.fill();}}
  ctx.globalAlpha=1;
 }
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;active=false;layer.classList.add('fx-paused');layer.dataset.running='false';}
 function animate(stamp){if(!shouldRun()){stop();return;}frame=requestAnimationFrame(animate);if(last&&stamp-last<1000/(window.IstantePerformance?.fps||30))return;const dt=Math.min(.08,last?(stamp-last)/1000:.033);last=stamp;paint(dt);}
 function sync(input){if(input)context=input;const s=getSettings();scene=resolve(s,context.sun,context.weather,+(input?.now||new Date()),document.documentElement.dataset.theme);layer.hidden=!s.effectsEnabled;layer.dataset.effect=scene.effect;layer.dataset.weather=scene.weather;layer.dataset.phase=scene.phase;
  const phaseColors={dawn:[32,66],dusk:[23,62],day:[70,42],night:[193,40]},[hue,sat]=phaseColors[scene.phase];
  layer.style.setProperty('--fx-intensity',String(s.effectIntensity/100));layer.style.setProperty('--fx-hue',hue);layer.style.setProperty('--fx-hue-alt',String(hue+38));layer.style.setProperty('--fx-saturation',sat+'%');layer.style.setProperty('--sun-x',(16+scene.progress*68)+'%');
  for(const [name,seconds]of [['halo',28],['aurora',30],['cloud',42]])layer.style.setProperty('--'+name+'-duration',(seconds*60/s.effectSpeed).toFixed(2)+'s');
  resize();paint(0);const wanted=shouldRun();if(wanted){layer.classList.remove('fx-paused');layer.dataset.running='true';if(!active){active=true;if(particles.length)frame=requestAnimationFrame(animate);}}else stop();
  // CSS-only scenes need no animation frame loop, but resume particles when the selection changes.
  if(wanted&&particles.length&&!frame)frame=requestAnimationFrame(animate);
  if(wanted&&!particles.length&&frame){cancelAnimationFrame(frame);frame=0;last=0;}
  if(statusNode){const names={halos:'Aloni di luce',particles:'Particelle sospese',aurora:'Aurora morbida',none:'Solo effetto meteo'};statusNode.textContent=!s.effectsEnabled?'Effetti disattivati.':reduced.matches?'Movimento ridotto del dispositivo: anteprima statica.':s.effect==='none'&&scene.weather==='off'?'Nessun effetto visibile: scegli un\u2019animazione o un effetto meteo.':(names[s.effect]||'Effetto')+' \u00b7 anteprima attiva. Salva per applicare allo screensaver.';if(s.effectsEnabled&&s.weatherFX==='auto'&&scene.weather==='off')statusNode.textContent+=' Meteo automatico in attesa di dati recenti.';}
 }
 const observer=new MutationObserver(()=>sync());observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>{resize();sync();}):null;ro?.observe(layer);
 document.addEventListener('istante:view-change',()=>sync());window.addEventListener('resize',()=>sync());document.addEventListener('visibilitychange',()=>sync());reduced.addEventListener?.('change',()=>sync());window.addEventListener('pagehide',stop);
 return{sync,stop};
}
return{resolve,weatherKind,create};});
