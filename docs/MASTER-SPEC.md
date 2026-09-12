# ISTANTE
## Specifica tecnica completa per la riscrittura da zero

**Documento:** Specifica funzionale, tecnica e architetturale  
**Progetto:** Istante  
**Tipo di intervento:** Riscrittura completa da zero  
**Versione di riferimento funzionale/visiva:** 3.13.11  
**Stack target:** Vue 3 + TypeScript + Vite + Element Plus + Pinia + PWA  
**Stato documento:** Specifica master per sviluppo e collaudo

---

# 1. Scopo del documento

Questo documento definisce in modo completo e tecnico come deve essere progettata e sviluppata la nuova versione di **Istante**.

La nuova versione deve essere una **riscrittura reale da zero**. La versione 3.13.11 deve essere utilizzata esclusivamente come riferimento per:

- funzionalità esistenti;
- esperienza utente;
- identità visiva;
- logica generale;
- contenuti;
- comportamento dei moduli;
- priorità delle informazioni.

Non devono essere riutilizzati come base architetturale:

- il vecchio `index.html`;
- i vecchi file CSS di correzione progressiva;
- i vecchi `polish-*.css`;
- il vecchio sistema di breakpoint;
- la manipolazione diretta del DOM;
- i vecchi ID usati come API interna;
- la vecchia organizzazione JavaScript;
- il vecchio sistema di override CSS.

La nuova applicazione deve essere pensata fin dall'inizio come prodotto moderno, mantenibile, modulare e adatto a evolvere nel tempo.

---

# 2. Visione del prodotto

Istante è una web app/PWA personale che unisce:

- dashboard quotidiana;
- screensaver;
- orologio;
- data;
- saluto;
- frase del momento;
- calendario;
- agenda;
- traguardi;
- meteo;
- alba e tramonto;
- sole e luna;
- fase lunare;
- sfondi;
- radio;
- timer;
- raccolte di frasi;
- preferiti;
- impostazioni;
- backup;
- documentazione del progetto.

L'esperienza deve essere:

- calma;
- minimale;
- elegante;
- immersiva;
- leggibile;
- poco invasiva;
- coerente;
- priva di elementi grafici superflui;
- utilizzabile sia passivamente sia in modo interattivo.

L'interfaccia non deve sembrare un gestionale.

Istante deve poter funzionare bene come:

- pagina personale;
- app installata;
- dashboard da scrivania;
- schermata touch;
- screensaver;
- display ambientale;
- app su tablet;
- app su TV o grande display.

---

# 3. Principio architetturale fondamentale

La nuova applicazione non deve essere realizzata come un unico layout desktop che si ridimensiona.

Devono esistere quattro esperienze principali:

1. **Telefono**
2. **Tablet**
3. **Laptop / PC**
4. **TV / Grande display**

Le quattro esperienze devono condividere:

- dati;
- store;
- servizi;
- design system;
- componenti atomici;
- logica applicativa;
- API;
- configurazioni.

Devono invece poter cambiare:

- disposizione;
- gerarchia;
- densità;
- navigazione;
- dimensione;
- comportamento;
- modalità di interazione;
- quantità di informazioni mostrate;
- tipo di modale;
- toolbar;
- composizione delle viste.

Il responsive non deve significare solo "ridurre le misure".

Il responsive deve modificare:

- **posizione**;
- **priorità**;
- **ergonomia**;
- **interazione**;
- **densità informativa**;
- **composizione**.

---

# 4. Stack tecnologico

## 4.1 Obbligatorio

Utilizzare:

- Vue 3
- Composition API
- `<script setup>`
- TypeScript
- Vite
- Element Plus
- `@element-plus/icons-vue`
- Pinia
- Vue Router
- IndexedDB
- Service Worker
- Web App Manifest
- CSS Custom Properties
- CSS Grid
- Flexbox
- Container Queries dove utili
- `ResizeObserver`
- `visualViewport`
- API browser moderne con fallback ragionevoli

## 4.2 Dipendenze

Tutte le dipendenze devono essere installate con npm.

Non utilizzare CDN runtime.

Sono vietati, in produzione, caricamenti tipo:

```html
<script src="https://unpkg.com/..."></script>
<link href="https://cdn.jsdelivr.net/...">
```

Il build finale deve essere completamente autosufficiente per quanto riguarda framework e librerie.

## 4.3 Obiettivo build

I comandi:

```bash
npm ci
npm run build
```

devono generare:

```text
dist/
```

pronta per pubblicazione statica.

---

# 5. Vincoli di deployment

L'applicazione deve poter essere pubblicata come sito statico.

Configurazioni supportate:

## 5.1 GitHub Pages

Frontend su GitHub Pages.

Proxy ICS esterno:

```text
https://api.istante.ruslan-dzyuba.it/calendar.php
```

## 5.2 Hosting tradizionale

Frontend e asset caricati su hosting statico/PHP.

## 5.3 Requisiti

Il frontend non deve richiedere:

- Node.js lato server;
- database remoto;
- autenticazione server obbligatoria;
- backend applicativo persistente.

---

# 6. Runtime configuration

Creare:

```text
public/config/runtime.js
```

Esempio:

```js
window.ISTANTE_CONFIG = {
  calendarProxy: 'https://api.istante.ruslan-dzyuba.it/calendar.php',
  calendarSyncMinutes: 30,
  deviceProfile: 'auto',
  weatherProvider: 'default',
  debug: false
}
```

Il runtime config deve permettere di cambiare:

- URL proxy calendario;
- intervallo sincronizzazione;
- device profile forzato;
- flag debug;
- eventuali provider;
- opzioni di deployment.

Senza rebuild.

---

# 7. Struttura repository

Struttura consigliata:

```text
istante/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── config/
│   │   └── runtime.js
│   ├── icons/
│   ├── images/
│   ├── audio/
│   └── manifest.webmanifest
├── src/
│   ├── App.vue
│   ├── main.ts
│   ├── env.d.ts
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── ui.store.ts
│   │   ├── settings.store.ts
│   │   ├── calendar.store.ts
│   │   ├── phrases.store.ts
│   │   ├── timer.store.ts
│   │   ├── radio.store.ts
│   │   ├── weather.store.ts
│   │   ├── environment.store.ts
│   │   └── storage.store.ts
│   ├── composables/
│   │   ├── useDeviceProfile.ts
│   │   ├── useClock.ts
│   │   ├── useSun.ts
│   │   ├── useMoon.ts
│   │   ├── useWeather.ts
│   │   ├── useFullscreen.ts
│   │   ├── useVisibility.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── usePersistentStorage.ts
│   │   └── useReducedMotion.ts
│   ├── services/
│   │   ├── calendar/
│   │   │   ├── calendar.service.ts
│   │   │   ├── ics.service.ts
│   │   │   ├── ics-parser.service.ts
│   │   │   ├── calendar-sync.service.ts
│   │   │   └── calendar-cache.service.ts
│   │   ├── weather/
│   │   ├── radio/
│   │   ├── backgrounds/
│   │   ├── astronomy/
│   │   ├── backup/
│   │   └── storage/
│   ├── models/
│   │   ├── calendar.ts
│   │   ├── event.ts
│   │   ├── phrase.ts
│   │   ├── radio.ts
│   │   ├── timer.ts
│   │   ├── settings.ts
│   │   └── device.ts
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── calendar/
│   │   ├── timer/
│   │   ├── radio/
│   │   ├── settings/
│   │   ├── weather/
│   │   ├── phrases/
│   │   └── dialogs/
│   ├── views/
│   │   ├── DashboardView.vue
│   │   ├── CalendarView.vue
│   │   ├── ProjectView.vue
│   │   ├── SettingsView.vue
│   │   └── NotFoundView.vue
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── element-plus.css
│   │   ├── transitions.css
│   │   └── utilities.css
│   └── data/
│       ├── phrases/
│       └── radio/
├── tests/
│   ├── unit/
│   ├── component/
│   └── e2e/
├── docs/
│   ├── ARCHITETTURA.md
│   ├── RESPONSIVE.md
│   ├── STORAGE.md
│   ├── ICS.md
│   ├── PRIVACY.md
│   ├── TERZE-PARTI.md
│   ├── LICENZA.md
│   └── release/
│       └── vX.Y.Z.md
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── CHANGELOG.md
```

---

# 8. Regole architetturali

## 8.1 Un solo proprietario per responsabilità

Ogni area UI deve avere un componente proprietario.

Esempio:

```text
CalendarHeader.vue
```

deve essere l'unico componente responsabile della struttura dell'header calendario.

Non deve esistere CSS esterno che corregga casualmente la struttura di `CalendarHeader`.

## 8.2 Vietato usare il DOM come bus

Non usare:

```js
document.querySelector(...)
document.getElementById(...)
element.style...
```

per pilotare normali flussi applicativi Vue.

Usare:

- props;
- emits;
- store;
- composable;
- ref;
- computed;
- provide/inject se necessario.

## 8.3 Vietato preservare ID legacy

Non mantenere centinaia di ID della 3.13.11 per compatibilità.

La nuova architettura deve essere nativa Vue.

## 8.4 Vietati CSS patch incrementali

Non creare:

```text
polish.css
mobile-fix.css
iphone-fix.css
fix-2.css
final-fix.css
```

I componenti devono essere corretti alla fonte.

---

# 9. Design system

## 9.1 Identità

L'identità visiva deve restare:

- minimale;
- elegante;
- contemplativa;
- fotografica;
- moderna;
- silenziosa;
- coerente;
- soft.

## 9.2 Tipografia

Prevedere almeno:

- font UI sans-serif;
- font serif per frasi e titoli emozionali;
- font display opzionale per ora/grandi titoli.

## 9.3 Token globali

File:

```text
src/styles/tokens.css
```

Deve definire:

```css
:root {
  --font-ui: ...;
  --font-serif: ...;
  --font-display: ...;

  --font-xs: ...;
  --font-sm: ...;
  --font-md: ...;
  --font-lg: ...;
  --font-xl: ...;
  --font-2xl: ...;
  --font-display-clock: ...;

  --space-1: ...;
  --space-2: ...;
  --space-3: ...;
  --space-4: ...;
  --space-5: ...;
  --space-6: ...;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;
  --radius-xl: ...;
  --radius-pill: 999px;

  --glass-bg: ...;
  --glass-border: ...;
  --glass-blur: ...;

  --text-primary: ...;
  --text-secondary: ...;
  --text-muted: ...;

  --accent: ...;
  --success: ...;
  --warning: ...;
  --danger: ...;

  --ui-scale: 1;
  --font-scale: 1;
  --space-scale: 1;
  --touch-scale: 1;

  --safe-top: env(safe-area-inset-top);
  --safe-bottom: env(safe-area-inset-bottom);
  --safe-left: env(safe-area-inset-left);
  --safe-right: env(safe-area-inset-right);
}
```

## 9.4 Element Plus

Element Plus deve essere tematizzato.

Sono accettabili componenti Element Plus per:

- button;
- dialog;
- drawer;
- switch;
- slider;
- select;
- input;
- tabs;
- segmented control;
- tooltip;
- popover;
- date picker;
- notification;
- message;
- progress;
- dropdown.

Non deve essere riconoscibile visivamente come UI Element Plus standard.

---

# 10. Sistema responsive

## 10.1 Device family

Creare il tipo:

```ts
export type DeviceFamily =
  | 'phone'
  | 'tablet'
  | 'desktop'
  | 'display'
```

## 10.2 Orientation

```ts
export type Orientation =
  | 'portrait'
  | 'landscape'
```

## 10.3 Shape

```ts
export type ViewportShape =
  | 'tall'
  | 'standard'
  | 'wide'
  | 'ultrawide'
```

## 10.4 Device profile

Interfaccia:

```ts
export interface DeviceProfile {
  family: DeviceFamily
  orientation: Orientation
  shape: ViewportShape

  width: number
  height: number

  shortSide: number
  longSide: number

  aspectRatio: number
  area: number
  sizeIndex: number

  uiScale: number
  fontScale: number
  touchScale: number

  isTouchPreferred: boolean
  isCompactHeight: boolean
  isWide: boolean
  isUltraWide: boolean
}
```

## 10.5 Sorgenti viewport

Priorità:

1. `window.visualViewport`
2. `window.innerWidth`
3. `window.innerHeight`

Ascoltare:

- `visualViewport.resize`
- `visualViewport.scroll` se necessario per iOS
- `resize`
- `orientationchange`

## 10.6 Altezza CSS

Usare:

```css
100dvh
100svh
```

Evitare di affidarsi solamente a:

```css
100vh
```

su mobile.

---

# 11. Classificazione dispositivi

La classificazione deve usare più parametri.

Non usare solamente:

```ts
if (width < 768)
```

Utilizzare:

- short side;
- long side;
- area;
- aspect ratio;
- touch capability;
- override runtime.

Indicazione di partenza:

```text
Phone:
shortSide <= ~500

Tablet:
shortSide > ~500 e <= ~900

Desktop:
viewport tipico monitor

Display:
viewport grande oppure override esplicito
```

I valori devono essere affinati con test reali.

---

# 12. Override dispositivo

Supportare:

```text
auto
phone
tablet
desktop
display
```

Configurazione:

```js
window.ISTANTE_CONFIG.deviceProfile = 'auto'
```

Deve esistere anche una preferenza nelle impostazioni avanzate.

Motivazione:

un televisore Full HD e un monitor Full HD possono esporre entrambi:

```text
1920 × 1080
```

Il browser non può distinguerli in modo affidabile.

---

# 13. Scala ottica

La scala deve essere separata dalla composizione.

## 13.1 Composizione

Dipende da:

- family;
- orientation;
- aspect ratio;
- compact height.

## 13.2 Scala

Calcolare un indice, ad esempio:

```ts
const sizeIndex = Math.sqrt(width * height)
```

normalizzato rispetto a un riferimento.

Esempio:

```ts
const normalized =
  Math.sqrt(width * height) /
  Math.sqrt(1440 * 900)
```

Applicare clamp:

```ts
uiScale = clamp(normalized, min, max)
```

## 13.3 Preferenza utente

Supportare:

```text
small
medium
large
```

come moltiplicatore:

```ts
finalScale =
  automaticScale *
  userPreferenceScale
```

---

# 14. Container queries

I componenti riutilizzati in aree differenti devono poter adattarsi allo spazio del proprio container.

Esempi:

- `AgendaCard`
- `CountdownCard`
- `WeatherCard`
- `CalendarMonth`
- `RadioPlayer`

Usare:

```css
container-type: inline-size;
```

e:

```css
@container (...)
```

quando più corretto rispetto a media query globali.

---

# 15. Dashboard

Route:

```text
/
```

Componente:

```text
DashboardView.vue
```

Deve essere composta da:

```text
DashboardShell
├── AmbientBackground
├── GreetingBlock
├── ClockBlock
├── AstronomyLayer
├── PhraseBlock
├── DashboardInfoArea
│   ├── WeatherSummary
│   ├── CountdownCard
│   └── AgendaSummary
└── AppToolbar
```

---

# 16. Dashboard - priorità visiva

Ordine di importanza:

1. ora;
2. frase;
3. data/saluto;
4. atmosfera;
5. prossimo evento;
6. traguardo;
7. meteo;
8. toolbar.

Su schermi piccoli gli elementi meno importanti devono ridursi prima dei principali.

---

# 17. Phone portrait

Il telefono verticale deve avere una vera composizione verticale.

Struttura indicativa:

```text
┌───────────────────────────────┐
│ Saluto                        │
│ Data                          │
│                               │
│            13:04              │
│          Sole/Luna            │
│                               │
│     PENSIERO DEL MOMENTO      │
│                               │
│  Una breve passeggiata ...    │
│                               │
│       Prossimo pensiero       │
│                               │
│ Meteo / luce                  │
│                               │
│ Traguardo                     │
│                               │
│ Agenda                        │
│                               │
│ Toolbar                       │
└───────────────────────────────┘
```

Obbligatorio:

- Meteo;
- Traguardo;
- Agenda;

devono essere realmente tre righe/componenti distinti.

Non devono tornare affiancati per effetto di CSS ereditato.

---

# 18. Phone landscape

Non deve essere il portrait ruotato.

Deve ottimizzare l'altezza.

Struttura indicativa:

```text
┌────────────────────────────────────────────┐
│  Ora / Data        │  Frase               │
│                    │                       │
├────────────────────┼───────────────────────┤
│  Meteo/Agenda      │  Traguardo            │
└────────────────────┴───────────────────────┘
                                      Toolbar
```

Possibile toolbar:

- verticale;
- laterale;
- compatta.

Evitare fasce orizzontali alte.

---

# 19. Tablet portrait

Deve sembrare un'app tablet.

Non una versione telefono ingrandita.

Possibile composizione:

```text
Ora
Frase

Meteo | Traguardo | Agenda
```

oppure:

```text
Ora + data
Frase
Info grid
```

Touch target minimo:

```text
44 × 44 CSS px
```

Preferibile:

```text
48 × 48
```

---

# 20. Tablet landscape

Utilizzare lo spazio orizzontale.

Struttura consigliata:

```text
┌──────────────────────────┬───────────────┐
│ Ora                      │ Meteo         │
│ Frase                    │ Traguardo     │
│                          │ Agenda        │
└──────────────────────────┴───────────────┘
```

La colonna secondaria deve avere una larghezza limitata e costante.

---

# 21. Desktop / Laptop

Su computer:

- layout centrato;
- max-width;
- buona distanza tra blocchi;
- toolbar orizzontale;
- hover disponibile;
- tastiera supportata;
- modali centrate;
- niente fullscreen non richiesti.

Su ultrawide:

```text
Orologio | Frase
```

può diventare una composizione a due colonne.

Non espandere indefinitamente i contenuti.

---

# 22. TV / Display

Su TV:

- leggere da distanza;
- pochi dettagli;
- safe-area ampia;
- font maggiori;
- frase importante;
- ora importante;
- toolbar poco invasiva;
- controlli secondari minimizzati.

Possibile comportamento:

- toolbar nascosta dopo inattività;
- ricompare a movimento mouse/touch/tasto;
- elementi ambientali più visibili;
- transizioni lente.

---

# 23. App toolbar

Componente:

```text
AppToolbar.vue
```

Azioni:

- raccolte;
- radio;
- preferiti;
- timer;
- calendario;
- condivisione;
- fullscreen;
- impostazioni.

Regola:

la posizione dei pulsanti deve essere deterministica.

Se un pulsante non è disponibile:

- non devono rimescolarsi casualmente tutti gli altri.

Possibile soluzione:

- slot fissi;
- grid-template-columns;
- zone logiche.

---

# 24. Orologio

Componente:

```text
ClockBlock.vue
```

Requisiti:

- 24h;
- 12h;
- secondi opzionali;
- aggiornamento preciso;
- nessun rerender globale della dashboard;
- dimensione fluida;
- nessun overflow;
- supporto TV.

Possibile implementazione:

```ts
useClock()
```

che espone:

```ts
hours
minutes
seconds
formattedTime
formattedDate
```

---

# 25. Saluto

Componente:

```text
GreetingBlock.vue
```

Deve gestire:

- buongiorno;
- buon pomeriggio;
- buonasera;
- buonanotte;
- eventuali varianti.

Il saluto non deve essere rimosso.

Deve poter cambiare posizione tra i quattro layout.

---

# 26. Data

Mostrare:

- giorno della settimana;
- giorno;
- mese;
- anno.

Formato localizzato italiano.

---

# 27. Sole e luna

Componenti:

```text
AstronomyLayer.vue
SunIndicator.vue
MoonIndicator.vue
```

Calcolare:

- alba;
- tramonto;
- durata del giorno;
- posizione solare;
- posizione lunare;
- fase lunare.

Configurazione:

```text
Follow the sun
```

quando disponibili coordinate.

---

# 28. Stelle

Mostrare di notte.

Requisiti:

- animazione leggera;
- non eccessiva;
- ridotta su dispositivi lenti;
- disabilitabile;
- rispetto `prefers-reduced-motion`.

---

# 29. Frasi

Store:

```text
phrases.store.ts
```

Modello:

```ts
interface Phrase {
  id: string
  text: string
  author?: string
  tags?: string[]
  periods?: Array<'morning' | 'day' | 'evening' | 'night'>
  favorite?: boolean
  collectionIds?: string[]
  enabled: boolean
}
```

---

# 30. Selezione frase

Supportare:

- random;
- fascia oraria;
- mattina;
- giorno;
- sera;
- notte;
- raccolte;
- preferiti;
- esclusione recenti.

Mantenere storico per evitare ripetizioni troppo frequenti.

---

# 31. Typewriter

Componente:

```text
TypewriterText.vue
```

Funzioni:

- lettera per lettera;
- velocità variabile;
- pause;
- errori casuali opzionali;
- backspace;
- correzione;
- multilinea;
- suono opzionale.

L'effetto non deve bloccare la UI.

---

# 32. Raccolte

Modello:

```ts
interface PhraseCollection {
  id: string
  name: string
  description?: string
  phraseIds: string[]
  createdAt: string
  updatedAt: string
}
```

Funzioni:

- crea;
- rinomina;
- elimina;
- aggiungi frase;
- rimuovi frase;
- importa JSON;
- esporta JSON;
- filtro.

---

# 33. Calendario

Route:

```text
/calendar
```

View:

```text
CalendarView.vue
```

Componenti:

```text
CalendarShell
├── CalendarHeader
├── CalendarViewSwitcher
├── YearView
├── MonthView
├── WeekView
├── DayView
├── AgendaView
├── CalendarDrawer
└── EventDetailsDialog
```

---

# 34. Modello calendario

```ts
interface CalendarSource {
  id: string
  name: string
  url: string
  color: string
  enabled: boolean

  syncIntervalMinutes: number

  lastSyncAt?: string
  lastSuccessAt?: string
  lastErrorAt?: string
  lastError?: string

  createdAt: string
  updatedAt: string
}
```

---

# 35. Modello evento

```ts
interface CalendarEvent {
  id: string
  calendarId: string

  uid: string

  title: string
  description?: string
  location?: string

  start: string
  end: string

  allDay: boolean

  timezone?: string

  recurrenceRule?: string
  recurrenceId?: string

  status?: string
}
```

---

# 36. ICS - strategia fetch

Il frontend deve sempre provare prima la richiesta diretta.

Pseudo-codice:

```ts
async function fetchIcs(url: string) {
  try {
    return await fetchDirect(url)
  } catch {
    return await fetchViaProxy(url)
  }
}
```

Proxy:

```text
https://api.istante.ruslan-dzyuba.it/calendar.php
```

Richiesta:

```http
POST /calendar.php
Content-Type: application/json
```

Body:

```json
{
  "url": "https://provider.example/calendar.ics"
}
```

---

# 37. ICS - URL persistito

Il database deve salvare:

```text
URL ICS originale
```

Non salvare:

```text
URL del proxy + URL ICS
```

Il proxy è solo trasporto.

---

# 38. Sincronizzazione calendario

Default:

```text
30 minuti
```

Configurabile.

Trigger:

- avvio app;
- apertura calendario;
- intervallo;
- ritorno online;
- ritorno in foreground;
- comando manuale.

Evitare sincronizzazioni duplicate.

Usare mutex/lock logico:

```ts
if (syncInProgress) return
```

---

# 39. ICS parsing

Supportare almeno:

- `BEGIN:VCALENDAR`
- `VEVENT`
- `UID`
- `SUMMARY`
- `DESCRIPTION`
- `LOCATION`
- `DTSTART`
- `DTEND`
- `RRULE`
- `EXDATE`
- `RDATE`
- `RECURRENCE-ID`
- `TZID`
- all-day events
- escaped text
- line folding

Preferire libreria affidabile.

Non creare un parser minimale fragile se esiste una libreria mantenuta adatta al bundle client.

---

# 40. Ricorrenze

Gestire almeno:

- DAILY
- WEEKLY
- MONTHLY
- YEARLY
- INTERVAL
- COUNT
- UNTIL
- BYDAY
- BYMONTHDAY
- BYMONTH

Le occorrenze devono essere calcolate solamente per una finestra temporale ragionevole.

Non materializzare ricorrenze infinite.

---

# 41. Cache calendario

Conservare localmente:

- eventi dell'ultima sincronizzazione valida;
- timestamp;
- stato.

Se sincronizzazione fallisce:

- mantenere eventi precedenti;
- non svuotare calendario;
- mostrare errore discreto.

---

# 42. CalendarHeader - Phone portrait

Layout obbligatorio.

Prima riga:

```text
ISTANTE                    OGGI   [Calendari]
```

- logo a sinistra;
- `Oggi` a destra;
- pulsante Calendari a destra;
- icona calendario;
- nessuna freccia extra.

Seconda riga:

```text
           ‹  SETTEMBRE 2026  ›
```

Periodo centrato.

Terza riga:

```text
ANNO   MESE   SETTIMANA   GIORNO   AGENDA
```

Segmented control.

---

# 43. CalendarHeader - Phone landscape

Deve essere molto compatto.

Obiettivi:

- altezza ridotta;
- controlli visibili;
- niente sovrapposizioni;
- nessuna freccia nel pulsante Calendari;
- periodo leggibile.

---

# 44. Vista Anno

## Phone portrait

```text
2 mesi per riga
```

Ogni mese deve mostrare:

```text
L M M G V S D
```

Nessuna colonna deve essere tagliata.

## Phone landscape

```text
3 mesi per riga
```

## Tablet

2-3 mesi in base allo spazio.

## Desktop

3-4 mesi.

## TV

4-6 mesi se leggibili.

---

# 45. Vista Mese

Su phone:

- evitare testi evento illeggibili;
- mostrare indicatori;
- massimo uno/due marker;
- tap sul giorno apre elenco.

Su tablet/desktop:

- mostrare titoli quando disponibili;
- truncation controllata;
- tooltip desktop.

---

# 46. Vista Settimana

Phone portrait:

- lista verticale.

Phone landscape:

- 7 colonne solo se leggibili.

Tablet/desktop:

- griglia settimanale completa.

---

# 47. Vista Giorno

Mostrare:

- data;
- eventi;
- all-day;
- orario;
- titolo;
- location.

Landscape phone:

possibile struttura:

```text
Riepilogo | Eventi
```

---

# 48. Vista Agenda

Lista cronologica raggruppata per giorno.

Mostrare:

- orario;
- titolo;
- calendario;
- location;
- stato se necessario.

---

# 49. Gestione calendari

Componente:

```text
CalendarSourcesDrawer.vue
```

Funzioni:

- aggiungi;
- modifica nome;
- modifica colore;
- attiva/disattiva;
- aggiorna;
- elimina;
- stato sync;
- ultimo aggiornamento;
- errore.

Phone:

- drawer.

Desktop:

- drawer o dialog laterale.

---

# 50. Meteo

Store:

```text
weather.store.ts
```

Dati minimi:

```ts
interface WeatherState {
  temperature?: number
  condition?: string
  icon?: string
  sunrise?: string
  sunset?: string
  updatedAt?: string
}
```

Errore meteo non deve bloccare l'app.

---

# 51. Geolocalizzazione

Supportare:

- coordinate manuali;
- browser geolocation con consenso.

Non richiedere posizione senza azione/consenso esplicito.

---

# 52. Sfondi

Service:

```text
background.service.ts
```

Supportare:

- immagine remota;
- immagine locale;
- rotazione;
- intervallo;
- preloading;
- fallback.

Transizione:

- opacity;
- crossfade.

Mai flash nero.

---

# 53. Radio

Store:

```text
radio.store.ts
```

Modello:

```ts
interface RadioStation {
  id: string
  name: string
  streamUrl: string
  website?: string
  favorite: boolean
  enabled: boolean
  tags?: string[]
}
```

---

# 54. Radio player

Funzioni:

- play;
- stop;
- volume;
- precedente;
- successiva;
- preferiti;
- ricerca;
- aggiunta stazione;
- rimozione;
- casuale;
- "Sorprendimi".

---

# 55. Sorprendimi

Sequenza obbligatoria:

```text
1. stop stream corrente
2. seleziona nuova stazione
3. crea/aggiorna sorgente audio
4. avvia
```

Mai due stream contemporanei.

---

# 56. Programmazione radio

Modello:

```ts
interface RadioSchedule {
  id: string
  enabled: boolean
  start: string
  end: string
  stationId?: string
  random?: boolean
  days?: number[]
}
```

Supportare più fasce.

---

# 57. Timer

Store:

```text
timer.store.ts
```

Stato:

```ts
interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'completed'

  totalSeconds: number
  remainingSeconds: number

  startedAt?: number
  expectedEndAt?: number

  radioMode: 'keep' | 'play' | 'stop' | 'silence'
  endSoundEnabled: boolean
  endSoundId?: string
}
```

---

# 58. Timer precisione

Non decrementare semplicemente:

```ts
remaining--
```

ogni secondo.

Calcolare tempo residuo rispetto a timestamp reale:

```ts
remaining =
  expectedEndAt - Date.now()
```

Questo evita deriva quando:

- tab va in background;
- mobile sospende timer;
- CPU rallenta;
- browser throttla.

---

# 59. Timer display

Supportare correttamente:

```text
5:00
30:00
1:00:00
2:00:00
```

Il testo non deve mai uscire dal cerchio.

Usare:

- `clamp`;
- container query;
- font scaling.

---

# 60. Timer dialog

## Phone portrait

Bottom sheet o dialog quasi pieno.

Deve mantenere:

- margini;
- bordo;
- percezione di modale.

## Phone landscape

Dialog largo/basso.

## Tablet

Dialog centrale.

## Laptop / PC

**Mai fullscreen.**

Indicazione:

```css
max-width: 620px;
max-height: 80dvh;
```

## TV

Dialog grande ma non necessariamente fullscreen.

---

# 61. Timer e radio

Durante timer permettere modifica live di:

- silenzio radio;
- radio attiva;
- stop a fine timer;
- mantieni radio;
- suono finale.

La modifica deve avere effetto immediato.

---

# 62. Impostazioni

View/dialog:

```text
SettingsView
```

Sezioni:

```text
Aspetto
Ora e data
Frasi
Sfondo
Meteo
Calendario
Radio
Timer
Dati
Sistema
Informazioni
```

---

# 63. Settings responsive

Phone:

- navigazione per sezioni;
- una sezione alla volta;
- drawer/sheet.

Tablet:

- lista categorie + contenuto.

Desktop:

- sidebar categorie;
- pannello impostazioni.

TV:

- controlli grandi;
- meno densità.

---

# 64. Persistenza

Utilizzare IndexedDB.

Suggerito:

```text
database: istante
schemaVersion: 4
```

Object store:

```text
settings
calendars
calendarEvents
phrases
collections
radioStations
radioSchedules
timerPresets
history
metadata
```

---

# 65. localStorage

Limitare a:

- boot preference;
- ultimo tema;
- flag migrazione;
- eventuali preferenze minime.

Non usare localStorage per dataset grandi.

---

# 66. Storage persistente

Tentare:

```ts
navigator.storage.persist()
```

Mostrare stato nelle impostazioni avanzate se utile.

---

# 67. Migrazione 3.13.11

Creare:

```text
LegacyMigrationService
```

Il nuovo codice non deve dipendere dai vecchi dati.

Procedura:

```text
1. rileva dati legacy
2. legge vecchie chiavi
3. valida
4. converte
5. salva nuovo schema
6. marca migrazione completata
```

Versione:

```text
schemaVersion = 4
```

La migrazione deve essere idempotente.

---

# 68. Backup

Export JSON.

Struttura:

```json
{
  "format": "istante-backup",
  "schemaVersion": 4,
  "appVersion": "4.x.x",
  "createdAt": "...",
  "data": {
    "settings": {},
    "calendars": [],
    "collections": [],
    "favorites": [],
    "radio": {},
    "timer": {}
  }
}
```

---

# 69. Import

Prima di importare:

- parse JSON;
- valida schema;
- controlla versione;
- mostra preview;
- mostra differenze principali;
- chiede conferma.

Non sovrascrivere subito.

---

# 70. PWA

Deve essere installabile.

Manifest:

- name;
- short_name;
- icons;
- theme_color;
- background_color;
- display;
- orientation se opportuno.

---

# 71. Service Worker

Strategie:

## App shell

```text
cache-first
```

## Asset versionati

```text
cache-first
```

## ICS proxy

```text
network-only
```

## ICS diretto

```text
network-only
```

## Meteo

```text
network-first
```

con fallback all'ultimo dato locale.

## Sfondi remoti

```text
stale-while-revalidate
```

se appropriato.

---

# 72. Precache

Precache solo file realmente prodotti dal build.

Non mantenere manifest manuale con file non esistenti.

Preferire plugin PWA/build-generated manifest.

---

# 73. Offline

Offline deve permettere:

- apertura app;
- ora/data;
- frasi;
- raccolte;
- preferiti;
- ultimi eventi calendario;
- timer;
- radio solo se stream non richiesto;
- ultimo meteo;
- ultimo sfondo disponibile.

---

# 74. Network status

Composable:

```text
useNetworkStatus()
```

Espone:

```ts
online
lastOnlineAt
```

Al ritorno online:

- sincronizza calendari se necessario;
- aggiorna meteo;
- non eseguire tempeste di richieste.

---

# 75. Privacy

Nessuna telemetria obbligatoria.

Nessun analytics.

Nessun tracking.

Nessun ID remoto utente.

Nessun invio delle preferenze a server Istante.

---

# 76. Proxy ICS

Il proxy:

```text
https://api.istante.ruslan-dzyuba.it/calendar.php
```

deve essere considerato stateless.

Il frontend non deve presumere persistenza lato server.

---

# 77. Error handling

Creare error model:

```ts
interface AppError {
  code: string
  message: string
  source: string
  recoverable: boolean
  timestamp: number
}
```

---

# 78. Errori servizi esterni

Se meteo fallisce:

```text
mostra ultimo valore oppure nascondi il widget
```

Se ICS fallisce:

```text
mantieni ultimi eventi
```

Se radio fallisce:

```text
stop player + feedback
```

Se sfondo fallisce:

```text
mantieni immagine precedente
```

Mai blank page.

---

# 79. Toast

Toast:

- discreti;
- non invasivi;
- posizione stabile;
- non sovrapposti a toolbar;
- safe-area aware.

Element Plus message/notification va tematizzato.

---

# 80. Modali

Regola generale:

- phone portrait: sheet/dialog quasi fullscreen se necessario;
- phone landscape: largo e basso;
- tablet: dialog;
- desktop: dialog centrato;
- TV: dialog scalato.

Nessuna modale deve essere fullscreen automaticamente su desktop.

---

# 81. Accessibilità

Obbligatorio:

- ARIA;
- label;
- focus visibile;
- keyboard navigation;
- `Escape` chiude dialog;
- focus trap nei dialog;
- contrasto;
- target touch;
- niente azioni solo hover.

---

# 82. Reduced motion

Rispettare:

```css
@media (prefers-reduced-motion: reduce)
```

Ridurre:

- typewriter;
- parallax;
- transizioni;
- animazioni sole/luna;
- stelle;
- effetti.

---

# 83. Keyboard shortcuts

Desktop opzionale ma consigliato.

Esempi:

```text
T = timer
C = calendario
R = radio
F = fullscreen
S = impostazioni
Esc = chiudi pannello
```

Evitare conflitti con input.

---

# 84. Performance

Obiettivi:

- nessun rerender globale ogni secondo;
- clock isolato;
- timer isolato;
- background isolato;
- lazy load viste;
- code splitting;
- prefetch ragionato.

---

# 85. Lazy loading

Route:

```ts
component: () => import(...)
```

Lazy load consigliato per:

- CalendarView;
- ProjectView;
- SettingsView;
- gestione raccolte;
- documentazione.

---

# 86. Immagini

Usare:

- lazy loading;
- preload della prossima immagine;
- decoding async;
- dimensioni corrette;
- WebP/AVIF se possibile.

---

# 87. Audio

Gestire un singolo audio context/player centrale.

Non creare player indipendenti concorrenti.

Store radio deve essere fonte unica di verità.

---

# 88. Sicurezza frontend

Evitare:

- `eval`;
- HTML non sanitizzato;
- `v-html` su dati esterni non sanitizzati;
- parsing pericoloso;
- secrets nel frontend.

---

# 89. Content Security Policy

Preparare il progetto per CSP restrittiva.

Idealmente:

```text
default-src 'self'
script-src 'self'
style-src 'self'
img-src 'self' https: data:
media-src 'self' https:
connect-src 'self' https:
```

Da adattare ai provider effettivi.

---

# 90. UI state

Store UI:

```ts
interface UiState {
  settingsOpen: boolean
  timerOpen: boolean
  radioOpen: boolean
  calendarDrawerOpen: boolean
  collectionOpen: boolean
  fullscreen: boolean
}
```

Non distribuire questi flag in componenti scollegati.

---

# 91. Routing

Route minime:

```text
/
 /calendar
 /project
 /settings
 /404
```

Possibili redirect legacy se necessari.

---

# 92. Project page

La pagina progetto deve includere:

- descrizione;
- filosofia;
- caratteristiche;
- changelog;
- release;
- licenza;
- terze parti;
- link GitHub;
- autore.

Non inserire riferimenti del tipo:

```text
costruita sulla visione della 3.8
```

---

# 93. Documentazione obbligatoria

Ogni release deve contenere:

```text
README.md
CHANGELOG.md
docs/ARCHITETTURA.md
docs/RESPONSIVE.md
docs/STORAGE.md
docs/ICS.md
docs/PRIVACY.md
docs/TERZE-PARTI.md
docs/LICENZA.md
docs/release/vX.Y.Z.md
```

---

# 94. Versioning

Usare Semantic Versioning.

Esempio:

```text
4.0.0
4.1.0
4.1.1
```

Major:

- cambi incompatibili;
- nuova architettura.

Minor:

- nuove funzioni.

Patch:

- bugfix.

---

# 95. Changelog

Formato consigliato:

```markdown
## [4.0.0] - YYYY-MM-DD

### Added
### Changed
### Fixed
### Removed
### Security
```

---

# 96. Test unitari

Testare almeno:

- classificazione device;
- sizeIndex;
- formatter date;
- timer calculation;
- ICS fallback;
- normalizzazione eventi;
- backup validation;
- migrazione storage.

---

# 97. Test componenti

Testare:

- CalendarHeader;
- AppToolbar;
- TimerDialog;
- PhraseBlock;
- AgendaCard;
- CountdownCard;
- CalendarMonth.

---

# 98. Test E2E

Usare Playwright.

Scenari minimi:

```text
caricamento dashboard
apertura timer
avvio/pausa timer
apertura calendario
cambio vista
aggiunta ICS
fallback proxy
apertura radio
apertura settings
backup export
```

---

# 99. Viewport test obbligatori

## Phone

```text
390 × 844
430 × 932
844 × 390
932 × 430
```

## Tablet

```text
768 × 1024
820 × 1180
1024 × 768
1180 × 820
```

## Desktop

```text
1366 × 768
1440 × 900
1920 × 1080
2560 × 1440
3440 × 1440
```

## Display

```text
2560 × 1440 con override display
3840 × 2160
```

---

# 100. Zoom test

Test:

```text
80%
100%
125%
```

Verificare:

- niente clipping;
- niente sovrapposizioni;
- niente scrollbar orizzontale imprevista.

---

# 101. Device acceptance criteria

Per ogni profilo:

- nessun overflow orizzontale;
- nessun testo tagliato;
- nessun pulsante sovrapposto;
- toolbar raggiungibile;
- calendario leggibile;
- timer leggibile;
- modali coerenti;
- safe-area rispettata.

---

# 102. Phone acceptance criteria

Il telefono deve sembrare un'app telefono.

Obbligatorio:

- touch first;
- nessun hover necessario;
- dock stabile;
- portrait e landscape differenti;
- calendario ottimizzato;
- timer leggibile;
- modali non rotte.

---

# 103. Tablet acceptance criteria

Tablet deve sfruttare:

- maggiore larghezza;
- maggiore altezza;
- touch;
- split layout.

Non deve sembrare:

- phone ingrandito;
- desktop rimpicciolito.

---

# 104. Desktop acceptance criteria

Desktop:

- mouse friendly;
- tastiera;
- hover opzionale;
- max-width;
- dialog non fullscreen;
- contenuti non eccessivamente larghi.

---

# 105. TV acceptance criteria

TV:

- leggibile da distanza;
- elementi essenziali grandi;
- safe-area;
- toolbar secondaria;
- pochi dettagli minuscoli.

---

# 106. Coding standards

TypeScript strict.

Preferire:

```ts
const
```

a:

```ts
let
```

quando possibile.

Niente:

```ts
any
```

senza motivazione.

---

# 107. Naming

Componenti:

```text
PascalCase.vue
```

Composable:

```text
useSomething.ts
```

Store:

```text
something.store.ts
```

Service:

```text
something.service.ts
```

Model:

```text
something.ts
```

---

# 108. Props

Definire tipi espliciti.

Esempio:

```ts
interface Props {
  compact?: boolean
  device?: DeviceFamily
}
```

---

# 109. Emits

Tipizzati.

Esempio:

```ts
const emit = defineEmits<{
  open: []
  close: []
  select: [id: string]
}>()
```

---

# 110. Store policy

Store per stato condiviso.

Non mettere tutto in Pinia.

Stato locale UI semplice deve restare nel componente.

---

# 111. Service policy

I service:

- niente UI;
- niente Element Plus;
- niente accesso diretto a componenti;
- input/output tipizzati.

---

# 112. Composable policy

Composable per:

- browser API;
- reactive orchestration;
- logica riusabile.

Non trasformare ogni funzione in composable.

---

# 113. Logging

In produzione:

- logging minimo;
- nessun dato sensibile;
- debug disabilitato.

Config:

```js
debug: false
```

---

# 114. Privacy storage

Calendari ICS possono contenere dati personali.

Non inviarli a sistemi di analytics.

Non persisterli lato server Istante.

---

# 115. Stato calendario

Il frontend deve indicare:

```text
Aggiornato
Aggiornamento in corso
Offline
Errore
```

senza invadere la UI.

---

# 116. Status indicators

Usare colori e icone con moderazione.

Non trasformare la dashboard in un pannello tecnico.

---

# 117. Data flow calendario

Flusso:

```text
CalendarSource
   ↓
CalendarSyncService
   ↓
DirectFetch
   ↓ fallimento
ProxyFetch
   ↓
IcsParser
   ↓
Normalize
   ↓
CalendarStore
   ↓
IndexedDB
   ↓
Calendar views
```

---

# 118. Data flow frasi

```text
Phrase repository
   ↓
PhraseStore
   ↓
selection engine
   ↓
history filter
   ↓
Typewriter
   ↓
Dashboard
```

---

# 119. Data flow radio

```text
RadioStore
   ↓
PlayerService
   ↓
HTMLAudioElement
```

Un solo `HTMLAudioElement` centrale.

---

# 120. Data flow timer

```text
TimerStore
   ↓
timestamp calculation
   ↓
UI
   ↓
completion handler
   ↓
radio/end sound
```

---

# 121. Fullscreen

Composable:

```text
useFullscreen()
```

Gestire:

- browser support;
- iOS limitations;
- stato;
- errori.

Toolbar deve nascondere il comando se non disponibile senza rompere la geometria.

---

# 122. Safe area

Tutti i layout phone devono rispettare:

```css
env(safe-area-inset-*)
```

Particolarmente:

- toolbar;
- header calendario;
- bottom sheet;
- fullscreen.

---

# 123. Scroll

Dashboard:

```text
no scroll
```

come principio generale.

Calendario:

```text
scroll consentito
```

nelle viste che lo richiedono.

Modali:

- scroll interno.

---

# 124. Overflow policy

Nessun componente deve causare:

```text
body horizontal scroll
```

Testare con:

```css
overflow-x
```

ma non mascherare bug semplicemente con `overflow-x:hidden`.

---

# 125. CSS policy

Preferire:

- component scoped styles;
- global tokens;
- poche utility;
- nessun override incrociato.

---

# 126. `!important`

Regola:

```text
vietato salvo eccezioni documentate
```

Ogni uso deve avere commento.

---

# 127. Z-index

Definire scala globale:

```css
--z-background: 0;
--z-content: 10;
--z-toolbar: 50;
--z-popover: 100;
--z-drawer: 200;
--z-dialog: 300;
--z-toast: 400;
```

Evitare valori casuali tipo:

```css
z-index: 999999;
```

---

# 128. Transizioni

UI:

```text
150-300 ms
```

Atmosfera:

```text
lenta
```

Preferire:

- opacity;
- transform.

---

# 129. Background performance

Non mantenere troppe immagini decodificate contemporaneamente.

Pool massimo ragionevole:

- current;
- next;
- fallback.

---

# 130. Radio persistence

Persistire:

- ultimo volume;
- ultima stazione;
- preferiti;
- custom station;
- schedule.

Non autostart audio senza rispettare policy browser.

---

# 131. Timer persistence

Se l'app viene chiusa durante timer attivo:

salvare:

```text
expectedEndAt
```

Al riavvio ricostruire stato.

---

# 132. Calendario persistence

Salvare feed normalizzato e non necessariamente ICS raw.

Opzionalmente conservare raw temporaneamente solo in memoria durante parse.

---

# 133. Nessun salvataggio lato proxy

L'app deve trattare proxy come:

```text
request -> response
```

Nessuna dipendenza da sessione server.

---

# 134. API timeout

Frontend deve applicare AbortController.

Esempio:

```ts
const controller = new AbortController()
```

Timeout diretto e proxy configurabili.

---

# 135. Retry

Non fare retry infinito.

Massimo:

```text
1 direct + 1 proxy
```

per ogni sincronizzazione.

---

# 136. Sync backoff

Se calendario fallisce ripetutamente:

- non sincronizzare ogni minuto;
- usare backoff;
- rispettare syncInterval.

---

# 137. Timezone

Tutti i calendari devono normalizzare date internamente.

Non perdere timezone originale se utile.

UI deve mostrare nel timezone locale utente salvo configurazione futura.

---

# 138. Data locale

Usare `Intl.DateTimeFormat`.

Non mantenere manualmente array di mesi/giorni se evitabile.

---

# 139. Locale

Default:

```text
it-IT
```

Architettura predisposta a eventuale i18n futuro.

---

# 140. Meteo e astronomia

Astronomia deve poter funzionare anche senza provider meteo, usando coordinate e calcolo locale.

Separare:

```text
WeatherService
AstronomyService
```

---

# 141. Tema giorno/notte

Store ambiente deve esporre:

```ts
themeMode: 'auto' | 'day' | 'night'
effectiveTheme: 'day' | 'night'
```

---

# 142. Follow the sun

Se attivo:

- alba -> giorno;
- tramonto -> notte.

Se coordinate non disponibili:

fallback su orari configurabili o sistema.

---

# 143. Preloader

Deve essere breve.

Non bloccare la UI per asset non essenziali.

Mostrare app shell appena pronta.

---

# 144. First run

Wizard:

```text
Benvenuto
```

Opzionale ma previsto.

Passi:

- introduzione;
- tema;
- ora;
- posizione/meteo;
- calendario;
- radio.

Deve poter essere saltato.

---

# 145. No-scroll dashboard

Il layout deve calcolare bene lo spazio.

Se altezza ridotta:

- ridurre elementi secondari;
- cambiare composizione;
- non introdurre scroll come soluzione automatica.

---

# 146. Compact height

DeviceProfile deve esporre:

```ts
isCompactHeight
```

Esempio:

phone landscape o laptop con altezza bassa.

---

# 147. Ultra-wide

Su:

```text
3440×1440
```

non espandere una singola frase su 3000 px.

Usare max-width.

---

# 148. Large display

Su 4K:

- UI scale aumenta;
- margini aumentano;
- line length resta controllata.

---

# 149. Font scaling

Usare `clamp()`.

Esempio:

```css
font-size:
  clamp(
    calc(3rem * var(--font-scale)),
    8vw,
    calc(9rem * var(--font-scale))
  );
```

Da adattare per componente.

---

# 150. Line length

Frase:

max circa:

```text
18-28 caratteri medi per riga su phone
30-50 desktop
```

Non estendere troppo.

---

# 151. Agenda summary

Dashboard deve mostrare:

- prossimo evento;
- ora;
- titolo;
- eventuale calendario.

Non mostrare dettagli eccessivi.

---

# 152. Countdown

Mostrare:

- titolo;
- mesi;
- giorni;
- ore;
- percentuale;
- progress bar.

Layout diverso per phone/desktop.

---

# 153. Countdown precisione

Calcolare rispetto a date reali.

Non assumere mese = 30 giorni se visualizzato come calendario.

---

# 154. Calendario locale

L'app può avere eventi/traguardi propri separati dagli ICS esterni.

Progettare store per futura estensione.

---

# 155. Event details dialog

Mostrare:

- titolo;
- date;
- ora;
- location;
- descrizione;
- calendario;
- ricorrenza.

Sanitizzare description.

---

# 156. Drawer calendari phone

Deve aprirsi dal lato coerente con il design scelto.

Evitare gesture che confliggono con back navigation iOS.

---

# 157. Gesture

Swipe opzionali.

Devono avere:

- soglia;
- direzione;
- prevenzione falsi positivi.

Non usare swipe come unico metodo di navigazione.

---

# 158. Double tap

Se mantenuto:

- evitare conflitti con zoom;
- documentare funzione;
- non renderlo unico controllo.

---

# 159. Fullscreen toolbar

Fullscreen può essere:

- mostrato desktop;
- nascosto su iOS se non supportato;
- stabile nella griglia.

---

# 160. Share

Creare share image:

- sfondo;
- frase;
- data;
- eventuale meteo;
- QR;
- autore.

Generazione client-side.

---

# 161. QR

QR deve essere generato localmente.

Nessun servizio web esterno necessario.

---

# 162. Cache dati

Separare:

- application cache;
- IndexedDB user data;
- network cache.

---

# 163. Reset

Settings -> Dati:

- reset preferenze;
- reset cache;
- reset dati;
- reset completo.

Con conferme distinte.

---

# 164. Import/export sicurezza

Non eseguire dati importati.

JSON solo dati.

Mai importare script/html arbitrario.

---

# 165. Versione dati

Ogni backup deve contenere:

```text
schemaVersion
```

---

# 166. Build info

Mostrare in Informazioni:

- appVersion;
- build timestamp;
- commit opzionale;
- schema version.

---

# 167. Release docs

Ogni ZIP/release deve includere:

```text
docs/release/vX.Y.Z.md
```

Obbligatorio.

---

# 168. GitHub Actions

Workflow:

```text
checkout
setup-node
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
deploy
```

---

# 169. Lint

Usare ESLint.

TypeScript + Vue.

---

# 170. Formatting

Prettier consigliato.

---

# 171. Typecheck

Script:

```json
"typecheck": "vue-tsc --noEmit"
```

---

# 172. Unit test

Vitest consigliato.

---

# 173. Component test

Vue Test Utils.

---

# 174. E2E

Playwright.

---

# 175. CI gate

Non pubblicare se fallisce:

- lint;
- typecheck;
- test;
- build.

---

# 176. Performance budget

Indicativo:

- initial JS contenuto;
- lazy route;
- immagini ottimizzate;
- niente bundle Element Plus completo se non necessario.

Preferire auto-import/tree shaking.

---

# 177. Element Plus import

Importare componenti su richiesta.

Non fare:

```ts
app.use(ElementPlus)
```

se questo comporta bundle completo non necessario, salvo verifica del tree shaking.

---

# 178. Icons

Usare:

```text
@element-plus/icons-vue
```

o set locale.

Niente font icone remoto obbligatorio.

---

# 179. Font

Preferire:

- system fonts;
- font self-hosted.

Niente Google Fonts obbligatorio.

---

# 180. Content control

L'app deve minimizzare dipendenze da domini generici esterni.

Questo riduce problemi in reti aziendali con:

- web filtering;
- content control;
- blocchi CDN.

---

# 181. Sicurezza API calendario

Il frontend deve usare solamente POST.

Non inserire URL ICS nella query string del proxy.

---

# 182. Secrets ICS

Un URL ICS privato può contenere token.

Non mostrarlo in chiaro nella UI se non necessario.

Prevedere campo con:

```text
mostra/nascondi
```

---

# 183. Logging ICS

Non loggare URL completo nella console in produzione.

---

# 184. Dev mode

Solo con:

```js
debug: true
```

mostrare:

- device profile;
- viewport;
- sync details;
- error stack.

---

# 185. Debug overlay

Opzionale.

Mostrare:

```text
family
orientation
aspectRatio
sizeIndex
uiScale
fontScale
```

Solo sviluppo.

---

# 186. Telefono portrait - calendario clipping

Test obbligatorio:

ultima colonna Domenica completamente visibile.

Nessun mese deve uscire dal container.

---

# 187. Calendar month layout

Usare CSS Grid:

```css
grid-template-columns: repeat(7, minmax(0, 1fr));
```

Non usare larghezze fisse per i giorni.

---

# 188. Calendar year layout

Usare:

```css
grid-template-columns:
  repeat(var(--year-columns), minmax(0, 1fr));
```

`--year-columns` dipende dal device profile.

---

# 189. Dialog overflow

Ogni dialog deve avere:

```css
max-height
overflow-y: auto
```

nel body interno.

Header/footer devono restare accessibili.

---

# 190. Timer modal laptop

Test automatico:

a 1366×768:

```text
dialog width < viewport width
dialog height < viewport height
not fullscreen
```

---

# 191. Toolbar phone

Testare:

- 390 px;
- 375 px;
- 360 px;
- safe-area.

I pulsanti devono restare utilizzabili.

---

# 192. Touch feedback

Tap:

- feedback visivo;
- non eccessivo.

No hover-only.

---

# 193. Focus desktop

Focus ring coerente con design.

Non rimuovere outline senza sostituzione.

---

# 194. Scrollbar

Desktop:

scrollbar discreta.

Mobile:

browser native.

Non creare scrollbar custom troppo invasiva.

---

# 195. Test iOS

Obbligatorio:

- Safari iPhone portrait;
- Safari landscape;
- barra indirizzi espansa/ridotta;
- PWA standalone;
- tastiera aperta;
- safe area.

---

# 196. Test Android

Chrome:

- portrait;
- landscape;
- PWA.

---

# 197. Test desktop

Almeno:

- Chrome;
- Edge;
- Firefox;
- Safari se disponibile.

---

# 198. Browser support

Target moderno:

- ultime versioni principali;
- iOS Safari moderno;
- Android Chrome moderno.

Non supportare browser legacy se ciò complica drasticamente l'architettura.

---

# 199. Progressive enhancement

Se una feature non esiste:

- fullscreen;
- persistent storage;
- visualViewport;

l'app deve continuare a funzionare.

---

# 200. Criterio finale del progetto

La nuova Istante deve sembrare progettata nativamente per:

- telefono;
- tablet;
- laptop/PC;
- TV.

Non deve dare la sensazione di un'app desktop adattata con breakpoint.

Il progetto deve avere:

- un solo design system;
- un solo layer responsive;
- componenti isolati;
- responsabilità chiare;
- dati centralizzati;
- nessun CSS patch cumulativo;
- nessun motore legacy nascosto;
- nessuna dipendenza CDN obbligatoria;
- build riproducibile;
- test automatici;
- documentazione.

---

# 201. Definition of Done

Una release può essere dichiarata pronta quando:

- `npm ci` funziona;
- `npm run lint` passa;
- `npm run typecheck` passa;
- `npm run test` passa;
- `npm run build` passa;
- `dist/` è pubblicabile;
- nessun errore console critico;
- nessun overflow imprevisto;
- nessun layout rotto nei viewport obbligatori;
- timer desktop non fullscreen;
- phone portrait dashboard corretta;
- phone landscape dashboard corretta;
- calendario phone corretto;
- ICS direct-first + proxy fallback funzionante;
- storage funziona;
- PWA installabile;
- offline shell funzionante;
- documentazione aggiornata;
- `docs/release/vX.Y.Z.md` presente.

---

# 202. Principio conclusivo

**Istante non deve essere una dashboard responsive nel senso tradizionale.**

Deve essere una sola applicazione che assume quattro forme differenti in base al contesto:

```text
PHONE
TABLET
DESKTOP
DISPLAY
```

Devono rimanere comuni:

- identità;
- dati;
- logica;
- servizi;
- componenti base.

Devono cambiare in modo consapevole:

- gerarchia;
- composizione;
- densità;
- interazione;
- dimensione;
- posizione;
- comportamento.

Prima di sviluppare qualsiasi componente bisogna rispondere a queste domande:

```text
Qual è il suo ruolo?
Quanto è importante?
Dove deve stare su Phone?
Dove deve stare su Tablet?
Dove deve stare su Desktop?
Dove deve stare su Display?
Come viene usato via touch?
Come viene usato via mouse?
Cosa succede con altezza molto ridotta?
Cosa succede con larghezza molto elevata?
Cosa succede offline?
Cosa succede se il servizio esterno fallisce?
```

Solo dopo queste risposte si deve implementare il componente.

La versione 3.13.11 deve restare il riferimento per ciò che Istante deve saper fare e per l'atmosfera che deve trasmettere.

**Il nuovo codice, invece, deve nascere completamente da zero.**
