# Changelog

## [4.0.0-alpha.1] - 2026-09-12

Prima alpha testabile della riscrittura Vue.

### Added
- Riscrittura completa in Vue 3 + TypeScript + Vite.
- Quattro esperienze responsive indipendenti: phone, tablet, desktop, display.
- Pinia per stato applicativo.
- IndexedDB schema 4.
- Dashboard, 1.000 pensieri con ricerca e preferiti, radio con programmazione, timer preciso, calendario ICS, meteo opzionale, astronomia locale, condivisione, impostazioni e backup.
- Runtime config esterna e PWA.
- Fallback ICS diretto → proxy.

### Changed
- La vista Settimana del calendario non è disponibile sui telefoni nella 4.0.0-alpha.1.
- Calendari nel backup come link ICS, mai come copia del file.

### Removed
- Vecchia manipolazione DOM, ID legacy, patch CSS progressive e architettura JavaScript 3.x.
