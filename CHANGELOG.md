# Changelog

## 3.13.8 — 10 settembre 2026

- Timer tablet: recuperato lo spazio liberato da **Durate rapide** per ingrandire il quadrante invece di comprimere il contenuto.
- Timer tablet: modale più larga e composizione ridistribuita, con quadrante, testi e controlli audio più grandi ma senza reintrodurre lo scroll.
- Timer: rimossa la vecchia altezza minima che lasciava troppo spazio vuoto tra le opzioni audio e il footer sui tablet portrait.

## 3.13.7 — 10 settembre 2026

- Timer: respiro reso nettamente più visibile con un alone radiale che non viene tagliato dal contenitore della modale; colori derivati dall’accento del tema con una sfumatura calda coerente con la palette di Istante.
- Timer: eliminato completamente il gruppo **Durate rapide**; la durata si imposta direttamente dal quadrante.
- Timer tablet: modale accorciata e ricomposta senza la riga dei preset, con layout landscape aggiornato per non lasciare spazi vuoti e ridurre la necessità di scroll.

## 3.13.6 — 10 settembre 2026

- Timer: alone respirante reso più evidente; eliminata la progress bar separata sotto il cerchio, lasciando l’avanzamento soltanto sull’anello circolare.
- Timer: il selettore non usa più una lancetta dal centro; la durata scelta è indicata da un singolo punto circolare sul quadrante. All’avvio scompaiono completamente −/+, insieme al testo della durata impostata.
- Wizard: aggiunto un prossimo evento simulato subito dopo Il prossimo capitolo quando non esiste un appuntamento reale, così la guida mostra anche questa capacità della dashboard.
- Wizard touch: l’area gesture mostrata è la stessa area reale usata da doppio tap e swipe volume sul lato destro; il contorno è tratteggiato perché è una zona invisibile nell’interfaccia.
- Wizard Calendario: eliminato il passaggio che evidenziava l’intero calendario; la guida entra direttamente nella vista Anno e passa subito alla spiegazione delle viste.
- Wizard: Avanti/Indietro resi deterministici. Le simulazioni vengono preparate prima del primo step, le transizioni Dashboard ↔ Calendario vengono sospese e il ritardo di 300 ms della vista Calendario viene azzerato durante la guida, evitando coordinate calcolate mentre gli elementi sono ancora in movimento.

## 3.13.5 — 10 settembre 2026

- Wizard: resta una presentazione del prodotto; l’unica configurazione consentita durante la guida è la posizione. Sequenza aggiornata fino a Calendario, viste e gestione calendari, con step gesture mostrato solo sui dispositivi touch.
- Timer: animazione sincronizzata al tempo reale con alone che respira, dot che compie un giro ogni 60 secondi e anello che si riempie in base al tempo trascorso; rimossa l’evidenziazione azzurra della tacca selezionata.
- Dashboard: rimossi gli effetti hover da Meteo e Il prossimo capitolo.
- Audio touch: eliminato il doppio toggle causato dal dblclick sintetico dei browser touch; doppio tap Play/Pausa e volume a passi di 10 restano limitati alla zona destra della Dashboard.
- Calendario: icona Le tue giornate sostituita con Calendario, tasto Oggi senza icona e aggiunta X esplicita al drawer.
- Gesture Calendario: swipe breve in Mese/Settimana cambia soltanto periodo; uno swipe lungo da sinistra verso destra torna alla Dashboard.
- CSS wizard: rimossi i vecchi limiti max-width specifici del testo dello step 2.

## 3.13.4 — 10 settembre 2026

- Timer modale: rimossi Durata precisa, dettagli e nota del passo; controlli −/+ spostati davvero fuori dal quadrante, con icone Material centrate e senza effetto hover.
- Timer: corrette geometria del quadrante e cerchio in esecuzione; aumentato lo spazio dai preset rapidi e riservato sempre lo spazio del chip per evitare spostamenti della dashboard.
- Dashboard: aggiunta l’impostazione per disattivare la compattazione automatica della barra dati durante l’inattività; hover mantenuto solo su Meteo e Il prossimo capitolo.
- Wizard: trasformato in presentazione senza configurazioni, sempre in Excalifont; simula il meteo quando manca e presenta anche la vista Calendario con Le tue giornate.
- Calendario: Le tue giornate ora entra da destra; Gestisci calendari è stato spostato in fondo al pannello e rimosso dalla testata della pagina.
- Gesture touch: abilitate di default; doppio tap Play/Pausa più affidabile, swipe volume a passi esatti di 10 e gesture audio escluse completamente dalla vista Calendario.
- Toast: spostati in alto al centro; rimosso il rendering speciale del toast volume in favore del toast standard.
- Dashboard: premendo il logo viene riaperto il wizard invece di ricaricare la pagina.

## 3.13.3 — 10 settembre 2026

- Timer: rimossa temporaneamente la modalità a pagina; una sola modale più stabile e coerente su touch.
- Timer: quadrante e cerchio in esecuzione condividono la stessa impronta; preset rapidi e +/- resi affidabili, inclusa 1 ora.
- Calendario: logo usa lo stesso lockup della dashboard; Giorno e Agenda sfruttano meglio la larghezza disponibile.
- Navigazione touch: ritorno Calendario → Dashboard più tollerante e limitato alla fascia bassa.
- Audio gesture: doppio tap sul bordo destro reso più affidabile.
- Cielo: Sole e Luna più grandi sui display ampi; stelle notturne riportate in primo piano.
- Dashboard: più respiro tra linea superiore e Prossimo capitolo.
- Wizard: passaggio 2 compattato per display piccoli e tablet landscape.
- Rifiniture generali per la prima release pubblicabile, con priorità a touch e piccoli viewport.

## 3.13.2 — 10 settembre 2026

- Biblioteca: **Crea raccolta** spostato accanto a **Importa JSON o TXT**; mantenuto il flusso dettagli → modifica → frasi una alla volta. Ricerca e filtri restano allineati e la raccolta in uso è evidenziata senza barra laterale.
- Dashboard: corretto il taglio inferiore dell’orario del prossimo impegno e consolidata la modalità inattiva con **una sola riga** sintetica, senza duplicazioni durante il timeout.
- Timer modale: controlli **− / +** spostati ai lati del quadrante e resi geometricamente centrati; corretti i preset 5/15/25/45/60 minuti affinché aggiornino lo stato reale, non solo la grafica.
- Timer: la parte inferiore visibile mostra soltanto **Silenzio / Radio / Suono relax**; messaggi ed errori tecnici restano come live-region invisibili e toast, senza occupare spazio.
- Pagina Timer: layout ripulito, orario corrente integrato, preset rapidi e comando **Imposta durata** utilizzabili direttamente dalla pagina senza sovrapporre footer o controlli.
- Calendario: linguaggio visivo riportato alla **3.12.9** mantenendo le funzioni attuali; viste Anno/Mese/Settimana/Giorno/Agenda solo testuali, mentre Elenco e Gestione restano azioni icon-only.
- Calendario Mese: griglia a piena altezza con 4/5/6 settimane reali; periodo stabile in hover e logo unificato pixel-per-pixel con Dashboard e pagina Timer.
- Calendario Settimana: eventi alleggeriti con un fondo appena percettibile e bordo colore sorgente, conservando la separazione tra data ed eventi.
- Audio gesture: toast volume con slider privo di animazioni pesanti; doppio tap/click reso più tollerante per alternare Play/Pausa nella zona audio.
- Tooltip: eliminati i tooltip nativi del browser e reso deterministico l’annullamento del timer appena si esce dall’elemento prima dei due secondi.
- Cielo notturno: ripristinate e aumentate leggermente le stelle, con resa coerente anche in modalità performance leggera.
- Excalifont: quando scelto globalmente viene applicato alla quasi totalità della tipografia, mantenendo Classic soltanto per micro-testi funzionali dove serve contrasto e leggibilità.
- Eseguiti smoke test Chromium su Dashboard, timeout, Calendario, Timer, raccolte, tooltip e gesture volume; consolidati cache offline, documentazione e compatibilità delle impostazioni esistenti.

## 3.13.1 — 9 settembre 2026

- Dashboard: sfumatura limitata alle sole estremità delle righe, senza mascherare testo o contenuti; pre-timeout più morbido e minimale senza spostare la frase.
- Luna principale ricostruita in SVG con fase, ombra e crateri separati; eliminati gli artefatti lineari e mantenuta la resa nella cartolina tramite mirror canvas.
- tooltip stock del browser eliminati dall'interfaccia; il tooltip custom compare dopo circa 2 secondi di permanenza.
- gesture audio: feedback volume con toast + slider; doppio tap/click nell'angolo destro alterna Play/Pausa della sorgente attiva.
- Biblioteca: nuovo flusso Crea raccolta → dettagli → Modifica raccolta; inserimento e rimozione delle frasi una alla volta; raccolte vuote persistenti ma non attivabili.
- catalogo Raccolte con ricerca e filtri allineati e raccolta attiva evidenziata tramite bordo/superficie, senza riga laterale.
- Timer: selezione della durata tramite quadrante circolare, cerchio in esecuzione più ampio e stabile, pagina Timer con lockup coerente e orario corrente.
- Calendario: pittogrammi delle viste al posto dei numeri, Mese a piena altezza, periodo stabile in hover e lockup coerente con la Dashboard.
- Calendario tablet: periodo sempre leggibile con toolbar compatta su una seconda riga e comandi icon-only; corretta anche la priorità CSS che forzava una sesta settimana vuota.
- Timer landscape: quadrante ridimensionato solo sui viewport bassi per rimanere interamente visibile, mantenendo le opzioni secondarie scorrevoli.
- tipografia: tre tab Piccolo / Normale / Grande; font originale rinominato Classic; Excalifont dedicato al Calendario disponibile solo quando il font globale è Classic.
- selettori custom numerici corretti: 30 secondi e 10 minuti non vengono più trattati come numeri di stazione.
- wizard: Meteo con Attiva / Non ora, Timer ridotto a Finestra / Pagina, Calendario applicato solo su Avanti e collegamento ICS spostato alla pagina Calendario.
- consolidati migrazione impostazioni, cache offline, accessibilità e documentazione di produzione.

## 3.13.0 — 9 settembre 2026

- tooltip resi intenzionalmente ritardati: compaiono solo dopo circa due secondi di permanenza con mouse/trackpad e restano non invasivi su touch;
- aggiunta la **gesture volume** opzionale e disattivata di default: swipe verticale nell’angolo destro su touch per regolare radio o ambiente, con variazione a passi e feedback percentuale;
- Calendario Mese reso dinamico a 4/5/6 settimane: non viene più aggiunta una settimana completa del mese successivo quando non serve;
- Calendario: nuova preferenza **Vista iniziale**, con Anno/Mese/Settimana/Giorno/Agenda oppure **Riprendi l’ultima vista**;
- Timer: aggiunta la modalità **Pagina**, disattivata di default, che crea una terza vista immersiva a sinistra della Dashboard; la navigazione diventa Timer / Dashboard / Calendario e il punto della vista corrente è disabilitato;
- il wizard iniziale permette di scegliere subito Timer in Finestra o Pagina e, se il Meteo non è configurato, mostra un esempio temporaneo offrendo solo l’acquisizione della posizione del dispositivo;
- separati i gesti del Calendario: lo swipe nel contenuto cambia mese/settimana, mentre il ritorno alla Dashboard parte soltanto dalla fascia bassa dello schermo;
- Calendario Settimana alleggerito ulteriormente e dotato di separatore tra intestazione del giorno ed eventi; Anno rifinito con separatore sotto il mese, indicatore evento a linea sui display compatti e cerchio di oggi ricentrato;
- i controlli del Calendario diventano icon/glyph-only su tablet e piccoli display; il titolo del periodo apre il selettore data custom senza spostarsi in hover;
- estesa Excalifont e aggiunta la scelta **Ovunque / Solo calendario**, mantenendo il fallback al font originale e nessun file font incorporato nel pacchetto;
- Biblioteca resa più compatta: raccolta attiva, ricerca e accesso alle Raccolte condividono la stessa riga; catalogo con ricerca ampia a sinistra e filtri-tab a destra;
- Timer modale con indicatore circolare più grande e impronta stabile tra configurazione e conto alla rovescia; mantenuti i controlli − / + precisi;
- generazione cartolina corretta affinché preloader e anteprima occupino lo stesso slot senza spingere il layout;
- gestione stazioni rifinita per evitare la sovrapposizione della linea di selezione al testo;
- focus dello slider dimensione testo mostrato soltanto con `:focus-visible`, più distanziato e arrotondato;
- normalizzata la tipografia del selettore “Ritorna allo screensaver”, inclusi 30 secondi e 10 minuti;
- consolidati responsive, accessibilità, migrazione impostazioni, cache offline e documentazione di produzione.

## 3.12.8 — 9 settembre 2026

- cursore personalizzato trasformato in opzione esplicita delle impostazioni, **disattivata di default**; il puntatore viene rimontato nel pannello/dialog attivo per restare sopra al top layer e resta escluso dai campi di testo e dai dispositivi touch;
- Biblioteca: ricerca delle frasi centrata, rimosso il conteggio laterale ridondante, catalogo Raccolte con ricerca più ampia, filtri a tab sulla destra, importazione testuale discreta e ritorno alle frasi più evidente;
- uniformate le azioni delle card Raccolta: download, attivazione, esportazione ed eliminazione sono più piccole e ancorate in basso a destra;
- Timer: centrati i controlli **− / +** della durata e stabilizzata l'impronta della modale tra configurazione, timer in corso, pausa e conclusione;
- Calendario: corretto il target hover del lockup, logo leggermente più grande, separazione più netta tra mese e griglia nella vista Anno, indicatori evento a linea sui tablet e giorno corrente ricentrato;
- Calendario Settimana: eventi alleggeriti visivamente, pulsanti di servizio a sola icona sui display compatti, titolo del periodo trasformato in selettore data e navigazione Month/Week tramite swipe orizzontale su touch;
- il prossimo impegno rispetta in modo stretto lo switch **Mostra il prossimo impegno** sia nella fascia attiva sia nella fascia sintetica;
- aggiunto un indice adattivo `vw/vh` esposto come variabile CSS per rifiniture responsive basate sulla forma del viewport;
- wizard iniziale compattato sui display bassi/orizzontali e arricchito con configurazione Meteo (posizione, città o coordinate) e collegamento ICS del Calendario; quando il meteo non esiste ancora viene mostrato un esempio temporaneo, mai salvato;
- aggiunta la scelta tipografica **Attuale / Excalifont** per frasi e titoli, con fallback locale e senza includere file font nel pacchetto;
- tooltip resi non persistenti su touch/tablet e rimossi i focus automatici sui campi di testo nei flussi touch;
- gestione radio estesa con comandi per spostare ogni stazione più in alto o più in basso nell'ordine;
- condivisione: rimossa la nota ridondante e aggiunto un placeholder animato durante la generazione della cartolina;
- consolidata la geometria della dashboard in inattività per evitare spostamenti della frase durante lo scambio tra fascia attiva e riepilogo sintetico;
- riallineati documentazione, attribuzioni di terze parti, cache offline e controlli di produzione.

## 3.12.7 — 9 settembre 2026

- Biblioteca: spostato **Vedi raccolte** accanto a ricerca e conteggio frasi; nel catalogo ricerca a sinistra e filtri di stato come tab sulla destra;
- reso più evidente **Torna alle frasi** e ridotto il pulsante **Scarica**, ora ancorato in basso a destra sulle raccolte da installare;
- Timer: aggiunti controlli **− / +** attorno al valore principale per rifinire la durata di un minuto alla volta;
- Calendario Settimana: eventi ridisegnati come mini-card con colore sorgente, orario, titolo, calendario di origine e località quando disponibile;
- corretta anche la sovrapposizione degli eventi nella Settimana mobile: le regole del titolo del giorno non vengono più ereditate dalle card evento e più appuntamenti si impilano correttamente;
- aggiunto puntatore esplicito sul traguardo e introdotto un **cursore custom** leggero per mouse/trackpad, disattivato su touch e nei campi di testo;
- ripristinato il lockup in alto a sinistra con l’**icona reale** di Istante e le due righe `istante.` / `Un momento, per te.` dentro un unico collegamento;
- riallineati versione, documentazione, cache offline e controlli di produzione.

## 3.12.6 — 9 settembre 2026

- toolbar inferiore ricomposta come **un unico cluster centrato**, mantenendo i tre gruppi semantici Frasi / Tempo / Schermo e impostazioni;
- condivisione alleggerita: rimossa l'etichetta visibile “Formato” e preview resa sempre contenuta, senza taglio dell'immagine;
- **Biblioteca** ripensata con due soli livelli, Frasi e Raccolte: tutte le raccolte sono mostrate come card in un unico catalogo e possono essere filtrate per **In uso / Scaricate / Da scaricare**;
- rimosso il comando permanente “Configura il prossimo capitolo” dalla fascia: il riepilogo del traguardo apre ora una **modale dedicata** con avanzamento, tempo residuo e accesso alle impostazioni;
- **Timer** ridisegnato con impostazione principale tramite slider 1–120 minuti, durata precisa in un pannello secondario e stato in corso animato con orbita/progresso;
- toast reso più riconoscibile con superficie più piena, bordo e ombra dedicata anche nel tema Carta;
- scala dei testi trasformata in uno **slider a quattro livelli**: Piccolo, Medio, Grande, Molto grande; la UI cresce più lentamente della frase e le barre di avanzamento mantengono una dimensione fisica minima;
- calendario: logo ricostruito come **un unico pulsante** con simbolo centrato verticalmente tra `istante.` e `Un momento, per te.`;
- calendario Anno: indicatore eventi ingrandito, distanziato dal numero del giorno e reso più contrastato;
- calendario Mese: riservata una riga reale a **“Altri N eventi”** e ridotto il numero di eventi espansi prima del riepilogo;
- calendario Settimana: l'elenco sorgenti non occupa più larghezza permanente, ma diventa un **drawer animato** aperto dal pulsante Elenco; i sette giorni usano l'intero canvas;
- feedback sonoro dei tocchi aumentato e slider volume spostato sotto la scelta del timbro;
- backup: **Località** e **Calendari** usano entrambi lo stesso pattern a switch;
- effetti meteo nel tema Carta rinforzati per mantenere contrasto e leggibilità senza diventare invasivi;
- quando non è configurato alcun traguardo, la relativa fascia viene realmente rimossa e lo spazio residuo viene redistribuito tra Meteo e Calendario;
- consolidati stati opzionali, compatibilità con dati locali esistenti, cache offline, documentazione e controlli di produzione.

## 3.12.5 — 9 settembre 2026

- portata la tipografia del calendario a una soglia minima realmente leggibile, con particolare attenzione alla vista **Settimana** e ai display compatti;
- vista **Anno** ridisegnata per sfruttare l'altezza disponibile in una griglia 4×3 sui desktop normali, mantenendo un limite di larghezza sui monitor ultrawide;
- corretto il lockup del logo del calendario: il simbolo non eredita più il vecchio posizionamento assoluto e non si sovrappone alla scritta;
- ingrandite le barre di avanzamento attiva e inattiva e aumentata la leggibilità dei relativi dati;
- fascia informativa resa adattiva: 20/60/20 con Meteo e Calendario, 25/75 quando è attivo un solo blocco laterale, 100% al traguardo quando entrambi sono disattivati;
- aggiunta una modale **Meteo e luce** apribile dalla fascia attiva e dal riepilogo inattivo, con temperatura, condizione, località, alba, tramonto e fase lunare;
- biblioteca rifinita con testata su due livelli, ricerca a tutta larghezza, raccolta corrente più evidente e righe delle frasi più leggibili;
- doppio clic sulla frase corrente per copiarla negli appunti, con fallback per browser senza Clipboard API moderna;
- wizard iniziale esteso a tutti i comandi principali, inclusi Meteo e Calendario anche quando non sono ancora configurati;
- cartolina di condivisione resa più compatta, con preview ridotta; le opzioni secondarie sono raccolte nell'accordione **Configura cartolina**;
- toolbar inferiore divisa in tre gruppi: Frasi / Tempo / Schermo e impostazioni;
- alleggerite e rese più fluide le transizioni di dialog, pannelli, chrome e accordioni, eliminando blur costosi durante l'inattività;
- riallineati versione, documentazione, cache offline e controlli di produzione.

## 3.12.4 — 9 settembre 2026

- corretta alla radice la disposizione della dashboard: contenuto centrale, fascia informativa e toolbar ora occupano tre aree strutturali distinte e non possono più sovrapporsi;
- il ridimensionamento automatico di orologio e frase misura soltanto la propria area e non intercetta più i click sui comandi inferiori;
- fascia attiva confermata a **80% del viewport** e **Meteo 20% · Conto alla rovescia 60% · Calendario 20%**, con tutti i blocchi forzati sulla stessa riga;
- fascia attiva ulteriormente alleggerita e timer mantenuto separato e centrato;
- modalità inattiva confermata come componente distinto, più sottile, nello stesso ordine 20/60/20;
- calendario reso nuovamente apribile dalla toolbar e consolidato con un solo livello CSS finale autorevole;
- corretto il nesting HTML della vista calendario e dei dialog: non sono più figli di `#app-shell`, quindi lo stato `inert` della dashboard non disabilita più navigazione, pulsanti ed eventi;
- aumentata e normalizzata la tipografia del calendario nelle viste Anno, Mese, Settimana, Giorno e Agenda, rispettando Piccolo / Medio / Grande;
- aggiunto un renderer dedicato alla vista **Giorno**, che non ricade più implicitamente nell'Agenda;
- rimossi i fallback responsive del calendario che riportavano alcuni testi a 5–7 px;
- riallineati worker, cache offline, README, Visione e documentazione di release.

## 3.12.3 — 9 settembre 2026

- corretta definitivamente la sequenza della fascia: **Meteo · Conto alla rovescia · Calendario**;
- larghezza desktop portata all'**80% del viewport** con proporzioni interne fisse **20% / 60% / 20%**;
- ridotta l'altezza e rimossi gli elementi da card per rendere la fascia normale più leggera e meno simile a una dashboard gestionale;
- introdotta una **seconda fascia dedicata all'inattività**: la fascia normale scompare dopo il timeout e viene sostituita da un riepilogo molto più sottile;
- riepilogo inattivo: meteo essenziale con alba/tramonto, traguardo con descrizione breve, percentuale, barra di avanzamento e giorni/ore/minuti, prossimo evento sintetico;
- il prossimo evento per la fascia inattiva viene calcolato quando il calendario è attivo anche se il riquadro prossimo evento della vista normale è disabilitato;
- timer mantenuto separato e centrato sopra la fascia;
- corretta la struttura della shell affinché timer, fascia e footer appartengano allo stesso viewport e la sostituzione attiva/inattiva sia stabile;
- aggiunta la release `docs/release/v3.12.3.md` e riallineati versione, worker, documentazione e cache offline.

## 3.12.2 — 9 settembre 2026

- ridisegnata la parte bassa come fascia unica a tre zone: Meteo, Conto alla rovescia e Calendario;
- timer riportato al centro sopra la fascia;
- la fascia informativa resta visibile in inattività mentre la toolbar dei comandi scompare;
- sostituita la vecchia scala testo con il selettore Piccolo / Medio / Grande;
- aumento ulteriore della tipografia del calendario, comprese viste mese, anno, settimana e agenda;
- aggiunto un riepilogo calendario utile anche quando il prossimo impegno non è mostrato;
- corretto il focus da tastiera del logo, che ora comprende anche la tagline;
- aggiunta la release `docs/release/v3.12.2.md` e riallineati riferimenti e cache offline.

## 3.12.1 — 9 settembre 2026

- ricomposta la parte bassa della dashboard: prossimo evento e timer a sinistra, Prossimo capitolo al centro, meteo e astronomia a destra;
- rimosso dalla dashboard il collegamento permanente “Mattina & sera”; la modalità delle frasi resta configurabile nelle impostazioni;
- meteo ridisegnato con temperatura e condizione in primo piano, località come metadato e alba/tramonto/fase lunare su un secondo livello compatto;
- prossimo evento reso editoriale e leggibile, senza card pesante e senza occupare il centro della hero;
- tipografia del calendario aumentata in Mese, Anno, Settimana e Agenda, compresi tablet e telefoni landscape;
- su schermi bassi gli eventi del mese tornano leggibili come testo invece di essere compressi in barre da pochi pixel;
- vista Anno dei display landscape bassi portata a tre colonne con scroll interno, privilegiando la leggibilità rispetto al mostrare tutti i mesi in una sola schermata;
- corretto il caso in cui il calendario continuava a riservare la colonna delle sorgenti anche quando la sidebar era nascosta;
- aggiornate le regole di `VISIONE-E-DESIGN.md` per gerarchia degli angoli e leggibilità minima.

## 3.12.0 — 9 settembre 2026

- corretto il crash all’avvio della biblioteca causato dal vecchio `#collection-count` rimosso dalla toolbar;
- `updateLibraryCounts()` ora aggiorna in modo sicuro solo gli elementi effettivamente presenti nel DOM;
- audit degli ID usati dai moduli principali per evitare regressioni analoghe;
- riallineati versione, worker calendario, backup, lettore documenti e cache offline;
- nessun cambiamento alla disposizione grafica consolidata nella v3.11.1.

## 3.11.1 — 9 settembre 2026

- Dashboard più ariosa: meteo/alba/tramonto/fase lunare nell’angolo basso destro; timer e prossimo evento nell’angolo basso sinistro.
- Biblioteca spostata nella toolbar centrale come sola icona e ridisegnata come un’unica modale con viste Frasi/Raccolte.
- Prossimo evento reso leggibile senza occupare il centro della hero.
- Nuovo sistema di tooltip personalizzati coerenti con i temi Carta/Notte.
- Timer: nuova icona dedicata al Silenzio.
- Calendario: tipografia aumentata mantenendo la geometria responsive della 3.11.

## 3.11.0 — Calendario più maturo, una sola biblioteca

- vista **Mese**: quando gli eventi eccedono lo spazio disponibile compare `altri eventi`, che apre direttamente la vista del giorno;
- testata calendario ulteriormente compattata: **Oggi** e selezione Anno/Mese/Settimana/Giorno/Agenda sono allineati sul lato destro insieme ai comandi;
- calendario riequilibrato su desktop, tablet, telefono verticale e landscape, mantenendo lo scroll soltanto nella superficie calendario quando serve;
- **Prossimo evento** riportato a una presenza intermedia: leggibile e coerente, senza tornare alla card pesante delle prime prove;
- la scelta delle raccolte ora avviene nella **stessa modale** della biblioteca delle frasi, senza aprire un secondo dialog sovrapposto;
- logo riallineato: il simbolo è centrato rispetto al blocco `istante.` + `Un momento, per te.` sia sulla dashboard sia nel calendario;
- selezione stazione consolidata con accento laterale, lasciando la destra libera per Preferiti e azioni;
- ricerche delle stazioni uniformate allo stesso componente usato nel resto di Istante;
- timbro **Legno** del suono dei tocchi ricostruito con un colpo sintetico più udibile;
- collegamenti About (`Leggi il progetto`, `Tutte le novità`, release, licenze e Visione) riallineati allo stile del sito e aperti nel lettore interno;
- nuova release documentata in `docs/release/v3.11.0.md`; cache offline e riferimenti di versione riallineati.

## 3.10.3 — Calendario e controlli coerenti

- unificate intestazione e toolbar del calendario in una sola barra compatta;
- riscritto il comportamento responsive finale del calendario, neutralizzando vecchie regole CSS che cambiavano il layout tra dispositivi;
- vista Anno a 4/3/2 colonne secondo lo spazio reale, con giorni sempre circolari e scroll confinato al contenuto quando necessario;
- vista Mese adattata a desktop, tablet, telefoni stretti e landscape senza overflow orizzontale;
- sui tablet le sorgenti ICS non occupano più una seconda fascia: restano raggiungibili dal pulsante `Calendari`;
- prossimo impegno trasformato da card marcata a riga editoriale discreta;
- stazione selezionata indicata a sinistra, lasciando la destra libera per il cuore Preferiti;
- ricerca del selettore radio e gestione stazioni uniformata al componente di ricerca usato nel resto di Istante;
- aggiornato `docs/VISIONE-E-DESIGN.md` con le regole permanenti per calendario e stati selezionati;
- cache offline e riferimenti di release riallineati alla 3.10.3.

## 3.10.2 — Proporzioni e calendario

- timer: ore, minuti, secondi e conteggio in corso tornano ad avere una dimensione leggibile e centrale;
- calendario Anno e Mese non vengono più tagliati: quando lo spazio non basta scorre soltanto il contenuto interno, mai la pagina;
- vista Anno libera da altezze forzate che nascondevano gli ultimi mesi;
- vista Mese con righe minime leggibili, così eventi e numeri del giorno non vengono schiacciati;
- sezione “Il prossimo capitolo” resa più bassa e leggera sulla dashboard;
- prossimo impegno allargato e reso più leggibile, mantenendo il linguaggio minimale della v3.8;
- ulteriori correzioni per telefoni in orizzontale e display bassi;
- cache offline e riferimenti di release riallineati alla 3.10.2.

## 3.10.1 — Coerenza e responsive

- corretto il giorno corrente ovale nella vista Anno del calendario;
- calendario affinato per telefono orizzontale e display bassi;
- frase “Un momento, per te.” sempre sotto il logo anche nel calendario;
- chiarita la gestione contemporanea di più calendari ICS;
- biblioteca riportata al linguaggio editoriale della v3.8;
- corretto lo spazio della ricerca rispetto all’icona;
- aggiunto swipe con il mouse opzionale;
- aggiunti quattro feedback sonori sintetizzati e opzionali per i tocchi;
- sole/luna restano visibili anche con meteo coperto o temporalesco, con intensità ridotta;
- guida iniziale estesa a calendario e configurazione diretta del Prossimo capitolo;
- aggiunto `docs/VISIONE-E-DESIGN.md` come riferimento permanente per valori, grafica e responsive.

## 3.10.0 — 9 settembre 2026

- Ricostruzione grafica completa sulla base della v3.8.0.
- Ripristinati tipografia, spaziature, superfici, modali e gerarchia delle impostazioni della 3.8.
- Benvenuto con logo reale animato e testo riscritto sul significato del progetto.
- Wizard iniziale nuovamente coerente con il design, con preferenze applicabili direttamente.
- “Prossimo capitolo” configurabile dalla dashboard e dal wizard, anche in mesi o anni.
- Controlli introdotti dopo la 3.8 adattati al sistema visivo originale.
- Conservate calendario, raccolte multiple, radio/ambiente, timer, condivisione, backup e funzioni cielo/meteo.
- Ripuliti i riferimenti alle patch 3.10.1–3.10.4: questa è la nuova 3.10 canonica.

Vedi le [note complete](docs/release/v3.10.0.md).

## 3.9.0 — 8 settembre 2026

Calendario ICS con cinque viste, biblioteca JSON persistente, QR con frase e modale di ricezione, rintocco orario, grana analogica, cielo circolare più caldo, riga ambientale riordinata e countdown in mesi/anni. Modalità leggera per tablet, meno ridisegni e backup esteso. Vedi [note complete](docs/release/v3.9.0.md) per limiti ICS, rete, audio e verifiche.

Le modifiche sono elencate dalla release più recente. Le voci Original 1.x descrivono la base minimale da cui deriva la linea 3.x; non includono gli esperimenti grafici della precedente linea 2.x.

## 3.8.0 - 8 settembre 2026

- Nuovo indirizzo ufficiale `https://istante.ruslan-dzyuba.it/`: aggiornati metadati, condivisione, QR, pagine informative e anteprima social.
- Benvenuto riscritto intorno all'idea di uno spazio personale che accompagna la giornata. Guida facoltativa con evidenziazioni, frecce disegnate e suggerimenti contestuali; rivedibile da Informazioni.
- Unica firma laterale nelle cartoline: `by ♡ Ruslan Dzyuba · istante.ruslan-dzyuba.it`, anche senza QR. Logo, cielo e meteo restano nella composizione.
- Eliminato il secondo astro durante il cambio tema. Sole e luna seguono il ritmo reale o indicativo della giornata; la transizione cambia soltanto l'atmosfera cromatica.
- Generatore ambientale offline nel player: rumore rosa, marrone, pioggia e vento, con volume, mute e attivazione indipendente dalla radio. Nessun file audio remoto; radio e generatore non si sovrappongono.
- Backup e ripristino JSON locale delle preferenze, del traguardo, del catalogo radio, delle programmazioni, delle frasi preferite e dello storico. Località facoltativa, anteprima e conferma prima della sostituzione, controlli di validità e rollback in caso di errore di memoria.
- Guida adattata a telefoni in orizzontale e verticale, senza scroll della dashboard. Tutte le nuove risorse incluse nella cache verificata della release.

## 3.7.0 - 8 settembre 2026

- Sostituite le 700 frasi con 1.000 nuovi pensieri, controllati per duplicati e formulazioni troppo simili.
- Sorteggio casuale senza ripetizioni fino all'esaurimento del ciclo; storico locale persistente, frase stabile nella stessa fascia e aggiornamenti senza perdere le raccolte personali.
- Pioggia, neve, nuvole, nebbia, luce ed effetti ambientali inclusi anche nel PNG della condivisione. Restano logo, firma laterale e QR coordinato al tema.
- Sole, luna e stelle seguono le condizioni del cielo, sia sulla dashboard sia nelle cartoline. Distinzione fra meteo recente ed effetti decorativi manuali; nessuna condizione inventata offline.
- Toast centrato tramite un contenitore indipendente dalle animazioni e dalle modali: nessun salto laterale durante l'ingresso o la chiusura delle impostazioni.
- Traguardo e conto alla rovescia mantenuti sui telefoni in orizzontale; adattamento del contenuto senza scroll della dashboard.
- Testo e contatore del pulsante Raccolta nascosti sui telefoni, anche in orizzontale. Restano icona, nome accessibile e accesso alla lista completa.
- Aggiornati documentazione, risorse e cache verificata; incluso `docs/release/v3.7.0.md`.

[Note complete della release 3.7.0](docs/release/v3.7.0.md)

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
