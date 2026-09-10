# Architettura responsive di Istante

**Riferimento:** v4.0.0

La v4 separa in modo netto **aspetto** e **composizione**. `assets/css/istante.css` contiene il linguaggio visuale condiviso; `assets/css/layout.css` e l'unico livello autorizzato a decidere geometria, densita e ricomposizione in base al dispositivo. Non esistono piu file `polish-*` o una catena di override responsive di release in release.

## Le quattro famiglie

1. **Telefono (`phone`)** — esperienza touch compatta, con composizioni indipendenti portrait e landscape.
2. **Tablet (`tablet`)** — piu spazio simultaneo, senza trattarlo come un desktop ristretto.
3. **Computer (`computer`)** — laptop e desktop normali; modali a finestra, contenuti centrati e controlli completi.
4. **Display (`display`)** — viewport realmente grandi, ultrawide e TV; scala maggiore ma con limiti di larghezza per non disperdere i contenuti. Un normale viewport Full-HD resta nella famiglia Computer per non ingrandire inutilmente l'interfaccia su laptop.

La famiglia viene calcolata sul `visualViewport` quando disponibile. Questo permette a Safari/iOS di reagire alla rotazione e alle variazioni dell'area realmente visibile dovute alle barre del browser.

## Due indici, due responsabilita

Il controller reattivo Vue `src/vue/core/viewport.js` espone:

- `--viewport-index = width / height`: descrive la **forma** del viewport e contribuisce a scegliere portrait, landscape, tall, wide o ultrawide;
- `--viewport-size-index = sqrt(width * height) / sqrt(1440 * 900)`: descrive la **dimensione ottica** del viewport e alimenta la scala automatica di font e UI.

Il secondo indice evita l'errore di legare la tipografia soltanto al rapporto dello schermo: un telefono 16:9 e una TV 16:9 hanno una forma simile, ma non devono avere gli stessi corpi tipografici. La scala scelta dall'utente viene poi moltiplicata per quella automatica del dispositivo.

## Variabili runtime

Su `<html>` vengono mantenuti:

- `data-device="phone|tablet|computer|display"`;
- `data-orientation="portrait|landscape|square"`;
- `data-viewport-shape="tall|balanced|wide|ultrawide"`;
- `data-viewport-layout`;
- `--viewport-index`;
- `--viewport-size-index`;
- `--viewport-w-px`, `--viewport-h-px`, `--viewport-short-px`;
- `--device-font-scale`, `--device-ui-scale`;
- `--text-scale`, `--ui-scale`.

## Dashboard

### Telefono portrait

La scena principale occupa lo spazio flessibile. Sotto di essa, la fascia informativa usa una vera colonna: **Meteo/Luce**, **Prossimo capitolo**, **Prossimo impegno**. Ogni blocco ha altezza propria e non puo essere riportato in una griglia orizzontale da regole storiche. La toolbar resta un livello separato e stabile.

### Telefono landscape

La priorita e preservare spazio verticale per ora e pensiero. La fascia informativa usa una riga molto compatta e nasconde prima i dettagli secondari, senza ridurre i touch target essenziali.

### Tablet

Il tablet ha composizioni proprie portrait/landscape. Non eredita automaticamente la colonna del telefono e non viene trattato come un computer soltanto piu stretto.

### Computer e Display

La Dashboard mantiene il ritmo editoriale. I display grandi aumentano scala e respiro in funzione del `viewport-size-index`, con limiti massimi di larghezza.

## Timer

Su **Computer** la modale Timer e una finestra centrata con larghezza e altezza massime. Non usa dimensioni fullscreen. Tablet e Display hanno limiti propri; il telefono puo invece usare piu superficie quando serve alla leggibilita e al touch.

## Calendario

### Telefono portrait

La testata segue tre livelli fissi:

1. **logo** a sinistra, **Oggi** e **Calendari** a destra;
2. **periodo centrato**, con precedente/successivo ai lati;
3. segmented control con **Anno / Mese / Settimana / Giorno / Agenda**.

Il pulsante Calendari contiene solo l'icona calendario. Il vecchio pulsante freccia separato e nascosto su telefono. La vista Anno usa due colonne elastiche e griglie interne a sette colonne senza larghezze rigide che possano tagliare l'ultima colonna.

### Telefono landscape

Resta la composizione compatta a due righe. Il pulsante Calendari mantiene solo l'icona calendario e la vista Anno usa tre colonne elastiche.

### Tablet / Computer / Display

Mantengono etichette complete e maggiore densita informativa, con numero di colonne e spaziature coerenti alla famiglia.

## Regola per le release future

Non creare nuovi `polish-x.y.z.css` e non reintrodurre `responsive.css`.

- **Aspetto condiviso:** `assets/css/istante.css`.
- **Geometria e responsive:** `assets/css/layout.css`.
- **Documentazione:** `assets/css/documents.css`.

Prima di aggiungere una regola responsive va deciso se il problema appartiene alla famiglia (`data-device`), all'orientamento, alla forma del viewport oppure alla scala ottica. Una correzione per una singola risoluzione e l'ultima scelta, non la prima.
