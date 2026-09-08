# Istante

**Versione corrente: **3.10.2**.
**Un momento, per te.** Un progetto di **Ruslan Dzyuba**.  
[Sito ufficiale: istante.ruslan-dzyuba.it](https://istante.ruslan-dzyuba.it/)

Istante è una dashboard / screensaver da lasciare dove preferisci: sul computer,
su un tablet, in un angolo tranquillo. Una pagina che ti fa compagnia dalla
mattina alla sera e ti ricorda di prendere un momento per te.

L'orologio, un pensiero, la tua musica e il tempo che manca al tuo prossimo
obiettivo. Non un elenco di cose da fare: un piccolo spazio per rilassarti,
ritrovare la tua direzione e abitare la giornata con un po' più di calma.

## Il tuo istante

La schermata principale resta nello schermo, senza scorrimento. Puoi scegliere
orologio digitale o analogico, formato 24 ore (predefinito) oppure 12 ore, una foto
personale o fotografie automatiche. Il tema può essere Notte, Carta, quello del
dispositivo o Segui il sole quando hai configurato una località.

Sole e luna seguono un arco circolare illustrativo; la luna mostra la fase
calcolata sul dispositivo. Vicino all'alba e al tramonto la luce diventa calda e
arancione. Meteo, orari solari e fase lunare sono raccolti in una riga discreta.
Il cielo reagisce al meteo recente, quando disponibile. Gli effetti manuali
rimangono decorativi e separati dalle condizioni reali.

Il prossimo capitolo è la tua data da aspettare: un viaggio, un cambiamento, un
obiettivo. Per attese lunghe il conto usa anni, mesi e giorni; avvicinandosi alla
data torna a giorni, ore e minuti. I mesi sono calcolati sul calendario, non
considerati tutti di trenta giorni.

## Pensieri da incontrare e da conservare

La biblioteca parte dalle **1.000 frasi originali** di Istante. La scelta è
casuale, con storico locale: prima di ripetere un pensiero il sorteggio percorre
la raccolta attiva. Una scelta manuale può invece ripetere una frase. Ricaricare
la pagina o riscrivere il testo non cambia il pensiero della stessa fascia.

Apri la raccolta in basso a sinistra e premi **La tua biblioteca**: si apre
una finestra con **Le mie raccolte**, **Da scoprire** e una ricerca per titolo o
categoria (la ricerca considera anche la descrizione). La raccolta originale resta quella iniziale. Il catalogo aggiunge
**Passi nuovi** (500 nuovi pensieri motivazionali), **Tra luce e silenzio**
(60 brevi testi poetici originali) e **Voci dei classici** (10 citazioni con
attribuzione e fonte, da Dante, Leopardi, Pascoli e Carducci).

**Scarica raccolta** la aggiunge alla biblioteca di questo browser, anche offline:
i testi sono già compresi nel sito, senza un download da servizi esterni. Il comando
non cambia la selezione; premi **Usa questa raccolta**, anche direttamente in
**Da scoprire**, per attivarla. Puoi importare,
esportare ed eliminare raccolte personali, fino a 30, senza cancellare i preferiti
conservati dalle altre. La raccolta originale non si elimina. Le fonti dei classici
sono in [Fonti delle citazioni](docs/FONTI-CITAZIONI.md).

La scrittura lettera per lettera, con pause e piccole correzioni, resta facoltativa
e indipendente dalla frequenza di cambio della frase. La biblioteca non viene
sincronizzata tra dispositivi: per trasferirla usa il backup JSON.

Un JSON può essere un semplice elenco di testi, oppure avere questo formato:

```json
{
  "title": "Piccoli versi",
  "category": "Poesia",
  "phrases": [
    "La finestra lascia entrare il giorno, senza chiedergli fretta.",
    "Nel silenzio trova posto anche quello che non sai dire."
  ]
}
```

Sono accettate anche voci con `text` e `author`: l'autore viene conservato nel
testo della frase. Usa solo contenuti che puoi legittimamente usare e condividere.
Massimo 10.000 frasi per raccolta, 1.000 caratteri per frase; biblioteca entro
circa 2,2 milioni di caratteri JSON, compatibilmente con lo spazio del browser.
I preferiti di una raccolta non attiva non vengono cancellati.

## I tuoi giorni, con calma

Il calendario è una **vista interna della stessa pagina**: scorrendo verso
sinistra dalla dashboard lo apri, verso destra torni al tuo istante. Due punti
in basso indicano la vista attiva. Restano il pulsante Calendario, il pulsante
Indietro e i punti cliccabili per chi usa mouse e tastiera. Il player e il timer
mantengono la stessa istanza e non vengono ricaricati.

In **Impostazioni > Spazio per i tuoi giorni** puoi disabilitare del tutto il
calendario, mostrare il prossimo impegno sotto la frase, attivare le festività
italiane e scegliere il ritorno automatico allo screensaver. Il valore iniziale
è **2 minuti di inattività**; puoi scegliere Mai o un intervallo personalizzato
da 10 secondi a un'ora. Durante modali, interazioni e scheda nascosta non si
viene rimandati improvvisamente alla dashboard. Il prossimo impegno è facoltativo
e inizialmente nascosto: considera la privacy su uno schermo condiviso. Mostra
il primo evento in corso o futuro nei successivi 90 giorni dei calendari abilitati,
non le festività. Toccalo per i dettagli.

Le viste sono **anno, mese, settimana, giorno e agenda**, con scorrimento interno
al calendario, mai dell'intera dashboard. Puoi mostrare insieme **fino a 8 calendari
personali o condivisi**, ciascuno con colore, interruttore e rimozione. Le festività
non occupano uno degli 8 posti. Il calendario festivo italiano funziona offline:
comprende Pasqua, lunedì dell'Angelo e le festività nazionali, incluso San Francesco
d'Assisi dal 2026; non include feste patronali locali, vacanze scolastiche o
chiusure aziendali. [Riferimenti](docs/TERZE-PARTI.md).

In **I tuoi calendari** importa un file `.ics` o collega un indirizzo HTTPS/webcal.
Sono calendari in **sola lettura**: Istante non modifica gli appuntamenti sul
servizio originale e non sostituisce un sistema collaborativo di creazione eventi.
I file importati rimangono sul dispositivo; i collegamenti vengono aggiornati
ogni 30 minuti mentre la pagina è visibile, oppure con il pulsante Aggiorna.
Senza rete o in caso di errore viene mantenuta l'ultima copia salvata.

Il fornitore deve autorizzare la lettura dal browser tramite **CORS**. Un link ICS
privato non è sempre leggibile da un sito esterno: in quel caso scarica il file
dal fornitore e importalo. Non viene usato un proxy esterno per aggirare il limite.
Non sono gestiti login OAuth o accessi che richiedano cookie del fornitore.

Limiti: 8 calendari, 1 MB per file, circa 2 milioni di caratteri complessivi e
5.000 eventi di origine per calendario. Le viste espandono fino a 10.000 istanze.
Sono supportati eventi giornalieri o con orario, UTC, orari locali, fusi IANA e
i nomi Windows/Outlook più comuni, incluso **W. Europe Standard Time** (Europe/Rome),
ricorrenze comuni giornaliere/settimanali/mensili/annuali, date aggiuntive,
esclusioni ed eccezioni singole. È un lettore mirato, non l'intero standard ICS:
regole avanzate, fusi proprietari non mappati/VTIMEZONE personalizzati, allarmi ICS e attività
non sono gestiti. La pagina segnala le ricorrenze e i fusi non interpretabili;
per regole non supportate mostra soltanto la prima data e le RDATE esplicite.
Gli orari sono visualizzati nel fuso del dispositivo. Controlla sempre gli
appuntamenti importanti nel calendario originale.

## Una colonna sonora, una pausa

Il mini player offre **Radio**, per le dirette, e **Ambiente**, per rumore rosa,
marrone, pioggia o vento sintetizzati offline. Avviare una sorgente ferma l'altra.
Il catalogo radio ha preferiti, stazioni personali, scelta casuale e fasce orarie
multiple. La radio richiede Internet; Ambiente non scarica registrazioni.

Nel timer imposta la durata e scegli **Silenzio**, **Radio** o **Suono relax** durante
la pausa. Il riepilogo sotto i tre pulsanti mostra la sorgente scelta. Suono relax usa il suono ambientale selezionato nel player (rumore rosa,
marrone, pioggia o vento); non richiede rete. Le sorgenti disabilitate nella
configurazione non sono selezionabili. Le preferenze principali, il valore
iniziale e l'avviso finale sono in **Impostazioni > Un tempo per te**.

Una pausa avviata conserva le proprie scelte. L'audio avviato dal timer si ferma
in pausa, all'annullamento o alla fine; può ripartire alla ripresa. La musica già
avviata manualmente resta distinta e non viene fermata come se appartenesse al
timer. Le azioni manuali nel player hanno precedenza. Radio e Ambiente sono
alternativi, non due flussi sovrapposti. Il timer continua durante la vista
calendario. L'avviso finale mantiene la scelta separata: suono, radio o avviso
visivo. Il browser deve autorizzare l'audio con un'interazione e la pagina deve
restare attiva: non si tratta di una sveglia di sistema.

Il **Rintocco consapevole** è facoltativo, disattivato all'inizio. Scegli campana
morbida o diapason, volume e fascia di silenzio, anche a cavallo della mezzanotte.
Due orari uguali significano silenzio tutto il giorno. Il suono avviene una sola
volta allo scoccare dell'ora: non recupera ore saltate quando torni alla pagina.
Serve una prima interazione per autorizzare Web Audio. Con scheda sospesa,
dispositivo bloccato o browser chiuso l'avviso non è garantito: non è una sveglia
di sistema e non va usato per scadenze critiche.

## Condividere un pensiero

Il comando Condividi genera una cartolina locale con logo, frase e firma laterale
con il sito ufficiale. Puoi includere orologio, data, cielo, obiettivo, stazione
e QR. All'apertura della condivisione viene fermato un fotogramma degli **effetti
attuali**: posizione relativa di sole/luna, fase lunare, stelle, pioggia/neve,
aloni, luce calda e grana, quando visibili e attivi. Il cielo non viene ricostruito
in una posizione fissa. Il formato iniziale **Come lo schermo** conserva il
rapporto della schermata nei formati comuni di telefono, tablet e desktop;
restano Quadrato, Storia e Orizzontale. Nei formati diversi dal dispositivo le
posizioni sono proporzionali e il disco rimane circolare. I formati estremamente
allungati sono limitati per mantenere una cartolina leggibile. Il fotogramma
è acquisito prima di aprire la modale, non dopo aver nascosto i suoi livelli. I livelli CSS sfumati sono
ridisegnati su canvas, quindi il risultato non è uno screenshot pixel per pixel.

**Le fotografie di sfondo non vengono mai incluse**, neanche quelle personali o
Picsum. La cartolina usa la base cromatica del tema e i livelli decorativi locali.
I controlli e il calendario non entrano nell'immagine. Per catturare un nuovo
momento chiudi e riapri Condividi.

**Il QR e il link contengono la frase**, in dati testuali codificati nel frammento
`#p=`. Chi li apre vede una modale con il pensiero ricevuto e può conservarlo
nella biblioteca, senza sostituire la propria raccolta. Non servono account o un
server che archivi le frasi. I dati non sono cifrati: chi possiede il link può
leggerli. Non condividere testi riservati. Coordinate, catalogo e preferenze non
entrano nel link. Alcune applicazioni possono rimuovere il frammento: il sito si
aprirà normalmente ma non potrà recuperare il pensiero. Le vecchie immagini con
QR verso la sola homepage rimangono tali.

Il QR mantiene colori coerenti e un margine libero. Per testi molto lunghi usa
il formato quadrato o storia; un testo eccezionalmente denso può richiedere di
condividere il link invece del QR. Non applicare filtri al codice e non ritagliarlo.

## Movimento e prestazioni

In **Impostazioni > Aspetto e schermo** trovi **Qualità delle animazioni**,
accanto a **Grana analogica**: Automatica, Leggera e Completa. La qualità
riguarda il rendering dell’intero schermo, non soltanto gli effetti aggiuntivi,
e resta regolabile anche quando questi sono disattivati. In **Effetti ambientali**
rimangono invece la scelta di aloni, particelle e meteo, con la loro intensità.
Automatica sceglie la modalità leggera sui dispositivi touch o con poca memoria
segnalata dal browser. Questa riduce particelle, risoluzione canvas, sfocature e
animazioni decorative; puoi selezionarla anche manualmente.

Gli effetti canvas sono limitati a 20 fotogrammi al secondo in Leggera e 30 in
Completa. Il cielo non viene ridisegnato a ogni secondo: posizione e fase sono
aggiornate quando necessario e il movimento è interpolato con trasformazioni.
Le animazioni non necessarie si fermano in background e durante la vista calendario. La preferenza di sistema
per movimento ridotto viene rispettata. In **Aspetto e schermo**, **Grana analogica** aggiunge una trama
SVG statica e regolabile, senza generare rumore nuovo a ogni fotogramma.

La modalità leggera non rende compatibile un browser obsoleto: occorre un browser
che supporti le API e la sintassi JavaScript moderne usate dall'applicazione.
Il risultato e il consumo effettivo dipendono dall'hardware e dal browser.

## Conservare il tuo spazio

In **Porta con te il tuo istante** esporta o ripristina un backup JSON. Include
configurazione, traguardo, radio, preferiti, storico e tutte le raccolte personali.
Località e calendari sono inclusi solo selezionando le rispettive caselle.
Il backup può contenere testi privati e URL ICS con chiavi di accesso: non
pubblicarlo. Foto, cache meteo, audio e timer in corso non sono inclusi.

Prima del ripristino compare un riepilogo e serve conferma. File non validi non
modificano i dati; una scrittura fallita tenta di ripristinare i valori precedenti.
Massimo 4 MB per backup. Sono leggibili anche i backup precedenti dello schema 1.
I calendari non inclusi restano sul dispositivo di destinazione. Dopo il
ripristino l'audio non riparte autonomamente. Il vecchio sito sul dominio
`ruslan-dzyuba.it` e il sottodominio attuale hanno memorie distinte: usa il backup
per trasferire i dati fra origini o dispositivi.

## Avvio, offline e aggiornamenti

Pubblica il contenuto di questa cartella nella root di **istante.ruslan-dzyuba.it**
su hosting statico HTTPS. Non occorrono compilazione o backend. Sostituisci tutti
i file, compreso `sw.js`, senza mescolare release diverse. I percorsi relativi
funzionano anche in sottocartella. Per prove locali usa un server statico.

Dopo il primo caricamento completo la cache include schermata, calendario,
documenti, frasi e risorse locali. I tuoi file ICS e JSON sono nella memoria
locale. La richiesta di persistenza può essere concessa o negata dal browser:
non garantisce conservazione illimitata e non sostituisce un backup.
Gli aggiornamenti preparati vengono segnalati sul pulsante Impostazioni e
attivati con **Aggiorna**. Foto nuove, meteo recente, sincronizzazione ICS e radio
live richiedono una connessione.

Fase lunare e orologio funzionano offline. Con coordinate salvate c'è un calcolo
solare locale di riserva; senza località il ritmo indicativo è 06:00/18:00.
La traiettoria grafica non indica azimut, altezza astronomica o veri orari di
levata della luna. Un tema Notte di giorno modifica i colori, non fa tramontare
il sole. Gli effetti meteo automatici usano dati di massimo 45 minuti; il testo
meteo può restare indicato come salvato fino a tre ore.

## File, autore e condizioni

- `index.html`: dashboard e calendario virtuale. `calendario.html`: compatibilità per i vecchi link. `leggi.html`: documenti Markdown.
- `assets/`: logica e interfaccia; `data/`: raccolta originale, catalogo delle raccolte e stazioni.
- `README.md`: il progetto; `CHANGELOG.md`: storico; `docs/release/v3.10.2.md`: questa release.
- `docs/LICENZA.md`, `docs/TERZE-PARTI.md`, `docs/licenses/`: condizioni e attribuzioni.

**Istante — Ruslan Dzyuba**. Sorgente disponibile per uso non commerciale, con
attribuzione e redistribuzione alle medesime condizioni. Il divieto di vendita
non corrisponde alla definizione OSI di open source. Restano separate le licenze
dei componenti terzi e i diritti delle versioni precedenti.

[Licenza](docs/LICENZA.md) · [Terze parti](docs/TERZE-PARTI.md)  
[GitHub](https://github.com/Trorker) · [Instagram](https://www.instagram.com/trorker/) ·
[LinkedIn](https://www.linkedin.com/in/ruslan-dzyuba/)
