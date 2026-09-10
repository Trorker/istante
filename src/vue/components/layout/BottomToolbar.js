/* Istante v4 · Vue component: BottomToolbar */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.BottomToolbar = {
    name: 'BottomToolbar',
    template: `<footer class="bottom-bar chrome">
<nav aria-label="Comandi screensaver" class="toolbar">
<div class="toolbar-cluster">
<div aria-label="Frasi" class="toolbar-group toolbar-group-left" role="group">
<button aria-label="Apri la biblioteca delle frasi" class="icon-button collection-link" data-istante-tooltip="La tua biblioteca" data-open="library" type="button"><span class="icon" data-icon="collection"></span></button>
<button aria-label="Un altro pensiero" class="icon-button" data-istante-tooltip="Un altro pensiero (N)" id="next-phrase" type="button"><span class="icon" data-icon="shuffle"></span></button>
<button aria-label="Aggiungi ai preferiti" aria-pressed="false" class="icon-button" data-istante-tooltip="Aggiungi ai preferiti" id="favorite-current" type="button"><span class="icon" data-icon="heart"></span></button>
</div>
<div aria-label="Tempo" class="toolbar-group toolbar-group-center" role="group">
<button aria-label="Apri timer" class="icon-button" data-istante-tooltip="Un tempo per te (T)" id="timer-open" type="button"><span class="icon" data-icon="clock"></span></button>
<button aria-label="Apri il calendario" class="icon-button" data-istante-tooltip="Il tuo calendario" id="calendar-open" type="button"><span class="icon" data-icon="calendar"></span></button>
</div>
<div aria-label="Schermo e impostazioni" class="toolbar-group toolbar-group-right" role="group">
<button aria-label="Condividi il tuo istante" class="icon-button" data-istante-tooltip="Condividi il tuo istante" id="share-open" type="button"><span class="icon" data-icon="share"></span></button>
<button aria-label="Schermo intero" class="icon-button" data-istante-tooltip="Schermo intero (F)" id="fullscreen" type="button"><span class="icon" data-icon="expand"></span></button>
<button aria-label="Impostazioni" class="icon-button" data-istante-tooltip="Impostazioni (S)" data-open="settings" id="settings-open" type="button"><span class="icon" data-icon="settings"></span><span class="update-badge" hidden="" id="update-badge">Nuova versione</span></button>
</div>
</div>
</nav>
</footer>`
  };
})();
