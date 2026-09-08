# Changelog di Istante

Le modifiche sono elencate dalla release più recente. Le voci Original 1.x descrivono la base minimale da cui deriva la linea 3.x; non includono gli esperimenti grafici della precedente linea 2.x.

## 3.6.0 - 8 settembre 2026

- Player più compatto: eliminati il campo stream personalizzato e il testo informativo sottostante. Restano gestione stazioni e messaggi di errore utili.
- Timer alleggerito: durata, scelta rapida della radio, riepilogo e avvio. Le preferenze principali sono nella configurazione.
- Suono finale, volume, tipo di avviso e comportamento predefinito spostati in Impostazioni → Un tempo per te; collegamento diretto e Salva e apri il timer.
- Importazione una tantum delle precedenti preferenze del timer. Le sessioni avviate mantengono le scelte iniziali.
- Firma unica, laterale e ruotata sulle cartoline; rimossi i crediti ripetuti.
- Sole, fase lunare, stelle e aloni ridisegnati per integrarsi meglio nella composizione.
- QR coordinato alla palette, con contrasto, margine libero e dimensioni verificati anche nei formati orizzontali. Rimane facoltativo.
- Aggiornati copertina social, README, lettore della release e cache verificata; incluso `docs/release/v3.6.0.md`.

## 3.5.0 - 8 settembre 2026

- Dashboard senza scroll, scena adattata alla viewport e timer senza spostamenti del layout.
- Orologio analogico opzionale; digitale e 24 ore predefiniti.
- Cielo fisso con sole, fase lunare calcolata localmente e stelle.
- Scelte durante/fine timer nel pannello del timer, bloccate per la sessione.
- Accordion richiusi uscendo dalle impostazioni; collegamenti documenti allineati.
- Cuore dei preferiti a destra della ricerca delle stazioni, senza schede Tutte/Preferite.
- Cartoline con logo e firma, formato orizzontale e inclusioni selezionabili; QR facoltativo.
- Benvenuto in tre passi mostrato una sola volta, rivedibile da Informazioni.
- Memoria persistente richiesta in modo protetto, con stato e gestione del rifiuto.
- Licenza non commerciale con attribuzione e sorgente disponibile; diritti precedenti e terzi preservati.
- Cache e risorse allineate alla release; incluso `docs/release/v3.5.0.md`.


## 3.4.0 - 8 settembre 2026

- Cuori dei preferiti realmente pieni in tutti i contesti; filtro delle stazioni coerente con il design.
- Sorprendimi avvia la nuova radio anche da fermo e rilascia sempre la sorgente precedente.
- Cartoline condivisibili in PNG, formato quadrato o storia, link e QR; fallback per salvataggio e condivisione del solo indirizzo.
- Anteprima social del sito con immagine inclusa, URL canonico e descrizione estesa.
- Radio durante il timer, indipendente dall'avviso finale, con pausa, ripresa e rispetto degli ascolti manuali e delle fasce autorizzate.
- Pagine che caricano README, changelog, release, licenza e terze parti dai file locali.
- Icone dei social in About; nuove risorse incluse nella cache verificata.
- Ripristinato il file Markdown della singola release in `docs/release/`, oltre al changelog generale.

[Note complete della release 3.4.0](docs/release/v3.4.0.md)

## 3.3.0 — 8 settembre 2026

### Interfaccia e orari

- Corretti gli ingombri reali delle modali, non soltanto nascosto lo scorrimento orizzontale. Griglie di calendario, campi, quadrante e footer rispettano lo spazio disponibile anche sui telefoni piccoli e in orizzontale.
- Limitata al quadrante l’area dei segni ruotati dell’orologio che causava overflow invisibile.
- Aggiunta la scelta 24 ore (predefinita) o 12 ore con AM/PM. Formato coerente in orologio, sole, traguardi, selettori e programmazione. Le durate rimangono durate.
- Quadrante a 12 ore con selettore AM/PM e inserimento manuale validato; mantenuta la scelta giorno/orario a due step sui dispositivi touch.
- Migliorati allineamento delle righe, spazi e accesso alle sezioni accordion.

### Radio e catalogo

- Nuova gestione locale delle stazioni: aggiunta di stream HTTPS personali, eliminazione, annullamento dell’ultima eliminazione e ripristino delle voci di base.
- Preferiti persistenti, filtro Tutte/Preferite nel selettore e nella gestione, pulsante preferito per la radio corrente.
- Pulsante stazione casuale che esclude quella corrente e non avvia musica se il player era fermo.
- Nessun focus automatico sulla ricerca all’apertura dell’elenco: sui dispositivi touch la tastiera si apre soltanto toccando il campo.
- Catalogo e selettori sincronizzati; rimozione della stazione corrente gestita senza errori. Catalogo vuoto: comandi, programmazione e fine timer radio non applicabili vengono disabilitati.

### Programmazione

- Sostituita la fascia singola con fino a 20 fasce indipendenti, ciascuna con nome, interruttore, giorni, inizio e fine.
- Migrazione automatica della precedente fascia senza perdere gli orari salvati.
- Supportati intervalli notturni e cambio dell’ora locale; fasce sovrapposte o consecutive unite in una sessione continua.
- Pausa manuale rispettata fino alla sessione successiva. Modifiche salvate esplicitamente; righe disattivate conservate ma non eseguite.

### Offline e nuove release

- Cache dell’intera applicazione e documentazione con verifica SHA-256 delle risorse. Una copia incompleta non sostituisce quella attuale.
- La nuova release resta in attesa: chip sul pulsante impostazioni, informazioni sulla versione e pulsante Aggiorna ora.
- Verifica automatica e manuale tramite service worker e indicatore di release non memorizzato nella cache dell’app.
- Conservazione della cache separata dell’ultima foto. Nessuna cache dei flussi radio live o dei servizi esterni.
- Gestione esplicita di rete assente, cache non disponibile e aggiornamento non completato.

### Progetto e documentazione

- Sezione Informazioni su Istante con presentazione, versione, stato offline, aggiornamenti e collegamenti GitHub, Instagram e LinkedIn dell’autore.
- README dedicato alla versione attuale, al significato del progetto, all’utilizzo e ai limiti.
- Riunite in questo file le note della linea corrente, senza cartelle con release duplicate.
- Mantenuti stile, 700 frasi originali, timer, effetti, fotografia personale/Picsum, selettori custom e icone Material SVG locali.

### Verifica

Test di logica per migrazione, orari 12/24, fasce multiple, sovrapposizioni, mezzanotte, cambio ora, timer, catalogo e integrità delle 700 frasi. Controlli d’interfaccia in Chromium su sette formati, da 320 px al desktop, con gestione radio e selettori. Simulazioni del worker per installazione, cache offline, aggiornamento esplicito e fallimento di rete. Non verificati su hosting reale, iPad fisico o dirette radio live.

## 3.2.0

- Separata la ricerca radio dall’elenco, con spaziatura dedicata e scorrimento indipendente.
- Animazioni di apertura/chiusura per impostazioni, raccolta, player, selettori e accordion, rispettando il movimento ridotto.
- Selettore data/ora in due passaggi sui dispositivi touch e quadrante circolare, con alternativa manuale.
- Prima programmazione radio con una fascia, giorni selezionabili, attraversamento della mezzanotte e autorizzazione audio per la sessione.
- Timer da un secondo a 24 ore: pausa, ripresa, annullamento, indicatore e radio/suono/avviso alla fine.
- Stato del timer nella sessione; nessun audio arretrato alla riapertura di un timer scaduto.
- Dipendenze tra radio, programmazione e timer, README centrato sull’idea di un momento per sé.

## 3.1.0

- Riordinata la distribuzione in sito, assets, dati e documentazione, senza copie di sviluppo.
- Ripristinato il saluto sopra l’orologio e mantenuto separato il meteo.
- Disabilitata la selezione del testo della schermata; conservata l’operatività dei campi di inserimento.
- Pulsante di espansione radio circolare; Segui il sole affiancato alle altre scelte del tema.
- Impostazioni suddivise in accordion; corretti livelli e visibilità degli effetti ambientali.
- Catalogo esteso a 22 stazioni, gestione degli stream compatibili e possibilità di specificare un URL della sorgente. Indirizzi community cercati senza sostituzioni ambigue.
- Mantenute le preferenze tra gli aggiornamenti e documentati i limiti di disponibilità delle dirette e dei formati audio.

## Original 1.2

- Material Icons SVG locali e riorganizzazione delle informazioni solari e meteo.
- Distinti tema automatico del dispositivo e modalità Segui il sole.
- Scrittura lettera per lettera con tempi irregolari, pause, errori scenici e cancellazione.
- Mini player audio con selezione della radio, volume e mute.
- Aloni, aurora, particelle ed effetti atmosferici selezionabili, con opzioni legate al sole e al meteo.
- Gestione dei dati scaduti, interruzioni di rete e movimento ridotto.

## Original 1.1

- Ripreso il primo design minimale, con maggiore leggibilità su PC e tablet.
- Foto automatiche Picsum con cadenza personalizzabile, dissolvenza e mantenimento della foto precedente in caso di errore.
- Località, alba e tramonto, tema solare e calcolo locale di riserva.
- Macchina da scrivere ciclica indipendente dalla scelta della frase e preloader iniziale.
- Selettori personalizzati per date, orari e menu, supporto offline e funzioni di base mantenute: orologio, traguardo, raccolta e preferiti.
