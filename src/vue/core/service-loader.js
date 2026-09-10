/* Istante v4 · service loader for the non-visual application engines used by Vue components. */
(function(){
  'use strict';
  const VERSION='4.0.0';
  const scripts = [
    'data/phrases.js','data/stations.js','assets/js/core.js','assets/js/collections.js','assets/js/companion.js',
    'assets/js/qr.js','assets/js/share-link.js','assets/js/phrase-history.js','assets/js/weather-scene.js','assets/js/solar.js',
    'assets/js/icons.js','assets/js/typing.js','assets/js/effects.js','assets/js/radio.js','assets/js/motion.js','assets/js/controls.js',
    'assets/js/experience.js','assets/js/time-core.js','assets/js/moments.js','assets/js/station-library.js','assets/js/station-manager.js',
    'assets/js/schedules.js','assets/js/updates.js','assets/js/share-card.js','assets/js/share.js','assets/js/scene.js','assets/js/ambient.js',
    'assets/js/calendar-core.js','assets/js/backup.js','assets/js/onboarding.js','data/collection-catalog.js','assets/js/calendar-holidays.js',
    'assets/js/calendar.js','assets/js/pages.js','assets/js/scene-snapshot.js','assets/js/touch-feedback.js','assets/js/main.js',
    'assets/js/tooltips.js','assets/js/cursor.js','assets/js/gestures.js'
  ];
  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const node=document.createElement('script');
      node.src=src+(src.includes('?')?'&':'?')+'v='+VERSION;
      node.async=false;
      node.dataset.istanteService='engine';
      node.onload=()=>resolve(src);
      node.onerror=()=>reject(new Error('Impossibile caricare '+src));
      document.head.append(node);
    });
  }
  async function boot(){
    for(const src of scripts) await loadScript(src);
    document.dispatchEvent(new CustomEvent('istante:services-ready'));
  }
  window.IstanteVueRuntime = window.IstanteVueRuntime || {};
  window.IstanteVueRuntime.loadServices = boot;
})();
