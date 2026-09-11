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
carica esclusivamente da questi percorsi. Il service worker li considera asset
vendor opzionali durante l'installazione: se sono presenti sul server vengono
memorizzati nella cache offline senza richiedere uno script di preparazione.

Attribuzioni e licenze: `docs/TERZE-PARTI.md` e `docs/licenses/`.
