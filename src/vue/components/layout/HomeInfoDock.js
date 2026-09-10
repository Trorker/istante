/* Istante v4 · Vue component: HomeInfoDock */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.HomeInfoDock = {
    name: 'HomeInfoDock',
    template: `<section aria-label="Informazioni del tuo istante" class="dashboard-lower chrome">
<div class="timer-slot">
<section aria-label="Timer in corso" class="timer-chip" hidden="" id="timer-chip">
<button class="timer-chip-main" id="timer-chip-open" type="button">
<span class="icon" data-icon="clock"></span>
<span id="timer-chip-label">Un tempo per te</span>
<strong id="timer-chip-time">25:00</strong>
</button>
<button aria-label="Metti in pausa il timer" class="icon-button" id="timer-chip-toggle" type="button"><span class="icon" data-icon="pause"></span></button>
<button aria-label="Elimina timer" class="icon-button timer-chip-delete" data-istante-tooltip="Elimina timer" id="timer-chip-delete" type="button"><span class="icon" data-icon="trash"></span></button>
<button aria-label="Chiudi avviso del timer" class="icon-button" hidden="" id="timer-chip-dismiss" type="button"><span class="icon" data-icon="close"></span></button>
</section>
</div>
<div class="active-info-strip" id="active-info-strip">
<section aria-haspopup="dialog" aria-label="Apri dettagli meteo e luce del giorno" class="environment-line" hidden="" id="environment-line" role="button" tabindex="0">
<div class="weather-line" hidden="" id="weather-line">
<span class="icon" id="weather-icon"></span>
<span id="weather-text"></span>
<span id="weather-condition"></span>
<span id="weather-place"></span>
<small id="weather-age"></small>
</div>
<div aria-label="Alba e tramonto della localita" class="solar-line" hidden="" id="solar-line">
<div class="solar-time"><span class="icon" data-icon="sunrise"></span><span class="solar-label">Alba</span><time id="sunrise-time">--:--</time></div>
<div aria-hidden="true" class="solar-path"><svg viewbox="0 0 180 40"><path class="solar-base" d="M8 33H172"></path><path class="solar-arc" d="M8 33 Q90 -17 172 33"></path><g id="solar-marker"><circle class="solar-halo" r="8"></circle><circle r="2.8"></circle></g></svg></div>
<div class="solar-time"><span class="icon" data-icon="sunset"></span><span class="solar-label">Tramonto</span><time id="sunset-time">--:--</time></div>
<span class="solar-note" id="solar-note"></span>
</div>
<p class="moon-caption" hidden="" id="moon-caption"><canvas aria-hidden="true" class="moon-phase-mini" height="64" id="moon-phase-mini" width="64"></canvas><span class="moon-phase-name"></span><span class="moon-phase-percent"></span></p>
</section>
<section aria-haspopup="dialog" aria-label="Apri il prossimo capitolo" class="goal-strip" id="goal-strip" role="button" tabindex="0">
<div class="goal-heading">
<span class="section-label" id="goal-label">Il prossimo capitolo</span>
<h2 id="goal-title">Il tuo traguardo</h2>
</div>
<div class="countdown" id="countdown">
<div><strong id="goal-days">00</strong><span id="goal-unit1">giorni</span></div>
<span class="count-separator">/</span>
<div><strong id="goal-hours">00</strong><span id="goal-unit2">ore</span></div>
<span class="count-separator">/</span>
<div><strong id="goal-minutes">00</strong><span id="goal-unit3">minuti</span></div>
</div>
<div class="goal-progress">
<div class="progress-labels"><span id="progress-label">Il percorso di quest'anno</span><span id="progress-value">0%</span></div>
<div aria-label="Avanzamento del traguardo" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" class="progress-track" id="goal-progress" role="progressbar"><div id="progress-fill"></div></div>
<p class="goal-date" id="goal-date"></p>
</div>
</section>
<button aria-label="Apri il prossimo impegno" class="upcoming-event" hidden="" id="upcoming-event" type="button">
<span class="icon" data-icon="calendar"></span>
<span class="upcoming-copy"><small id="upcoming-label">Il prossimo impegno</small><span id="upcoming-title"></span></span>
<time id="upcoming-time"></time>
<span class="icon upcoming-arrow" data-icon="arrow"></span>
</button>
</div>
<section aria-label="Riepilogo dello screensaver" class="idle-summary-strip" id="idle-summary-strip">
<div aria-haspopup="dialog" aria-label="Apri dettagli meteo e luce del giorno" class="idle-weather-summary" role="button" tabindex="0">
<div class="idle-weather-primary"><span class="icon" id="idle-weather-icon"></span><strong id="idle-weather-text">--°</strong><span id="idle-weather-condition">Meteo</span></div>
<div class="idle-solar-summary" id="idle-solar-summary"><span class="idle-solar-time"><span class="icon" data-icon="sunrise"></span><time id="idle-sunrise-time">--:--</time></span><span aria-hidden="true" class="idle-solar-dot">·</span><span class="idle-solar-time"><span class="icon" data-icon="sunset"></span><time id="idle-sunset-time">--:--</time></span></div>
</div>
<div aria-haspopup="dialog" aria-label="Apri il prossimo capitolo" class="idle-goal-summary" id="idle-goal-summary" role="button" tabindex="0">
<div class="idle-goal-heading"><span id="idle-goal-label">Il prossimo capitolo</span><strong id="idle-goal-progress-value">0%</strong></div>
<div class="idle-goal-title" id="idle-goal-title">Il tuo traguardo</div>
<div aria-label="Avanzamento sintetico del traguardo" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" class="idle-progress-track" id="idle-goal-progress" role="progressbar"><span id="idle-goal-progress-fill"></span></div>
<div class="idle-goal-countdown" id="idle-goal-countdown"><span><strong id="idle-goal-days">00</strong> giorni</span><span><strong id="idle-goal-hours">00</strong> ore</span><span><strong id="idle-goal-minutes">00</strong> min</span></div>
</div>
<button aria-label="Apri il prossimo evento" class="idle-upcoming-event" id="idle-upcoming-event" type="button">
<span class="icon" data-icon="calendar"></span>
<span class="idle-upcoming-copy"><small id="idle-upcoming-label">Prossimo evento</small><span id="idle-upcoming-title">Nessun impegno in vista</span></span>
<time id="idle-upcoming-time"></time>
</button>
</section>
</section>`
  };
})();
