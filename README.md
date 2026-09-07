# Istante
## Un momento, per te.

**Dashboard / screensaver · v3.2.0**

Istante è una pagina da tenere dove preferisci: su un tablet, un secondo monitor, una scrivania o uno schermo in casa. Un piccolo spazio per rallentare, rilassarti e prenderti del tempo per te. Il tuo istante.

Ti fa compagnia dalla mattina alla sera con un orologio, una frase motivazionale e, quando lo desideri, una colonna sonora. Il conto alla rovescia ti ricorda quanto manca al tuo obiettivo: un viaggio, un progetto, una data importante, il prossimo capitolo. Il timer, invece, ti aiuta a ritagliare una pausa adesso.

Non vuole riempire lo schermo di informazioni. Vuole lasciare spazio: a un pensiero, a una fotografia, a una luce che cambia lentamente. Ogni funzione aggiuntiva è facoltativa e si può disattivare.

Il progetto è un **sito statico**, senza backend, account, compilazione o dipendenze da installare. Le frasi e la parte essenziale funzionano localmente. Fotografie online, meteo e radio utilizzano servizi esterni e non devono impedire allo screensaver di funzionare quando manca la connessione.

## Avvio e pubblicazione

Estrai lo ZIP. Per pubblicare il sito, carica **il contenuto di `istante-v3.2.0`** nella cartella del tuo hosting: `index.html` deve trovarsi accanto ad `assets`, `data`, `docs`, `sw.js` e `manifest.webmanifest`. Non è necessario cercare una seconda cartella di produzione. Funziona anche in una sottocartella, per esempio `/istante/`.

Utilizza HTTPS per la geolocalizzazione, la cache offline e le funzioni che richiedono un contesto sicuro. Per una prova locale:

```sh
python -m http.server 8080
```

Apri `http://localhost:8080`. Puoi aprire anche `index.html` direttamente, ma `file://` non abilita il service worker e può limitare memoria e servizi esterni in alcuni browser.

### Aggiornamento dalla 3.1.0

Conserva una copia della versione precedente e sostituisci **tutti i file**, incluso `sw.js`, mantenendo dominio e percorso. Preferenze, raccolta, preferiti, località e foto personale continuano a utilizzare lo stesso spazio di memoria della serie Original: non serve cancellare i dati del sito.

La cache e gli URL delle risorse usano `3.2.0`. Quando il nuovo service worker prende il controllo, la pagina già controllata dalla vecchia versione viene ricaricata una volta. Dopo un aggiornamento o una ricarica può essere necessario autorizzare di nuovo l'audio. Non applicare una cache permanente a `index.html` o `sw.js`; in caso di file vecchi, controlla prima la cache del server/CDN.

## La pagina principale

Il saluto segue l'ora del dispositivo ed è collocato sopra data e orologio. La frase rimane al centro. Alba, tramonto e meteo, se disponibili e abilitati, condividono una riga discreta; il conto alla rovescia verso il traguardo resta nella parte inferiore. Il mini player è in alto a destra.

Il timer si apre dal pulsante con l'orologio nella barra dei comandi o con **T**. Quando è in corso, compare un piccolo elemento con il tempo rimanente e il comando di pausa: non scompare insieme ai comandi inattivi. Se il timer è disabilitato, anche il suo pulsante viene nascosto.

I comandi possono scomparire dopo dieci secondi di inattività e ritornano al movimento del mouse o al tocco. La selezione del testo e il trascinamento sono disattivati. Nei campi si può comunque scrivere, correggere e spostare il cursore. I pulsanti espliciti **Copia frase** ed **Esporta** restano disponibili: bloccare la selezione non protegge il codice o i contenuti dalla copia.

## Le impostazioni

Le preferenze sono divise in otto sezioni a fisarmonica: **Aspetto e schermo**, **Frasi e scrittura**, **Località e cielo**, **Effetti ambientali**, **Radio e audio**, **Un tempo per te**, **Il tuo traguardo** e **Modalità screensaver**. Si espandono e richiudono con un passaggio morbido, senza mostrare una lista interminabile di controlli.

Le modifiche si applicano con **Salva impostazioni**. Annulla, il pulsante di chiusura ed Esc non salvano la bozza. L'anteprima degli effetti e il pulsante Prova suono servono a valutare una scelta prima di salvarla. Le scelte nel mini player, invece, sono immediate.

### Aspetto e movimento

Sono disponibili Notte, Carta e Auto. **Auto segue il tema del dispositivo.** Impostando una località compare, dopo le altre scelte e nella stessa riga, **Segui il sole**: Carta di giorno, Notte dopo il tramonto. Non viene selezionato automaticamente soltanto perché hai impostato le coordinate.

Gli sfondi possibili sono sfumatura, tinta unita, foto personale e foto automatiche Picsum a 1920 × 1080. La cadenza delle fotografie si può impostare da 1 minuto a 24 ore. La nuova foto viene caricata prima della dissolvenza; in caso di errore resta la precedente. Oscuramento, movimento della fotografia e scala dei testi sono regolabili.

Le animazioni accompagnano apertura e chiusura di impostazioni, raccolta, player e selettori, l'espansione delle sezioni, i passaggi del calendario e la comparsa/scomparsa dei comandi. Il controllo **Transizioni dell'interfaccia** le disattiva; viene rispettata anche la preferenza di sistema per il movimento ridotto. Gli effetti di sfondo mantengono il proprio interruttore indipendente.

### Frasi

Sono incluse tutte le **700 frasi originali**, senza riscriverle. Puoi cercarle, salvarle tra i preferiti, mostrarne una manualmente oppure importare/esportare una raccolta JSON. La scelta manuale non elimina il cambio automatico successivo.

La rotazione può seguire mattina e sera, una frase al giorno, intervalli o ogni apertura. La frase serale continua oltre mezzanotte fino al cambio mattutino. L'effetto macchina da scrivere ha velocità, pause, errori scenici/correzioni e ripetizione separati dalla rotazione delle frasi: riscrivere un testo non significa cambiarlo. Gli a capo rispettano le parole.

### Località, sole e meteo

Puoi cercare una città, inserire coordinate o premere il pulsante per usare la posizione del dispositivo. Nessun consenso GPS viene richiesto all'apertura.

Open-Meteo fornisce gli orari solari e le condizioni meteo. Con coordinate salvate, il calcolo astronomico locale consente di mantenere alba, tramonto e tema solare anche senza API. Gli orari calcolati localmente sono indicati come tali. Il meteo salvato viene etichettato e non viene presentato come aggiornato indefinitamente.

Aloni, particelle, aurora e piccoli effetti meteo possono essere attivati, selezionati e regolati. La sincronizzazione solare modifica i colori attorno ad alba e tramonto. Gli effetti scelti manualmente sono decorativi, non una previsione del tempo. Il meteo automatico richiede una località e dati recenti: senza questi requisiti non viene inventata una condizione. Il temporale non utilizza lampi improvvisi.

## Radio e programmazione

Il catalogo contiene le 22 stazioni della 3.1.0. Include emittenti con flussi diretti e voci community che cercano l'indirizzo della propria stazione al primo ascolto. L'app non sostituisce silenziosamente una stazione con un'altra quando non riesce a identificarla. Nel player puoi cambiare stazione, volume e mute, oppure specificare un URL HTTPS pubblico per quella voce.

La ricerca ha ora un'area separata e l'elenco scorre sotto di essa: i risultati non devono sovrapporsi al campo. La freccia del player rimane circolare. I flussi non vengono scaricati nella cache del sito e la loro disponibilità dipende dalle emittenti. Alcuni formati lossless o AAC possono non essere supportati dal browser; il catalogo conserva le sorgenti/fallback già previsti, senza promettere un formato non disponibile.

### Impostare una fascia musicale

In **Radio e audio**, abilita il player e poi **Programma la radio**. Scegli l'ora di accensione, l'ora di spegnimento e i giorni di partenza. Salva le impostazioni e premi **Abilita** nel player, oppure **Abilita audio per questa sessione** nella sezione della programmazione.

è prevista **una fascia ricorrente**, applicata ai giorni selezionati. Gli orari possono attraversare la mezzanotte: lunedì 22:00 → 07:00 termina martedì mattina. Il giorno selezionato è sempre quello di inizio. Inizio e fine uguali, o nessun giorno selezionato, non sono una programmazione valida.

Si utilizza **l'ora del dispositivo**, non il fuso della località meteo. Vengono costruite date locali, in modo da seguire i cambi di ora legale; una fascia non è interpretata come una somma fissa di 24 ore. Se autorizzi l'audio mentre sei già dentro una fascia, la radio prova a partire subito. Si usano stazione, volume e stato mute correnti del player.

Una pausa manuale durante la fascia viene rispettata: il controllo periodico non fa ripartire continuamente la radio. La prossima fascia può avviarla di nuovo. Alla fine della fascia la radio viene fermata anche se nel frattempo hai cambiato stazione. Errori di rete o blocchi del browser producono uno stato esplicito, non una raffica infinita di tentativi; puoi riprovare con Play.

### Limiti importanti dell'audio automatico

La programmazione funziona **con la pagina aperta e il dispositivo attivo**. Non accende il tablet, non apre il browser e non è una sveglia del sistema operativo. Una prima interazione prepara l'audio; il browser può comunque richiedere un nuovo Play, in particolare dopo una ricarica, una sospensione o per alcune sorgenti. In quel caso il player lo segnala.

Le schede in background e i dispositivi in standby possono ritardare l'esecuzione. Al ritorno viene verificata l'ora reale: non vengono riprodotte retroattivamente tutte le accensioni perse. La richiesta di mantenere lo schermo acceso può aiutare quando supportata, ma non garantisce che il sistema non sospenda l'app.

Riferimenti tecnici: [riproduzione e rifiuto dell'autoplay](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play), [visibilità della pagina e limitazione dei timer in background](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).

## Il timer: un tempo per te

Apri **Il tuo tempo** dal pulsante dedicato o con T. Scegli ore, minuti e secondi, oppure una durata rapida: 5, 15, 25, 45 o 60 minuti. Il timer accetta **da 1 secondo a 24 ore**. Premi **Inizia il tuo momento**; puoi mettere in pausa, riprendere o annullare. Chiudere il pannello non annulla il timer.

In **Impostazioni → Un tempo per te** scegli la durata iniziale e cosa succede alla fine:

- **Riproduci un suono**: piccoli rintocchi, campana morbida o segnale delicato, con volume dedicato e anteprima. I suoni sono sintetizzati sul dispositivo e non richiedono file musicali o connessione.
- **Avvia la radio selezionata**: usa la stazione e il volume del player. Se la radio sta già suonando, non viene interrotta per risintonizzarla inutilmente. Se non può partire, resta l'avviso visivo e viene tentato il suono locale, quando disponibile; il pulsante consente di riprovare.
- **Solo avviso visivo**: il tempo termina senza avviare audio.

Il tempo rimanente deriva da una scadenza assoluta, non da un contatore che sottrae un secondo a ogni callback. Se il browser ritarda gli aggiornamenti, alla ripresa viene mostrato il tempo effettivo. Un timer in pausa conserva il tempo residuo.

Lo stato del timer è salvato nella **sessione della scheda** e sopravvive alla normale ricarica della stessa scheda quando il browser consente lo storage. Non viene condiviso tra dispositivi. Se viene ritrovato già scaduto al caricamento, compare l'avviso, senza un avvio audio tardivo non richiesto. Non è garantita l'esecuzione a pagina chiusa o durante lo standby.

Il timer è indipendente dal conto alla rovescia del traguardo e dalla fascia musicale. Una fine timer configurata per la radio può avviarla anche fuori fascia; un successivo orario di spegnimento programmato continua a essere rispettato. L'avviso visivo viene sempre mostrato, anche se la rete o l'autorizzazione audio non sono disponibili.

## Coerenza tra le opzioni

Disabilitando la radio, vengono nascosti i suoi controlli e disabilitata la programmazione. La radio non è più selezionabile come fine timer; una selezione preesistente viene ricondotta al suono locale. Riabilitare il player non riattiva da solo una programmazione che è stata spenta.

Disabilitando il timer, scompaiono i suoi comandi e si annulla quello eventualmente in corso. Scegliendo un avviso diverso dal suono, i relativi selettori non restano attivi. Lo stesso principio vale per secondi/orologio, opzioni delle foto, scrittura/transizioni, effetti e meteo automatico: i controlli non applicabili vengono nascosti o resi inattivi senza inviare operazioni incoerenti.

## Selettori di data e ora

Su telefoni e tablet touch, un campo che richiede data e ora si apre in due passaggi: **Giorno**, poi **Orario**. Puoi tornare indietro senza perdere la scelta. I campi che richiedono soltanto l'ora aprono direttamente il quadrante.

L'orario usa un quadrante circolare a **24 ore**, con due anelli per le ore e un quadrante per i minuti. Dopo l'ora si passa ai minuti; puoi anche toccare le cifre in alto per scegliere quale parte modificare. Il trascinamento permette di impostare ogni minuto, non soltanto i multipli di cinque. Le frecce della tastiera regolano il valore con precisione.

Rimane disponibile l'inserimento manuale `GG/MM/AAAA HH:MM` o `HH:MM`. Date impossibili, ore fuori intervallo e orari inesistenti nel passaggio all'ora legale vengono segnalati. Solo **Conferma** applica il valore. Sul desktop calendario e quadrante possono comparire affiancati.

## Senza Internet, privacy e limiti

Orologio, frasi, raccolta, timer, suoni locali, selettori e parte decorativa non richiedono la rete. Con le coordinate salvate resta il calcolo solare locale. La fotografia precedente viene mantenuta; la radio si ferma con un messaggio; il meteo non aggiornabile non viene spacciato per attuale.

Per **riaprire il sito completamente offline** occorre aver prima completato il caricamento online e l'installazione della cache in un browser compatibile. Il service worker memorizza i file del sito, non le dirette radio o tutte le risposte delle API. Le condizioni dello storage privato e le eventuali espulsioni della cache dipendono dal browser.

Preferenze, preferiti, foto, raccolta, posizione scelta e URL radio personalizzati restano in questo browser. Non esiste una sincronizzazione cloud o un account Istante. Foto Picsum, geocodifica, meteo, registro radio e dirette contattano servizi terzi quando utilizzati; tali servizi ricevono le informazioni tecniche necessarie alla connessione. Nessun sistema di analisi o tracciamento è stato aggiunto da Istante.

Per una pubblicazione commerciale verifica i termini e gli eventuali piani dei servizi esterni, in particolare [Open-Meteo](https://open-meteo.com/en/terms), e i diritti delle emittenti. L'inclusione di un collegamento non trasferisce diritti sui brani. Le voci community non sono una dichiarazione di affiliazione ufficiale.

## Struttura del progetto

```text
istante-v3.2.0/
  index.html
  README.md
  manifest.webmanifest
  sw.js
  assets/
    css/
      app.css                 Stile base della dashboard
      interactions.css        Pannelli, quadranti, timer e interazioni
    icons/                    Icone dell'applicazione
    js/
      core.js                 Preferenze, raccolta e rotazione frasi
      controls.js             Select, calendario e quadrante
      motion.js               Transizioni e accordion
      time-core.js            Calcoli puri di timer e programmazione
      moments.js              Interfaccia timer, suoni e orari radio
      radio.js                Riproduzione e catalogo radio
      experience.js           Foto, scrittura e dati ambientali
      effects.js              Effetti di sfondo
      solar.js                Calcolo solare locale
      typing.js               Sequenza della macchina da scrivere
      icons.js                Material Icons SVG locali
      main.js                 Coordinamento della pagina
  data/
    phrases.js                Le 700 frasi originali
    stations.js               Le 22 stazioni
  docs/
    releases/v3.2.0.md         Note di questo rilascio
    licenses/                 Licenze del progetto e risorse incluse
```

Sono incluse soltanto risorse del sito, README, note del rilascio corrente e licenze: niente screenshot, test, copie di vecchie versioni o cartelle di compilazione.

## Verifiche di questa versione

Sono stati eseguiti 30 test sulle funzioni pure: validazione, fasce giornaliere e notturne, giorni selezionati, cambi d'ora, scadenze del timer, dipendenze delle preferenze e conservazione integrale delle 700 frasi. Sono stati controllati anche i flussi di interfaccia per ricerca radio, selettori, timer, programmazione e indisponibilità audio/rete.

La resa è stata verificata in Chromium con viewport 1440×900, 1920×1080, 1024×768, 768×1024, 390×844, 360×640 e 844×390. Per questi test sono stati caricati gli stessi script e stili della distribuzione in un ambiente locale isolato; storage, rete ed eventi delle dirette sono stati simulati. Questo non equivale a una prova di ascolto delle emittenti, della cache su un hosting reale o su un iPad fisico. Va verificato il comportamento dell'audio sul dispositivo di destinazione.
