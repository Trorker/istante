# Font locali di Istante

Istante distribuisce i caratteri editoriali come normali asset statici. Non esiste download font a runtime e non è necessaria alcuna installazione.

```text
assets/fonts/
├── libre-baskerville/
│   ├── LibreBaskerville-VariableFont_wght.ttf
│   └── LibreBaskerville-Italic-VariableFont_wght.ttf
└── excalifont/
    └── Excalifont-Regular.woff2
```

`src/styles/tokens.css` dichiara gli `@font-face` e la build copia gli asset invariati in `dist/assets/fonts/`.

Attribuzioni e licenze: `docs/TERZE-PARTI.md` e `docs/licenses/`.
