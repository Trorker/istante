# Istante

**Versione corrente: 3.12.7**  
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

## Il cuore della 3.12

La **3.12 resta costruita sul design della 3.8.0**, che torna a essere la
base grafica: superfici più pulite, tipografia più equilibrata, controlli
coerenti, gerarchie più semplici e meno elementi che competono fra loro.
Le funzioni introdotte in seguito sono state mantenute dove utili, ma riportate
nello stesso sistema visivo.

La dashboard principale resta senza scroll. Puoi scegliere orologio digitale
o analogico, formato 24/12 ore, tema Notte, Carta, tema del dispositivo oppure
**Segui il sole** quando hai configurato una località. Alba, tramonto, sole,
luna, fase lunare, stelle ed effetti atmosferici accompagnano la scena senza
trasformarla in una dashboard tecnica.

## Pensieri e raccolte

La raccolta principale contiene 1.000 pensieri e usa una selezione casuale con
memoria locale per evitare ripetizioni ravvicinate. Dalla biblioteca puoi
aggiungere altre raccolte incluse nel sito oppure importare file **JSON** o
**TXT** (una frase per riga). La scelta delle raccolte vive nella **stessa modale** delle frasi: non apre un secondo pannello sopra al primo. Il pulsante **Vedi raccolte** vive accanto alla ricerca e al conteggio delle frasi e apre un unico catalogo a card. Nel catalogo la ricerca resta a sinistra, mentre i filtri a tab **Tutte / In uso / Scaricate / Da scaricare** sono allineati a destra; ogni raccolta indica subito il proprio stato. Le raccolte personali restano nel browser finché non le elimini.

La macchina da scrivere è facoltativa e può usare un ritmo umano, piccole pause
e correzioni. Preferiti e storico restano locali.

La dimensione dei testi usa una scala a quattro posizioni — **Piccolo, Medio, Grande, Molto grande** — progettata per far crescere soprattutto i contenuti da leggere e solo in misura minore i controlli dell'interfaccia.

## Il tuo prossimo capitolo

Il traguardo non è un promemoria aggressivo: è una direzione. Puoi usare il
nuovo anno, scegliere una data precisa oppure impostare rapidamente una distanza
in **mesi o anni**. Dalla dashboard il riepilogo apre una **modale dedicata** con avanzamento e tempo residuo; da lì puoi passare alla configurazione completa. Se nessun traguardo è impostato, il blocco non occupa spazio vuoto. Il wizard iniziale può aiutarti a impostarlo senza entrare prima nelle impostazioni complete.

Quando la distanza è lunga, il riepilogo usa anche mesi e anni invece di
riempire lo schermo con un numero enorme di giorni.

## Musica, relax e timer

Il mini player supporta radio lo-fi e stazioni personali, preferiti,
programmazioni multiple e scelta casuale. In alternativa puoi usare il
generatore audio offline: rumore rosa, marrone, pioggia o vento sintetizzati
con Web Audio, senza file audio da scaricare.

Il timer rimane volutamente semplice: la durata principale si sceglie con uno **slider da 1 a 120 minuti** e può essere rifinita di un minuto alla volta con i pulsanti **− / +** accanto al valore; ore/minuti/secondi precisi restano sotto “Durata precisa”. Quando parte, il tempo residuo entra in un indicatore circolare animato con avanzamento; silenzio, radio o suono rilassante restano configurabili senza appesantire la schermata principale.

## Calendario, se ti serve

Il calendario è **opzionale** e vive nella stessa istanza della dashboard: su
dispositivi touch puoi passare alla vista calendario con uno swipe, oppure usare
i controlli dedicati. Sono disponibili viste mese, settimana, anno, giorno e
agenda, con fino a 8 calendari ICS e festività italiane facoltative. La vista Anno sfrutta lo spazio disponibile sui desktop normali senza dilatarsi sui monitor ultrawide. Nella vista Settimana l'elenco dei calendari è un **drawer richiamabile**: quando è chiuso, i sette giorni usano tutta la larghezza disponibile. Gli eventi sono mini-card con colore della sorgente, ora, titolo e calendario di origine, così restano distinguibili senza ridurre la tipografia.

La vista torna alla dashboard dopo un periodo configurabile di inattività.
Il prossimo impegno può comparire in modo discreto sulla hero. Nella vista mese, quando un giorno contiene più eventi di quanti possano essere mostrati con calma, compare **“altri eventi”**: apre direttamente quel giorno invece di comprimere il calendario. I feed ICS sono
letti in sola lettura; alcuni fusi Windows/Outlook comuni vengono normalizzati
in fusi IANA quando possibile.

## Condivisione

Istante può creare una cartolina PNG del momento: frase, tema, posizione del sole o della luna, stelle ed effetti atmosferici. La preview nella modale mantiene sempre l'intero rapporto d'aspetto, senza essere tagliata dalla superficie di anteprima. La cartolina non incorpora eventuali foto di sfondo personali o Picsum. Il QR apre il sito ufficiale e può portare con sé
la frase condivisa. Firma e indirizzo ufficiale restano parte della composizione.

## Offline, privacy e backup

Istante è un sito statico: **non richiede account né backend applicativo**.
Preferenze, raccolte personali, calendari importati, stazioni e preferiti sono
salvati nel browser. Puoi esportare e ripristinare un backup JSON.

L'interfaccia e i contenuti locali possono essere conservati dal service worker.
Radio live, nuove foto automatiche, sincronizzazione di calendari remoti e meteo
aggiornato richiedono Internet; un errore di rete non deve bloccare la pagina.
Dopo aver configurato una località, i dati astronomici principali possono
continuare a essere calcolati localmente quando la rete non è disponibile.

## Primo avvio

Il benvenuto spiega perché esiste Istante e propone una breve configurazione
guidata. La guida passa attraverso tutti i controlli principali — raccolta,
nuova frase, preferiti, meteo, calendario, timer, condivisione, schermo intero,
impostazioni e radio — anche quando Meteo o Calendario non sono ancora
configurati. Può essere saltata o riaperta più avanti.

Su desktop con mouse, Istante usa inoltre un **cursore personalizzato discreto**: puntino e anello reagiscono agli elementi interattivi, mentre nei campi di testo resta il cursore nativo.

## Struttura del progetto

- `index.html`: dashboard, viste e pannelli principali.
- `assets/`: CSS, JavaScript, icone e immagine social.
- `data/`: frasi, catalogo raccolte e stazioni predefinite.
- `README.md`: descrizione del progetto e release corrente.
- `CHANGELOG.md`: storico delle modifiche.
- `docs/release/v3.12.7.md`: note dettagliate di questa release.
- `docs/LICENZA.md`: licenza non commerciale con attribuzione obbligatoria.
- `docs/TERZE-PARTI.md`: dipendenze, servizi e attribuzioni.
- `docs/VISIONE-E-DESIGN.md`: valori, regole grafiche e criteri responsive da mantenere nelle release future.

## Pubblicazione

Pubblica **tutto il contenuto della cartella** sullo stesso percorso HTTPS,
compresi `sw.js`, `version.json`, `assets`, `data` e `docs`. Non mescolare file
di release diverse: il controllo aggiornamenti e la cache verificano una copia
coerente prima di attivarla.

## Autore e licenza

**Istante — Ruslan Dzyuba**. Il codice originale è sorgente disponibile per uso
non commerciale, con attribuzione obbligatoria e redistribuzione del sorgente
alle condizioni indicate in [docs/LICENZA.md](docs/LICENZA.md). Le componenti di
terze parti mantengono le rispettive licenze.

[Sito](https://istante.ruslan-dzyuba.it/) ·
[GitHub](https://github.com/Trorker) ·
[Instagram](https://www.instagram.com/trorker/) ·
[LinkedIn](https://www.linkedin.com/in/ruslan-dzyuba/)
