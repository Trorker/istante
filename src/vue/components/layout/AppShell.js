/* Istante v4 · Vue component: AppShell */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.AppShell = {
    name: 'AppShell',
    template: `<div class="app-shell" id="app-shell" inert>
  <app-topbar></app-topbar>
  <div class="stage-viewport">
    <home-main-stage></home-main-stage>
    <home-info-dock></home-info-dock>
    <bottom-toolbar></bottom-toolbar>
  </div>
</div>`
  };
})();
