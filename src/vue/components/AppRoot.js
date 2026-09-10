/* Istante v4 · Vue component: AppRoot */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.AppRoot = {
    name: 'AppRoot',
    template: `<app-backdrop></app-backdrop>
<div aria-hidden="true" class="paper-grain"></div>
<app-shell></app-shell>
<calendar-view></calendar-view>
<settings-dialog></settings-dialog>
<timer-dialog></timer-dialog>
<weather-dialog></weather-dialog>
<goal-dialog></goal-dialog>
<library-dialog></library-dialog>
<collection-create-dialog></collection-create-dialog>
<collection-edit-dialog></collection-edit-dialog>
<toast-host></toast-host>
<stations-dialog></stations-dialog>
<share-dialog></share-dialog>
<welcome-dialog></welcome-dialog>
<tour-dialog></tour-dialog>
<backup-dialog></backup-dialog>
<received-dialog></received-dialog>
<calendar-sources-dialog></calendar-sources-dialog>
<calendar-event-dialog></calendar-event-dialog>
<view-dots></view-dots>`
  };
})();
