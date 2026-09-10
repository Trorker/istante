/* Istante v4 · Vue component: BackupDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.BackupDialog = {
    name: 'BackupDialog',
    template: `<dialog aria-labelledby="backup-title" class="panel backup-panel" id="backup-dialog"><div class="panel-head"><div><p class="section-label">Il tuo spazio, ritrovato</p><h2 id="backup-title">Ripristina il tuo istante.</h2></div><button aria-label="Chiudi ripristino" class="icon-button close-button" data-close="" type="button"><span class="icon" data-icon="close"></span></button></div><div class="panel-content"><p class="field-note" id="backup-file-name"></p><dl class="backup-summary" id="backup-summary"></dl><p class="backup-warning">Il ripristino sostituisce le preferenze, il traguardo, le stazioni e i preferiti di questo browser. La pagina si ricarica e l'audio si ferma. I timer in corso non vengono trasferiti.</p><p class="field-note" id="backup-extra-note"></p><p class="form-error" hidden="" id="backup-error" role="alert"></p><label class="toggle-row"><span>Confermo la sostituzione<small>Puoi prima esportare i dati attuali dalle impostazioni.</small></span><input id="backup-confirm" role="switch" type="checkbox"/></label></div><div class="panel-footer"><button class="text-button" data-close="" type="button">Annulla</button><button class="primary-button" disabled="" id="backup-restore" type="button">Ripristina e riapri</button></div></dialog>`
  };
})();
