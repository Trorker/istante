/* Istante v4 · Vue component: LibraryDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.LibraryDialog = {
    name: 'LibraryDialog',
    template: `<dialog aria-labelledby="library-title" class="panel library-panel" id="library-dialog">
<div class="panel-head">
<div>
<p class="section-label">
      Parole da tenere con te
     </p>
<h2 id="library-title">La tua biblioteca.</h2>
<p class="library-subtitle" id="library-subtitle">
      1000 piccoli promemoria.
     </p>
</div>
<button aria-label="Chiudi raccolta" class="icon-button close-button" data-close="" type="button">
<span class="icon" data-icon="close">
</span>
</button>
</div>
<div class="library-tools"><button hidden="" id="library-phrases-tab" type="button">Frasi</button><div class="phrase-library-tools" id="phrase-library-tools"><div class="library-current"><span class="icon" data-icon="collection"></span><span class="library-current-copy"><small>Raccolta attiva</small><strong id="collection-active-name">Pensieri di Istante</strong></span></div>
<div class="library-search-row"><label class="search-field">
<span class="icon" data-icon="search">
</span>
<input aria-label="Cerca nelle frasi" autocomplete="off" id="phrase-search" placeholder="Cerca una parola, un pensiero..." type="search"/>
</label><div class="library-search-actions"><button aria-controls="collection-library-inline" aria-expanded="false" aria-pressed="false" class="secondary-button library-collections-button" id="collection-library-toggle" type="button"><span class="icon" data-icon="collection"></span><span>Vedi raccolte</span></button></div></div>
<div class="library-tabs">
<div aria-label="Filtro raccolta" role="group">
<button aria-pressed="true" class="tab-button active" id="filter-all" type="button">
       Tutte
       <span id="all-count">
        1000
       </span>
</button>
<button aria-pressed="false" class="tab-button" id="filter-favorites" type="button">
<span class="icon" data-icon="heart">
</span>
       Preferite
       <span id="favorites-count">
        0
       </span>
</button>
</div>
</div>
</div></div><section class="collection-library-inline" hidden="" id="collection-library-inline"><div class="collection-library-inline-head library-collections-intro"><div><p class="section-label">Le raccolte</p><h3>Tutte le tue parole, in un posto solo.</h3></div></div><div class="collection-library-toolbar"><label class="search-field"><span class="icon" data-icon="search"></span><input aria-label="Cerca nelle raccolte" autocomplete="off" id="collection-search" placeholder="Cerca titolo, categoria o descrizione" type="search"/></label><div aria-label="Filtra raccolte per stato" class="collection-status-filters" role="group"><button aria-pressed="true" data-collection-status="all" type="button">Tutte</button><button aria-pressed="false" data-collection-status="active" type="button">In uso</button><button aria-pressed="false" data-collection-status="installed" type="button">Scaricate</button><button aria-pressed="false" data-collection-status="available" type="button">Da scaricare</button></div></div><div class="panel-content"><p class="field-note" id="collection-library-note">Ogni card mostra subito se una raccolta è in uso, già sul dispositivo o ancora da scaricare.</p><div class="collection-library-grid" id="collection-shelf"></div><p hidden="" id="collection-library-empty">Nessuna raccolta con questo stato.</p></div><div class="panel-footer collection-library-footer"><div class="collection-library-file-actions"><label class="text-button file-button collection-import-link">Importa JSON o TXT<input accept=".json,.txt,application/json,text/plain" hidden="" id="collection-import-file" type="file"/></label><button class="text-button collection-create-button" id="collection-create-open" type="button"><span class="icon" data-icon="plus"></span>Crea raccolta</button></div><button class="primary-button collection-return-button" id="collection-library-done" type="button"><span class="icon" data-icon="arrow"></span>Torna alle frasi</button></div></section>
<div class="library-list-wrap">
<div class="phrase-list" id="phrase-list">
</div>
<p class="empty-state" hidden="" id="library-empty">
     Nessuna frase trovata.
    </p>
<button class="secondary-button more-button" id="load-more" type="button">
     Mostra altre frasi
     <span class="icon" data-icon="chevron">
</span>
</button>
</div>
<div class="library-footer">
<label class="text-button file-button">
<span class="icon" data-icon="upload">
</span>
     Importa JSON o TXT
     <input accept="application/json,text/plain,.json,.txt" id="import-phrases" type="file"/>
</label>
<button class="text-button" id="export-phrases" type="button">
<span class="icon" data-icon="download">
</span>
     Esporta
    </button>
<button class="text-button restore-button" hidden="" id="restore-phrases" type="button">
     Raccolta originale
    </button>
<span class="local-note">
     Solo sul tuo dispositivo
    </span>
</div>
</dialog>`
  };
})();
