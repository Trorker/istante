# Istante — Visione, valori e sistema di design

**Versione di riferimento:** 3.10.2  
**Sito ufficiale:** https://istante.ruslan-dzyuba.it/

## 1. Che cos'è Istante

Istante è una dashboard/screensaver personale pensata per trasformare uno schermo acceso in un luogo più calmo. Non nasce per aumentare il numero di informazioni visibili, ma per scegliere con cura **quali poche cose meritano di restare davanti agli occhi**: il tempo, una frase, il prossimo capitolo, il cielo, un appuntamento e, quando serve, un sottofondo sonoro.

Il principio centrale è semplice: **prenditi un momento, per te.**

## 2. Valori del progetto

- **Calma prima della densità.** Ogni funzione deve meritarsi il proprio spazio.
- **Presenza, non pressione.** Traguardi e calendario accompagnano; non devono sembrare una lista di cose da fare.
- **Ritmo naturale.** Giorno, notte, alba, tramonto, meteo e fase lunare possono modificare l'atmosfera in modo graduale.
- **Scelta personale.** Quasi tutto ciò che aggiunge movimento, suono o informazioni deve poter essere disattivato.
- **Offline quando possibile.** Orologio, frasi, timer, preferenze, raccolte, cielo calcolabile localmente e suoni sintetizzati non devono dipendere dalla rete.
- **Privacy locale.** Preferenze e contenuti personali restano nel browser salvo azioni esplicite dell'utente.
- **Lunga permanenza sullo schermo.** L'interfaccia deve rimanere piacevole anche dopo ore, senza effetti aggressivi o contrasti stancanti.

## 3. Regola grafica fondamentale

La **v3.8 è il riferimento estetico**. Le funzioni aggiunte successivamente devono sembrare nate insieme a quella versione. Non si introduce una nuova estetica per una singola funzione.

### Da mantenere

- grandi spazi vuoti;
- linee sottili e bordi poco contrastati;
- font serif per frase, titoli emotivi e numeri importanti;
- sans-serif piccola e precisa per controlli e metadati;
- un solo colore accento, usato con moderazione;
- superfici prevalentemente piatte, con ombre leggere solo per modali e livelli temporanei;
- Material Icons/icone locali coerenti per tutte le azioni;
- animazioni lente e brevi transizioni funzionali.

### Da evitare

- card dentro card senza una reale necessità;
- pill e chip usate ovunque;
- pannelli che sembrano dashboard amministrative;
- bordi forti, gradienti decorativi gratuiti e ombre pesanti;
- testi di aiuto lunghi ripetuti sotto ogni controllo;
- controlli nativi che rompono lo stile quando esiste già un equivalente custom;
- elementi che cambiano dimensione o posizione quando parte un timer, una radio o un'animazione.

## 4. Gerarchia dello screensaver

Ordine visivo da proteggere:

1. **Ora e data** — il centro temporale.
2. **Pensiero** — il centro emotivo.
3. **Cielo / meteo / alba e tramonto** — contesto discreto.
4. **Prossimo impegno** — contesto temporale utile quando è presente, leggibile ma non dominante.
5. **Prossimo capitolo** — direzione, non task list; più compatto dell’evento imminente.
6. **Comandi** — secondari e capaci di scomparire.

Nessun nuovo elemento deve competere con ora e frase.

## 5. Calendario

Il calendario è una **vista virtuale della stessa istanza**, non un'altra applicazione. Deve mantenere logo, frase “Un momento, per te.”, colori, tipografia e ritmo di Istante.

- Swipe/tasto cambiano vista senza ricaricare.
- Su schermi grandi il contenuto deve utilizzare il viewport senza scroll della pagina.
- Su schermi piccoli o con poco spazio è consentito lo scroll **interno al contenuto calendario**, mai lo scroll orizzontale dell'intera applicazione.
- Anno, mese, settimana, giorno e agenda devono avere la stessa gerarchia.
- I calendari condivisi sono in sola lettura e visivamente secondari rispetto agli eventi.

## 6. Biblioteca

La biblioteca deve ricordare una raccolta editoriale, non uno store:

- righe e separatori sottili;
- titolo della raccolta in serif;
- categoria e numero di frasi come metadati;
- azioni compatte;
- ricerca con icona e spazio dedicato;
- raccolta attiva indicata con un dettaglio discreto, non con una grande card colorata.

## 7. Impostazioni

Le impostazioni sono divise per significato, tramite accordion. Una sezione aperta alla volta.

Ogni controllo deve seguire uno di questi pattern: toggle, select custom, campo testo/data/ora custom, slider, gruppo segmentato solo quando rappresenta realmente alternative equivalenti. Le note devono essere brevi e occupare tutta la larghezza quando spiegano l'intero gruppo.

## 8. Animazioni e prestazioni

Le animazioni devono:

- usare soprattutto `transform` e `opacity`;
- evitare layout thrashing e proprietà costose animate in continuo;
- rispettare `prefers-reduced-motion`;
- avere una modalità leggera per hardware datato;
- fermarsi o ridursi quando la pagina non è visibile;
- non causare flicker durante cambio tema, timer o passaggio dashboard/calendario.

Il cielo è persistente: **un solo sole di giorno, una sola luna di notte**. Meteo e tema ne modificano intensità e atmosfera, non creano duplicati.

## 9. Responsive

Istante deve essere progettato anche per dispositivi dedicati e orientamenti insoliti. I breakpoint non bastano: conta soprattutto l'altezza disponibile.

- Desktop: composizione ampia e ariosa.
- Tablet: testi abbastanza grandi da essere letti a distanza.
- Telefono verticale: priorità a ora, frase e azioni principali.
- Telefono orizzontale / display bassi: composizione compatta, traguardo sempre leggibile, timer senza spostare il layout, calendario a pieno spazio residuo.

Non è accettabile uno scroll orizzontale della dashboard.

## 10. Criterio per nuove funzioni

Prima di aggiungere una funzione chiedere:

1. Aiuta davvero a creare un momento più calmo o consapevole?
2. Può essere opzionale?
3. Può funzionare localmente o degradare bene offline?
4. Può essere integrata senza rubare attenzione a ora e frase?
5. Somiglia visivamente a Istante 3.8?

Se una risposta è “no”, la funzione va semplificata, spostata nelle impostazioni o lasciata fuori dal progetto.
