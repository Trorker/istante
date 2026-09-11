/* Recurrences are expanded away from the UI, with bounds and a caller timeout. */
importScripts('calendar-core.js?v=3.13.15');
self.onmessage=function(e){const {id,sources,from,to}=e.data;try{self.postMessage({id,...self.IstanteCalendarCore.expand(sources,from,to)});}catch(error){self.postMessage({id,error:error.message});}};
