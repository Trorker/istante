# Changelog

## 4.0.0 — 2026-09-13

### Fondamenta
- Riscrittura completa in Vue 3.5.13 con componenti ES module.
- Separazione esplicita fra View, Component, Store, Service e Composable.
- Eliminazione dei globali applicativi `window.Istante*`.
- I/O browser confinato nei service; gli store non accedono direttamente a `localStorage`.
- Unica classificazione responsive Phone / Tablet / Desktop / TV.
- Sorgenti separati da `dist/`, che viene rigenerata integralmente a ogni build.
- Runtime Vue e font distribuiti localmente: nessuna CDN necessaria per avviare l'app.

### Quality gate
- Controlli automatici su sintassi JavaScript, import, ownership CSS e manifest PWA.
- `!important` vietato dal gate.
- Breakpoint CSS `min-width` / `max-width` vietati: il responsive passa dal device profile centrale.
- Smoke test di import per tutti i moduli browser.
- Test puri per ICS/ricorrenze, schedule radio, audio procedurale, backup, share link, typing e versioni.

### Dashboard e pensieri
- Conservata l'identità carta/e-ink della 3.14.4.
- Orologio, pensiero, meteo, traguardo, prossimo impegno e mini-player ricostruiti come componenti indipendenti.
- 1.000 pensieri originali mantenuti.
- Preferiti compatibili con il formato testuale della 3.x.
- Storico dei pensieri esposto nella Biblioteca.
- Raccolte personali con creazione, modifica, rimozione, import ed export.
- Link condivisi `#p=` salvabili in `Pensieri ricevuti`.
- Motore typing separato e testabile.

### Calendario
- `YearView`, `MonthView`, `WeekView`, `DayView`, `AgendaView` sono componenti separati.
- Tablet: Anno/Mese/Settimana senza scroll; Giorno/Agenda con scroll.
- WeekView usa sempre sette colonne reali.
- Parser ICS/recurrence migrato come ES module puro.
- Feed HTTPS con tentativo diretto e fallback al proxy `calendar.php`.
- Festività italiane offline.
- Backup dei calendari URL conserva il link e non la copia ICS.

### Audio e timer
- Radio, Ambiente e Melodie condividono un unico dominio di stato.
- Catalogo radio, stazioni personali, preferiti, ordine e programmazioni mantenuti.
- Generatori offline per rumore rosa/marrone, pioggia, vento, Respiro lento 4-4-6, Meditazione, Notturno e Onde lente.
- Il player si riallinea automaticamente quando una sorgente viene disabilitata.
- Timer fino a 24 ore; sorgente durante il timer modificabile anche a sessione avviata.
- Nel quadrante del timer resta soltanto il countdown.

### Backup e migrazione
- Migrazione delle principali preferenze, calendari, raccolte e preferiti dalla 3.14.x.
- Backup v4 portabile con ripristino transazionale.
- Compatibilità di import con i backup 3.x supportati.
- Cache, fotografie e copie temporanee dei feed remoti escluse dal backup portabile.

### Aggiornamenti PWA
- Policy invariata: `Update now` manuale per 72 ore, quindi aggiornamento automatico.
- `version.json`, manifest asset e service worker generati dalla build.
- Installazione best-effort: un asset accessorio non blocca indefinitamente l'update.
- Una cache precedente viene mantenuta temporaneamente come fallback durante il passaggio release.
