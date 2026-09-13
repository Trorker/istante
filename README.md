# Istante 4.0.0

**Un momento, per te.**  
Progetto di **Ruslan Dzyuba** — <https://istante.ruslan-dzyuba.it/>

Istante 4 è la riscrittura completa in **Vue 3** della dashboard/screensaver personale Istante. La 4.0.0 mantiene l'identità visiva carta/e-ink e le funzioni consolidate della linea 3.14.x, ma sostituisce la vecchia struttura stratificata con una codebase a componenti, store, service e composable separati.

La 3.14.4 resta il riferimento visivo e comportamentale usato durante la migrazione. `dist/` è un artefatto generato: non va modificato a mano.

## Obiettivi della 4.0

- stessa identità grafica: superfici carta/e-ink, tipografia, palette, gerarchie e atmosfera;
- Vue 3.5 con componenti separati per dominio;
- una sola sorgente di verità per Phone, Tablet, Desktop e TV;
- stato condiviso tramite store, senza binding DOM globali;
- accesso a storage/rete/audio confinato nei service;
- calendario composto da viste indipendenti;
- build riproducibile e release verificata prima dello ZIP;
- funzionamento offline-first senza CDN JavaScript o font remoti;
- compatibilità/migrazione dalla linea 3.14.x.

## Funzioni principali

### Dashboard

- orologio digitale o analogico, 12/24 ore e secondi opzionali;
- tema chiaro, scuro, automatico o **Segui il sole**;
- cielo con sole/luna, stelle, effetti e meteo opzionale;
- sfondo atmosfera, carta pulita, fotografia personale o Picsum;
- traguardo annuale o personalizzato;
- prossimo evento del calendario;
- controlli a scomparsa, cursore personalizzato, Wake Lock, rintocco e feedback touch.

### Pensieri e Biblioteca

- 1.000 pensieri inclusi;
- programmazione mattina/sera, giornaliera, a intervallo o all'apertura;
- macchina da scrivere con ritmo naturale, errori/correzioni e ripetizione;
- preferiti e **storico** locale;
- raccolte personali con creazione, modifica, eliminazione, import JSON/TXT ed export;
- catalogo raccolte;
- ricezione di pensieri tramite link `#p=…` e salvataggio in **Pensieri ricevuti**;
- font Istante Classic / Excalifont e tre scale testo.

### Calendario

Le viste sono componenti distinti:

- `YearView`
- `MonthView`
- `WeekView`
- `DayView`
- `AgendaView`

Il calendario supporta feed ICS HTTPS, file ICS locali, fallback al proxy `calendar.php`, ricorrenze supportate dal parser locale, festività italiane offline, selezione delle sorgenti e prossimo appuntamento in dashboard.

Sul **Tablet** la regola è strutturale, non una patch CSS:

- Anno: nessuno scroll;
- Mese: nessuno scroll;
- Settimana: nessuno scroll;
- Giorno/Oggi: scroll consentito;
- Agenda: scroll consentito.

La Settimana mantiene sette colonne reali. Quando gli eventi eccedono lo spazio, la vista mostra l'accesso al Giorno invece di espandere verticalmente il layout.

### Colonna sonora

Un unico dominio audio alimenta mini-player, pannello audio, timer e programmazioni:

- Radio con catalogo, stazioni personali, preferiti, riordino e fasce programmate;
- Ambiente: rumore rosa, rumore marrone, pioggia e vento;
- Melodie procedurali offline: **Respiro lento**, **Meditazione**, **Notturno**, **Onde lente**;
- tab nascoste automaticamente quando rimane una sola categoria attiva;
- cambio sorgente coerente anche quando una categoria viene disabilitata;
- gesture touch opzionali per play/pausa e volume sulla Dashboard.

### Timer

- interfaccia circolare coerente con Istante;
- countdown come unico testo dentro il cerchio;
- regolazione durata con controlli esterni;
- durata fino a 24 ore;
- Silenzio / Radio / Ambiente modificabili anche a timer avviato;
- azione finale configurabile.

### Condivisione

- link portabile del pensiero;
- QR generato localmente;
- cartolina PNG generata con Canvas sul dispositivo;
- condivisione nativa quando supportata;
- nessun servizio esterno per generare QR o immagine.

### Backup e migrazione

Il backup v4 salva la configurazione locale e può importare anche backup della linea 3.x. Il ripristino è transazionale per ridurre il rischio di stato parziale.

I calendari remoti sono esportati come **URL**, non come copia del file ICS; dopo il ripristino su un altro dispositivo vengono risincronizzati. I calendari importati da file restano invece incorporati.

## Aggiornamenti PWA

La politica resta quella approvata nella 3.14.4:

1. la nuova versione viene rilevata e compare **Update now**;
2. per le prime 72 ore decide l'utente quando aggiornare;
3. trascorse 72 ore dalla prima rilevazione su quel dispositivo, l'update parte automaticamente;
4. il service worker è generato dalla build partendo dagli asset realmente presenti;
5. un asset temporaneamente indisponibile non blocca per sempre l'installazione;
6. durante il cambio release viene mantenuta una cache precedente come fallback.

## Architettura

```text
src/
├── app/            bootstrap Vue, versione e profilo dispositivo
├── views/          viste applicative principali
├── components/     componenti divisi per dominio
├── stores/         stato reattivo e azioni di dominio
├── services/       storage, rete, ICS, audio, backup, update, share
├── composables/    comportamento UI riutilizzabile
├── data/           definizioni applicative locali
└── styles/         sette domini CSS con ownership esplicita

public/             asset statici, font, Vue locale, dati e documentazione
scripts/            build, check, server locale e release
tests/              test puri e smoke test
dist/               output generato, mai modificato a mano
```

La versione attuale usa **Vue 3.5.13 locale + ES modules browser** e un builder Node senza dipendenze npm runtime/build. Questa scelta rende la build riproducibile anche senza registry o CDN. I confini dei componenti sono già predisposti per un eventuale passaggio futuro a SFC/Vite senza cambiare store, service o modello responsive.

## Profili dispositivo

La classificazione vive in un solo modulo:

- Phone: `<= 740 px`
- Tablet: `741–1180 px`
- Desktop/Laptop: `1181–1799 px`
- TV: `>= 1800 px`

Il root riceve `data-device`, `data-orientation` e `data-height`. I CSS non definiscono breakpoint di larghezza indipendenti.

## Sviluppo

Richiede Node.js 20 o successivo.

```bash
npm run build
npm run check
npm test
npm run serve
```

Per produrre lo ZIP di pubblicazione:

```bash
npm run release
```

### Regole di qualità automatiche

`npm run check` fallisce se rileva:

- errori di sintassi JavaScript;
- globali legacy `window.Istante*`;
- store che accedono direttamente a `localStorage`;
- `!important` nei CSS;
- media query `min-width` / `max-width` fuori dal sistema device-profile;
- selettori del calendario full-screen fuori dal suo dominio CSS;
- import relativi mancanti;
- asset dichiarati nel manifest PWA ma assenti in `dist/`.

## Pubblicazione

Pubblicare **solo il contenuto di `dist/`** sul percorso HTTPS del sito. Non pubblicare `src/`, `tests/` o `scripts/` sul sito di produzione.

Per ridurre il rischio di pubblicazione parziale, quando il pannello hosting lo consente è preferibile caricare `version.json` e `sw.js` per ultimi.

## Documentazione

- `docs/ARCHITETTURA-V4.md` — architettura e regole di manutenzione;
- `docs/release/v4.0.0.md` — note della release;
- `CHANGELOG.md` — storico;
- `docs/VISIONE-E-DESIGN.md` — principi grafici;
- `docs/LICENZA.md` — licenza del progetto;
- `docs/TERZE-PARTI.md` — componenti e servizi esterni.

## Licenza

Istante è un progetto sorgente disponibile per uso non commerciale con attribuzione obbligatoria. Le dipendenze e i contenuti di terze parti mantengono le rispettive licenze.
