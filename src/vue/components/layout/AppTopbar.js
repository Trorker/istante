/* Istante v4 · Vue component: AppTopbar */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.AppTopbar = {
    name: 'AppTopbar',
    template: `<header class="topbar chrome">
<div class="brand-lockup">
<a aria-label="Istante, pagina iniziale" class="wordmark brand-home-link" href="index.html">
<img alt="" aria-hidden="true" class="brand-logo-image" height="32" src="assets/icons/icon.svg" width="32"/>
<span class="brand-home-copy"><span class="brand-home-name">istante<span class="brand-point">.</span></span><span class="brand-home-tagline">Un momento, per te.</span></span>
</a>
</div>
<section aria-label="Radio lo-fi" class="radio-mini" id="radio-mini">
<button aria-label="Ascolta la radio" aria-pressed="false" class="radio-play" id="radio-play" type="button">
<span class="icon" data-icon="play">
</span>
</button>
<button aria-controls="radio-panel" aria-expanded="false" class="radio-disclosure" id="radio-disclosure" type="button">
<span class="radio-kicker"><span id="audio-source-label">Lo-fi radio</span><span aria-hidden="true" class="radio-eq">
<i>
</i>
<i>
</i>
<i>
</i>
</span>
</span>
<span id="radio-status">
       ChillHop · FluxFM
      </span>
</button>
<button aria-controls="radio-panel" aria-expanded="false" aria-label="Apri controlli radio" class="icon-button radio-expand" id="radio-expand" type="button">
<span class="icon" data-icon="chevron">
</span>
</button>
<div aria-label="Controlli radio" class="radio-panel" hidden="" id="radio-panel" role="region">
<div class="radio-panel-head">
<span class="icon" data-icon="headphones">
</span>
<div>
<h2>La tua colonna sonora.</h2>
</div>
<button aria-label="Chiudi controlli radio" class="icon-button" id="radio-close" type="button">
<span class="icon" data-icon="close">
</span>
</button>
</div><div aria-label="Sorgente audio" class="audio-source-switch" role="group"><button aria-pressed="true" id="audio-source-radio" type="button"><span class="icon" data-icon="headphones"></span>Radio</button><button aria-pressed="false" id="audio-source-ambient" type="button"><span class="icon" data-icon="wind"></span>Ambiente</button></div><div id="radio-controls">
<label class="stacked-label">
       Stazione
       <select data-search="true" id="radio-station">
<option value="lofigirl">
         01  Lofi Girl (Community Relay)
        </option>
<option value="laut-lofi">
         02  Laut.FM | Lofi 24/7
        </option>
<option value="zeno-study">
         03  Zeno FM | Study Lofi
        </option>
<option value="zeno-chill">
         04  Zeno FM | Chill Beats
        </option>
<option value="zeno-hiphop">
         05  Zeno FM | Lofi Hip Hop
        </option>
<option value="zeno-box">
         06  Zeno FM | Box Lofi
        </option>
<option value="zeno-bootleg">
         07  Zeno FM | The Bootleg Boy
        </option>
<option value="fastcast-lofi">
         08  Fastcast4u | Chill Lofi
        </option>
<option value="chillhop">
         09  FluxFM | Chillhop
        </option>
<option value="chillsynth">
         10  Nightride FM | Chillsynth
        </option>
<option value="secretagent">
         11  SomaFM | Secret Agent
        </option>
<option value="deepspaceone">
         12  SomaFM | Deep Space One (Deep Ambient)
        </option>
<option value="groovesalad">
         13  SomaFM | Groove Salad
        </option>
<option value="dronezone">
         14  SomaFM | Drone Zone
        </option>
<option value="defcon">
         15  SomaFM | DEF CON Radio
        </option>
<option value="spacestation">
         16  SomaFM | Space Station
        </option>
<option value="vaporwaves">
         17  SomaFM | Vaporwaves
        </option>
<option value="synphaera">
         18  SomaFM | Synphaera
        </option>
<option value="intense">
         19  Intense Radio | FLAC / OGG
        </option>
<option value="pinkfloyd">
         20  Exclusively Pink Floyd
        </option>
<option value="pinkfloyd-hits">
         21  Exclusively Pink Floyd | Hits
        </option>
<option value="paradise-mellow">
         22  Radio Paradise | Mellow Mix (FLAC Lossless)
        </option>
</select>
</label>
<div class="radio-actions">
<button class="text-button" id="radio-random" type="button">
<span class="icon" data-icon="shuffle">
</span>
        Sorprendimi
       </button>
<button aria-label="Aggiungi stazione ai preferiti" aria-pressed="false" class="icon-button" id="radio-favorite" type="button">
<span class="icon" data-icon="heart">
</span>
</button>
<button aria-label="Gestisci stazioni" class="icon-button" data-open="stations" type="button">
<span class="icon" data-icon="collection">
</span>
</button>
</div>
<div class="radio-volume">
<button aria-label="Disattiva audio" aria-pressed="false" class="icon-button" id="radio-mute" type="button">
<span class="icon" data-icon="volume">
</span>
</button>
<input aria-label="Volume radio" id="radio-volume" max="100" min="0" step="1" type="range"/>
<output id="radio-volume-value">
        45%
       </output>
</div>
<p class="field-note" hidden="" id="radio-detail" role="status"></p>
<div class="radio-source">
<a href="https://www.fluxfm.de/channels/e3d6cb48-55bb-41c5-ab72-9def83aa3ca8" id="radio-source" rel="noopener noreferrer" target="_blank">
        Sito della stazione
        <span class="icon" data-icon="open">
</span>
</a>
<span id="radio-provider">
        Live · FluxFM
       </span>
</div>
<div class="radio-program-info" hidden="" id="radio-program-info">
<span class="icon" data-icon="clock">
</span>
<span id="radio-program-status">
</span>
<button class="text-button" id="radio-program-enable" type="button">
        Abilita
       </button>
</div>
</div><div hidden="" id="ambient-controls">
<div aria-label="Suono ambientale" class="ambient-options" role="group">
<button aria-pressed="false" data-ambient-type="pink" type="button"><span class="icon" data-icon="effects"></span><strong>Rosa</strong><small>Morbido, uniforme</small></button>
<button aria-pressed="true" data-ambient-type="brown" type="button"><span class="icon" data-icon="moon"></span><strong>Marrone</strong><small>Profondo, avvolgente</small></button>
<button aria-pressed="false" data-ambient-type="rain" type="button"><span class="icon" data-icon="rain"></span><strong>Pioggia</strong><small>Un fruscio leggero</small></button>
<button aria-pressed="false" data-ambient-type="wind" type="button"><span class="icon" data-icon="wind"></span><strong>Vento</strong><small>Un soffio lento</small></button>
</div>
<div class="radio-volume"><button aria-label="Disattiva suono ambientale" aria-pressed="false" class="icon-button" id="ambient-mute" type="button"><span class="icon" data-icon="volume"></span></button><input aria-label="Volume ambiente" id="ambient-volume" max="100" min="0" type="range" value="35"/><output id="ambient-volume-value">35%</output></div>
<p class="field-note" id="ambient-status" role="status">Generato sul dispositivo. Nessun file audio, nessuna connessione.</p>
</div></div>
</section>
</header>`
  };
})();
