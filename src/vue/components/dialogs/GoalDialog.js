/* Istante v4 · Vue component: GoalDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.GoalDialog = {
    name: 'GoalDialog',
    template: `<dialog aria-labelledby="goal-dialog-title" class="panel goal-detail-panel" id="goal-dialog">
<div class="panel-head"><div><p class="section-label" id="goal-dialog-label">Il prossimo capitolo</p><h2 id="goal-dialog-title">Il tuo traguardo.</h2></div><button aria-label="Chiudi prossimo capitolo" class="icon-button close-button" data-close="" type="button"><span class="icon" data-icon="close"></span></button></div>
<div class="panel-content goal-detail-content">
<div class="goal-detail-progress-head"><span id="goal-dialog-progress-label">Il tuo percorso</span><strong id="goal-dialog-progress-value">0%</strong></div>
<div aria-label="Avanzamento del prossimo capitolo" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" class="goal-detail-track" id="goal-dialog-progress" role="progressbar"><span id="goal-dialog-progress-fill"></span></div>
<div class="goal-detail-countdown"><div><strong id="goal-dialog-days">00</strong><span>giorni</span></div><div><strong id="goal-dialog-hours">00</strong><span>ore</span></div><div><strong id="goal-dialog-minutes">00</strong><span>minuti</span></div></div>
<p class="goal-detail-date" id="goal-dialog-date"></p>
</div>
<div class="panel-footer"><button class="text-button" data-close="" type="button">Chiudi</button><button class="primary-button" id="goal-dialog-edit" type="button"><span class="icon" data-icon="settings"></span>Modifica traguardo</button></div>
</dialog>`
  };
})();
