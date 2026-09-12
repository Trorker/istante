# Changelog

## [4.0.0-alpha.2] - 2026-09-12

Alpha di riallineamento grafico alla 3.14.1.

### Changed
- Dashboard riportata alla composizione visiva della 3.14.1: brand, mini-player, orologio, pensiero, fascia informazioni, traguardo e toolbar.
- Ripristinati i token colore esatti Carta/Notte della 3.14.1 e i font self-hosted Istante Classic/Excalifont.
- Impostazioni riportate a **A modo tuo / Il tuo istante.** con le 12 sezioni e i relativi microtesti originali.
- Calendario riportato a **Il tempo che scegli / Il tuo calendario. / Un po’ di ordine. Senza fretta.**.
- Biblioteca riportata a **Parole da tenere con te / La tua biblioteca. / 1000 piccoli promemoria.**.
- Player e Timer riallineati a testi, spaziature e gerarchie della 3.14.1.
- Responsive rifatto per adattare composizione e interazione senza cambiare identità grafica.

### Fixed
- Vista **Settimana** esclusa dai telefoni anche nella nuova UI Vue.
- Spazio della programmazione radio separato dal link della stazione.
- Label sopra il quadrante Timer sempre visibile nella composizione tablet.

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
