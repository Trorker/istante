/* Local sky, clocks, fitted viewport and introduction.
 * Moon formulas adapted from SunCalc 1.9.0 (Vladimir Agafonkin, BSD-2-Clause).
 * See docs/licenses/SUNCALC-LICENSE.txt. On-screen paths are illustrative. */
(function(){'use strict';
const PI=Math.PI,rad=PI/180,sin=Math.sin,cos=Math.cos,atan=Math.atan2;
function moon(date){
 const d=+date/86400000-.5+2440588-2451545,e=rad*23.4397;
 const M=rad*(357.5291+.98560028*d),L=M+rad*(1.9148*sin(M)+.02*sin(2*M)+.0003*sin(3*M))+rad*102.9372+PI;
 const sr=atan(sin(L)*cos(e),cos(L)),sd=Math.asin(sin(L)*sin(e));
 const m=rad*(134.963+13.064993*d),l=rad*(218.316+13.176396*d)+rad*6.289*sin(m),b=rad*5.128*sin(rad*(93.272+13.22935*d));
 const mr=atan(sin(l)*cos(e)-Math.tan(b)*sin(e),cos(l)),md=Math.asin(sin(b)*cos(e)+cos(b)*sin(e)*sin(l)),dist=385001-20905*cos(m);
 const phi=Math.acos(Math.max(-1,Math.min(1,sin(sd)*sin(md)+cos(sd)*cos(md)*cos(sr-mr)))),inc=atan(149598000*sin(phi),dist-149598000*cos(phi));
 const angle=atan(cos(sd)*sin(sr-mr),sin(sd)*cos(md)-cos(sd)*sin(md)*cos(sr-mr));
 const phase=.5+.5*inc*(angle<0?-1:1)/PI,fraction=(1+cos(inc))/2;
 const name=phase<.025||phase>.975?'Luna nuova':phase<.225?'Luna crescente':phase<.275?'Primo quarto':phase<.475?'Gibbosa crescente':phase<.525?'Luna piena':phase<.725?'Gibbosa calante':phase<.775?'Ultimo quarto':'Luna calante';
 return{phase,fraction,name};
}
function paintMoon(canvas,phase,light=false){
 const c=canvas.getContext('2d');if(!c)return;const w=canvas.width,h=canvas.height,r=w*.43,im=c.createImageData(w,h),sx=sin(2*PI*phase),sz=-cos(2*PI*phase);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const nx=(x-w/2)/r,ny=(y-h/2)/r,rr=nx*nx+ny*ny;if(rr>1)continue;const nz=Math.sqrt(1-rr),dot=nx*sx+nz*sz,texture=.91+(sin(x*.42)*sin(y*.37)+sin(x*.14+y*.16))*.025,value=(dot>0?183+Math.max(0,dot)*61:light?93:44)*texture,i=(y*w+x)*4;im.data[i]=value;im.data[i+1]=value+3;im.data[i+2]=value+7;im.data[i+3]=Math.min(255,(1-rr)*14000);}
 c.clearRect(0,0,w,h);c.putImageData(im,0,0);
}
function create({getSettings,getSun,store,openWelcome}){
 const $=id=>document.getElementById(id),sky=$('celestial-sky'),body=$('sky-body'),stars=$('sky-stars'),main=$('main'),viewport=document.querySelector('.stage-viewport'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let queued=false,lastMoon='',lastSky='',snapshot={},storageBusy=false,welcomeStep=0,ready=false,pending=false;
 const points=Array.from({length:65},(_,i)=>({x:(Math.sin(i*171.3)*12345)%1,y:(Math.sin(i*97.8+1)*6789)%1,r:.5+(i%4)*.28,a:.18+(i%5)*.11}));
 const marks=$('analog-marks');for(let i=0;i<60;i++){const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1','100');line.setAttribute('x2','100');line.setAttribute('y1',i%5?'14':'12');line.setAttribute('y2',i%5?'17':'22');line.setAttribute('transform','rotate('+i*6+' 100 100)');line.setAttribute('class',i%5?'dial-minor':'dial-major');marks.append(line);}
 function fit(){queued=false;const h=window.visualViewport?.height||innerHeight;document.documentElement.style.setProperty('--view-h',Math.round(h)+'px');const scale=Math.min(1,Math.max(.05,(viewport.clientHeight-8)/Math.max(1,main.offsetHeight)),(viewport.clientWidth-4)/Math.max(1,main.scrollWidth));if(Math.abs(Number(main.dataset.scale||1)-scale)>.001){main.dataset.scale=String(scale);main.style.setProperty('--stage-scale',scale);}}
 function queueFit(){if(!queued){queued=true;requestAnimationFrame(fit);}}
 const ro=typeof ResizeObserver==='function'?new ResizeObserver(queueFit):null;[main,viewport,document.querySelector('.goal-strip'),document.querySelector('.bottom-bar')].forEach(n=>ro?.observe(n));window.addEventListener('resize',queueFit,{passive:true});window.visualViewport?.addEventListener('resize',queueFit,{passive:true});
 function drawStars(now,isDay){const w=sky.clientWidth,h=sky.clientHeight,c=stars.getContext('2d');if(!c||!w||!h)return;if(stars.width!==w||stars.height!==h){stars.width=w;stars.height=h;}c.clearRect(0,0,w,h);if(isDay)return;const shift=(+now%86164000)/86164000*.13;for(const p of points){const x=((p.x+1+shift)%1)*w,y=((p.y+1)%1)*h*.83,center=Math.abs(x/w-.5)<.29&&y/h>.25?.28:1;c.globalAlpha=p.a*center;c.fillStyle='#e1e6e7';c.beginPath();c.arc(x,y,p.r,0,2*PI);c.fill();}c.globalAlpha=1;}
 function update(now){
  const s=getSettings(),analog=s.clockStyle==='analog';document.body.dataset.clockStyle=s.clockStyle;$('clock-line').hidden=analog;$('analog-clock').hidden=!analog;
  const angle={hour:(now.getHours()%12)*30+now.getMinutes()*.5,minute:now.getMinutes()*6+now.getSeconds()*.1,second:now.getSeconds()*6};for(const key of ['hour','minute','second'])document.querySelector('.analog-'+key).style.transform='rotate('+angle[key]+'deg)';
  document.querySelector('.analog-second').style.visibility=s.showSeconds?'visible':'hidden';$('analog-clock').setAttribute('aria-label','Sono le '+window.IstanteTime.formatTime(now,s.timeFormat));document.querySelector('.analog-period').textContent=s.timeFormat==='12'?(now.getHours()<12?'AM':'PM'):'';
  const sol=getSun(),minutes=now.getHours()*60+now.getMinutes(),isDay=sol?sol.isDay:minutes>=360&&minutes<1080;let progress=isDay?(minutes-360)/720:(minutes>=1080?minutes-1080:minutes+360)/720;
  if(sol?.rise&&sol?.set){if(isDay)progress=(+now-sol.rise)/(sol.set-sol.rise);else{const start=+now<sol.rise?sol.set-86400000:sol.set,end=+now<sol.rise?sol.rise:sol.rise+86400000;progress=(+now-start)/(end-start);}}
  progress=Math.max(0,Math.min(1,progress));const m=moon(now);snapshot={...m,isDay,approximate:!sol,label:isDay?'Il sole ti accompagna':m.name};sky.hidden=!s.celestialSky;sky.dataset.period=isDay?'day':'night';sky.classList.toggle('sky-static',!s.motion||reduced.matches||document.hidden);sky.style.setProperty('--sky-x',(9+82*progress)+'%');sky.style.setProperty('--sky-y',(20-13*sin(PI*progress))+'%');
  const phaseKey=Math.round(m.phase*10000)+':'+isDay+':'+document.documentElement.dataset.theme;if(phaseKey!==lastMoon){lastMoon=phaseKey;if(isDay){const c=body.getContext('2d');if(c){c.clearRect(0,0,160,160);const g=c.createRadialGradient(69,64,2,80,80,60);g.addColorStop(0,'#fff7d0');g.addColorStop(1,'#e4ba7c');c.fillStyle=g;c.beginPath();c.arc(80,80,49,0,2*PI);c.fill();}}else paintMoon(body,m.phase,document.documentElement.dataset.theme==='light');}
  const sk=Math.floor(+now/10000)+':'+sky.clientWidth+':'+sky.clientHeight+':'+isDay;if(sk!==lastSky){lastSky=sk;drawStars(now,isDay);}
  $('moon-caption').hidden=!s.celestialSky||isDay;$('moon-caption').title='Fase lunare calcolata sul dispositivo. Il percorso sullo schermo e illustrativo.';document.querySelector('.moon-phase-name').textContent=m.name;document.querySelector('.moon-phase-percent').textContent=Math.round(m.fraction*100)+'% illuminata';queueFit();
 }
 function collapseSettings(){document.querySelectorAll('#settings-dialog details').forEach(d=>{const content=d.querySelector(':scope > .settings-section-body');if(content){window.IstanteMotion.cancel(content);content.style.removeProperty('overflow');content.style.removeProperty('height');}d._intent=false;d.open=false;});const content=document.querySelector('#settings-dialog .panel-content');if(content)content.scrollTop=0;}
 async function persistence(){if(storageBusy)return;storageBusy=true;const el=$('persistent-storage-status');try{if(!navigator.storage||typeof navigator.storage.persist!=='function'){el.textContent='Memoria persistente non supportata qui. Le preferenze restano nella normale memoria del browser.';$('storage-request').hidden=true;return;}const granted=(typeof navigator.storage.persisted==='function'&&await navigator.storage.persisted())||await navigator.storage.persist();el.textContent=granted?'Memoria persistente concessa dal browser. Puoi comunque cancellare i dati dalle impostazioni del dispositivo.':'Il browser non ha concesso la persistenza. La cache normale resta attiva, ma potrebbe essere liberata dal sistema.';$('storage-request').hidden=!!granted;}catch(_){el.textContent='Richiesta di persistenza non disponibile. Istante continua con la memoria ordinaria, quando consentita.';}finally{storageBusy=false;}}
 const guide=[
 ['Prenditi un momento per te.','Istante ti fa compagnia dalla mattina alla sera: un pensiero, il tempo che passa e uno spazio tutto tuo.',['Frasi da leggere e conservare con un cuore.','Un orologio e il conto alla rovescia verso il tuo obiettivo.']],
 ['Scegli il tuo ritmo.','Apri le impostazioni per rendere questo spazio davvero tuo.',['Foto, colori, sole e luna; digitale o analogico.','Musica lo-fi e un timer per la tua pausa. L\u2019audio parte soltanto con il tuo consenso.']],
 ['Il tuo spazio, anche offline.','Orologio, frasi e cielo continuano anche senza Internet, dopo il primo caricamento completo.',['Radio, foto nuove e meteo richiedono una connessione.','I comandi scompaiono dopo un po\u2019: basta un tocco per ritrovarli. La guida resta nella sezione Informazioni.']]];
 function drawGuide(){const g=guide[welcomeStep];$('welcome-title').textContent=g[0];$('welcome-copy').textContent=g[1];$('welcome-features').replaceChildren(...g[2].map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));$('welcome-step').textContent=(welcomeStep+1)+' / 3';$('welcome-back').disabled=welcomeStep===0;$('welcome-next').textContent=welcomeStep===2?'Inizia il tuo istante':'Continua';}
 function showGuide(force=false){if(!ready)return;if(!force&&store.read('welcome.seen',false))return;if(document.querySelector('dialog[open]')){pending=true;return;}pending=false;welcomeStep=0;drawGuide();openWelcome();}
 $('welcome-next').addEventListener('click',()=>{if(welcomeStep<2){welcomeStep++;drawGuide();}else window.IstanteMotion.dismiss($('welcome-dialog'));});$('welcome-back').addEventListener('click',()=>{welcomeStep=Math.max(0,welcomeStep-1);drawGuide();});$('welcome-dialog').addEventListener('close',()=>store.write('welcome.seen',true));
 $('welcome-reopen').addEventListener('click',()=>{const d=$('settings-dialog');d.addEventListener('close',()=>showGuide(true),{once:true});window.IstanteMotion.dismiss(d);});document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{if(pending)queueMicrotask(()=>showGuide());}));$('storage-request').addEventListener('click',()=>void persistence());document.addEventListener('visibilitychange',()=>{if(!document.hidden)update(new Date());});
 document.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.target.closest('dialog[open],#radio-panel'))e.preventDefault();},{passive:false});document.addEventListener('touchmove',e=>{if(e.touches.length===1&&!e.target.closest('dialog[open],#radio-panel'))e.preventDefault();},{passive:false});document.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)&&!e.target.closest('dialog,button,input,select,textarea,a'))e.preventDefault();});
 return{update,describe:()=>({...snapshot}),collapseSettings,ready(){ready=true;queueFit();void persistence();showGuide();}};
}
window.IstanteScene={create,moon,paintMoon};
})();
