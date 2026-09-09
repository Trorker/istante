/* Optional local UI feedback sounds. No audio files, no network. */
(function(root){'use strict';
function create({getSettings}){
 let ctx=null,last=0;
 function context(){const A=root.AudioContext||root.webkitAudioContext;if(!A)return null;if(!ctx)ctx=new A();if(ctx.state==='suspended')ctx.resume().catch(()=>{});return ctx;}
 function gainNode(c,volume){const g=c.createGain();g.gain.value=Math.max(0,Math.min(1,volume/100))*.19;g.connect(c.destination);return g;}
 function tone(type,volume){const c=context();if(!c)return;const now=c.currentTime,g=gainNode(c,volume);g.gain.setValueAtTime(g.gain.value,now);g.gain.exponentialRampToValueAtTime(.0001,now+.075);
  if(type==='paper'){const n=c.createBuffer(1,Math.floor(c.sampleRate*.055),c.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);const src=c.createBufferSource(),f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1750;f.Q.value=.8;src.buffer=n;src.connect(f);f.connect(g);src.start(now);src.stop(now+.06);return;}
  const o=c.createOscillator();o.type=type==='glass'?'sine':type==='wood'?'triangle':'sine';o.frequency.setValueAtTime(type==='glass'?980:type==='wood'?170:420,now);if(type==='glass')o.frequency.exponentialRampToValueAtTime(620,now+.06);else if(type==='soft')o.frequency.exponentialRampToValueAtTime(330,now+.07);o.connect(g);o.start(now);o.stop(now+.08);
 }
 function play(){const s=getSettings();if(!s.touchSoundEnabled||Date.now()-last<38)return;last=Date.now();tone(s.touchSoundType,s.touchSoundVolume);}
 function interactive(el){return el?.closest?.('button,a,summary,input,select,textarea,[role=button],[role=switch],.custom-trigger,.custom-option,.choice-card,.tab-button');}
 document.addEventListener('pointerdown',e=>{if(e.button!=null&&e.button!==0)return;if(interactive(e.target))play();},{capture:true,passive:true});
 return{apply(){},preview:(type,volume)=>tone(type||getSettings().touchSoundType,volume??getSettings().touchSoundVolume),destroy(){ctx?.close?.();ctx=null;}};
}
root.IstanteTouchFeedback={create};
})(typeof window==='undefined'?globalThis:window);
