# Istante

**Versione attuale: 3.3.0**  
**Il tuo istante. Prenditi un momento per te.**

Istante è una dashboard e uno screensaver web da tenere dove preferisci: sulla scrivania, su un tablet, su un monitor di casa o in uno spazio dedicato alla tranquillità. Una pagina che ti fa compagnia dalla mattina alla sera, senza chiederti continuamente attenzione.

L’orologio scandisce la giornata, le frasi motivazionali offrono un pensiero su cui fermarti e il conto alla rovescia ti ricorda quanto manca al tuo obiettivo. Fotografie, luce, piccoli movimenti e radio possono accompagnare il momento. Il timer serve a ritagliarti una pausa o un tempo tutto tuo.

Non è una bacheca di notifiche e non vuole misurare ogni cosa. L’idea è lasciare spazio: al relax, ai tuoi progetti e al piacere di prenderti un istante.

## Avvio e pubblicazione

Il sito è statico: non richiede account, database, compilazione o backend. Pubblica **tutto il contenuto di questa cartella**, mantenendo i percorsi, sulla root del tuo hosting oppure in una sottocartella. L’ingresso è `index.html`.

Usa **HTTPS** per cache offline, aggiornamenti e geolocalizzazione. Per una prova locale, dalla cartella del sito:

```sh
python3 -m http.server 8080
```

Apri `http://localhost:8080`. Aprendo direttamente `index.html` come file locale funzionano le funzioni di base, ma non il service worker né la verifica degli aggiornamenti. Le richieste esterne possono essere limitate dal browser.

La cartella contiene soltanto il sito, questa guida, il changelog e le licenze:

```text
index.html              Schermata e pannelli
assets/css/             Stili
assets/js/              Moduli dell’applicazione
assets/icons/           Icone dell’app, senza font esterni
data/                   Le 700 frasi e il catalogo radio di base
docs/licenses/          Licenze e attribuzioni
manifest.webmanifest    Installazione come applicazione web
sw.js                   Cache e gestione delle versioni
version.json            Indicatore della release pubblicata
README.md               Progetto, utilizzo e limiti
CHANGELOG.md            Cronologia delle modifiche
```

## Il tuo spazio

Le impostazioni sono divise in sezioni richiudibili. Le modifiche alla schermata si applicano con **Salva**; chiudere il pannello senza salvare le scarta. La gestione del catalogo radio è invece immediata, come indicato nel suo pannello. I comandi principali scompaiono durante l’inattività e tornano con il mouse o il tocco.

L’orario predefinito è **24 ore**. Puoi scegliere **12 ore con AM/PM**: il formato si applica a orologio, orari solari, traguardi, selettori e programmazione radio. Non cambia il fuso del dispositivo o la durata del timer.

Su telefono e tablet, la scelta di data e ora avviene in due passaggi: prima il giorno, poi il quadrante circolare. Puoi trascinare le lancette, scegliere i numeri o digitare il valore manualmente. Nel formato a 12 ore, durante l’inserimento manuale dell’orario specifica anche AM o PM. Annulla non modifica il valore precedente.

Le 700 frasi originali sono disponibili nella raccolta, con ricerca e preferiti. Puoi sceglierne la cadenza, importare o esportare una raccolta JSON e personalizzare la macchina da scrivere. L’animazione può riscrivere lo stesso testo: il suo intervallo è indipendente dal cambio della frase. Gli errori scenici non modificano il testo salvato.

## Sfondo, sole e meteo

Puoi scegliere uno sfondo minimale, la tua fotografia oppure immagini automatiche da Picsum con cadenza regolabile. La fotografia successiva viene caricata prima della dissolvenza. Se fallisce, rimane l’immagine precedente.

**Auto** segue il tema del dispositivo. **Segui il sole** compare quando configuri una città o le coordinate e deve essere scelto esplicitamente: passa al tema chiaro di giorno e a quello scuro di notte. Il saluto rimane sopra l’orologio; meteo e orari solari sono discreti elementi della schermata, disattivabili.

La posizione viene richiesta soltanto premendo il pulsante dedicato. Le coordinate salvate permettono anche un calcolo solare locale quando l’API non risponde. Il meteo memorizzato viene indicato come salvato e non viene presentato come attuale oltre il limite di freschezza previsto. Nessun dato inventato in assenza di rete.

Aloni, aurora, particelle ed effetti atmosferici sono facoltativi. Gli effetti decorativi possono essere manuali; quelli legati al meteo reale richiedono dati recenti. Le animazioni rispettano il movimento ridotto del sistema. Le icone Material sono SVG locali.

## La tua colonna sonora

Il mini player permette Play/Pausa, volume, mute, stazione casuale e preferito. **Casuale** evita di scegliere la stazione già selezionata: se stai ascoltando cambia la diretta, altrimenti prepara la scelta senza avviare musica.

Aprire il selettore non attiva la ricerca e non apre automaticamente la tastiera. Puoi sfogliare tutte le stazioni o soltanto le preferite; la ricerca si attiva quando la tocchi.

In **Gestisci stazioni** puoi aggiungere fino a 100 radio personali, mettere i preferiti, eliminare una voce e annullare l’ultima eliminazione. Le voci del catalogo incluso vengono nascoste localmente e possono essere ripristinate; quelle personali sono indipendenti. Se svuoti il catalogo, i controlli che richiedono una stazione vengono disabilitati finché non ne aggiungi o ripristini una.

Per aggiungere una radio servono un nome e **l’URL HTTPS del flusso audio**, non il link a una pagina o a un video. Il sito della stazione è facoltativo. Gli URL con credenziali o protocolli non sicuri sono rifiutati. Il formato audio deve essere supportato dal dispositivo. Per alcune radio del catalogo l’indirizzo viene cercato al primo Play nel registro pubblico Radio Browser; un risultato ambiguo non viene sostituito con una radio differente.

Il catalogo incluso conserva 22 stazioni di base. La presenza in elenco non garantisce disponibilità continua, qualità lossless, compatibilità con tutti i browser o diritti di riproduzione pubblica. Gli stream sono gestiti dalle rispettive emittenti. I collegamenti ai loro siti rimangono disponibili.

## Più momenti per la musica

Attiva la programmazione e aggiungi le tue fasce, per esempio **Mattina 08:00–10:00**, **Pausa pranzo 12:30–14:00** e **Sera 19:00–22:00**. Ogni fascia ha nome, interruttore, inizio, fine e giorni propri; puoi aggiungerne fino a 20.

Le fasce usano l’ora locale del dispositivo. Una fine precedente all’inizio indica il giorno successivo: lunedì 22:00–02:00 termina martedì. Inizio e fine uguali non costituiscono una fascia valida. Intervalli sovrapposti o consecutivi diventano un’unica sessione continua, senza arresti e riavvii al loro confine. Una pausa manuale viene rispettata fino alla successiva sessione.

Salva gli orari e premi **Abilita audio per questa sessione**. La programmazione avvia la stazione selezionata nel player: non assegna emittenti diverse alle singole fasce. Disattivare la radio o non avere stazioni disponibili disabilita la programmazione e la scelta “radio” come fine timer.

**La pagina deve restare aperta e il dispositivo attivo.** I browser possono richiedere nuovamente Play, sospendere schede, limitare l’audio o interrompere la rete. Istante non è una sveglia di sistema e non garantisce avvii a browser chiuso o durante lo standby. A ogni nuova sessione potrebbe servire una nuova autorizzazione.

## Un tempo per te

Il timer va da un secondo a 24 ore, con pausa, ripresa e annullamento. Alla fine puoi scegliere radio, uno dei suoni locali oppure il solo avviso visivo. Se disabiliti la radio, l’opzione non è selezionabile. Disabilitando il timer si annulla quello in corso.

La scadenza si basa sull’ora effettiva, non sul numero di aggiornamenti della schermata. Lo stato resta nella sessione della scheda e sopravvive a una ricarica. Un timer ritrovato già scaduto viene segnalato senza riprodurre automaticamente un suono arretrato.

## Offline e aggiornamenti

Dopo il primo caricamento online su HTTPS, il service worker prepara una copia completa di **interfaccia, codice, stili, frasi, icone, effetti e documentazione**. In **Informazioni su Istante** viene mostrato quando la copia offline è pronta. Puoi conservare l’ultima fotografia automatica caricata; non viene scaricato l’intero catalogo Picsum.

Le dirette radio, le nuove fotografie, la ricerca delle città e gli aggiornamenti meteo richiedono Internet. **I flussi audio live non vengono memorizzati nella cache.** Senza rete continuano orologio, frasi, timer, suoni locali, effetti manuali e, con le coordinate salvate, il calcolo solare locale. Il browser può cancellare cache e dati per mancanza di spazio, in modalità privata o su tua richiesta: offline non significa conservazione garantita per sempre.

Istante verifica le release all’apertura, periodicamente mentre la pagina è visibile e al ritorno della connessione. Puoi farlo anche manualmente. La nuova copia deve essere interamente scaricata e verificata prima di diventare disponibile: se qualcosa fallisce, rimane quella attuale.

Quando è pronta compare **Nuova** sul pulsante delle impostazioni. Apri **Informazioni su Istante** e premi **Aggiorna ora** quando preferisci. Il sito si ricarica conservando preferenze, catalogo, preferiti e stato del timer; l’audio può richiedere nuovamente Play. Salva le modifiche alle impostazioni prima di aggiornare. Anche le altre schede aperte della stessa installazione possono ricaricarsi per non mescolare file di versioni diverse.

Per pubblicare una nuova release sostituisci **tutti** i file, compresi `sw.js` e `version.json`. Sul server evita cache HTTP permanenti per questi due file; `Cache-Control: no-cache` è adatto al controllo delle release. Conserva dominio e percorso per mantenere lo stesso spazio di memoria. La prima migrazione da una versione con aggiornamento automatico può seguire il comportamento del vecchio worker; il nuovo controllo esplicito opera quando questa versione è installata.

Nota per chi modifica i sorgenti: il manifest incorporato in `sw.js` contiene gli hash dei file della release, per impedire l’installazione di copie incomplete o miste. Una distribuzione modificata richiede versione coerente, URL delle risorse e rigenerazione dell’elenco con gli hash SHA-256. Non modificare soltanto `version.json`: da solo non costituisce un aggiornamento.

## Dati, servizi e limiti

Preferenze, località, preferiti e catalogo personale rimangono nel browser; non vengono sincronizzati tra dispositivi. La radio usa collegamenti esterni solo quando necessari. Picsum, Open-Meteo, Radio Browser e le emittenti ricevono le normali richieste di rete alle rispettive risorse. Istante non richiede un account e non include analytics.

L’endpoint gratuito Open-Meteo ha condizioni specifiche per l’uso non commerciale: per un impiego commerciale verifica il piano e le condizioni applicabili. I diritti delle radio non sono concessi dal codice di Istante.

Documentazione tecnica e condizioni dei servizi:

- [Service worker e cache offline (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [Ciclo di vita degli aggiornamenti (web.dev)](https://web.dev/articles/service-worker-lifecycle)
- [Lorem Picsum](https://picsum.photos/), [Open-Meteo](https://open-meteo.com/en/docs) e [condizioni Open-Meteo](https://open-meteo.com/en/terms)
- [Radio Browser](https://www.radio-browser.info/), [Material Icons](https://developers.google.com/fonts/docs/material_icons) e [SunCalc](https://github.com/mourner/suncalc)

Le verifiche di questa distribuzione includono logica, interfaccia responsive e simulazione del ciclo della cache. I test di interfaccia usano i file reali in Chromium con servizi simulati; i test del service worker simulano cache ed eventi. Non costituiscono una prova delle 22 dirette, dell’audio su un iPad fisico o degli aggiornamenti sul tuo hosting HTTPS. Prova questi aspetti sul dispositivo e sull’hosting di destinazione.

## Informazioni e autore

**Ruslan Dzyuba**  
[GitHub · Trorker](https://github.com/Trorker) · [Instagram · @trorker](https://www.instagram.com/trorker/) · [LinkedIn](https://www.linkedin.com/in/ruslan-dzyuba/)

Gli stessi collegamenti sono disponibili nella sezione **Informazioni su Istante**. La cronologia completa di questa linea del progetto è in `CHANGELOG.md`; le licenze delle componenti sono in `docs/licenses/`.
