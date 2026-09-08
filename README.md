# Istante

**Ultima versione: 3.8.0**  
**Un momento, per te.**  
Un progetto di **Ruslan Dzyuba**.

**Sito ufficiale: [istante.ruslan-dzyuba.it](https://istante.ruslan-dzyuba.it/)**

Istante è una dashboard / screensaver da mettere dove preferisci: sul computer,
su un tablet, in uno spazio tranquillo. Una pagina che ti fa compagnia dalla
mattina alla sera e ti invita a prenderti del tempo per te.

Un orologio, una frase motivazionale, la tua musica e il conto alla rovescia
verso un obiettivo: pochi elementi che danno ritmo alla giornata, senza fretta.
Il tuo istante, un piccolo spazio per rilassarti e ritrovare la tua direzione.

## Il tuo spazio

La scena principale resta contenuta nello schermo, senza scorrimento. Puoi
scegliere orologio digitale (predefinito) o analogico, formato 24 o 12 ore,
tema Notte o Carta, tema del dispositivo oppure Segui il sole con una località.

Le 1.000 frasi sono incluse nel sito, con preferiti e una scrittura animata
facoltativa. La scelta è casuale, con uno storico locale: prima di ripetere
un pensiero, Istante percorre l’intera raccolta. Ricaricare la pagina o
ripetere la scrittura non consuma una nuova frase durante la stessa fascia. Lo sfondo può essere una sfumatura, una fotografia personale o
un’immagine automatica da Picsum. Sole, fase lunare e stelle accompagnano il
giorno e la notte; gli altri effetti ambientali restano selezionabili.

Il mini player ha due modi di farti compagnia: **Radio** per le dirette e
**Ambiente** per i suoni generati sul dispositivo. La radio raccoglie le tue
stazioni, i preferiti e le programmazioni; la gestione del catalogo permette
di aggiungere le proprie emittenti senza appesantire i controlli di ascolto.

In Ambiente puoi scegliere rumore rosa, rumore marrone, pioggia o vento.
Premi Play e regola il volume: non serve una connessione e non viene scaricata
alcuna registrazione. I suoni sono sintetici, non campionamenti naturali.
Radio e ambiente si alternano: avviare uno ferma l'altro. Puoi disabilitarli
separatamente in Impostazioni, nella sezione della colonna sonora.
Le programmazioni e l'opzione del timer restano riferite alla radio; i suoni
ambientali si avviano dal player e non introducono nuovi automatismi.

Per una pausa imposta la durata e scegli se ascoltare la radio durante il timer.
In Impostazioni → Un tempo per te trovi le preferenze: durata iniziale,
comportamento predefinito, avviso finale, suono e volume. Il timer resta
semplice: una scelta rapida per la musica, il riepilogo finale e il pulsante
Inizia. Una pausa già avviata mantiene le proprie scelte, anche modificando
la configurazione. L’ascolto avviato manualmente resta indipendente dal timer.

La condivisione prepara sul dispositivo una cartolina con logo, frase, link
e una sola firma laterale con cuore, autore e indirizzo ufficiale. Scegli se aggiungere QR, orologio, data, cielo,
obiettivo e stazione. Il QR riprende i colori del tema mantenendo un fondo
uniforme e un contrasto netto. Sole, luna e stelle accompagnano la frase
senza coprirla; le illustrazioni sono stilizzate, non mappe del cielo.
Pioggia, neve, nuvole, nebbia e altri effetti del cielo vengono disegnati
anche nel PNG esportato, non soltanto nell’anteprima. Sole, luna e stelle
si attenuano quando il meteo lo richiede. Le scelte decorative manuali
restano distinte dalle condizioni reali.
Obiettivo e stazione non vengono inclusi senza una tua scelta esplicita.

## Frasi e memoria locale

La raccolta predefinita contiene 1.000 testi nuovi, senza combinazioni di
prefissi e suffissi ripetuti. Il sorteggio tiene traccia dei testi mostrati
e salva fino a 3.000 voci recenti di storico, con data e motivo del cambio.
La raccolta mostra anche il numero di pensieri già incontrati nel ciclo.
Dopo averli esauriti tutti, un nuovo ciclo riparte senza ripetere subito
l’ultima frase. Una selezione esplicita dalla raccolta può invece ripetere
volontariamente un testo. La modalità A ogni apertura mantiene la sua
funzione: una nuova apertura fa un nuovo sorteggio.

Lo storico appartiene a quel browser e non viene sincronizzato fra dispositivi.
Cancellare i dati del sito lo azzera; con memoria negata rimane solo per
la sessione. Le raccolte personali importate non vengono sostituite. Una
copia identica della vecchia raccolta standard viene aggiornata; per altre
raccolte resta il comando Ripristina originale. I preferiti relativi a testi
non più presenti rimangono memorizzati, ma non compaiono nella nuova lista.

## Una guida che ti fa strada

Al primo ingresso il benvenuto racconta il progetto: non una lista di cose da
fare, ma un piccolo spazio per stare bene e tenere vicino il proprio obiettivo.
Puoi entrare subito oppure scegliere **Fammi strada**. La guida evidenzia
orologio, frase, preferiti, traguardo, player, timer, condivisione e impostazioni
con frecce disegnate e brevi suggerimenti. I controlli disattivati non vengono
indicati. Puoi saltarla, tornare indietro o rivederla da Informazioni.
Il nuovo benvenuto compare una sola volta per profilo, anche aggiornando da
una versione con il vecchio messaggio, salvo cancellazione dei dati locali.

## Il tuo istante, da conservare

In **Impostazioni > Porta con te il tuo istante** trovi Esporta backup e
Ripristina backup. Il file JSON comprende il traguardo, le preferenze salvate,
le stazioni personali e preferite, le fasce radio, le frasi preferite,
l'eventuale raccolta personalizzata e lo storico delle frasi. Le modifiche
ancora aperte nelle impostazioni vanno prima salvate.

La località è inclusa soltanto selezionando la relativa casella. Senza questa
scelta, l'importazione mantiene la località già presente sul dispositivo di
arrivo. Fotografie, meteo in cache, registrazioni audio e timer in corso non
entrano nel backup. Lo sfondo personale torna all'atmosfera neutra: la foto
va caricata nuovamente. Il file contiene dati personali leggibili e non è
cifrato: conservalo in un posto fidato, non pubblicarlo.

Prima di sostituire i dati, Istante controlla il JSON e mostra un riepilogo.
Serve una conferma esplicita. Un file non valido non modifica la configurazione;
in caso di errore di scrittura viene tentato il ripristino dei valori precedenti.
Il limite del file è 4 MB. Dopo il ripristino la pagina si ricarica, il timer
precedente si ferma e l'audio non riparte da solo. Le programmazioni salvate
richiedono nuovamente l'abilitazione per la sessione.

**Cambio di indirizzo:** il vecchio percorso su `ruslan-dzyuba.it` e il nuovo
sottodominio sono origini differenti; il browser non trasferisce automaticamente
i dati. Per recuperarli, rendi disponibile questa versione anche al vecchio
indirizzo, esporta lì il backup e importalo sul sito ufficiale. Istante non
può leggere direttamente la memoria di un'altra origine. Lo stesso backup
permette il passaggio fra dispositivi, senza account o sincronizzazione cloud.

## Avvio e pubblicazione

Carica il contenuto di questa cartella nella root di `istante.ruslan-dzyuba.it`,
su un hosting statico HTTPS. I percorsi relativi permettono anche una sottocartella
per prove o migrazione. Non serve compilazione, backend o account.
Sostituisci l’intera cartella di rilascio, incluso `sw.js`: non mescolare file
di versioni diverse. In locale puoi usare un server statico; l’apertura diretta
di `index.html` non offre le funzioni di aggiornamento/cache dei service worker.

Gli aggiornamenti disponibili vengono segnalati sul pulsante Impostazioni;
la nuova copia viene verificata e attivata con il comando Aggiorna. Preferenze,
frasi personali e stazioni rimangono nel browser, quando la memoria è disponibile.

## Offline, privacy e limiti

Dopo un primo caricamento completo su HTTPS, il sito conserva in cache
interfaccia, documenti, frasi, icone ed effetti locali. Orologio e fase lunare
non richiedono Internet; con coordinate salvate anche gli orari solari hanno
un calcolo locale di riserva. La traiettoria visiva di sole e luna è stilizzata,
non una mappa della loro posizione astronomica. Scegliere il tema Notte durante
il giorno non fa tramontare il sole: il tema modifica i colori, non l’ora del cielo; senza località il ritmo del
cielo segue indicativamente le 06:00 / 18:00 dell’orologio del dispositivo.

La richiesta `navigator.storage.persist()` viene gestita senza bloccare
l’avvio. Il browser può concederla o negarla: in Informazioni trovi lo stato.
Non è una promessa di conservazione illimitata e non sostituisce un backup.

I suoni ambientali funzionano offline una volta caricata l'applicazione.
Non ci sono file audio da salvare in cache: vengono creati piccoli buffer
stereo in RAM e riprodotti con Web Audio, con volume progressivo. Questo non
significa zero memoria o zero codice: la cache contiene comunque il programma,
mentre i campioni temporanei vengono ricreati sul dispositivo. Il rumore rosa
è un'approssimazione procedurale a bande; il marrone privilegia le frequenze
basse. Pioggia e vento sono texture sintetiche con variazioni lente.

Radio live, nuove foto e meteo aggiornato richiedono Internet. Il cielo e
le cartoline usano osservazioni meteo vecchie al massimo 45 minuti. Quando
scadono, tornano a un cielo neutro, senza inventare condizioni; un effetto
scelto manualmente continua a funzionare anche offline. Il meteo testuale
può rimanere visibile come salvato fino a tre ore. Le richieste
ai servizi partono soltanto per le funzioni attive. La geolocalizzazione
richiede una scelta esplicita e il consenso del dispositivo. Nessun account,
server applicativo o caricamento remoto delle cartoline.

L’audio parte solo con un’azione esplicita; il browser può richiedere Play per
autorizzarlo o riprenderlo. Il livello effettivo dipende anche dal volume del
dispositivo. La pausa sospende il generatore; in background il sistema operativo
può interrompere l’ascolto. Timer e programmi
radio funzionano con la pagina aperta: sospensione, standby o chiusura della
scheda possono ritardare o impedire gli avvisi. Istante non è una sveglia di
sistema e non è adatto a scadenze critiche.

## File e documenti

- `index.html`, `leggi.html`, `sw.js`, `manifest.webmanifest`, `version.json`: ingresso, lettore documenti e aggiornamenti.
- `assets/`: interfaccia, logica, immagini e icone. `data/`: raccolta e catalogo radio.
- `README.md`: il progetto. `CHANGELOG.md`: lo storico. `docs/release/v3.8.0.md`: la release corrente.
- `docs/LICENZA.md` e `docs/TERZE-PARTI.md`: diritti, attribuzioni e servizi.

Le pagine Leggi il progetto, Tutte le novità, Questa release, Licenza e Terze
parti caricano i rispettivi Markdown inclusi nel sito.

## Autore e licenza

**Istante — Ruslan Dzyuba**. Sorgente disponibile per uso non commerciale,
con attribuzione e redistribuzione del codice alle medesime condizioni.
Il divieto di vendita non è compatibile con la definizione OSI di open source;
consulta [la licenza completa](docs/LICENZA.md). Le licenze dei terzi e i diritti
sulle copie precedenti non vengono modificati retroattivamente.

[Sito](https://istante.ruslan-dzyuba.it/) ·
[GitHub](https://github.com/Trorker) ·
[Instagram](https://www.instagram.com/trorker/) ·
[LinkedIn](https://www.linkedin.com/in/ruslan-dzyuba/)
