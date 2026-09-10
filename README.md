# Istante

**Versione corrente: 4.0.0**  
**Un momento, per te.**  
Un progetto di **Ruslan Dzyuba**.

**Sito ufficiale: [istante.ruslan-dzyuba.it](https://istante.ruslan-dzyuba.it/)**

Istante è una **dashboard / screensaver personale** pensata per stare su uno
schermo che hai vicino: computer, tablet, monitor secondario o display dedicato.
Non vuole chiederti continuamente attenzione. Fa il contrario: lascia spazio,
mostra il tempo, propone un pensiero e ti ricorda con calma dove vuoi arrivare.

È una pagina che può accompagnarti dalla mattina alla sera: orologio, frasi,
il tuo prossimo capitolo, musica lo-fi o suoni rilassanti, cielo e meteo,
un timer per una pausa e, se lo desideri, il calendario. Tutto resta nello
stesso linguaggio visivo essenziale di Istante.

## Il cuore di Istante

La linea grafica usa superfici pulite, tipografia equilibrata, controlli coerenti,
gerarchie semplici e pochi elementi in competizione. La v4 separa finalmente
**interfaccia Vue**, **motore responsive**, **servizi applicativi** e **dati**,
così un cambiamento di layout non richiede più correzioni sparse nel progetto.

La dashboard principale resta senza scroll. Puoi scegliere orologio digitale
o analogico, formato 24/12 ore, tema Notte, Carta, tema del dispositivo oppure
**Segui il sole** quando hai configurato una località. Alba, tramonto, sole,
luna, fase lunare, stelle ed effetti atmosferici accompagnano la scena senza
trasformarla in una dashboard tecnica.

## Pensieri e raccolte

La raccolta principale contiene 1.000 pensieri e usa una selezione casuale con
memoria locale per evitare ripetizioni ravvicinate. Dalla biblioteca puoi
aggiungere altre raccolte incluse nel sito oppure importare file **JSON** o
**TXT** (una frase per riga). Il pulsante **Vedi raccolte** apre un unico catalogo a card. Nel catalogo la ricerca resta a sinistra e i filtri a tab **Tutte / In uso / Scaricate / Da scaricare** sono allineati a destra. Con **Crea raccolta** inserisci titolo, categoria e descrizione; subito dopo puoi aprire la raccolta in modifica e aggiungere le frasi una alla volta. Le raccolte personali restano nel browser finché non le elimini.

La macchina da scrivere è facoltativa e può usare un ritmo umano, piccole pause
e correzioni. Preferiti e storico restano locali.

La dimensione scelta dall’utente viene combinata con la scala automatica del dispositivo. Istante distingue **Telefono, Tablet, Computer e Display grande/TV**: il rapporto `vw/vh` decide la forma della composizione, mentre un secondo indice basato sulla dimensione reale del viewport regola la scala tipografica. In questo modo la stessa proporzione di schermo non produce font identici su un telefono e su una TV.

Per i contenuti editoriali puoi scegliere tra **Classic** ed **Excalifont**, più vicino a una scrittura a mano. Quando il font globale è Classic, il Calendario offre uno switch separato per usare Excalifont soltanto nelle date, nei titoli e negli eventi. Se Excalifont è già globale, lo switch dedicato scompare. Excalifont viene richiesto solo quando selezionato; senza rete o se non disponibile, Istante torna automaticamente al carattere Classic.

## Il tuo prossimo capitolo

Il traguardo non è un promemoria aggressivo: è una direzione. Puoi usare il
nuovo anno, scegliere una data precisa oppure impostare rapidamente una distanza
in **mesi o anni**. Dalla dashboard il riepilogo apre una **modale dedicata** con avanzamento e tempo residuo; da lì puoi passare alla configurazione completa. Se nessun traguardo è impostato, il blocco non occupa spazio vuoto. Il wizard iniziale lo presenta senza modificarlo: eventuali configurazioni si fanno soltanto dalle Impostazioni.

Quando la distanza è lunga, il riepilogo usa anche mesi e anni invece di
riempire lo schermo con un numero enorme di giorni.

## Musica, relax e timer

Il mini player supporta radio lo-fi e stazioni personali, preferiti,
programmazioni multiple e scelta casuale. Dalla gestione delle stazioni puoi anche **spostare una radio più in alto o più in basso** nell’ordine del catalogo. Sui dispositivi touch le gesture audio sono attive di default nella sola zona destra della Dashboard: un doppio tap alterna Play/Pausa e uno swipe verticale modifica il volume di **10 punti esatti**. Le gesture possono essere disattivate dalle Impostazioni e non vengono mai applicate nel Calendario. In alternativa puoi usare il generatore audio offline: rumore rosa, marrone, pioggia o vento sintetizzati con Web Audio, senza file audio da scaricare.

Il timer rimane volutamente semplice: la durata principale si sceglie su un **quadrante circolare tipo orologio** da 1 a 60 minuti e può essere rifinita di un minuto alla volta con i pulsanti **− / +** esterni al cerchio. Per questa prima release pubblica il Timer usa una sola esperienza: una **modale** ottimizzata per mouse e touch. Durante il conto alla rovescia l’anello si riempie seguendo il tempo trascorso, un dot compie un giro ogni minuto seguendo i secondi e un alone più evidente respira attorno al cerchio. Non c’è una seconda progress bar: tutto l’avanzamento vive nel quadrante. Silenzio, radio o suono rilassante restano configurabili senza appesantire la schermata principale.

## Calendario, se ti serve

Il calendario è **opzionale** e vive nella stessa istanza della dashboard: su
dispositivi touch puoi passare alla vista calendario con uno swipe, oppure usare
i controlli dedicati. Sono disponibili viste mese, settimana, anno, giorno e
agenda; puoi scegliere una vista iniziale fissa oppure **riprendere l’ultima vista usata**. Il Mese usa solo le 4/5/6 settimane realmente necessarie. Nelle viste Mese e Settimana uno swipe breve cambia soltanto periodo; uno swipe lungo da sinistra verso destra torna alla Dashboard, senza confondersi con la navigazione del calendario. Sono supportati fino a 8 calendari ICS e festività italiane facoltative. La vista Anno sfrutta lo spazio disponibile sui desktop normali senza dilatarsi sui monitor ultrawide. Nella vista Settimana l'elenco dei calendari è un **drawer richiamabile**: quando è chiuso, i sette giorni usano tutta la larghezza disponibile. Gli eventi usano superfici molto leggere con colore della sorgente, ora, titolo e calendario di origine, così restano distinguibili senza trasformare la Settimana in un mosaico di card.

La vista torna alla dashboard dopo un periodo configurabile di inattività.
Il prossimo impegno può comparire in modo discreto sulla hero. Nella vista mese, quando un giorno contiene più eventi di quanti possano essere mostrati con calma, compare **“altri eventi”**: apre direttamente quel giorno invece di comprimere il calendario. I feed ICS sono
letti in sola lettura; alcuni fusi Windows/Outlook comuni vengono normalizzati
in fusi IANA quando possibile. Per i calendari remoti la release include una
**API ICS PHP provider-agnostic**: Google Calendar, Outlook / Microsoft 365,
iCloud e altri feed HTTPS passano dallo stesso relay locale all'installazione,
superando i limiti CORS senza introdurre account o un database applicativo.

## Condivisione

Istante può creare una cartolina PNG del momento: frase, tema, posizione del sole o della luna, stelle ed effetti atmosferici. La preview nella modale mantiene sempre l'intero rapporto d'aspetto, senza essere tagliata dalla superficie di anteprima. La cartolina non incorpora eventuali foto di sfondo personali o Picsum. Il QR apre il sito ufficiale e può portare con sé
la frase condivisa. Firma e indirizzo ufficiale restano parte della composizione.

## Offline, privacy e backup

Istante resta un'applicazione **senza account e senza database applicativo**.
Preferenze, raccolte personali, calendari importati, stazioni e preferiti sono
salvati nel browser. Puoi esportare e ripristinare un backup JSON. L'unica
componente server della release di produzione è `api/calendar.php`: un piccolo
relay PHP sola lettura usato esclusivamente per scaricare feed ICS remoti che
il browser non può leggere direttamente per CORS. Il link del feed non viene
salvato dall'API.

L'interfaccia e i contenuti locali possono essere conservati dal service worker.
Radio live, nuove foto automatiche, sincronizzazione di calendari remoti e meteo
aggiornato richiedono Internet; un errore di rete non deve bloccare la pagina.
Dopo aver configurato una località, i dati astronomici principali possono
continuare a essere calcolati localmente quando la rete non è disponibile.

## Primo avvio

Il benvenuto spiega perché esiste Istante e propone una breve visita guidata. Su tablet e display bassi la scheda si compatta per non uscire dal viewport. La guida presenta orologio, pensiero, meteo e luce della giornata, prossimo capitolo, biblioteca, nuova frase, preferiti, timer, Calendario, condivisione, schermo intero, impostazioni e player. Sui dispositivi touch mostra anche la zona destra dedicata alle gesture audio. Poi passa realmente al Calendario in vista Anno, presenta le tab delle viste e il pulsante Calendari. La guida non modifica preferenze: **l’unica configurazione disponibile nel wizard è la posizione**, utile per meteo, alba, tramonto e cielo. Se manca, il meteo viene comunque simulato durante la presentazione. Può essere saltata o riaperta più avanti.

Su desktop con mouse o trackpad puoi attivare un **cursore personalizzato discreto** dalle impostazioni. È disattivato di default: puntino e anello reagiscono agli elementi interattivi e restano sopra ai pannelli aperti, mentre nei campi di testo continua a comparire il cursore nativo.

## Struttura del progetto

La v4 usa **Vue 3.5.13 locale**, senza CDN e senza build obbligatoria. Il browser
carica il runtime vendorizzato e i componenti già assemblati; i sorgenti dei
componenti restano leggibili in `src/vue/`.

- `index.html`: shell minima, boot screen e mount point Vue.
- `src/vue/components/`: componenti Vue della Dashboard, Calendario, toolbar e modali.
- `src/vue/core/viewport.js`: classificazione reattiva Phone / Tablet / Computer / Display e scale ottiche.
- `src/vue/core/service-loader.js`: avvio ordinato dei motori non visuali.
- `assets/vue/istante-vue.js`: bundle browser dei componenti e del bootstrap Vue.
- `vendor/vue.global.prod.js`: Vue 3.5.13 locale, licenza MIT.
- `assets/js/`: servizi applicativi (calendario ICS, radio, timer, meteo, scene, backup, gesture).
- `assets/css/istante.css`: fondazione visuale.
- `assets/css/layout.css`: composizione responsive per le quattro famiglie di dispositivo.
- `config/runtime.js`: configurazione modificabile senza ricompilare, compreso l'endpoint ICS.
- `api/calendar.php`: relay ICS HTTPS sola lettura.
- `data/`: frasi, raccolte e stazioni.
- `docs/ARCHITETTURA-VUE.md`: mappa dei componenti e regole di sviluppo della v4.
- `docs/RESPONSIVE-ARCHITECTURE.md`: classificazione dei viewport e criteri di scala.
- `docs/release/v4.0.0.md`: note della migrazione.

## Pubblicazione

La v4 supporta entrambe le modalità:

1. **Tutto sullo stesso hosting**: lascia `calendarApiUrl: 'api/calendar.php'` in `config/runtime.js`.
2. **Frontend statico su GitHub Pages + API PHP sul tuo hosting**: imposta in `config/runtime.js` un URL HTTPS assoluto, ad esempio `https://api.example.it/calendar.php`, e abilita CORS nell'API solo per il dominio pubblico di Istante.

Il frontend non richiede Node.js, npm o un server applicativo. Per i calendari
remoti l'endpoint PHP richiede PHP 8.1+ e cURL. Service worker, Vue, icone, dati e
componenti sono locali e possono funzionare dalla cache una volta installati.

## Autore e licenza

**Istante — Ruslan Dzyuba**. Il codice originale è sorgente disponibile per uso
non commerciale, con attribuzione obbligatoria e redistribuzione del sorgente
alle condizioni indicate in [docs/LICENZA.md](docs/LICENZA.md). Le componenti di
terze parti mantengono le rispettive licenze.

[Sito](https://istante.ruslan-dzyuba.it/) ·
[GitHub](https://github.com/Trorker) ·
[Instagram](https://www.instagram.com/trorker/) ·
[LinkedIn](https://www.linkedin.com/in/ruslan-dzyuba/)
