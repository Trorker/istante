/* Istante v4 · Vue application bootstrap */
(function(){
  'use strict';
  const components=window.IstanteVueComponents||{};
  if(!window.Vue) throw new Error('Vue runtime non disponibile.');
  if(!components.AppRoot) throw new Error('Componenti Istante non disponibili.');
  const app=Vue.createApp({
    name:'IstanteApplication',
    components:{AppRoot:components.AppRoot},
    template:'<app-root></app-root>'
  });
  Object.entries(components).forEach(([name,component])=>app.component(name,component));
  app.config.errorHandler=(error,instance,info)=>{
    console.error('[Istante Vue]',info,error);
    const note=document.getElementById('boot-note'); if(note) note.textContent='Avvio non riuscito. Ricarica la pagina.';
    const retry=document.getElementById('boot-retry'); if(retry) retry.hidden=false;
  };
  window.IstanteVueApp=app;
  app.mount('#app');
  document.dispatchEvent(new CustomEvent('istante:vue-mounted'));
  Promise.resolve(window.IstanteVueRuntime?.loadServices?.()).catch(error=>{
    console.error('[Istante services]',error);
    const note=document.getElementById('boot-note'); if(note) note.textContent='Alcuni servizi non sono stati caricati. Ricarica la pagina.';
    const retry=document.getElementById('boot-retry'); if(retry) retry.hidden=false;
  });
})();
