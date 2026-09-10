/* Istante v4 · Vue component: ShareDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.ShareDialog = {
    name: 'ShareDialog',
    template: `<dialog aria-labelledby="share-title" class="panel share-panel" id="share-dialog">
<div class="panel-head">
<div>
<p class="section-label">
      Un pensiero da portare con te
     </p>
<h2 id="share-title">
      Condividi un istante.
     </h2>
</div>
<button aria-label="Chiudi condivisione" class="icon-button close-button" data-close="" type="button">
<span class="icon" data-icon="close">
</span>
</button>
</div>
<div class="panel-content share-content">
<p class="field-note">Scegli il formato e cosa portare nella cartolina. Le fotografie restano fuori.</p>
<div class="share-format-row"><div aria-label="Formato della cartolina" class="share-formats" role="group">
<button aria-pressed="true" class="share-format active" data-share-format="square" type="button">Quadrato<small>1:1</small></button>
<button aria-pressed="false" class="share-format" data-share-format="story" type="button">Storia<small>9:16</small></button>
<button aria-pressed="false" class="share-format" data-share-format="landscape" type="button">Orizzontale<small>16:9</small></button>
</div></div>
<details class="share-config" id="share-options-details"><summary><span><strong>Configura cartolina</strong><small>Orologio, QR, data, cielo e altri dettagli</small></span><span class="icon share-config-chevron" data-icon="chevron"></span></summary><div class="share-options">
<label class="toggle-row share-clock-toggle"><span>Includi l'orologio<small>L'ora di questo momento.</small></span><input checked="" id="share-clock" role="switch" type="checkbox"/></label>
<label class="toggle-row"><span>Includi il QR<small>Apre la frase condivisa in Istante.</small></span><input checked="" id="share-qr" role="switch" type="checkbox"/></label>
<label class="toggle-row"><span>Includi la data<small>La data di oggi.</small></span><input checked="" id="share-date" role="switch" type="checkbox"/></label>
<label class="toggle-row"><span>Includi il cielo<small>Luce, meteo, sole o luna e fase lunare.</small></span><input checked="" id="share-sky" role="switch" type="checkbox"/></label>
<label class="toggle-row"><span>Includi il mio obiettivo<small>Nome e conto alla rovescia.</small></span><input id="share-goal" role="switch" type="checkbox"/></label>
<label class="toggle-row"><span>Includi la colonna sonora<small>Quello che stai ascoltando.</small></span><input id="share-radio" role="switch" type="checkbox"/></label>
</div></details>
<div aria-busy="true" class="share-preview-wrap">
<div aria-hidden="true" class="share-generation-placeholder" id="share-preloader"><div class="share-placeholder-card"><i></i><i></i><i></i><span></span></div><small>Creo la tua cartolina…</small></div>
<img alt="Anteprima della cartolina di Istante" hidden="" id="share-preview"/>
<p id="share-status" role="status">
      Preparo il tuo istante...
     </p>
</div>
<div class="share-secondary">
<button class="text-button" id="share-link" type="button">
<span class="icon" data-icon="link">
</span>
      Condividi link
     </button>
<button class="text-button" id="share-copy" type="button">
<span class="icon" data-icon="copy">
</span>
      Copia link
     </button>
</div>
</div>
<div class="panel-footer share-footer">
<button class="secondary-button" disabled="" id="share-download" type="button">
<span class="icon" data-icon="download">
</span>
     Salva immagine
    </button>
<button class="primary-button" disabled="" id="share-send" type="button">
<span class="icon" data-icon="share">
</span>
     Condividi
    </button>
</div>
</dialog>`
  };
})();
