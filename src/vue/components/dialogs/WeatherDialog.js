/* Istante v4 · Vue component: WeatherDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.WeatherDialog = {
    name: 'WeatherDialog',
    template: `<dialog aria-labelledby="weather-dialog-title" class="panel weather-detail-panel" id="weather-dialog">
<div class="panel-head"><div><p class="section-label">Il cielo, adesso</p><h2 id="weather-dialog-title">Meteo e luce.</h2></div><button aria-label="Chiudi meteo" class="icon-button close-button" data-close="" type="button"><span class="icon" data-icon="close"></span></button></div>
<div class="panel-content weather-detail-content">
<div class="weather-detail-hero"><span aria-hidden="true" class="weather-detail-icon" id="weather-modal-icon"></span><div><strong id="weather-modal-temp">—</strong><span id="weather-modal-condition">Meteo non disponibile</span><small id="weather-modal-place">Nessuna località</small></div></div>
<p class="weather-detail-status" id="weather-modal-status">I dati restano leggeri e vengono letti solo quando servono.</p>
<div class="weather-detail-grid">
<div class="weather-detail-metric"><span class="icon" data-icon="sunrise"></span><span><small>Alba</small><strong id="weather-modal-sunrise">—</strong></span></div>
<div class="weather-detail-metric"><span class="icon" data-icon="sunset"></span><span><small>Tramonto</small><strong id="weather-modal-sunset">—</strong></span></div>
<div class="weather-detail-metric"><span class="icon" data-icon="moon"></span><span><small>Luna</small><strong id="weather-modal-moon">—</strong></span></div>
</div>
<p class="weather-detail-empty" hidden="" id="weather-modal-empty"></p>
</div>
<div class="panel-footer"><button class="text-button" data-close="" type="button">Chiudi</button><button class="primary-button" id="weather-configure" type="button"><span class="icon" data-icon="settings"></span>Configura meteo</button></div>
</dialog>`
  };
})();
