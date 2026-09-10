/* Istante v4 · Vue component: CalendarEventDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.CalendarEventDialog = {
    name: 'CalendarEventDialog',
    template: `<dialog aria-labelledby="cal-event-title" class="panel calendar-event-panel" id="cal-event-dialog"><div class="panel-head"><div><p class="section-label" id="cal-event-source"></p><h2 id="cal-event-title"></h2></div><button aria-label="Chiudi evento" class="icon-button close-button" data-cal-close="" type="button"><span class="icon" data-icon="close"></span></button></div><div class="panel-content"><p id="cal-event-date"></p><p id="cal-event-place"></p><div id="cal-event-description"></div><a class="secondary-button" hidden="" id="cal-event-link" rel="noopener noreferrer" target="_blank">Apri il link dell'evento<span class="icon" data-icon="link"></span></a></div></dialog>`
  };
})();
