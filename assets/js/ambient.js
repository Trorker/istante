/* Procedural sound, no recordings, downloads or persisted audio buffers.
 * Buffers live in RAM. One AudioContext is reused and suspended when idle.
 */
(function(root,factory){
 'use strict';
 if(typeof module==='object'&&module.exports)module.exports=factory();
 else root.IstanteAmbient=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const names={pink:'Rumore rosa',brown:'Rumore marrone',rain:'Pioggia',wind:'Vento'};
 function generate(kind,sampleRate,count,rng=Math.random){
  if(!names[kind]||!Number.isFinite(sampleRate)||sampleRate<8000||!Number.isSafeInteger(count)||count<1||count>sampleRate*30)throw Error('Parametri audio non validi.');
  const seam=Math.min(Math.round(sampleRate*.15),Math.floor(count/4)),raw=new Float32Array(count+seam);
  // Sum equal-energy low-pass bands: a pink-like spectrum without borrowed DSP code.
  const bands=new Float64Array(9),a=Array.from({length:9},(_,i)=>Math.exp(-2*Math.PI*(25*2**i)/sampleRate));
  let brown=0,mean=0;
  for(let i=0;i<raw.length;i++){
   const white=rng()*2-1;let pink=0;
   for(let j=0;j<bands.length;j++){bands[j]=a[j]*bands[j]+(1-a[j])*white;pink+=bands[j]/Math.sqrt(1-a[j]);}
   pink/=14;brown=.998*brown+.018*white;
   const value=kind==='brown'?brown:kind==='pink'?pink:kind==='wind'?brown*.85+pink*.10:pink*.32+white*.18;
   raw[i]=value;mean+=value;
  }
  mean/=raw.length;
  const out=new Float32Array(count);let sum=0,peak=0;
  for(let i=0;i<count;i++){
   let value=raw[i]-mean;
   if(i<seam){const t=(i+.5)/seam*Math.PI/2;value=(raw[i]-mean)*Math.sin(t)+(raw[count+i]-mean)*Math.cos(t);}
   out[i]=value;sum+=value*value;peak=Math.max(peak,Math.abs(value));
  }
  const gain=Math.min(.16/Math.max(.00001,Math.sqrt(sum/count)),.80/Math.max(.00001,peak));
  for(let i=0;i<count;i++)out[i]*=gain;
  return out;
 }
 function create({getSettings,save,radio,notify,icon}){
  const $=id=>document.getElementById(id),supported=!!(window.AudioContext||window.webkitAudioContext);
  let context=null,graph=null,ticket=0,playing=false,loading=false,muted=false,message='',activeType='';
  const selected=()=>getSettings().audioSource==='ambient'&&getSettings().ambientEnabled;
  const level=()=>muted?0:Math.pow(getSettings().ambientVolume/100,1.6)*.9;
  function render(){
   const s=getSettings(),active=selected(),mini=$('radio-mini');
   $('audio-source-radio').hidden=!s.radioEnabled;$('audio-source-ambient').hidden=!s.ambientEnabled;
   $('audio-source-radio').setAttribute('aria-pressed',String(!active));$('audio-source-ambient').setAttribute('aria-pressed',String(active));
   $('radio-controls').hidden=active;$('ambient-controls').hidden=!active;
   $('audio-source-label').textContent=active?'Ambiente offline':'Lo-fi radio';
   mini.dataset.source=active?'ambient':'radio';mini.hidden=!s.radioEnabled&&!s.ambientEnabled;
   document.querySelectorAll('[data-ambient-type]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.ambientType===s.ambientType));b.disabled=!supported;});
   $('ambient-volume').value=s.ambientVolume;$('ambient-volume-value').textContent=s.ambientVolume+'%';
   $('ambient-mute').setAttribute('aria-pressed',String(muted));$('ambient-mute').setAttribute('aria-label',muted?'Riattiva suono ambientale':'Disattiva suono ambientale');$('ambient-mute').innerHTML='<span class="icon">'+icon(muted?'mute':'volume')+'</span>';
   $('ambient-status').textContent=!supported?'Web Audio non disponibile in questo browser. La radio resta utilizzabile.':message||'Generato sul dispositivo. Nessun file audio, nessuna connessione.';
   if(active){
    mini.dataset.state=playing?'playing':loading?'loading':'paused';
    $('radio-status').textContent=loading?'Preparo il tuo suono...':names[s.ambientType];$('radio-status').dataset.istanteTooltip=names[s.ambientType];
    const b=$('radio-play');b.disabled=!supported;b.setAttribute('aria-label',playing||loading?'Ferma il suono ambientale':'Ascolta '+names[s.ambientType]);b.setAttribute('aria-pressed',String(playing||loading));b.innerHTML='<span class="icon">'+icon(playing||loading?'pause':'play')+'</span>';
   }
  }
  function release(g,delay){
   if(!g)return;const t=g.ctx.currentTime;
   try{g.gain.gain.cancelScheduledValues(t);g.gain.gain.setValueAtTime(g.gain.gain.value,t);g.gain.gain.linearRampToValueAtTime(0,t+delay);}catch(_){}
   for(const n of g.sources)try{n.stop(t+delay+.01);}catch(_){}
   const disconnect=()=>g.nodes.forEach(n=>{try{n.disconnect();}catch(_){}});
   if(delay)setTimeout(disconnect,delay*1000+40);else disconnect();
  }
  function stop(immediate=false){
   const id=++ticket;playing=false;loading=false;const old=graph;graph=null;release(old,immediate?0:.16);
   setTimeout(()=>{if(ticket===id&&!graph&&context?.state==='running')context.suspend().catch(()=>{});},immediate?0:200);render();
  }
  async function start(reason='manual'){
   const s=getSettings();if(!s.ambientEnabled||!supported){message='Suoni ambientali non disponibili.';render();return false;}
   const id=++ticket;release(graph,0);graph=null;playing=false;loading=true;message='';
   radio.stop();save('audioSource','ambient');
   // A deliberate source switch takes ownership from an automatic radio slot/timer.
   if(reason==='manual')document.dispatchEvent(new CustomEvent('istante:ambient-manual',{detail:{playing:true}}));render();
   try{
    if(!context||context.state==='closed'){
     const AC=window.AudioContext||window.webkitAudioContext;context=new AC();
     context.addEventListener('statechange',()=>{if(graph&&context.state!=='running'){playing=false;message='Le riprese audio dipendono dal browser. Premi Play per continuare.';render();}});
    }
    if(context.state!=='running'){
     let timeout;try{await Promise.race([context.resume(),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('autoplay')),2500);})]);}finally{clearTimeout(timeout);}
    }
    if(id!==ticket)return false;if(context.state!=='running')throw Error('autoplay');
    const sr=context.sampleRate,length=Math.round(sr*12),buffer=context.createBuffer(2,length,sr);
    for(let channel=0;channel<2;channel++)buffer.copyToChannel(generate(s.ambientType,sr,length),channel);
    if(id!==ticket)return false;
    const src=context.createBufferSource(),high=context.createBiquadFilter(),filter=context.createBiquadFilter(),gain=context.createGain(),compressor=context.createDynamicsCompressor();
    src.buffer=buffer;src.loop=true;high.type='highpass';high.frequency.value=30;filter.type='lowpass';filter.Q.value=.45;
    filter.frequency.value={pink:6500,brown:1600,rain:9000,wind:1200}[s.ambientType];
    gain.gain.setValueAtTime(0,context.currentTime);gain.gain.linearRampToValueAtTime(level(),context.currentTime+.6);
    compressor.threshold.value=-12;compressor.knee.value=18;compressor.ratio.value=3;compressor.attack.value=.02;compressor.release.value=.3;
    src.connect(high);high.connect(filter);filter.connect(gain);gain.connect(compressor);compressor.connect(context.destination);
    const nodes=[src,high,filter,gain,compressor],sources=[src];
    if(s.ambientType==='wind'||s.ambientType==='rain'){
     const lfo=context.createOscillator(),depth=context.createGain();lfo.frequency.value=s.ambientType==='wind'?.075:.11;depth.gain.value=s.ambientType==='wind'?650:1300;lfo.connect(depth);depth.connect(filter.frequency);lfo.start();nodes.push(lfo,depth);sources.push(lfo);
    }
    graph={ctx:context,gain,nodes,sources};activeType=s.ambientType;src.start();playing=true;loading=false;render();return true;
   }catch(_){
    if(id!==ticket)return false;loading=false;playing=false;release(graph,0);graph=null;message='Audio non autorizzato o non disponibile. Premi Play per riprovare.';render();return false;
   }
  }
  function switchSource(source){
   if(source==='ambient'&&!getSettings().ambientEnabled||source==='radio'&&!getSettings().radioEnabled)return;
   if(source===getSettings().audioSource)return;
   document.dispatchEvent(new CustomEvent('istante:ambient-manual',{detail:{playing:false}}));
   if(source==='ambient')radio.stop();else stop(true);
   save('audioSource',source);message='';radio.apply();render();
  }
  function apply(){
   const s=getSettings();if(!s.ambientEnabled&&getSettings().audioSource==='ambient')save('audioSource','radio');
   if(!s.radioEnabled&&s.ambientEnabled)save('audioSource','ambient');
   if(!s.ambientEnabled)stop(true);else if(graph&&activeType!==s.ambientType){void start('settings');return;}else if(graph){graph.gain.gain.setTargetAtTime(level(),context.currentTime,.08);}
   render();
  }
  $('audio-source-radio').addEventListener('click',()=>switchSource('radio'));
  $('audio-source-ambient').addEventListener('click',()=>switchSource('ambient'));
  document.addEventListener('istante:ambient-toggle',()=>{document.dispatchEvent(new CustomEvent('istante:ambient-manual',{detail:{playing:!(playing||loading)}}));playing||loading?stop():void start('manual');});
  document.addEventListener('istante:before-radio-start',()=>{stop(true);if(getSettings().audioSource!=='radio')save('audioSource','radio');render();});
  document.addEventListener('istante:radio-ui',render);
  document.querySelectorAll('[data-ambient-type]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.ambientType===getSettings().ambientType)return;save('ambientType',b.dataset.ambientType);message='';if(playing||loading)void start('settings');else render();}));
  $('ambient-volume').addEventListener('input',e=>{save('ambientVolume',Number(e.target.value));muted=false;if(graph)graph.gain.gain.setTargetAtTime(level(),context.currentTime,.06);render();});
  $('ambient-mute').addEventListener('click',()=>{muted=!muted;if(graph)graph.gain.gain.setTargetAtTime(level(),context.currentTime,.06);render();});
  window.addEventListener('pagehide',()=>stop(true));apply();
  return{start,stop,apply,label:()=>names[getSettings().ambientType],inspect:()=>({playing,loading,muted,type:getSettings().ambientType,contextState:context?.state||'not-created',nodes:graph?.nodes.length||0})};
 }
 return{create,generate,names};
});
