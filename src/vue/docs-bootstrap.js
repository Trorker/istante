/* Istante v4 · Vue bootstrap for the reading/document area. */
(function(){
 'use strict';
 const app=Vue.createApp({name:'IstanteDocuments',components:{DocumentApp:window.IstanteVueComponents.DocumentApp},template:'<document-app></document-app>'});
 app.mount('#docs-app');
 const scripts=['assets/js/documents.js','assets/js/tooltips.js','assets/js/cursor.js'];
 (async()=>{for(const src of scripts){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src+'?v=4.0.0';s.async=false;s.onload=resolve;s.onerror=reject;document.head.append(s);});}})().catch(console.error);
})();
