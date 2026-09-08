/* Small, bounded enhancements. No periodic texture rendering or audio files. */
(function(root){'use strict';
const perf={light:false,fps:30,dpr:1.5,apply(s){const coarse=typeof matchMedia==='function'&&matchMedia('(pointer: coarse)').matches;this.light=s.performance==='light'||s.performance!=='full'&&(coarse||(navigator.deviceMemory&&navigator.deviceMemory<=4));this.fps=this.light?20:30;this.dpr=this.light?1:1.5;document.body.classList.toggle('performance-light',this.light);document.body.classList.toggle('has-paper-grain',!!s.grain);document.body.style.setProperty('--grain-opacity',(s.grainOpacity||18)/100);}};
function addMonths(d,n){const out=new Date(d);out.setDate(1);out.setMonth(out.getMonth()+n);out.setDate(Math.min(d.getDate(),new Date(out.getFullYear(),out.getMonth()+1,0).getDate()));return out;}
function goalParts(now,end){
 const ms=Math.max(0,+end-+now),days=Math.floor(ms/86400000),hours=Math.floor(ms/3600000)%24,minutes=Math.floor(ms/60000)%60;
 let months=(end.getFullYear()-now.getFullYear())*12+end.getMonth()-now.getMonth();if(+addMonths(now,months)>+end)months--;months=Math.max(0,months);
 const rest=Math.max(0,+end-addMonths(now,months)),remaining=Math.floor(rest/86400000),remainingHours=Math.floor(rest/3600000)%24;
 return months>=12?[{value:Math.floor(months/12),unit:'anni'},{value:months%12,unit:'mesi'},{value:remaining,unit:'giorni'}]:months>=1?[{value:months,unit:'mesi'},{value:remaining,unit:'giorni'},{value:remainingHours,unit:'ore'}]:[{value:days,unit:'giorni'},{value:hours,unit:'ore'},{value:minutes,unit:'minuti'}];
}
function quiet(now,s){if(!s.chimeQuiet)return false;const mins=x=>{const a=String(x).split(':').map(Number);return a[0]*60+a[1];},a=mins(s.chimeQuietStart),b=mins(s.chimeQuietEnd),t=now.getHours()*60+now.getMinutes();return a===b||a<b?t>=a&&t<b||a===b:t>=a||t<b;}
function create({getSettings,notify}){
 let ctx=null,lastHour=-1,voices=[],suspendTimer=0;
 function unlock(){try{if(!(root.AudioContext||root.webkitAudioContext))return false;if(!ctx)ctx=new(root.AudioContext||root.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume().catch(()=>{});return true;}catch(_){return false;}}
 function note(s){if(!ctx||ctx.state!=='running')return false;clearTimeout(suspendTimer);const t=ctx.currentTime,v=(s.chimeVolume/100)**1.5*.35;
  const tones=s.chimeType==='fork'?[[440,1,4],[880,.10,2]]:[[396,.8,5],[792,.18,3.7],[1069,.10,2.4]];
  tones.forEach(([freq,amp,seconds])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.00001,t);g.gain.exponentialRampToValueAtTime(Math.max(.00001,v*amp),t+.035);g.gain.exponentialRampToValueAtTime(.00001,t+seconds);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+seconds+.06);voices.push(o);o.onended=()=>{o.disconnect();g.disconnect();voices=voices.filter(x=>x!==o);};});return true;
 }
 document.addEventListener('pointerdown',()=>{const f=document.getElementById('settings-form');if(getSettings().chimeEnabled||f?.elements.chimeEnabled.checked)unlock();},{passive:true});
 document.addEventListener('keydown',()=>{if(getSettings().chimeEnabled)unlock();},{passive:true});
 document.getElementById('chime-test').addEventListener('click',async()=>{const f=document.getElementById('settings-form').elements;if(!unlock()){notify('Web Audio non disponibile in questo browser.');return;}try{await ctx.resume();note({chimeType:f.chimeType.value,chimeVolume:Number(f.chimeVolume.value)});}catch(_){notify('Il browser non ha autorizzato il suono.');}});
 function tick(now){const s=getSettings();if(!s.chimeEnabled||document.hidden||now.getMinutes()!==0||now.getSeconds()>2)return;const key=Math.floor(+now/3600000);if(key===lastHour)return;lastHour=key;if(quiet(now,s))return;note(s);}
 function apply(){const s=getSettings();if(!s.chimeEnabled){voices.forEach(o=>{try{o.stop();}catch(_){}});voices=[];ctx?.suspend().catch(()=>{});}}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)lastHour=Math.floor(Date.now()/3600000);});root.addEventListener('pagehide',()=>{voices.forEach(o=>{try{o.stop();}catch(_){}});ctx?.close().catch(()=>{});ctx=null;});
 return{tick,apply};
}
root.IstantePerformance=perf;root.IstanteCompanion={create,goalParts,quiet,addMonths};
})(typeof window==='undefined'?globalThis:window);
