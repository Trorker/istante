/* Istante v4 · Vue component: StationsDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.StationsDialog = {
    name: 'StationsDialog',
    template: `<dialog aria-labelledby="stations-title" class="panel station-manager-panel" id="stations-dialog">
<div class="panel-head">
<div>
<p class="section-label">
      La tua colonna sonora
     </p>
<h2 id="stations-title">
      Le tue stazioni.
     </h2>
</div>
<button aria-label="Chiudi gestione stazioni" class="icon-button close-button" data-close="" type="button">
<span class="icon" data-icon="close">
</span>
</button>
</div>
<div class="panel-content">
<p class="field-note">
     Aggiungi, elimina e salva le tue stazioni preferite.
    </p>
<details class="station-add-details" id="station-add-details">
<summary>
<span class="icon" data-icon="plus">
</span>
      Aggiungi una stazione
     </summary>
<form id="station-add-form" novalidate="">
<label class="stacked-label">
       Nome
       <input autocomplete="off" maxlength="90" name="stationName" placeholder="La mia radio" required="" type="text"/>
</label>
<label class="stacked-label">
       Indirizzo del flusso audio HTTPS
       <input autocomplete="off" name="stationUrl" placeholder="https://.../stream" required="" spellcheck="false" type="url"/>
</label>
<label class="stacked-label">
       Sito della stazione · facoltativo
       <input autocomplete="off" name="stationPage" placeholder="https://..." spellcheck="false" type="url"/>
</label>
<p class="field-note">
       Serve un flusso audio diretto compatibile con il browser.
      </p>
<p class="form-error" hidden="" id="station-add-error" role="alert">
</p>
<button class="primary-button" type="submit">
       Aggiungi al catalogo
      </button>
</form>
</details>
<div class="station-list-tools">
<label class="search-field station-search-field">
<span class="icon" data-icon="search">
</span>
<input aria-label="Cerca stazioni" autocomplete="off" class="select-search" id="station-manager-search" placeholder="Cerca una stazione..." type="search"/>
</label>
<button aria-label="Mostra solo le stazioni preferite" aria-pressed="false" class="icon-button favorite-search-button" data-istante-tooltip="Mostra soltanto le stazioni preferite" id="station-filter" type="button"><span class="icon" data-icon="heart"></span></button>
</div>
<p class="local-note" id="station-manager-count">
</p>
<div id="station-manager-list">
</div>
<p class="field-note" hidden="" id="station-manager-empty">
     Nessuna stazione in questa vista.
    </p>
<div class="station-management-actions">
<button class="text-button" hidden="" id="station-undo" type="button">
      Annulla eliminazione
     </button>
<button class="text-button" hidden="" id="station-restore" type="button">
      Ripristina stazioni del catalogo
     </button>
</div>
</div>
<div class="panel-footer">
<p class="local-note">
     I preferiti della radio sono separati da quelli delle frasi.
    </p>
<button class="primary-button" data-close="" type="button">
     Fatto
    </button>
</div>
</dialog>`
  };
})();
