/* Istante runtime configuration - editable without rebuilding. */
window.ISTANTE_CONFIG = Object.assign({
  calendarApiUrl: 'https://api.istante.ruslan-dzyuba.it/calendar.php',
  // auto | phone | tablet | computer | display
  deviceProfile: 'auto'
}, window.ISTANTE_CONFIG || {});
