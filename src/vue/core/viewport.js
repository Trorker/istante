/* Istante v4.1 · viewport model: Phone / Tablet / Computer / Display. */
(function(){
  'use strict';
  const { reactive, readonly } = Vue;
  const root = document.documentElement;
  const clamp=(min,value,max)=>Math.max(min,Math.min(max,value));
  const state=reactive({
    width:0,height:0,shortSide:0,longSide:0,ratio:1,sizeIndex:1,
    device:'computer',orientation:'landscape',shape:'balanced',layout:'computer',density:'normal',
    fontScale:1,uiScale:1,userTextScale:1,userUiScale:1,touch:false
  });

  function configuredProfile(){
    const value=String(window.ISTANTE_CONFIG?.deviceProfile||'auto').toLowerCase();
    return ['phone','tablet','computer','display'].includes(value)?value:'auto';
  }

  function classify(w,h,touch){
    const forced=configuredProfile();
    if(forced!=='auto') return forced;
    const shortSide=Math.min(w,h), longSide=Math.max(w,h), ratio=w/h;
    // Phone: CSS viewport small enough that the interface must be single-column.
    if(shortSide<=600 && longSide<=1220) return 'phone';
    // Tablet: touch devices with a larger short side. Non-touch 1024/1366 laptops remain computers.
    if(touch && shortSide<=1100 && longSide<=1800) return 'tablet';
    // Display/TV: reserve the TV composition for truly large CSS canvases.
    // A QHD/ultrawide desktop remains a computer. 1080p TVs can be forced through runtime config.
    if((w>=3200 && h>=1600) || h>=1800 || w>=3800 || (ratio>=2.5 && w>=4200)) return 'display';
    return 'computer';
  }

  function scaleFor(device,w,h,orientation){
    const areaIndex=Math.sqrt((w*h)/(1440*900));
    let font=1,ui=1;
    if(device==='phone'){
      font=clamp(.90,.93+(areaIndex-.46)*.25,1.04);
      ui=clamp(.90,.95+(areaIndex-.46)*.16,1.03);
      if(Math.min(w,h)<375){font*=.97;ui*=.98;}
      if(orientation==='landscape'){font*=.94;ui*=.95;}
    }else if(device==='tablet'){
      font=clamp(.98,1.00+(areaIndex-.70)*.17,1.13);
      ui=clamp(.98,1.00+(areaIndex-.70)*.12,1.10);
    }else if(device==='display'){
      font=clamp(1.14,1.14+(areaIndex-1.20)*.18,1.48);
      ui=clamp(1.10,1.10+(areaIndex-1.20)*.14,1.32);
    }else{
      font=clamp(.96,.99+(areaIndex-.78)*.11,1.13);
      ui=clamp(.96,.99+(areaIndex-.78)*.08,1.09);
    }
    return {font,ui,areaIndex};
  }

  function update(){
    // Use layout viewport for device family so browser chrome / keyboard does not change family.
    const w=Math.max(1,Math.round(document.documentElement.clientWidth || innerWidth || 1));
    const h=Math.max(1,Math.round(innerHeight || document.documentElement.clientHeight || 1));
    const shortSide=Math.min(w,h), longSide=Math.max(w,h), ratio=w/h;
    const touch=((navigator.maxTouchPoints||0)>0)||matchMedia('(pointer:coarse)').matches;
    const orientation=ratio>1.12?'landscape':ratio<.89?'portrait':'square';
    const shape=ratio>=2.18?'ultrawide':ratio>=1.55?'wide':ratio<=.72?'tall':'balanced';
    const device=classify(w,h,touch);
    const layout=(device==='phone'||device==='tablet')?`${device}-${orientation}`:device;
    const optical=scaleFor(device,w,h,orientation);
    const density=optical.areaIndex<.72?'compact':optical.areaIndex>1.35?'large':'normal';
    Object.assign(state,{width:w,height:h,shortSide,longSide,ratio,sizeIndex:optical.areaIndex,device,orientation,shape,layout,density,fontScale:optical.font,uiScale:optical.ui,touch});
    root.dataset.device=device;
    root.dataset.orientation=orientation;
    root.dataset.viewportLayout=layout;
    root.dataset.viewportShape=shape;
    root.dataset.viewportDensity=density;
    root.style.setProperty('--viewport-index',ratio.toFixed(4));
    root.style.setProperty('--viewport-size-index',optical.areaIndex.toFixed(4));
    root.style.setProperty('--viewport-w-px',w+'px');
    root.style.setProperty('--viewport-h-px',h+'px');
    root.style.setProperty('--viewport-short-px',shortSide+'px');
    root.style.setProperty('--device-font-scale',optical.font.toFixed(4));
    root.style.setProperty('--device-ui-scale',optical.ui.toFixed(4));
    root.style.setProperty('--text-scale',(state.userTextScale*optical.font).toFixed(4));
    root.style.setProperty('--ui-scale',(state.userUiScale*optical.ui).toFixed(4));
    if(document.body){
      document.body.dataset.device=device;
      document.body.dataset.orientation=orientation;
      document.body.dataset.viewportLayout=layout;
    }
    return state;
  }

  function setUserScale(text,ui){
    const t=Number(text),u=Number(ui);
    state.userTextScale=Number.isFinite(t)?clamp(.8,t,1.4):1;
    state.userUiScale=Number.isFinite(u)?clamp(.8,u,1.4):1;
    return update();
  }

  let raf=0;
  const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(update);};
  window.IstanteVueRuntime=window.IstanteVueRuntime||{};
  window.IstanteVueRuntime.viewport=readonly(state);
  window.IstanteViewport={update,setUserScale,get:()=>state};
  update();
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',schedule,{passive:true});
  window.visualViewport?.addEventListener('resize',schedule,{passive:true});
})();
