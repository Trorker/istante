# Calendari ICS

La sorgente viene conservata come URL HTTPS. Il frontend tenta prima il fetch diretto e, in caso di CORS/rete, usa `calendarProxy` da `public/config/runtime.js` via POST JSON `{ "url": "..." }`.

Il parser 4.0.0 gestisce VEVENT di base, date/ora, all-day, location e description. Le ricorrenze avanzate sono il primo elemento da estendere nel ciclo 4.x.
