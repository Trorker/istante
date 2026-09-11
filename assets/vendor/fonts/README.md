# Font vendor di Istante

Istante tratta i caratteri editoriali come normali asset vendor del progetto.
Non esiste alcun download a runtime e non serve alcun comando di installazione.

Struttura prevista:

```text
assets/vendor/fonts/
├── libre-baskerville/
│   ├── LibreBaskerville-VariableFont_wght.ttf
│   └── LibreBaskerville-Italic-VariableFont_wght.ttf
└── excalifont/
    └── Excalifont-Regular.woff2
```

I tre file devono essere distribuiti insieme al resto del sito. `fonts.css` li
carica esclusivamente da questi percorsi. Il service worker li tratta come asset vendor runtime: quando il browser li richiede vengono
memorizzati nella cache offline, senza richiedere uno script di preparazione e senza poter
bloccare l'aggiornamento della shell essenziale.

Attribuzioni e licenze: `docs/TERZE-PARTI.md` e `docs/licenses/`.
