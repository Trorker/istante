# Istante
## v3.1.0

Un orologio, un pensiero, una piccola colonna sonora. Sito statico: nessun backend, compilazione, dipendenza da installare o chiave API da inserire.

## Avvio e pubblicazione

Apri `index.html` per utilizzare la parte locale. Per usare tutte le funzioni, pubblica **il contenuto di questa cartella** su un hosting HTTPS: `index.html` deve trovarsi direttamente nella cartella che apri nel browser, insieme ad `assets`, `data`, `docs`, `manifest.webmanifest` e `sw.js`. Funziona anche in una sottocartella, per esempio `/istante/`.

Per una prova locale, dalla cartella del sito:

```sh
python -m http.server 8080
```

Apri `http://localhost:8080`. L'apertura diretta con `file://` non abilita il service worker e, a seconda del browser, limita memoria, ricerca online, GPS e servizi esterni.

### Aggiornare dalla 1.2

Fai una copia dei file precedenti e sostituisci la cartella pubblicata con il contenuto di questa versione, **nello stesso percorso e sullo stesso dominio**. Non sovrascrivere soltanto `index.html`: i percorsi delle risorse sono cambiati. Non servono più vecchi `original.css`, `refinements.css`, cartelle `sito`, `sviluppo` o copie di altri rilasci nella directory pubblica.

Preferenze, preferiti, foto e raccolta personale restano nel browser: viene mantenuto lo spazio di memoria della serie Original. Non cancellare i dati del sito per aggiornare. Le due vecchie stazioni Flux che non fanno parte del nuovo elenco vengono ricondotte alla stazione iniziale Chillhop.

La cache usa la versione `3.1.0`. Quando il nuovo service worker prende il controllo, una pagina già controllata dalla vecchia versione viene ricaricata una volta. Se un hosting o un proxy conserva ancora i file vecchi, svuota la cache **del server/CDN**, poi chiudi e riapri le schede di Istante. Non impostare una cache permanente per `sw.js` o `index.html`.

## Struttura

```text
istante-v3.1.0/
  index.html                 Pagina e struttura dell'interfaccia
  README.md                  Questo documento
  manifest.webmanifest       Installazione come applicazione web
  sw.js                      Cache offline del sito
  assets/
    css/app.css              Un solo foglio di stile
    icons/                   Icone dell'applicazione
    js/                      Moduli della pagina, selettori, radio ed effetti
  data/
    phrases.js               Unica raccolta inclusa: 700 frasi originali
    stations.js              Catalogo ordinato delle 22 radio
  docs/
    releases/v3.1.0.md        Note di questo rilascio
    licenses/                Licenze del progetto, delle icone e del calcolo solare
```

La cartella contiene solo il sito e la sua documentazione. Non occorre estrarre un secondo archivio o scegliere fra più cartelle di produzione.

## L'interfaccia

Il saluto è tornato **sopra la data e l'orologio**, separato dalla riga con meteo, alba e tramonto. Cambia con l'ora del dispositivo. La frase rimane al centro. Il pulsante a freccia del player è circolare anche su telefono.

La selezione del testo è disattivata nell'intera interfaccia, inclusi raccolta e campi. Anche trascinamento del testo, selezione da mouse/tocco e scorciatoia Seleziona tutto sono disattivati. Nei campi si può comunque scrivere e spostare il cursore. I comandi espliciti **Copia frase** ed **Esporta raccolta** rimangono disponibili. Questo intervento riguarda l'interazione: non è una protezione dei contenuti o del codice sorgente.

## Impostazioni compatte

Le impostazioni sono raccolte in sette **accordion**, inizialmente chiusi. Si apre una sezione alla volta; la riga chiusa riassume la scelta attuale. **Salva impostazioni** applica le modifiche del modulo; **Annulla** le scarta.

| Sezione | Contenuto |
| --- | --- |
| Aspetto e schermo | Tema, sfondo, foto, cadenza Picsum, oscuramento, dimensione testi e orologio |
| Frasi e scrittura | Rotazione, orari, macchina da scrivere, velocità, ritmo, errori e cancellazione |
| Località e cielo | Ricerca città, coordinate, GPS, meteo, alba e tramonto |
| Effetti ambientali | Attivazione, anteprima, aloni, particelle, aurora e meteo decorativo |
| Radio e audio | Visibilità del player, stazione e volume |
| Il tuo traguardo | Nuovo anno o conto alla rovescia personalizzato |
| Modalitè screensaver | Comandi a scomparsa, transizioni e richiesta di schermo acceso |

Menu, calendario e selettore dell'ora sono personalizzati. Nei selettori di cadenza compare anche un campo numerico; nel calendario e nell'ora rimane l'inserimento manuale. **Esc** chiude il selettore senza applicare una nuova scelta. Gli errori di compilazione aprono la sezione da correggere.

## Tema, cielo e fotografie

**Notte**, **Carta** e **Auto** restano sempre disponibili. Auto segue il tema del dispositivo. Quando imposti una località compare **Segui il sole**, come **quarta scelta nella stessa riga**, dopo le altre tre: non occupa più una riga intera. La posizione non attiva automaticamente il tema solare.

Con coordinate salvate, alba e tramonto sono disponibili anche senza API tramite un calcolo locale. Il tema solare usa quegli orari. Se abilitate, le transizioni mostrano per pochi secondi un sole o una luna. Il meteo non aggiornabile è indicato come salvato e, dopo tre ore, nascosto; l'effetto meteo automatico richiede invece dati di meno di 45 minuti. Nessuna località o condizione meteorologica viene inventata.

Picsum carica fotografie 1920 × 1080 a intervalli, anche personalizzati da 1 a 1.440 minuti. La selezione è stabile nello stesso intervallo. La nuova foto viene preparata prima della dissolvenza; in caso di errore resta l'ultima disponibile, oppure lo sfondo locale se non esiste ancora una foto. La fotografia personale resta sul dispositivo.

## Effetti visibili, non invadenti

Apri **Effetti ambientali**, attiva il relativo interruttore e scegli l'effetto. L'**anteprima nella sezione è animata e risponde subito** a effetto, intensità e velocità. Salva per applicarla allo screensaver. Annullando, lo sfondo conserva le scelte precedenti.

Gli effetti hanno un interruttore indipendente da **Transizioni dell'interfaccia**: spegnere le transizioni non spegne più aloni e particelle. Restano facoltativi, disattivati inizialmente; in una installazione già usata viene conservata la scelta salvata.

Puoi combinare aloni, particelle o aurora con luce del sole, nuvole, pioggia, neve, nebbia o temporale. I colori degli aloni possono seguire alba e tramonto. Le scelte meteo manuali sono decorative e non richiedono Internet. **Segui il meteo attuale** necessita di dati recenti: senza dati, la parte meteorologica si spegne e l'eventuale animazione principale continua.

Gli strati sono dietro il contenuto e sopra l'oscuramento delle foto. Il movimento è attenuato al centro. Il temporale usa un chiarore lento, non lampi improvvisi. Le animazioni dello sfondo si fermano mentre un dialogo è aperto; l'anteprima continua solo nella sezione Effetti aperta. Nelle schede nascoste il rendering si ferma. **Movimento ridotto** del sistema ha sempre precedenza: viene conservata una scena statica anziché forzare l'animazione.

## Radio: il catalogo completo

Il mini player include **22 voci**, nello stesso ordine richiesto. Il menu ha una ricerca per nome. La stazione iniziale rimane FluxFM | Chillhop. Play avvia la connessione; pausa la chiude. Non parte musica all'avvio della pagina o al ritorno della rete. Stazione e volume cambiati direttamente dal mini player vengono salvati subito.

**Non tutte le voci sono stream ufficiali con un indirizzo fisso verificabile.** Per 13 sono configurate sorgenti pubbliche; per 9 viene interrogato Radio Browser soltanto al primo Play. La ricerca controlla nome e dominio del fornitore: se non identifica una sorgente coerente, la radio rimane non disponibile, senza sostituirla con una stazione diversa.

| N. | Voce del player | Individuazione dello stream |
| --- | --- | --- |
| 01 | Lofi Girl (Community Relay) | Ricerca al primo Play |
| 02 | Laut.FM \| Lofi 24/7 | Stream configurato |
| 03 | Zeno FM \| Study Lofi | Ricerca al primo Play |
| 04 | Zeno FM \| Chill Beats | Ricerca al primo Play |
| 05 | Zeno FM \| Lofi Hip Hop | Stream configurato |
| 06 | Zeno FM \| Box Lofi | Ricerca al primo Play |
| 07 | Zeno FM \| The Bootleg Boy | Ricerca al primo Play |
| 08 | Fastcast4u \| Chill Lofi | Ricerca al primo Play |
| 09 | FluxFM \| Chillhop | Stream configurato |
| 10 | Nightride FM \| Chillsynth | Stream configurato |
| 11 | SomaFM \| Secret Agent | Stream configurato |
| 12 | SomaFM \| Deep Space One (Deep Ambient) | Stream configurato |
| 13 | SomaFM \| Groove Salad | Stream configurato |
| 14 | SomaFM \| Drone Zone | Stream configurato |
| 15 | SomaFM \| DEF CON Radio | Stream configurato |
| 16 | SomaFM \| Space Station | Stream configurato |
| 17 | SomaFM \| Vaporwaves | Stream configurato |
| 18 | SomaFM \| Synphaera | Stream configurato |
| 19 | Intense Radio \| FLAC / OGG | Stream configurato |
| 20 | Exclusively Pink Floyd | Ricerca al primo Play |
| 21 | Exclusively Pink Floyd \| Hits | Ricerca al primo Play |
| 22 | Radio Paradise \| Mellow Mix (FLAC Lossless) | Ricerca al primo Play |

### Disponibilità e qualità

Le dirette dipendono dall'emittente, dal browser e dalla rete. Le sorgenti sono state ricavate da documentazione o cataloghi pubblici, **non ascoltate live nell'ambiente di verifica di questo rilascio**. Un titolo nell'elenco non certifica disponibilità, identità ufficiale o qualità del relay.

- **Lofi Girl (Community Relay)** è indicato esplicitamente come relay community, non come stream ufficiale garantito. Le omonimie delle radio Zeno possono rendere la ricerca ambigua.
- Il riferimento chiamava **Chillsynth** “Hi-Res AAC”; il server pubblico consultato espone MP3 e Opus. Il player mostra questi formati, senza dichiarare un AAC ad alta risoluzione non verificato.
- **Intense Radio** pubblica un flusso FLAC in contenitore Ogg, con alternativa MP3. La denominazione del riferimento “Chillout” non corrisponde al genere dance/house/trance descritto dall'emittente. Il nome del player evita quella promessa.
- Per **Radio Paradise Mellow Mix**, il resolver privilegia un flusso indicato come FLAC se presente nel catalogo. Il player mostra il formato della sorgente effettivamente scelta. Non converte l'audio in lossless e non aumenta la qualità di una sorgente compressa.

Nel player trovi **Indirizzo della stazione**: puoi salvare un **URL HTTPS diretto** per la singola voce, oppure ripristinare la sorgente del catalogo. Serve il flusso audio, non una pagina web, un link YouTube o un indirizzo con credenziali. Le modifiche rimangono in questo browser. Per aggiornare il catalogo per tutti, modifica `data/stations.js` e pubblica un nuovo rilascio con cache aggiornata.

I tentativi sono limitati: ricerca su due server con timeout e, al massimo, tre sorgenti audio compatibili. Un errore o un'interruzione producono un messaggio nel player, non un blocco della pagina. Il volume effettivo su iPhone/iPad può dipendere dai tasti del dispositivo e dalle regole del sistema. FLAC consuma più banda; alcuni browser useranno l'alternativa compatibile, quando presente.

Istante non ospita, registra, scarica in cache o ritrasmette musica. I collegamenti non costituiscono un'autorizzazione per diffusione pubblica o impieghi commerciali: verifica le condizioni delle singole emittenti. In particolare SomaFM indica limiti per l'uso dei propri stream in prodotti e contesti pubblici.

## Frasi, dati e uso senza Internet

Sono mantenute tutte le **700 frasi originali**, con ricerca, preferiti e importazione/esportazione JSON. La scrittura carattere per carattere, gli errori scenici e la cancellazione restano separati dalla cadenza di scelta delle frasi: riscrivere non significa cambiare pensiero. La frase completa viene mantenuta invariata dopo ogni animazione.

La raccolta incorporata ha una sola fonte: `data/phrases.js`. Il contenuto è un oggetto con `version`, `language`, `count` e `phrases`, assegnato a `window.ISTANTE_PHRASES`. Per cambiare la raccolta soltanto sul tuo dispositivo, preferisci l'importazione JSON dal pannello Raccolta: non occorre toccare i file del sito.

Orologio, raccolta, scrittura, traguardi, selettori ed effetti decorativi sono locali. Per **riaprire il sito web interamente offline**, va prima caricato e salvato con successo nella cache su HTTPS o localhost. La cancellazione dei dati o le restrizioni di memoria del browser possono rimuovere tale cache. Se la memoria locale non è utilizzabile, la pagina continua nella sessione senza promettere il salvataggio.

Ricerca città, foto, meteo e radio usano servizi esterni solo quando richiesti dalla funzione attivata. Con una località salvata, i dati meteo possono essere aggiornati alle aperture successive. Le coordinate sono arrotondate a due decimali. Ricerca radio, fornitori delle immagini e delle dirette ricevono i normali dati di connessione. Non ci sono account, analytics aggiunti da Istante, iframe o video nascosti. I fornitori esterni applicano le proprie informative.

## Verifiche di questo rilascio

**59 test automatici Node** superati: calendario e rotazione delle frasi, 700 testi invariati, macchina da scrivere, calcolo solare, selezione degli effetti, catalogo delle radio, URL e cache. **37 verifiche dell'interfaccia** superate, eseguite in Chromium con i sorgenti caricati in memoria, API simulate e un mezzo audio simulato; includono dieci dimensioni di schermo, anteprima e movimento effettivo dei canvas, accordion, selettore solare, ricerca radio, assenza di autoplay, errori e memoria non disponibile.

Le policy dell'ambiente di verifica non consentono la navigazione HTTP del browser, neppure verso il server locale. La logica della cache è testata separatamente; **installazione reale del service worker, ascolto delle dirette, GPS, hosting e Safari su iPad fisico non sono certificati da questi test**. Schermo intero e mantenimento dello schermo acceso dipendono dal dispositivo. È uno screensaver web, non un salvaschermo installato nel sistema operativo.

## Fonti e licenze

Riferimenti dei servizi e delle librerie utilizzati; ulteriori URL delle emittenti sono accanto alle voci in `data/stations.js`.

- Material Icons e licenza SVG: https://developers.google.com/fonts/docs/material_icons
- Lorem Picsum: https://picsum.photos/
- Open-Meteo: https://open-meteo.com/en/docs
- Ricerca città: https://open-meteo.com/en/docs/geocoding-api
- Condizioni Open-Meteo: https://open-meteo.com/en/terms
- SunCalc 1.9.0: https://github.com/mourner/suncalc/tree/v1.9.0
- Radio Browser: https://api.radio-browser.info/
- Laut.fm: https://laut.fm/lofi
- FluxFM, sorgenti per player: https://www.fluxfm.de/p/Fur-externe-Player-1WZbsCt1TTDNUAfTWhwdZe
- Nightride, server pubblico: https://stream.nightride.fm/
- SomaFM, esempio di sorgenti e condizioni: https://somafm.com/secretagent/directstreamlinks.html
- Intense Radio: https://www.intenseradio.net/listen-mp3-aacp-opus-flac/
- Zeno, pagina della sorgente Hip Hop: https://zeno.fm/radio/LofiHipHopStream/
- Radio Paradise: https://radioparadise.com/listen/channels/mellow-mix
- Riferimento funzionale per il player: https://firewatch-outpost.vercel.app/

L'endpoint gratuito Open-Meteo è destinato all'uso non commerciale; per un impiego commerciale verifica le condizioni e il piano appropriato. La licenza delle icone e l'attribuzione a SunCalc sono incluse in `docs/licenses`, insieme alla licenza originaria del progetto. Non sono inclusi file font: la tipografia usa i caratteri del dispositivo. Le icone Material sono SVG locali.
