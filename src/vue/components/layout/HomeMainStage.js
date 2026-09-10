/* Istante v4 · Vue component: HomeMainStage */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.HomeMainStage = {
    name: 'HomeMainStage',
    template: `<div class="stage-main-slot"><main class="main-stage" id="main">
<section aria-label="Orologio e data" class="clock-block">
<p class="moment-greeting" id="moment-greeting">
      Un momento, per te.
     </p>
<p class="date-label" id="date-label">
</p>
<div class="clock-frame"><div class="clock-line" id="clock-line">
<time aria-label="Ora locale" class="clock" id="clock">
       00
       <span class="clock-colon">
        :
       </span>
       00
      </time>
<span class="clock-seconds" hidden="" id="clock-seconds">
       00
      </span>
<span class="clock-period" hidden="" id="clock-period">
</span>
</div><div aria-label="Orologio analogico" class="analog-clock" hidden="" id="analog-clock" role="img"><svg aria-hidden="true" viewbox="0 0 200 200"><circle class="dial-rim" cx="100" cy="100" r="92"></circle><g id="analog-marks"></g><g class="analog-hour"><line x1="100" x2="100" y1="105" y2="54"></line></g><g class="analog-minute"><line x1="100" x2="100" y1="112" y2="31"></line></g><g class="analog-second"><line x1="100" x2="100" y1="116" y2="26"></line></g><circle class="dial-pin" cx="100" cy="100" r="3"></circle></svg><span class="analog-period"></span></div></div>
</section>
<section aria-label="Frase motivazionale" class="thought-block">
<div class="thought-eyebrow">
<span class="tiny-line">
</span>
<h1 id="thought-label">
       Il pensiero della sera
      </h1>
<span class="tiny-line">
</span>
</div>
<figure class="quote-wrap" id="quote-wrap">
<p class="quote-intro" hidden="" id="quote-intro">
</p>
<blockquote id="quote-text">
       Un momento, per te.
      </blockquote>
</figure>
<div class="phrase-meta">
<span aria-hidden="true" class="status-dot">
</span>
<span id="phrase-meta">
       Caricamento della raccolta
      </span>
<span class="manual-label" hidden="" id="manual-label">
       Scelta da te
      </span>
</div>
</section>
</main></div>`
  };
})();
