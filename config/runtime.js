/* Istante runtime configuration.
 * For GitHub Pages + external PHP API, replace calendarApiUrl with the full HTTPS endpoint.
 * Example: https://api.istante.ruslan-dzyuba.it/calendar.php
 */
window.ISTANTE_CONFIG = Object.assign({
  calendarApiUrl: 'api/calendar.php'
}, window.ISTANTE_CONFIG || {});
