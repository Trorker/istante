# Architettura Vue di Istante

**Riferimento:** v4.0.0  
**Obiettivo:** separare UI, responsive, servizi e dati senza alterare il linguaggio visivo di Istante.

## Principio

La v4 non considera più `index.html` come l'applicazione. `index.html` contiene solo
metadata, boot screen e il mount point `#app`. Tutta l'interfaccia viene creata da
Vue 3.

La UI è composta da componenti, mentre i motori che non hanno responsabilità di
rendering restano moduli JavaScript separati. Questo evita di riscrivere logiche
stabili (ICS, audio, backup, astronomia) ogni volta che cambia la disposizione.

## Albero dei componenti

```text
IstanteApplication
└─ AppRoot
   ├─ AppBackdrop
   ├─ AppShell
   │  ├─ AppTopbar
   │  └─ StageViewport
   │     ├─ HomeMainStage
   │     ├─ HomeInfoDock
   │     └─ BottomToolbar
   ├─ CalendarView
   ├─ SettingsDialog
   ├─ TimerDialog
   ├─ WeatherDialog
   ├─ GoalDialog
   ├─ LibraryDialog
   ├─ CollectionCreateDialog
   ├─ CollectionEditDialog
   ├─ StationsDialog
   ├─ ShareDialog
   ├─ WelcomeDialog
   ├─ TourDialog
   ├─ BackupDialog
   ├─ ReceivedDialog
   ├─ CalendarSourcesDialog
   ├─ CalendarEventDialog
   ├─ ToastHost
   └─ ViewDots
```

Anche `leggi.html` usa un componente Vue dedicato (`DocumentApp`).

## Responsive

Il responsive è una responsabilità globale unica. `viewport.js` calcola:

- famiglia: `phone`, `tablet`, `computer`, `display`;
- orientamento: `portrait`, `landscape`, `square`;
- forma: `tall`, `balanced`, `wide`, `ultrawide`;
- `--viewport-index`: rapporto `vw / vh`;
- `--viewport-size-index`: dimensione ottica del viewport;
- `--device-font-scale`: scala tipografica automatica;
- `--device-ui-scale`: scala dei controlli.

Il rapporto decide **come** ricomporre l'interfaccia. La dimensione ottica decide
**quanto** grandi devono essere font e controlli. Una TV 16:9 e un telefono 16:9
non condividono quindi la stessa scala.

## Regola per i componenti

Un componente possiede il proprio markup e non deve duplicare breakpoint in file
sparsi. Le variazioni geometriche condivise restano in `assets/css/layout.css`.
Le regole visuali di base restano in `assets/css/istante.css`.

Non creare più file `polish-x.y.z.css`.

## Servizi applicativi

I file in `assets/js/` sono trattati come servizi non visuali. La v4 li carica
solo **dopo** che Vue ha montato tutto il DOM, così i moduli esistenti possono
agganciarsi agli ID senza race condition.

La migrazione futura può spostare progressivamente stato e azioni in composable
Vue senza cambiare nuovamente il markup. Il contratto è: un servizio non deve
creare intere schermate quando esiste già un componente responsabile di quella
schermata.

## Configurazione runtime

`config/runtime.js` viene caricato prima dell'app Vue. Consente di cambiare
l'endpoint calendario senza ricostruire la release:

```js
window.ISTANTE_CONFIG = {
  calendarApiUrl: 'https://api.example.it/calendar.php'
};
```

Questo permette di distribuire il frontend su GitHub Pages e tenere soltanto
l'API ICS su un hosting PHP.

## Dipendenze

Vue 3.5.13 è incluso localmente in `vendor/vue.global.prod.js`. Nessun framework
UI o CDN è richiesto per avviare l'applicazione.
