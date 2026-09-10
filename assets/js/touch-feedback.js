/* Optional local UI feedback sounds. No audio files, no network. */
(function(root){'use strict';
function create({getSettings}){
 let ctx=null,last=0;
 function context(){const A=root.AudioContext||root.webkitAudioContext;if(!A)return null;if(!ctx)ctx=new A();if(ctx.state==='suspended')ctx.resume().catch(()=>{});return ctx;}
 function gainNode(c,volume){const g=c.createGain();g.gain.value=Math.max(0,Math.min(1,volume/100))*.48;g.connect(c.destination);return g;}
 function tone(type,volume){
  const c=context();if(!c)return;const now=c.currentTime,level=Math.max(.0001,Math.min(1,volume/100))*.52,g=c.createGain();g.connect(c.destination);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(level,now+.003);
  if(type==='paper'){g.gain.exponentialRampToValueAtTime(.0001,now+.075);const n=c.createBuffer(1,Math.floor(c.sampleRate*.06),c.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);const src=c.createBufferSource(),f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1750;f.Q.value=.8;src.buffer=n;src.connect(f);f.connect(g);src.start(now);src.stop(now+.065);return;}
  if(type==='wood'){
   /* A short wooden knock: low body + filtered transient. Separate gains avoid the
      near-silent double attenuation that affected the previous implementation. */
   g.gain.cancelScheduledValues(now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(Math.max(.025,level*1.5),now+.002);g.gain.exponentialRampToValueAtTime(.0001,now+.135);
   const body=c.createOscillator(),bodyGain=c.createGain(),tap=c.createBufferSource(),tapGain=c.createGain(),filter=c.createBiquadFilter();
   filter.type='lowpass';filter.frequency.setValueAtTime(1650,now);filter.frequency.exponentialRampToValueAtTime(720,now+.09);filter.Q.value=.55;
   body.type='triangle';body.frequency.setValueAtTime(205,now);body.frequency.exponentialRampToValueAtTime(118,now+.105);
   bodyGain.gain.setValueAtTime(.78,now);bodyGain.gain.exponentialRampToValueAtTime(.0001,now+.125);body.connect(bodyGain);bodyGain.connect(filter);
   const n=c.createBuffer(1,Math.max(32,Math.floor(c.sampleRate*.022)),c.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.4);
   tap.buffer=n;tapGain.gain.setValueAtTime(.48,now);tapGain.gain.exponentialRampToValueAtTime(.0001,now+.028);tap.connect(tapGain);tapGain.connect(filter);filter.connect(g);
   body.start(now);tap.start(now);body.stop(now+.14);tap.stop(now+.03);return;
  }
  g.gain.exponentialRampToValueAtTime(.0001,now+.085);const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(type==='glass'?980:420,now);if(type==='glass')o.frequency.exponentialRampToValueAtTime(620,now+.06);else o.frequency.exponentialRampToValueAtTime(330,now+.07);o.connect(g);o.start(now);o.stop(now+.09);
 }
 function play(){const s=getSettings();if(!s.touchSoundEnabled||Date.now()-last<38)return;last=Date.now();tone(s.touchSoundType,s.touchSoundVolume);}
 function interactive(el){return el?.closest?.('button,a,summary,input,select,textarea,[role=button],[role=switch],.custom-trigger,.custom-option,.choice-card,.tab-button');}
 document.addEventListener('pointerdown',e=>{if(e.button!=null&&e.button!==0)return;if(interactive(e.target))play();},{capture:true,passive:true});
 return{apply(){},preview:(type,volume)=>tone(type||getSettings().touchSoundType,volume??getSettings().touchSoundVolume),destroy(){ctx?.close?.();ctx=null;}};
}
root.IstanteTouchFeedback={create};
})(typeof window==='undefined'?globalThis:window);
