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
    aurora:'Respiro lento',
    vetro:'Meditazione',
    notturno:'Notturno',
    orizzonte:'Onde lente'
  };

  // IDs stay stable so existing local preferences keep working after upgrades.
  // The four pieces intentionally use different musical structures: a slow
  // breathing swell, sparse meditation bells, nocturnal chords and soft waves.
  const MELODY_PATTERNS={
    // Guided 4-4-6 breathing: 4 s inhale, 4 s hold, 6 s exhale.
    // Two complete cycles fit the 28-second loop without an audible seam.
    aurora:{root:45,fifth:52,air:57,cycle:14,tone:.64},
    // Meditation intentionally stays in the low/mid register to avoid sharp tones.
    vetro:{bells:[48,52,50,55,47],drone:[29,36],tone:.62},
    notturno:{chords:[[45,52,57],[43,50,55],[40,47,52],[38,45,50]],top:[64,62,59,57],tone:.72},
    orizzonte:{roots:[38,45,40,47],fifths:[57,64,59,66],tone:.58}
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
    const tau=Math.PI*2;
    let peak=.001;

    const softBell=(phase,decay=5.4)=>phase<.035?phase/.035:Math.exp(-(phase-.035)*decay);
    const smooth01=value=>value*value*(3-2*value);

    for(let i=0;i<count;i++){
      const t=i/sampleRate;
      let l=0,r=0;

      if(kind==='aurora'){
        // "Respiro lento": audible guide for the 4-4-6 relaxation technique.
        // Rise for 4 s (inhale), stay open for 4 s (hold), release for 6 s (exhale).
        const cycle=pattern.cycle;
        const phase=t%cycle;
        let breathe;
        if(phase<4)breathe=.07+.93*smooth01(phase/4);
        else if(phase<8){
          const hold=(phase-4)/4;
          breathe=.985+.015*Math.sin(Math.PI*hold);
        }else breathe=.07+.93*(1-smooth01((phase-8)/6));
        const root=midi(pattern.root),fifth=midi(pattern.fifth),air=midi(pattern.air);
        const body=(Math.sin(tau*root*t)*.37+Math.sin(tau*fifth*t)*.18)*breathe;
        const halo=Math.sin(tau*air*t)*.042*Math.pow(breathe,1.55);
        l=(body+halo*.70)*pattern.tone;
        r=((Math.sin(tau*root*1.001*t)*.36+Math.sin(tau*fifth*.999*t)*.19)*breathe+halo)*pattern.tone;
      }else if(kind==='vetro'){
        // "Meditazione": low drone and very soft bowl tones, intentionally
        // avoiding the high partials used by the older version.
        const bellStep=5;
        const bellIndex=Math.floor(t/bellStep);
        const phase=(t%bellStep)/bellStep;
        const root=midi(pattern.drone[Math.floor(t/10)%pattern.drone.length]);
        const bedSwell=.34+.66*Math.pow(Math.sin(Math.PI*((t%10)/10)),.72);
        const bed=(Math.sin(tau*root*t)*.24+Math.sin(tau*root*1.5*t)*.045)*bedSwell;
        const note=midi(pattern.bells[bellIndex%pattern.bells.length]);
        const env=softBell(phase,5.7);
        const bowl=(Math.sin(tau*note*t)+.13*Math.sin(tau*note*1.5*t)+.035*Math.sin(tau*note*2.01*t))*env*.17;
        const side=bellIndex%2===0;
        l=(bed+bowl*(side?.74:1))*pattern.tone;
        r=(bed*.98+bowl*(side?1:.74))*pattern.tone;
      }else if(kind==='notturno'){
        // Keep the piece the user preferred: slow low-register chord breathing.
        const chordSeconds=5;
        const index=Math.floor(t/chordSeconds)%pattern.chords.length;
        const local=(t%chordSeconds)/chordSeconds;
        const chord=pattern.chords[index];
        const breathe=Math.pow(Math.sin(Math.PI*local),.72);
        const f0=midi(chord[0]),f1=midi(chord[1]),f2=midi(chord[2]);
        const chordL=(Math.sin(tau*f0*t)*.46+Math.sin(tau*f1*t)*.33+Math.sin(tau*f2*t)*.24)*breathe*.20;
        const chordR=(Math.sin(tau*f0*1.001*t)*.44+Math.sin(tau*f1*.999*t)*.34+Math.sin(tau*f2*1.002*t)*.25)*breathe*.20;
        const topStep=2.5;
        const topPhase=(t%topStep)/topStep;
        const topIndex=Math.floor(t/topStep)%pattern.top.length;
        const tf=midi(pattern.top[topIndex]);
        const topEnv=Math.pow(Math.sin(Math.PI*topPhase),1.4);
        const top=Math.sin(tau*tf*t)*topEnv*.055;
        l=(chordL+top*.72)*pattern.tone;
        r=(chordR+top)*pattern.tone;
      }else{
        // "Onde lente": alternating swells without a beat or note sequence.
        const waveSeconds=5;
        const section=Math.floor(t/waveSeconds)%pattern.roots.length;
        const phase=(t%waveSeconds)/waveSeconds;
        const eased=smooth01(phase<.5?phase*2:(1-phase)*2);
        const root=midi(pattern.roots[section]);
        const fifth=midi(pattern.fifths[section]);
        const next=midi(pattern.roots[(section+1)%pattern.roots.length]);
        const current=(Math.sin(tau*root*t)*.30+Math.sin(tau*fifth*t)*.15)*eased;
        const cross=.5-.5*Math.cos(Math.PI*phase);
        const wash=Math.sin(tau*next*.5*t)*.08*cross;
        const shimmer=Math.sin(tau*fifth*2.002*t)*.025*(.35+.65*eased);
        l=(current+wash+shimmer*.7)*pattern.tone;
        r=((Math.sin(tau*root*1.001*t)*.29+Math.sin(tau*fifth*.999*t)*.16)*eased+wash*.94+shimmer)*pattern.tone;
      }

      left[i]=l;
      right[i]=r;
      peak=Math.max(peak,Math.abs(l),Math.abs(r));
    }

    // Fade the loop seam without changing the characteristic envelope.
    const seam=Math.min(Math.round(sampleRate*.24),Math.floor(count/5));
    // The older buffers were intentionally conservative and became too quiet on
    // phone speakers. Apply per-piece make-up gain while retaining ample headroom.
    const makeUp={aurora:1.72,vetro:1.86,notturno:1.32,orizzonte:1.42}[kind]||1;
    const normalizer=Math.min(makeUp,.74/peak);
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
      return source==='melody'?Math.pow(volume/100,1.35)*1.08:Math.pow(volume/100,1.6)*.9;
    };
    const setPressed=(id,value)=>$(id)?.setAttribute('aria-pressed',String(value));

    function render(){
      let settings=getSettings();
      const available=['radio','ambient','melody'].filter(source=>enabled(source,settings));
      let source=available.includes(settings.audioSource)?settings.audioSource:(available[0]||settings.audioSource);
      if(available.length&&source!==settings.audioSource){
        save('audioSource',source);
        settings=getSettings();
      }
      const offline=['ambient','melody'].includes(source)&&enabled(source,settings);
      const mini=$('radio-mini');
      const sourceSwitch=document.querySelector('.audio-source-switch');
      const radioTab=$('audio-source-radio');
      const ambientTab=$('audio-source-ambient');
      const melodyTab=$('audio-source-melody');

      if(radioTab)radioTab.hidden=!settings.radioEnabled;
      if(ambientTab)ambientTab.hidden=!settings.ambientEnabled;
      if(melodyTab)melodyTab.hidden=!settings.melodyEnabled;
      if(sourceSwitch){
        sourceSwitch.hidden=available.length<=1;
        sourceSwitch.setAttribute('aria-hidden',String(available.length<=1));
      }
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
      for(const sourceId of ['ambient','melody']){
        const status=$(sourceId+'-status');if(!status)continue;
        const text=!supported?unsupported:(source===sourceId&&message?message:'');
        status.textContent=text;status.hidden=!text;
      }

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
        const melodyType=getSettings().melodyType;
        const seconds=source==='melody'?(melodyType==='aurora'?28:20):12;
        const length=Math.round(sampleRate*seconds);
        const buffer=context.createBuffer(2,length,sampleRate);
        if(source==='melody'){
          const channels=generateMelody(melodyType,sampleRate,length);
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
        compressor.threshold.value=-8;
        compressor.knee.value=16;
        compressor.ratio.value=2.2;
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
