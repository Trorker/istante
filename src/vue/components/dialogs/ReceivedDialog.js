/* Istante v4 · Vue component: ReceivedDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.ReceivedDialog = {
    name: 'ReceivedDialog',
    template: `<dialog aria-labelledby="received-title" class="panel received-panel" id="received-dialog"><div class="panel-head"><div><p class="section-label">Un pensiero arrivato fino a te</p><h2 id="received-title">Questo istante è per te.</h2></div><button aria-label="Chiudi il pensiero" class="icon-button close-button" data-close="" type="button"><span class="icon" data-icon="close"></span></button></div><div class="panel-content"><blockquote id="received-phrase"></blockquote><p class="field-note">Una frase condivisa da un'altra persona. Non modifica la tua raccolta.</p></div><div class="panel-footer"><button class="secondary-button" id="received-save" type="button"><span class="icon" data-icon="heart"></span>Conserva nella biblioteca</button><button class="text-button" data-close="" type="button">Entra in Istante</button></div></dialog>`
  };
})();
