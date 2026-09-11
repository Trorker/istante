/* Istante offline audio engine.
 * Ambient noise and four short melodies are generated procedurally with Web Audio.
 * No recordings are downloaded or persisted: audio buffers live only in memory.
 */
(function(root,factory){
  'use strict';
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.IstanteAmbient=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const AMBIENT_NAMES={
    pink:'Rumore rosa',
    brown:'Rumore marrone',
    rain:'Pioggia',
    wind:'Vento'
  };

  const MELODY_NAMES={
    aurora:'Aurora lenta',
    vetro:'Vetro e pioggia',
    notturno:'Notturno',
    orizzonte:'Orizzonte'
  };

  const MELODY_PATTERNS={
    aurora:{bpm:78,notes:[69,72,76,72,71,74,78,74,69,72,76,81,78,76,74,72],roots:[45,48,41,43],tone:.72},
    vetro:{bpm:70,notes:[64,67,71,74,71,67,66,69,72,76,72,69,64,67,71,67],roots:[40,43,45,38],tone:.58},
    notturno:{bpm:60,notes:[57,60,64,67,64,60,55,59,62,67,62,59,57,60,64,60],roots:[33,36,38,31],tone:.45},
    orizzonte:{bpm:84,notes:[62,66,69,74,69,66,64,67,71,76,71,67,62,66,71,74],roots:[38,42,35,40],tone:.66}
  };

  const midi=midiNote=>440*Math.pow(2,(midiNote-69)/12);

  function assertAudioShape(kind,names,sampleRate,count,label){
    if(!names[kind]||!Number.isFinite(sampleRate)||sampleRate<8000||!Number.isSafeInteger(count)||count<1||count>sampleRate*30){
      throw Error('Parametri '+label+' non validi.');
    }
  }

  function generateNoise(kind,sampleRate,count,rng=Math.random){
    assertAudioShape(kind,AMBIENT_NAMES,sampleRate,count,'audio');
    const seam=Math.min(Math.round(sampleRate*.15),Math.floor(count/4));
    const raw=new Float32Array(count+seam);
    const bands=new Float64Array(9);
    const coefficients=Array.from({length:9},(_,i)=>Math.exp(-2*Math.PI*(25*2**i)/sampleRate));
    let brown=0;
    let mean=0;

    for(let i=0;i<raw.length;i++){
      const white=rng()*2-1;
      let pink=0;
      for(let j=0;j<bands.length;j++){
        bands[j]=coefficients[j]*bands[j]+(1-coefficients[j])*white;
        pink+=bands[j]/Math.sqrt(1-coefficients[j]);
      }
      pink/=14;
      brown=.998*brown+.018*white;
      const value=kind==='brown'?brown:kind==='pink'?pink:kind==='wind'?brown*.85+pink*.10:pink*.32+white*.18;
      raw[i]=value;
      mean+=value;
    }

    mean/=raw.length;
    const out=new Float32Array(count);
    let sum=0;
    let peak=0;
    for(let i=0;i<count;i++){
      let value=raw[i]-mean;
      if(i<seam){
        const t=(i+.5)/seam*Math.PI/2;
        value=(raw[i]-mean)*Math.sin(t)+(raw[count+i]-mean)*Math.cos(t);
      }
      out[i]=value;
      sum+=value*value;
      peak=Math.max(peak,Math.abs(value));
    }

    const gain=Math.min(.16/Math.max(.00001,Math.sqrt(sum/count)),.80/Math.max(.00001,peak));
    for(let i=0;i<count;i++)out[i]*=gain;
    return out;
  }

  function generateMelody(kind,sampleRate,count){
    assertAudioShape(kind,MELODY_NAMES,sampleRate,count,'melodia');
    const pattern=MELODY_PATTERNS[kind];
    const left=new Float32Array(count);
    const right=new Float32Array(count);
    const stepSeconds=30/pattern.bpm;
    let peak=.001;

    for(let i=0;i<count;i++){
      const t=i/sampleRate;
      const stepIndex=Math.floor(t/stepSeconds);
      const phase=(t%stepSeconds)/stepSeconds;
      const note=pattern.notes[stepIndex%pattern.notes.length];
      const frequency=midi(note);
      const root=midi(pattern.roots[Math.floor(stepIndex/4)%pattern.roots.length]);
      const attack=Math.min(1,phase/.08);
      const release=Math.min(1,(1-phase)/.20);
      const envelope=Math.pow(Math.max(0,Math.min(attack,release)),.8);
      const lead=(Math.sin(2*Math.PI*frequency*t)+.22*Math.sin(4*Math.PI*frequency*t)+.08*Math.sin(6*Math.PI*frequency*t))*envelope*.27;
      const pad=(Math.sin(2*Math.PI*root*t)+.55*Math.sin(2*Math.PI*root*1.5*t)+.34*Math.sin(2*Math.PI*root*2*t))*.085;
      const pulse=Math.sin(Math.PI*Math.min(1,(t%(stepSeconds*4))/(stepSeconds*4)))**2;
      const l=(lead*(.94+.06*Math.sin(t*.35))+pad*pulse)*pattern.tone;
      const r=(lead*(.94+.06*Math.cos(t*.31))+pad*pulse+.018*Math.sin(2*Math.PI*(frequency*.5)*t))*pattern.tone;
      left[i]=l;
      right[i]=r;
      peak=Math.max(peak,Math.abs(l),Math.abs(r));
    }

    const seam=Math.min(Math.round(sampleRate*.22),Math.floor(count/5));
    const normalizer=Math.min(1,.68/peak);
    for(let i=0;i<count;i++){
      let fade=1;
      if(i<seam)fade=Math.sin((i/seam)*Math.PI/2);
      else if(i>count-seam)fade=Math.sin(((count-i)/seam)*Math.PI/2);
      left[i]*=normalizer*fade;
      right[i]*=normalizer*fade;
    }
    return[left,right];
  }

  function create({getSettings,save,radio,notify,icon}){
    const $=id=>document.getElementById(id);
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    const supported=!!AudioContextClass;
    let context=null;
    let graph=null;
    let ticket=0;
    let playing=false;
    let loading=false;
    let muted=false;
    let message='';
    let activeSource='';
    let activeType='';

    const enabled=(source,settings=getSettings())=>{
      if(source==='radio')return !!settings.radioEnabled;
      if(source==='ambient')return !!settings.ambientEnabled;
      if(source==='melody')return !!settings.melodyEnabled;
      return false;
    };
    const currentSource=()=>getSettings().audioSource;
    const offlineSelected=()=>['ambient','melody'].includes(currentSource())&&enabled(currentSource());
    const currentType=(source=currentSource(),settings=getSettings())=>source==='melody'?settings.melodyType:settings.ambientType;
    const sourceName=(source=currentSource(),settings=getSettings())=>source==='melody'?MELODY_NAMES[settings.melodyType]:AMBIENT_NAMES[settings.ambientType];
    const level=(source=activeSource||currentSource(),settings=getSettings())=>{
      if(muted)return 0;
      const volume=source==='melody'?settings.melodyVolume:settings.ambientVolume;
      return Math.pow(volume/100,1.6)*(source==='melody'?.82:.9);
    };
    const setPressed=(id,value)=>$(id)?.setAttribute('aria-pressed',String(value));

    function render(){
      const settings=getSettings();
      const source=settings.audioSource;
      const offline=offlineSelected();
      const mini=$('radio-mini');
      const radioTab=$('audio-source-radio');
      const ambientTab=$('audio-source-ambient');
      const melodyTab=$('audio-source-melody');

      if(radioTab)radioTab.hidden=!settings.radioEnabled;
      if(ambientTab)ambientTab.hidden=!settings.ambientEnabled;
      if(melodyTab)melodyTab.hidden=!settings.melodyEnabled;
      setPressed('audio-source-radio',source==='radio');
      setPressed('audio-source-ambient',source==='ambient');
      setPressed('audio-source-melody',source==='melody');

      if($('radio-controls'))$('radio-controls').hidden=source!=='radio';
      if($('ambient-controls'))$('ambient-controls').hidden=source!=='ambient';
      if($('melody-controls'))$('melody-controls').hidden=source!=='melody';
      if($('audio-source-label'))$('audio-source-label').textContent=source==='melody'?'Melodie offline':source==='ambient'?'Ambiente offline':'Lo-fi radio';
      if(mini){
        mini.dataset.source=source;
        mini.hidden=!settings.radioEnabled&&!settings.ambientEnabled&&!settings.melodyEnabled;
      }

      document.querySelectorAll('[data-ambient-type]').forEach(button=>{
        button.setAttribute('aria-pressed',String(button.dataset.ambientType===settings.ambientType));
        button.disabled=!supported;
      });
      document.querySelectorAll('[data-melody-type]').forEach(button=>{
        button.setAttribute('aria-pressed',String(button.dataset.melodyType===settings.melodyType));
        button.disabled=!supported;
      });

      if($('ambient-volume'))$('ambient-volume').value=settings.ambientVolume;
      if($('ambient-volume-value'))$('ambient-volume-value').textContent=settings.ambientVolume+'%';
      if($('melody-volume'))$('melody-volume').value=settings.melodyVolume;
      if($('melody-volume-value'))$('melody-volume-value').textContent=settings.melodyVolume+'%';

      for(const sourceId of ['ambient','melody']){
        const muteButton=$(sourceId+'-mute');
        if(!muteButton)continue;
        const noun=sourceId==='melody'?'melodia':'suono ambientale';
        muteButton.setAttribute('aria-pressed',String(muted));
        muteButton.setAttribute('aria-label',muted?'Riattiva '+noun:'Disattiva '+noun);
        muteButton.innerHTML='<span class="icon">'+icon(muted?'mute':'volume')+'</span>';
      }

      const unsupported='Web Audio non disponibile in questo browser. La radio resta utilizzabile.';
      if($('ambient-status'))$('ambient-status').textContent=!supported?unsupported:(source==='ambient'&&message?message:'Generato sul dispositivo. Nessun file audio, nessuna connessione.');
      if($('melody-status'))$('melody-status').textContent=!supported?unsupported:(source==='melody'&&message?message:'Generata sul dispositivo. Nessun file audio, nessuna connessione.');

      if(!offline)return;
      if(mini)mini.dataset.state=playing?'playing':loading?'loading':'paused';
      if($('radio-status')){
        $('radio-status').textContent=loading?'Preparo il tuo suono...':sourceName();
        $('radio-status').dataset.istanteTooltip=sourceName();
      }
      const playButton=$('radio-play');
      if(playButton){
        const active=playing||loading;
        playButton.disabled=!supported;
        playButton.setAttribute('aria-label',active?'Ferma '+(source==='melody'?'la melodia':'il suono ambientale'):'Ascolta '+sourceName());
        playButton.setAttribute('aria-pressed',String(active));
        playButton.innerHTML='<span class="icon">'+icon(active?'pause':'play')+'</span>';
      }
    }

    function release(currentGraph,delay){
      if(!currentGraph)return;
      const now=currentGraph.ctx.currentTime;
      try{
        currentGraph.gain.gain.cancelScheduledValues(now);
        currentGraph.gain.gain.setValueAtTime(currentGraph.gain.gain.value,now);
        currentGraph.gain.gain.linearRampToValueAtTime(0,now+delay);
      }catch(_){/* Audio graph may already be closing. */}
      for(const node of currentGraph.sources){
        try{node.stop(now+delay+.01);}catch(_){/* Node may already be stopped. */}
      }
      const disconnect=()=>currentGraph.nodes.forEach(node=>{
        try{node.disconnect();}catch(_){/* Disconnected already. */}
      });
      if(delay)setTimeout(disconnect,delay*1000+40);
      else disconnect();
    }

    function stop(immediate=false){
      const id=++ticket;
      playing=false;
      loading=false;
      const oldGraph=graph;
      graph=null;
      release(oldGraph,immediate?0:.16);
      activeSource='';
      activeType='';
      setTimeout(()=>{
        if(ticket===id&&!graph&&context?.state==='running')context.suspend().catch(()=>{});
      },immediate?0:200);
      render();
    }

    async function ensureContext(){
      if(!context||context.state==='closed'){
        context=new AudioContextClass();
        context.addEventListener('statechange',()=>{
          if(graph&&context.state!=='running'){
            playing=false;
            message='Le riprese audio dipendono dal browser. Premi Play per continuare.';
            render();
          }
        });
      }
      if(context.state!=='running'){
        let timeout;
        try{
          await Promise.race([
            context.resume(),
            new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('autoplay')),2500);})
          ]);
        }finally{
          clearTimeout(timeout);
        }
      }
      if(context.state!=='running')throw Error('autoplay');
    }

    async function start(reason='manual',forcedSource=null){
      const settings=getSettings();
      const source=forcedSource||settings.audioSource;
      if(!['ambient','melody'].includes(source)||!enabled(source,settings)||!supported){
        message='Audio offline non disponibile.';
        render();
        return false;
      }

      const id=++ticket;
      release(graph,0);
      graph=null;
      playing=false;
      loading=true;
      message='';
      radio.stop();
      save('audioSource',source);
      if(reason==='manual'){
        document.dispatchEvent(new CustomEvent(source==='melody'?'istante:melody-manual':'istante:ambient-manual',{detail:{playing:true}}));
      }
      render();

      try{
        await ensureContext();
        if(id!==ticket)return false;

        const sampleRate=context.sampleRate;
        const length=Math.round(sampleRate*(source==='melody'?16:12));
        const buffer=context.createBuffer(2,length,sampleRate);
        if(source==='melody'){
          const channels=generateMelody(getSettings().melodyType,sampleRate,length);
          buffer.copyToChannel(channels[0],0);
          buffer.copyToChannel(channels[1],1);
        }else{
          for(let channel=0;channel<2;channel++)buffer.copyToChannel(generateNoise(getSettings().ambientType,sampleRate,length),channel);
        }
        if(id!==ticket)return false;

        const sourceNode=context.createBufferSource();
        const highPass=context.createBiquadFilter();
        const lowPass=context.createBiquadFilter();
        const gain=context.createGain();
        const compressor=context.createDynamicsCompressor();
        sourceNode.buffer=buffer;
        sourceNode.loop=true;
        highPass.type='highpass';
        highPass.frequency.value=source==='melody'?45:30;
        lowPass.type='lowpass';
        lowPass.Q.value=.45;
        lowPass.frequency.value=source==='melody'?5200:{pink:6500,brown:1600,rain:9000,wind:1200}[getSettings().ambientType];
        gain.gain.setValueAtTime(0,context.currentTime);
        gain.gain.linearRampToValueAtTime(level(source),context.currentTime+.6);
        compressor.threshold.value=-12;
        compressor.knee.value=18;
        compressor.ratio.value=3;
        compressor.attack.value=.02;
        compressor.release.value=.3;
        sourceNode.connect(highPass);
        highPass.connect(lowPass);
        lowPass.connect(gain);
        gain.connect(compressor);
        compressor.connect(context.destination);

        const nodes=[sourceNode,highPass,lowPass,gain,compressor];
        const sources=[sourceNode];
        if(source==='ambient'&&['wind','rain'].includes(getSettings().ambientType)){
          const lfo=context.createOscillator();
          const depth=context.createGain();
          lfo.frequency.value=getSettings().ambientType==='wind'?.075:.11;
          depth.gain.value=getSettings().ambientType==='wind'?650:1300;
          lfo.connect(depth);
          depth.connect(lowPass.frequency);
          lfo.start();
          nodes.push(lfo,depth);
          sources.push(lfo);
        }

        graph={ctx:context,gain,nodes,sources,source};
        activeSource=source;
        activeType=currentType(source);
        sourceNode.start();
        playing=true;
        loading=false;
        render();
        return true;
      }catch(_){
        if(id!==ticket)return false;
        loading=false;
        playing=false;
        release(graph,0);
        graph=null;
        activeSource='';
        activeType='';
        message='Audio non autorizzato o non disponibile. Premi Play per riprovare.';
        render();
        return false;
      }
    }

    function switchSource(source){
      if(!enabled(source)||source===currentSource())return;
      document.dispatchEvent(new CustomEvent('istante:ambient-manual',{detail:{playing:false}}));
      document.dispatchEvent(new CustomEvent('istante:melody-manual',{detail:{playing:false}}));
      if(source==='radio')stop(true);
      else{
        radio.stop();
        stop(true);
      }
      save('audioSource',source);
      message='';
      radio.apply();
      render();
    }

    function toggleOffline(source){
      if(!enabled(source))return;
      if(currentSource()!==source){
        radio.stop();
        stop(true);
        save('audioSource',source);
      }
      if((playing||loading)&&activeSource===source)stop();
      else void start('manual',source);
    }

    function apply(){
      const settings=getSettings();
      const source=settings.audioSource;
      const activeDisabled=(activeSource==='ambient'&&!settings.ambientEnabled)||(activeSource==='melody'&&!settings.melodyEnabled);
      if(activeDisabled){
        stop(true);
      }else if(graph&&(activeSource!==source||activeType!==currentType(activeSource,settings))){
        void start('settings',source);
        return;
      }else if(graph){
        graph.gain.gain.setTargetAtTime(level(activeSource,settings),context.currentTime,.08);
      }
      render();
    }

    $('audio-source-radio')?.addEventListener('click',()=>switchSource('radio'));
    $('audio-source-ambient')?.addEventListener('click',()=>switchSource('ambient'));
    $('audio-source-melody')?.addEventListener('click',()=>switchSource('melody'));
    document.addEventListener('istante:ambient-toggle',()=>toggleOffline('ambient'));
    document.addEventListener('istante:melody-toggle',()=>toggleOffline('melody'));
    document.addEventListener('istante:before-radio-start',()=>{
      stop(true);
      if(currentSource()!=='radio')save('audioSource','radio');
      render();
    });
    document.addEventListener('istante:radio-ui',render);

    document.querySelectorAll('[data-ambient-type]').forEach(button=>button.addEventListener('click',()=>{
      if(button.dataset.ambientType===getSettings().ambientType)return;
      save('ambientType',button.dataset.ambientType);
      message='';
      const shouldRestart=(playing&&activeSource==='ambient')||(loading&&currentSource()==='ambient');
      if(shouldRestart)void start('settings','ambient');
      else render();
    }));

    document.querySelectorAll('[data-melody-type]').forEach(button=>button.addEventListener('click',()=>{
      if(button.dataset.melodyType===getSettings().melodyType)return;
      save('melodyType',button.dataset.melodyType);
      message='';
      const shouldRestart=(playing&&activeSource==='melody')||(loading&&currentSource()==='melody');
      if(shouldRestart)void start('settings','melody');
      else render();
    }));

    for(const source of ['ambient','melody']){
      $(source+'-volume')?.addEventListener('input',event=>{
        save(source==='melody'?'melodyVolume':'ambientVolume',Number(event.target.value));
        muted=false;
        if(graph&&activeSource===source)graph.gain.gain.setTargetAtTime(level(source),context.currentTime,.06);
        render();
      });
      $(source+'-mute')?.addEventListener('click',()=>{
        muted=!muted;
        if(graph)graph.gain.gain.setTargetAtTime(level(activeSource),context.currentTime,.06);
        render();
      });
    }

    window.addEventListener('pagehide',()=>stop(true));
    apply();

    return{
      start,
      stop,
      apply,
      label:()=>sourceName(),
      inspect:()=>({
        playing,
        loading,
        muted,
        source:activeSource||currentSource(),
        type:currentType(activeSource||currentSource()),
        contextState:context?.state||'not-created',
        nodes:graph?.nodes.length||0
      })
    };
  }

  return{
    create,
    generate:generateNoise,
    generateNoise,
    generateMelody,
    names:AMBIENT_NAMES,
    melodyNames:MELODY_NAMES
  };
});
