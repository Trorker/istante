# Architettura Vue di Istante 4.1

**Base funzionale:** Istante 3.13.11  
**Obiettivo:** conservare le funzionalita stabili della 3.13.11 e sostituire la struttura monolitica della UI con componenti Vue.

## Principio

`index.html` non contiene piu l'interfaccia completa. Contiene solo metadata, boot screen e il mount point `#app`.
Vue monta la UI prima dell'avvio dei motori applicativi storici, cosi i servizi trovano tutti gli ID attesi senza race condition.

## Albero principale

```text
AppRoot
├─ AppBackdrop
├─ AppShell
│  ├─ AppTopbar
│  ├─ HomeMainStage
│  ├─ HomeInfoDock
│  └─ BottomToolbar
├─ CalendarView
├─ TimerDialog
├─ SettingsDialog
├─ WeatherDialog
├─ GoalDialog
├─ LibraryDialog
├─ ShareDialog
├─ CalendarSourcesDialog
├─ CalendarEventDialog
└─ altri dialog/componenti secondari
```

I componenti sono in `src/vue/components/`. Il bundle browser pronto per GitHub Pages e in `assets/vue/istante-vue.js`.

## Servizi

Audio, calendario ICS, astronomia, meteo, backup, raccolte e persistenza restano moduli separati in `assets/js/`.
Sono caricati **dopo** il mount Vue da `src/vue/core/service-loader.js`.

Questa separazione consente di riscrivere gradualmente lo stato interno in composable/store senza rompere la UI in una singola migrazione.

## Calendario ICS

Il motore prova prima l'URL ICS direttamente dal browser. Se il provider blocca CORS, usa automaticamente:

`https://api.istante.ruslan-dzyuba.it/calendar.php`

La configurazione e in `config/runtime.js` e puo essere cambiata senza ricostruire l'app.

## CSS

- `assets/css/istante.css`: baseline visuale consolidata dalla 3.13.11.
- `assets/css/responsive.css`: **unico proprietario della geometria responsive**.
- `assets/css/documents.css`: pagina documentazione.

Non creare piu file `polish-x.y.z.css`.

## Dipendenze UI

La UI e costruita con componenti Vue 3 locali. Non dipende da una CDN per la libreria grafica: questo evita che un content-control esterno renda inutilizzabile l'interfaccia e mantiene il bootstrap disponibile offline. I componenti applicativi restano in `src/vue/components/`; i motori storici della 3.13.11 vengono caricati come service layer dopo il mount e possono essere migrati progressivamente senza cambiare il contratto DOM.
