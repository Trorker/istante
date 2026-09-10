/* Istante v4 · Vue component: AppBackdrop */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.AppBackdrop = {
    name: 'AppBackdrop',
    template: `<div aria-hidden="true" class="backdrop">
<div class="wallpaper" id="wallpaper">
</div>
<div class="wallpaper wallpaper-next" id="wallpaper-next">
</div>
<div class="ambient">
</div>
<div class="breathing-light">
</div>
<div class="celestial-transition" id="celestial-transition">
<span class="transition-horizon">
</span>
</div>
<div class="photo-shade">
</div>
<div class="ambient-fx" hidden="" id="ambient-fx">
<div class="fx-halos">
<i>
</i>
<i>
</i>
<i>
</i>
</div>
<div class="fx-aurora">
</div>
<div class="fx-weather-light">
</div>
<div class="fx-clouds">
</div>
<canvas class="fx-canvas" id="fx-canvas">
</canvas>
</div>
<div aria-hidden="true" class="celestial-sky" id="celestial-sky"><canvas id="sky-stars"></canvas><div class="sky-halo"></div><svg aria-hidden="true" id="sky-body" viewbox="0 0 160 160"><defs><radialgradient cx="38%" cy="32%" id="sky-sun-gradient" r="68%"><stop offset="0" stop-color="#fff9dc"></stop><stop offset=".56" stop-color="#f4d381"></stop><stop offset="1" stop-color="#dfa95f"></stop></radialgradient><radialgradient cx="36%" cy="30%" id="sky-moon-gradient" r="72%"><stop id="sky-moon-stop-a" offset="0" stop-color="#f3f0df"></stop><stop id="sky-moon-stop-b" offset=".62" stop-color="#c8c7bd"></stop><stop id="sky-moon-stop-c" offset="1" stop-color="#8f9497"></stop></radialgradient><filter height="180%" id="sky-orb-svg-glow" width="180%" x="-40%" y="-40%"><fegaussianblur result="blur" stddeviation="5"></fegaussianblur><femerge><femergenode in="blur"></femergenode><femergenode in="SourceGraphic"></femergenode></femerge></filter><clippath id="sky-moon-light-clip"><path id="sky-moon-light-path"></path></clippath></defs><g id="sky-sun-art"><g class="sky-sun-rays" stroke="#f2cf87" stroke-linecap="round" stroke-width="2.2"><line x1="80" x2="80" y1="13" y2="2"></line><line x1="80" x2="80" y1="147" y2="158"></line><line x1="13" x2="2" y1="80" y2="80"></line><line x1="147" x2="158" y1="80" y2="80"></line><line x1="33" x2="25" y1="33" y2="25"></line><line x1="127" x2="135" y1="127" y2="135"></line><line x1="127" x2="135" y1="33" y2="25"></line><line x1="33" x2="25" y1="127" y2="135"></line></g><circle cx="80" cy="80" fill="url(#sky-sun-gradient)" filter="url(#sky-orb-svg-glow)" r="49"></circle></g><g id="sky-moon-art"><circle class="sky-moon-halo" cx="80" cy="80" r="58"></circle><circle class="sky-moon-dark" cx="80" cy="80" r="49"></circle><g class="sky-moon-shadow-detail"><ellipse cx="62" cy="66" rx="8" ry="6"></ellipse><ellipse cx="99" cy="75" rx="5" ry="7"></ellipse><ellipse cx="76" cy="101" rx="6" ry="4"></ellipse><path d="M48 87 C57 81 62 84 67 92 C61 98 53 99 47 94 Z"></path><path d="M88 49 C94 45 103 48 108 54 C102 60 95 60 89 56 Z"></path></g><g clip-path="url(#sky-moon-light-clip)" id="sky-moon-light"><circle cx="80" cy="80" fill="url(#sky-moon-gradient)" filter="url(#sky-orb-svg-glow)" r="49"></circle><circle class="sky-moon-crater crater-a" cx="64" cy="68" r="7"></circle><circle class="sky-moon-crater crater-b" cx="91" cy="80" r="5"></circle><circle class="sky-moon-crater crater-c" cx="76" cy="101" r="4"></circle><circle class="sky-moon-crater crater-d" cx="101" cy="99" r="3"></circle></g><circle class="sky-moon-edge" cx="80" cy="80" fill="none" r="49"></circle></g></svg><canvas aria-hidden="true" height="160" hidden="" id="sky-body-snapshot" width="160"></canvas></div></div>`
  };
})();
