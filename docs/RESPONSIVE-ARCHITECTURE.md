# Architettura responsive di Istante

**Riferimento:** v3.15.0

Istante non usa piu una sequenza di correzioni CSS legate a singole larghezze. La composizione parte da quattro famiglie di dispositivo e usa larghezza, altezza e forma del viewport come segnali secondari.

## Le quattro famiglie

1. **Telefono (`phone`)**: interfaccia touch compatta. Ha composizioni distinte portrait e landscape, con priorita alla leggibilita e alle aree di tocco.
2. **Tablet (`tablet`)**: mantiene piu informazioni contemporaneamente ma evita di comportarsi come un desktop semplicemente ristretto.
3. **Computer (`computer`)**: laptop e desktop normali. La scena resta ampia, centrata e con controlli completi.
4. **Display (`display`)**: monitor molto grandi, ultrawide e TV. Testi, corpi celesti, spazi e larghezza utile crescono senza dilatare indefinitamente i contenuti.

La famiglia viene calcolata sul `visualViewport` quando disponibile, quindi Safari mobile puo cambiare correttamente composizione anche quando barre del browser o rotazione modificano l'area realmente visibile.

## Due indici, due responsabilita

Istante espone due indici CSS:

- `--viewport-index = larghezza / altezza`: descrive la **forma** dello schermo. Serve a scegliere portrait, landscape, tall, wide e ultrawide.
- `--viewport-size-index = sqrt(larghezza * altezza) / sqrt(1440 * 900)`: descrive la **scala fisica del layout in CSS pixel**. Serve alla scala tipografica e alla densita dell'interfaccia.

Usare solo `vw / vh` per la dimensione dei font sarebbe scorretto: un telefono 16:9 e un televisore 16:9 hanno lo stesso rapporto, ma non devono avere la stessa tipografia. Per questo la forma decide la composizione, mentre la dimensione effettiva contribuisce alla scala.

## Variabili runtime

Il bootstrap imposta su `<html>`:

- `data-device="phone|tablet|computer|display"`
- `data-orientation="portrait|landscape|square"`
- `data-viewport-shape="tall|balanced|wide|ultrawide"`
- `--viewport-index`
- `--viewport-size-index`
- `--viewport-w-px`, `--viewport-h-px`, `--viewport-short-px`
- `--device-font-scale`, `--device-ui-scale`

`--text-scale` e `--ui-scale` sono il prodotto tra la scala automatica del dispositivo e la dimensione scelta dall'utente. La preferenza dell'utente resta quindi rispettata, ma viene adattata al contesto reale dello schermo.

## Dashboard

### Telefono portrait

La fascia informativa inferiore e una vera colonna. Meteo/luce, Prossimo capitolo e prossimo impegno occupano tre righe indipendenti; nessuna regola desktop basata su `:has()` puo rimetterli affiancati. La toolbar resta sotto come quarto livello stabile.

### Telefono landscape

La fascia usa una sola riga molto bassa. I dettagli secondari spariscono prima di ridurre eccessivamente testo e icone. Ora e pensiero sfruttano la larghezza con una composizione a due colonne.

### Tablet

Il tablet ha una composizione propria: non eredita automaticamente ne la colonna del telefono ne la larghezza del desktop. In portrait la fascia informativa puo usare una seconda riga; in landscape sfrutta maggiormente la larghezza.

### Computer e display

I computer mantengono l'impostazione editoriale della dashboard. I display grandi aumentano scala e respiro ma applicano limiti di larghezza per evitare che frase e informazioni diventino troppo disperse.

## Calendario

Il calendario mobile ha una testata indipendente dal desktop.

- **Telefono portrait:** identita e azioni; periodo e navigazione; cinque viste. I comandi di navigazione e le azioni sono raggruppati in rail coerenti e non si sovrappongono.
- **Telefono landscape:** due righe compatte. La vista Anno usa tre colonne e scorre verticalmente invece di comprimere dodici mesi in celle illeggibili.
- **Tablet:** toolbar completa e vista Anno a tre o quattro colonne in base all'orientamento.
- **Computer/display:** mantengono etichette complete e piu spazio per eventi e contenuti.

Le viste Anno, Mese, Settimana, Giorno e Agenda restano funzionalmente identiche; cambia soltanto la composizione.

## Regola per le release future

Non creare nuovi `polish-x.y.z.css`. Le regole visuali di base restano in `assets/css/istante.css`; tutte le decisioni dipendenti da dispositivo, orientamento o rapporto del viewport devono vivere in `assets/css/responsive.css`. Prima di aggiungere un breakpoint va verificato se il problema e di famiglia (`data-device`), di orientamento o di forma (`data-viewport-shape`).
