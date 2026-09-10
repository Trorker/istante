/* Istante v4 · Vue component: TimerDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.TimerDialog = {
    name: 'TimerDialog',
    template: `<dialog aria-labelledby="timer-title" class="panel timer-panel" id="timer-dialog">
<div class="panel-head">
<div>
<p class="section-label">
      Prenditi un momento
     </p>
<h2 id="timer-title">
      Il tuo tempo.
     </h2><p class="timer-modal-now"><span>Adesso</span><strong id="timer-modal-clock">--:--</strong></p>
</div>
<button aria-label="Chiudi timer" class="icon-button close-button" data-close="" type="button">
<span class="icon" data-icon="close">
</span>
</button>
</div>
<div class="timer-content">
<div class="timer-time-stage"><div class="timer-duration" id="timer-duration">
<div class="timer-range-picker timer-dial-picker">
<span class="section-label">Quanto tempo vuoi tenerti?</span>
<div class="timer-dial-shell"><button aria-label="Riduci di un minuto" class="timer-step-button timer-step-side timer-step-side-left" id="timer-duration-decrease" type="button"><span class="icon" data-icon="minus"></span></button><div aria-label="Scegli la durata ruotando come un orologio" aria-valuemax="60" aria-valuemin="1" aria-valuenow="25" class="timer-duration-dial" id="timer-duration-dial" role="slider" tabindex="0"><div class="timer-dial-face"><span class="timer-dial-mark" data-minute="5">5</span><span class="timer-dial-mark" data-minute="10">10</span><span class="timer-dial-mark" data-minute="15">15</span><span class="timer-dial-mark" data-minute="20">20</span><span class="timer-dial-mark" data-minute="25">25</span><span class="timer-dial-mark" data-minute="30">30</span><span class="timer-dial-mark" data-minute="35">35</span><span class="timer-dial-mark" data-minute="40">40</span><span class="timer-dial-mark" data-minute="45">45</span><span class="timer-dial-mark" data-minute="50">50</span><span class="timer-dial-mark" data-minute="55">55</span><span class="timer-dial-mark" data-minute="60">60</span><i aria-hidden="true" class="timer-dial-pointer" id="timer-dial-pointer"></i><output id="timer-duration-display">25 minuti</output></div></div><button aria-label="Aumenta di un minuto" class="timer-step-button timer-step-side timer-step-side-right" id="timer-duration-increase" type="button"><span class="icon" data-icon="plus"></span></button></div>
<input aria-hidden="true" id="timer-duration-range" max="120" min="1" step="1" tabindex="-1" type="range" value="25"/>
</div>
<div aria-hidden="true" class="visually-hidden timer-duration-internals">
<input id="timer-hours" inputmode="numeric" max="24" min="0" step="1" tabindex="-1" type="number" value="0"/>
<input id="timer-minutes" inputmode="numeric" max="59" min="0" step="1" tabindex="-1" type="number" value="25"/>
<input id="timer-seconds" inputmode="numeric" max="59" min="0" step="1" tabindex="-1" type="number" value="0"/>
</div>
</div><div class="timer-running" hidden="" id="timer-running">
<span class="section-label" id="timer-state-label">Il tuo momento, in corso</span>
<div aria-label="Tempo rimanente e avanzamento" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" class="timer-orbit" id="timer-orbit" role="progressbar"><strong id="timer-readout">25:00</strong></div>
</div></div>
<div class="timer-session-options" id="timer-session-options"><div class="timer-sound-choice" id="timer-radio-choice"><span class="visually-hidden timer-choice-label">Durante il timer</span><div aria-label="Audio durante questa pausa" class="timer-sound-segments" role="group"><button aria-pressed="true" data-istante-tooltip="Avvia soltanto il timer, senza accendere altre sorgenti." data-timer-during="silent" type="button"><span class="icon" data-icon="silence"></span>Silenzio</button><button aria-pressed="false" data-timer-during="radio" type="button"><span class="icon" data-icon="headphones"></span>Radio</button><button aria-pressed="false" data-timer-during="ambient" type="button"><span class="icon" data-icon="wind"></span>Suono relax</button></div><p aria-live="polite" class="visually-hidden timer-source-description" id="timer-source-description">Solo il tempo, senza avviare un audio.</p></div>
<div class="visually-hidden timer-preference-summary"><p class="timer-finish-description" id="timer-finish-description"></p></div></div>
<div aria-live="polite" class="visually-hidden timer-notice"><p class="field-note" hidden="" id="timer-audio-hint"></p><p class="form-error" hidden="" id="timer-error" role="alert">
</p><p class="timer-result" hidden="" id="timer-result" role="status">
</p><button class="text-button" hidden="" id="timer-retry-audio" type="button">
<span class="icon" data-icon="play">
</span>
     Riproduci avviso
    </button></div></div>
<div class="panel-footer timer-actions">
<button class="text-button" hidden="" id="timer-reset" type="button">
     Annulla timer
    </button>
<button class="primary-button" id="timer-start" type="button">
<span class="icon" data-icon="play">
</span>
<span>
      Inizia il tuo momento
     </span>
</button>
</div>
</dialog>`
  };
})();
