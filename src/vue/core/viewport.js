/* Istante v4 · responsive viewport model. Shape controls composition, physical viewport size controls optical scale. */
(function(){
  'use strict';
  const { reactive, readonly } = Vue;
  const root = document.documentElement;
  const state = reactive({
    width: 0, height: 0, shortSide: 0, ratio: 1, sizeIndex: 1,
    device: 'computer', orientation: 'landscape', shape: 'balanced', layout: 'computer',
    fontScale: 1, uiScale: 1, userTextScale: 1, userUiScale: 1
  });
  const clamp=(min,value,max)=>Math.max(min,Math.min(max,value));
  function family(w,h,ratio,touch){
    const shortSide=Math.min(w,h), longSide=Math.max(w,h);
    const sizeIndex=Math.sqrt(w*h)/Math.sqrt(1440*900);
    if((touch&&shortSide<=600)||(shortSide<=520&&longSide<=1180)) return 'phone';
    if(touch&&shortSide<=1100&&longSide<=1700) return 'tablet';
    if(sizeIndex>=1.38&&(w>=2300||h>=1350||(ratio>=2.05&&w>=2200))) return 'display';
    return 'computer';
  }
  function opticalScale(device,w,h,ratio,orientation){
    const shortSide=Math.min(w,h), sizeIndex=Math.sqrt(w*h)/Math.sqrt(1440*900);
    let font=1,ui=1;
    if(device==='phone'){
      font=clamp(.90,.955+(sizeIndex-.50)*.22,1.055);
      ui=clamp(.91,.965+(sizeIndex-.50)*.16,1.025);
      if(shortSide<375){font*=.975;ui*=.98;}
      if(orientation==='landscape'&&ratio>1.85){font*=.94;ui*=.95;}
    }else if(device==='tablet'){
      font=clamp(.98,1.015+(sizeIndex-.72)*.16,1.115);
      ui=clamp(.98,1.010+(sizeIndex-.72)*.12,1.085);
      if(orientation==='landscape'&&ratio>1.55){font*=.985;ui*=.99;}
    }else if(device==='display'){
      font=clamp(1.12,1.13+(sizeIndex-1.18)*.21,1.38);
      ui=clamp(1.08,1.09+(sizeIndex-1.18)*.15,1.25);
    }else{
      font=clamp(.97,1.00+(sizeIndex-.83)*.12,1.11);
      ui=clamp(.97,1.00+(sizeIndex-.83)*.09,1.08);
    }
    return {font,ui};
  }
  function apply(){
    const vp=window.visualViewport;
    const w=Math.max(1,Math.round((vp&&vp.width)||innerWidth||1));
    const h=Math.max(1,Math.round((vp&&vp.height)||innerHeight||1));
    const ratio=w/h, shortSide=Math.min(w,h), sizeIndex=Math.sqrt(w*h)/Math.sqrt(1440*900);
    const touch=root.dataset.touchCapable==='true';
    const orientation=ratio>1.12?'landscape':ratio<.89?'portrait':'square';
    const shape=ratio>=2.2?'ultrawide':ratio>1.55?'wide':ratio<.72?'tall':'balanced';
    const device=family(w,h,ratio,touch);
    const layout=device+((device==='phone'||device==='tablet')?'-'+orientation:'');
    const scale=opticalScale(device,w,h,ratio,orientation);
    Object.assign(state,{width:w,height:h,shortSide,ratio,sizeIndex,device,orientation,shape,layout,fontScale:scale.font,uiScale:scale.ui});
    root.style.setProperty('--viewport-index',ratio.toFixed(4));
    root.style.setProperty('--viewport-size-index',sizeIndex.toFixed(4));
    root.style.setProperty('--viewport-w',String(w)); root.style.setProperty('--viewport-h',String(h));
    root.style.setProperty('--viewport-w-px',w+'px'); root.style.setProperty('--viewport-h-px',h+'px'); root.style.setProperty('--viewport-short-px',shortSide+'px');
    root.style.setProperty('--device-font-scale',scale.font.toFixed(4)); root.style.setProperty('--device-ui-scale',scale.ui.toFixed(4));
    root.style.setProperty('--text-scale',(state.userTextScale*scale.font).toFixed(4));
    root.style.setProperty('--ui-scale',(state.userUiScale*scale.ui).toFixed(4));
    root.dataset.viewportShape=shape; root.dataset.viewportLayout=layout; root.dataset.device=device; root.dataset.orientation=orientation;
    if(document.body){ document.body.dataset.viewportShape=shape; document.body.dataset.viewportLayout=layout; document.body.dataset.device=device; document.body.dataset.orientation=orientation; }
    return state;
  }
  function setUserScale(text,ui){
    const t=Number(text),u=Number(ui);
    state.userTextScale=Number.isFinite(t)?t:1; state.userUiScale=Number.isFinite(u)?u:1;
    root.dataset.userTextScale=state.userTextScale.toFixed(3); root.dataset.userUiScale=state.userUiScale.toFixed(3);
    return apply();
  }
  window.IstanteVueRuntime = window.IstanteVueRuntime || {};
  window.IstanteVueRuntime.viewport = readonly(state);
  window.IstanteViewport={update:apply,setUserScale,get:()=>state};
  apply();
  addEventListener('resize',apply,{passive:true});
  window.visualViewport?.addEventListener('resize',apply,{passive:true});
})();
