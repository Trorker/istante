# Istante

**Ultima versione: 3.6.0**  
**Un momento, per te.**  
Un progetto di **Ruslan Dzyuba**.

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

Le 700 frasi sono incluse nel sito, con preferiti e una scrittura animata
facoltativa. Lo sfondo può essere una sfumatura, una fotografia personale o
un’immagine automatica da Picsum. Sole, fase lunare e stelle accompagnano il
giorno e la notte; gli altri effetti ambientali restano selezionabili.

Il mini player raccoglie le tue stazioni, i preferiti e le programmazioni.
La gestione del catalogo permette di aggiungere le proprie radio senza
appesantire i controlli di ascolto.

Per una pausa imposta la durata e scegli se ascoltare la radio durante il timer.
In Impostazioni → Un tempo per te trovi le preferenze: durata iniziale,
comportamento predefinito, avviso finale, suono e volume. Il timer resta
semplice: una scelta rapida per la musica, il riepilogo finale e il pulsante
Inizia. Una pausa già avviata mantiene le proprie scelte, anche modificando
la configurazione. L’ascolto avviato manualmente resta indipendente dal timer.

La condivisione prepara sul dispositivo una cartolina con logo, frase, link
e una sola firma laterale. Scegli se aggiungere QR, orologio, data, cielo,
obiettivo e stazione. Il QR riprende i colori del tema mantenendo un fondo
uniforme e un contrasto netto. Sole, luna e stelle accompagnano la frase
senza coprirla; le illustrazioni sono stilizzate, non mappe del cielo.
Obiettivo e stazione non vengono inclusi senza una tua scelta esplicita.

## Avvio e pubblicazione

Carica il contenuto di questa cartella su un hosting statico HTTPS, anche in una
sottocartella come `/istante/`. Non serve compilazione, backend o account.
Sostituisci l’intera cartella di rilascio, incluso `sw.js`: non mescolare file
di versioni diverse. In locale puoi usare un server statico; l’apertura diretta
di `index.html` non offre le funzioni di aggiornamento/cache dei service worker.

Gli aggiornamenti disponibili vengono segnalati sul pulsante Impostazioni;
la nuova copia viene verificata e attivata con il comando Aggiorna. Preferenze,
frasi personali e stazioni rimangono nel browser, quando la memoria è disponibile.

Al primo accesso compare una piccola guida. Una volta chiusa non riappare sullo
stesso profilo; puoi rileggerla da Informazioni. Cancellare i dati del sito
ripristina anche il benvenuto.

## Offline, privacy e limiti

Dopo un primo caricamento completo su HTTPS, il sito conserva in cache
interfaccia, documenti, frasi, icone ed effetti locali. Orologio e fase lunare
non richiedono Internet; con coordinate salvate anche gli orari solari hanno
un calcolo locale di riserva. La traiettoria visiva di sole e luna è stilizzata,
non una mappa della loro posizione astronomica; senza località il ritmo del
cielo segue indicativamente le 06:00 / 18:00 dell’orologio del dispositivo.

La richiesta `navigator.storage.persist()` viene gestita senza bloccare
l’avvio. Il browser può concederla o negarla: in Informazioni trovi lo stato.
Non è una promessa di conservazione illimitata e non sostituisce un backup.

Radio live, nuove foto e meteo aggiornato richiedono Internet. Le richieste
ai servizi partono soltanto per le funzioni attive. La geolocalizzazione
richiede una scelta esplicita e il consenso del dispositivo. Nessun account,
server applicativo o caricamento remoto delle cartoline.

Il browser può richiedere un tocco per autorizzare l’audio. Timer e programmi
radio funzionano con la pagina aperta: sospensione, standby o chiusura della
scheda possono ritardare o impedire gli avvisi. Istante non è una sveglia di
sistema e non è adatto a scadenze critiche.

## File e documenti

- `index.html`, `leggi.html`, `sw.js`, `manifest.webmanifest`, `version.json`: ingresso, lettore documenti e aggiornamenti.
- `assets/`: interfaccia, logica, immagini e icone. `data/`: raccolta e catalogo radio.
- `README.md`: il progetto. `CHANGELOG.md`: lo storico. `docs/release/v3.6.0.md`: la release corrente.
- `docs/LICENZA.md` e `docs/TERZE-PARTI.md`: diritti, attribuzioni e servizi.

Le pagine Leggi il progetto, Tutte le novità, Questa release, Licenza e Terze
parti caricano i rispettivi Markdown inclusi nel sito.

## Autore e licenza

**Istante — Ruslan Dzyuba**. Sorgente disponibile per uso non commerciale,
con attribuzione e redistribuzione del codice alle medesime condizioni.
Il divieto di vendita non è compatibile con la definizione OSI di open source;
consulta [la licenza completa](docs/LICENZA.md). Le licenze dei terzi e i diritti
sulle copie precedenti non vengono modificati retroattivamente.

[Sito](https://ruslan-dzyuba.it/istante/) ·
[GitHub](https://github.com/Trorker) ·
[Instagram](https://www.instagram.com/trorker/) ·
[LinkedIn](https://www.linkedin.com/in/ruslan-dzyuba/)
