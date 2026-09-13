const SYNODIC = 29.53058867;
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);
export function moonPhase(date = new Date()) { const days = (date.getTime() - REFERENCE_NEW_MOON) / 86400000; const fraction = ((days % SYNODIC) + SYNODIC) % SYNODIC / SYNODIC; const names = ['Luna nuova', 'Falce crescente', 'Primo quarto', 'Gibbosa crescente', 'Luna piena', 'Gibbosa calante', 'Ultimo quarto', 'Falce calante']; const index = Math.round(fraction * 8) % 8; return { fraction, name: names[index], illumination: (1 - Math.cos(fraction * Math.PI * 2)) / 2 }; }
export function isNight(date = new Date(), weather = null) { const sunrise = weather?.sunrise ? new Date(weather.sunrise) : null, sunset = weather?.sunset ? new Date(weather.sunset) : null; if (sunrise && sunset && Number.isFinite(+sunrise) && Number.isFinite(+sunset))
    return date < sunrise || date >= sunset; const h = date.getHours(); return h < 7 || h >= 19; }
export function solarProgress(date = new Date(), weather = null) { const sunrise = weather?.sunrise ? new Date(weather.sunrise) : null, sunset = weather?.sunset ? new Date(weather.sunset) : null; if (!sunrise || !sunset || !Number.isFinite(+sunrise) || !Number.isFinite(+sunset) || sunset <= sunrise)
    return null; return Math.max(0, Math.min(1, (date - sunrise) / (sunset - sunrise))); }
