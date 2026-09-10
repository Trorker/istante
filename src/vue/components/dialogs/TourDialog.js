/* Istante v4 · Vue component: TourDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.TourDialog = {
    name: 'TourDialog',
    template: `<dialog aria-describedby="tour-copy" aria-labelledby="tour-title" class="tour-layer" id="tour-dialog"><svg aria-hidden="true" class="tour-sketch" id="tour-sketch"><defs><mask id="tour-mask"><rect fill="white" height="100%" id="tour-mask-bg" width="100%"></rect><rect fill="black" id="tour-cutout" rx="18"></rect></mask></defs><rect class="tour-shade" height="100%" mask="url(#tour-mask)" width="100%"></rect><path class="tour-outline" id="tour-outline"></path><path class="tour-arrow shadow" id="tour-arrow-shadow"></path><path class="tour-arrow" id="tour-arrow"></path><path class="tour-arrow" id="tour-arrow-tip"></path></svg><section class="tour-card" id="tour-card"><div class="tour-topline"><span class="section-label" id="tour-step"></span><button aria-label="Chiudi la guida" class="icon-button close-button" data-close="" type="button"><span class="icon" data-icon="close"></span></button></div><p class="tour-note" id="tour-note"></p><h2 id="tour-title"></h2><p aria-live="polite" id="tour-copy"></p><div class="tour-choices" hidden="" id="tour-choices"></div><div class="tour-navigation"><button class="text-button" id="tour-back" type="button">Indietro</button><button class="primary-button" id="tour-next" type="button">Avanti<span class="icon" data-icon="chevron"></span></button></div></section></dialog>`
  };
})();
