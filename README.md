# Istante

**Versione attuale: 3.9.0**  
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

Apri la raccolta in basso a sinistra: il selettore in alto contiene la raccolta
originale e i tuoi JSON personali. Puoi conservarne fino a 30, scegliere quella
attiva, esportarla o eliminare una raccolta personale. Quella originale resta
sempre disponibile. Le raccolte sono locali a questo browser, non sincronizzate
tra dispositivi. La scrittura lettera per lettera, con pause e piccole correzioni,
è facoltativa e indipendente dalla frequenza di cambio della frase.

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

Il pulsante calendario apre **calendario.html**, una seconda pagina con viste
**anno, mese, settimana, giorno e agenda**. Tocca un giorno o un appuntamento per
vederne i dettagli. Più calendari possono essere mostrati insieme e nascosti
singolarmente senza essere cancellati.

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
Sono supportati eventi giornalieri o con orario, UTC, orari locali e fusi IANA,
ricorrenze comuni giornaliere/settimanali/mensili/annuali, date aggiuntive,
esclusioni ed eccezioni singole. È un lettore mirato, non l'intero standard ICS:
regole avanzate, fusi proprietari/VTIMEZONE personalizzati, allarmi ICS e attività
non sono gestiti. La pagina segnala le ricorrenze e i fusi non interpretabili;
per regole non supportate mostra soltanto la prima data e le RDATE esplicite.
Gli orari sono visualizzati nel fuso del dispositivo. Controlla sempre gli
appuntamenti importanti nel calendario originale.

## Una colonna sonora, una pausa

Il mini player offre **Radio**, per le dirette, e **Ambiente**, per rumore rosa,
marrone, pioggia o vento sintetizzati offline. Avviare una sorgente ferma l'altra.
Il catalogo radio ha preferiti, stazioni personali, scelta casuale e fasce orarie
multiple. La radio richiede Internet; Ambiente non scarica registrazioni.

Il timer rimane semplice: imposta la durata e scegli la radio durante la pausa.
Le preferenze principali e l'avviso finale sono in **Impostazioni > Un tempo per
te**. Una pausa avviata conserva le proprie scelte. La musica avviata manualmente
resta distinta da quella avviata dal timer.

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
e QR. Gli effetti del tempo vengono disegnati anche nel PNG esportato.

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

In **Impostazioni > Lo schermo** trovi qualità Automatica, Leggera e Completa.
Automatica sceglie la modalità leggera sui dispositivi touch o con poca memoria
segnalata dal browser. Questa riduce particelle, risoluzione canvas, sfocature e
animazioni decorative; puoi selezionarla anche manualmente.

Gli effetti canvas sono limitati a 20 fotogrammi al secondo in Leggera e 30 in
Completa. Il cielo non viene ridisegnato a ogni secondo: posizione e fase sono
aggiornate quando necessario e il movimento è interpolato con trasformazioni.
Le animazioni non necessarie si fermano in background. La preferenza di sistema
per movimento ridotto viene rispettata. **Grana analogica** aggiunge una trama
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

- `index.html`: screensaver. `calendario.html`: calendari. `leggi.html`: documenti Markdown.
- `assets/`: logica e interfaccia; `data/`: raccolta originale e stazioni.
- `README.md`: il progetto; `CHANGELOG.md`: storico; `docs/release/v3.9.0.md`: questa release.
- `docs/LICENZA.md`, `docs/TERZE-PARTI.md`, `docs/licenses/`: condizioni e attribuzioni.

**Istante — Ruslan Dzyuba**. Sorgente disponibile per uso non commerciale, con
attribuzione e redistribuzione alle medesime condizioni. Il divieto di vendita
non corrisponde alla definizione OSI di open source. Restano separate le licenze
dei componenti terzi e i diritti delle versioni precedenti.

[Licenza](docs/LICENZA.md) · [Terze parti](docs/TERZE-PARTI.md)  
[GitHub](https://github.com/Trorker) · [Instagram](https://www.instagram.com/trorker/) ·
[LinkedIn](https://www.linkedin.com/in/ruslan-dzyuba/)
