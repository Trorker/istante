const fallback = {
  calendarProxy: 'https://api.istante.ruslan-dzyuba.it/calendar.php',
  calendarSyncMinutes: 30,
  deviceProfile: 'auto' as const,
  weatherProvider: 'open-meteo',
  projectUrl: 'https://istante.ruslan-dzyuba.it',
  debug: false,
}
export const runtime = { ...fallback, ...(window.ISTANTE_CONFIG ?? {}) }
