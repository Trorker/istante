# Istante

**Versione attuale: 3.4.0**

## Il tuo istante. Prenditi un momento per te.

Istante è una dashboard e uno screensaver web da tenere dove preferisci: sulla scrivania, su un tablet, su un monitor di casa o in uno spazio tutto tuo. Una pagina che ti fa compagnia dalla mattina alla sera, senza chiederti continuamente attenzione.

L'orologio accompagna la giornata. Le frasi motivazionali ti lasciano un pensiero su cui fermarti. La radio crea una colonna sonora discreta. Il conto alla rovescia ti ricorda quanto manca al tuo prossimo obiettivo: un viaggio, un progetto, una data da aspettare. E il timer ti aiuta a ritagliare un piccolo spazio per rilassarti, respirare o concentrarti.

Fotografie, luce e piccoli movimenti rendono lo schermo vivo senza riempirlo. Istante non è una bacheca di notifiche e non vuole misurare ogni cosa. Vuole ricordarti che, tra quello che devi fare e quello che vuoi raggiungere, c'è anche il tempo per te.

[Apri Istante](https://ruslan-dzyuba.it/istante/)

## Uno spazio a modo tuo

Scegli tra tema Notte, Carta e Auto, che segue il dispositivo. Impostando una località puoi scegliere anche **Segui il sole**: luce di giorno e colori scuri dopo il tramonto. Il meteo e gli orari solari restano piccoli elementi facoltativi.

Puoi usare la tua fotografia oppure immagini automatiche da Picsum, decidere la cadenza delle 700 frasi, conservare le preferite e personalizzare la macchina da scrivere. Sfondo, animazioni, dimensione dei testi e formato dell'orologio si adattano al tuo schermo. Il formato predefinito è 24 ore.

Il player raccoglie radio da ascoltare, aggiungere, eliminare e salvare nei preferiti. Con **Sorprendimi** inizia subito una stazione diversa, fermando quella precedente. Puoi programmare più fasce di ascolto durante la giornata.

Il timer ha pausa e ripresa. Può avviare la radio **durante** il tuo momento oppure **alla fine**, o concludersi con un suono locale o un avviso visivo. La musica avviata dal timer si ferma con la pausa o la conclusione, salvo che tu scelga di continuare con la radio; un ascolto già avviato o scelto manualmente non viene fermato dal timer. Le opzioni che richiedono la radio si disattivano quando il player è spento o non ci sono stazioni.

Con **Condividi** prepari sul dispositivo una cartolina della frase: formato quadrato o storia, orologio facoltativo, link e QR per ritrovare Istante. Puoi condividerla dove il browser lo consente, salvarla come PNG oppure inviare soltanto il link. Non vengono inclusi posizione, date personali, fotografie o contenuti dei pannelli.

## Dove usarlo

Istante è un sito statico: niente account, database, compilazione o backend. Pubblica **tutto il contenuto della cartella del sito**, mantenendo i percorsi, sulla root del tuo hosting o in una sottocartella. Il file di ingresso è `index.html`.

Usa **HTTPS** per geolocalizzazione, condivisione nativa, copia del link e cache offline. Per una prova locale:

```sh
python3 -m http.server 8080
```

Apri `http://localhost:8080`. Aprendo il sito con `file://`, gli aggiornamenti e il lettore Markdown non funzionano come su un server; alcune funzioni del browser sono limitate.

## Cosa rimane sul dispositivo

Preferenze, raccolta, località e catalogo personale restano nel browser, senza sincronizzazione tra dispositivi. I cambiamenti alle impostazioni si applicano con Salva; preferiti e catalogo radio vengono invece salvati subito. La condivisione crea l'immagine localmente, senza caricare schermate su un server.

Dopo il primo caricamento online, la copia offline comprende interfaccia, frasi, icone, effetti, pagine informative e relativi Markdown. Lo stato è visibile nelle informazioni. Senza Internet continuano orologio, frasi, timer, suoni locali ed effetti manuali. Con le coordinate salvate continua anche il calcolo solare locale.

Le nuove foto, le radio live, la ricerca delle città e l'aggiornamento del meteo richiedono una connessione. La cache conserva l'ultima foto disponibile, non il catalogo delle fotografie o le dirette audio. Il browser può liberare la memoria locale: la conservazione offline non è garantita per sempre.

**Il browser deve restare aperto e il dispositivo attivo per timer, radio e programmazione.** Il sistema può sospendere la pagina o richiedere di nuovo Play. Istante non è una sveglia di sistema e non garantisce avvisi durante lo standby. Un timer già scaduto al ripristino viene segnalato senza far partire un allarme arretrato.

## Aggiornamenti e documentazione

Quando la nuova copia è pronta, un chip compare sulle impostazioni. Apri Informazioni e premi **Aggiorna** quando preferisci. Le preferenze restano sul dispositivo; la riproduzione audio può richiedere un nuovo tocco.

Per pubblicare una release sostituisci **tutti i file**, inclusi `sw.js` e `version.json`, evitando cache HTTP permanenti per questi ultimi. Gli hash in `sw.js` proteggono dall'installazione di copie incomplete: se modifichi i sorgenti devi rigenerarli, non cambiare soltanto il numero di versione.

L'anteprima social è configurata per `https://ruslan-dzyuba.it/istante/` con titolo, descrizione e immagine inclusa. Diventa disponibile dopo la pubblicazione dei file. Le piattaforme possono conservare la vecchia anteprima nella propria cache. Con un altro dominio, aggiorna URL canonico, metadati, link e QR in `assets/js/share-card.js`.

[Tutte le novità](CHANGELOG.md) · [Note della release 3.4.0](docs/release/v3.4.0.md) · [Licenza](docs/LICENZA.md) · [Terze parti e servizi](docs/TERZE-PARTI.md)

La cartella `docs/release/` contiene sempre il Markdown dedicato alla release. Il README descrive il progetto e la versione attuale; il changelog ne conserva la storia. Dal sito puoi leggere questi file in pagine dedicate, senza aprire Markdown grezzo.

## Autore

Un progetto di **Ruslan Dzyuba**.

[GitHub](https://github.com/Trorker) · [Instagram](https://www.instagram.com/trorker/) · [LinkedIn](https://www.linkedin.com/in/ruslan-dzyuba/)
