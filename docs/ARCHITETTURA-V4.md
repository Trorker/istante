# Istante 4.0 — Architettura tecnica

## 1. Scopo

Istante 4 nasce per eliminare la stratificazione tecnica accumulata nella linea 3.x mantenendo invariata l'identità del prodotto. La 3.14.4 è il riferimento visivo e funzionale; la 4.0 non è una nuova grafica, ma una nuova fondazione.

Gli obiettivi sono: componenti isolati, ownership chiara del CSS, stato prevedibile, servizi testabili, responsive centralizzato, build riproducibile e aggiornamenti PWA resilienti.

## 2. Stack reale della 4.0.0

- Vue 3.5.13, distribuito localmente in `public/assets/vendor/vue.global.prod.js`;
- componenti Vue definiti come ES module browser;
- JavaScript moderno senza globali applicativi;
- CSS nativo con design token e domini separati;
- Node.js per build, validazione, server locale e packaging;
- Service Worker custom generato durante la build;
- test Node per i moduli puri e smoke test di import/architettura.

La build non richiede Vite, npm registry o CDN. Il progetto rimane tuttavia **Vite/SFC-ready**: View, Component, Store, Service e Composable sono già separati e possono essere trasferiti in `.vue` senza cambiare il modello di dominio.

## 3. Regola fondamentale

```text
src/ + public/ -> npm run build -> dist/
```

`dist/` è un artefatto generato e non deve mai essere modificato manualmente.

Una correzione si esegue sempre nei sorgenti, quindi si ricostruisce e si riesegue il gate di qualità.

## 4. Struttura

```text
src/
├── app/
│   ├── App.js
│   ├── device-profile.js
│   ├── version.js
│   └── vue.js
├── views/
│   ├── DashboardView.js
│   └── CalendarView.js
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── calendar/
│   ├── library/
│   ├── radio/
│   ├── settings/
│   ├── timer/
│   └── weather/
├── stores/
├── services/
│   ├── appearance/
│   ├── audio/
│   ├── backup/
│   ├── calendar/
│   ├── share/
│   ├── storage/
│   ├── typing/
│   ├── updates/
│   └── weather/
├── composables/
├── data/
└── styles/

public/
├── assets/
├── data/
└── docs/

scripts/
tests/
dist/
```

## 5. Responsabilità dei livelli

### View

Una View compone grandi aree dell'applicazione. Non deve contenere parser, fetch o persistenza.

### Component

Un Component gestisce una porzione di UI e usa store/composable. Non scrive direttamente `localStorage` e non deve conoscere dettagli di rete.

### Store

Uno Store possiede lo stato reattivo e le azioni del dominio. Può orchestrare service, ma non implementa direttamente storage, fetch o Web Audio.

### Service

Un Service incapsula I/O o logica pura: storage, ICS, meteo, audio, backup, share, update. I service puri sono testabili senza montare Vue.

### Composable

Un Composable contiene comportamento UI riutilizzabile: viewport, gesture, inattività, cursore, interazione calendario, volume.

## 6. Stato e persistenza

Flusso previsto:

```text
UI -> Store -> Service -> Browser API / rete
```

Gli store non accedono direttamente a `localStorage`. Lo storage v4 usa il namespace `istante.v4.*` e mantiene funzioni esplicite di migrazione dalla linea `istante.original1.*`.

Le preferenze mantengono i nomi stabili della 3.14.x dove possibile (`mode`, `interval`, `calendarViewMode`, ecc.) per evitare una seconda tassonomia da mantenere.

## 7. Responsive: una sola sorgente di verità

`src/app/device-profile.js` definisce:

- Phone: fino a 740 px;
- Tablet: 741–1180 px;
- Desktop/Laptop: 1181–1799 px;
- TV: da 1800 px.

`useViewport` applica al root:

```html
<div
  id="app-root"
  data-device="tablet"
  data-orientation="landscape"
  data-height="compact">
```

Le varianti CSS leggono questi attributi. Nei fogli stile è vietato ricreare breakpoint `min-width` / `max-width` indipendenti.

## 8. Ownership CSS

I sette domini vengono concatenati in ordine dalla build:

1. `tokens.css`
2. `reset.css`
3. `primitives.css`
4. `dashboard.css`
5. `calendar.css`
6. `panels.css`
7. `accessibility.css`

Regole:

- niente `!important`;
- il calendario full-screen può essere definito solo in `calendar.css`;
- i componenti condivisi usano primitive e token, non override incrociati;
- le differenze Phone/Tablet/Desktop/TV sono espresse tramite `data-device`.

## 9. Calendario

`CalendarView` orchestra componenti separati:

```text
CalendarView
├── CalendarHeader
└── CalendarViewport
    ├── YearView
    ├── MonthView
    ├── WeekView
    ├── DayView
    └── AgendaView
```

Ogni vista è proprietaria della propria geometria e del proprio overflow.

### Tablet

La policy è esplicita:

```text
YearView    overflow hidden
MonthView   overflow hidden
WeekView    overflow hidden
DayView     overflow auto
AgendaView  overflow auto
```

`YearView` usa 3x4 in portrait e 4x3 in landscape. `MonthView` calcola 4/5/6 righe reali. `WeekView` mantiene sette colonne; gli eventi eccedenti diventano un accesso al Giorno invece di far crescere la pagina.

Il parser ICS è un modulo puro e il calendar-store gestisce sorgenti, sincronizzazione, vista attiva, data e filtri. I feed HTTPS vengono tentati direttamente e, se necessario, tramite il proxy Istante.

## 10. Audio

Radio, Ambiente e Melodie condividono un unico audio-store. Il mini-player, il pannello audio e il timer non mantengono copie separate dello stato.

I generatori procedurali sono service puri: rumore rosa/marrone, pioggia, vento, Respiro lento, Meditazione, Notturno e Onde lente. I buffer vengono creati localmente con Web Audio.

Le programmazioni radio sono una funzione pura testata anche sulle fasce che attraversano la mezzanotte.

## 11. Pensieri

Il phrase-store possiede:

- raccolta attiva;
- deck;
- pensiero corrente;
- preferiti;
- storico;
- raccolte personali/installate;
- programmazione del pensiero.

I preferiti sono persistiti come **testo della frase**, compatibilmente con la 3.x. I link condivisi possono essere salvati nella raccolta `Pensieri ricevuti`.

## 12. Timer

Il timer-store è l'unica sorgente di stato per durata, avanzamento e sorgente audio. La sorgente durante il timer può essere cambiata anche a sessione avviata. La UI visualizza soltanto il countdown nel cerchio; lo stato resta esterno al quadrante.

## 13. Backup

Il backup-service crea un formato v4 portabile e accetta anche i backup supportati della linea 3.x.

Regole:

- foto/cache temporanee non vengono incorporate nel backup;
- un calendario URL conserva l'URL e non la copia ICS;
- un calendario importato da file conserva il contenuto ICS;
- il ripristino usa una scrittura transazionale: in caso di errore tenta il rollback dello storage precedente.

## 14. Update PWA

`version.json`, `sw-manifest.json` e `sw.js` sono prodotti dalla build.

La policy utente è separata dalla cache:

1. rilevazione release;
2. memorizzazione `firstSeenAt` per versione/dispositivo;
3. badge `Update now`;
4. attivazione manuale nelle prime 72 ore;
5. attivazione automatica dopo 72 ore;
6. nessun singolo asset accessorio può impedire indefinitamente l'update.

Il Service Worker installa gli asset in modalità best-effort, usa network-first per navigazione/versione e cache con revalidazione per gli asset. Durante l'attivazione conserva una cache precedente come fallback e ritenta gli asset mancanti.

## 15. Build

`scripts/build.mjs`:

1. ricrea `dist/` da zero;
2. copia `public/`;
3. copia i moduli `src/` nell'area applicativa di `dist/`;
4. genera un unico `assets/app.css` dai sette domini;
5. genera `version.json`;
6. elenca gli asset realmente presenti;
7. calcola SHA-256 e genera `sw-manifest.json`;
8. genera `sw.js`.

Il manifest non viene mantenuto a mano.

## 16. Quality gate

`npm run check` verifica automaticamente:

- sintassi di tutti i moduli JavaScript;
- assenza di `window.Istante*`;
- assenza di accesso diretto a `localStorage` negli store;
- assenza di `!important`;
- assenza di breakpoint width sparsi;
- ownership CSS del calendario;
- import relativi esistenti;
- coerenza fra `sw-manifest.json` e file presenti in `dist/`.

I test Node coprono inoltre parser ICS/ricorrenze, schedule radio, generatori audio, backup calendari, profili dispositivo, share link, typing, confronto versione e import di tutti i moduli browser.

## 17. Regole per le future modifiche

1. Non modificare `dist/`.
2. Non aggiungere un nuovo breakpoint dentro un componente: aggiornare il profilo dispositivo solo se la tassonomia cambia davvero.
3. Non correggere una View da un foglio CSS di un altro dominio.
4. Non introdurre stato duplicato se esiste già nello Store del dominio.
5. Non accedere direttamente a storage/rete/Web Audio da un componente se può essere un Service.
6. Aggiungere un test per ogni bug di logica riproducibile.
7. Eseguire sempre `build`, `check` e test prima di produrre lo ZIP.
8. Una nuova funzione deve prima avere un proprietario architetturale chiaro, poi la UI.

Queste regole sono il vero confine tra la 4.0 e la vecchia crescita per stratificazione.
