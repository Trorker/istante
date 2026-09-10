# Responsive architecture - 4 famiglie

La UI usa quattro famiglie: **Phone**, **Tablet**, **Computer** e **Display/TV**.

`src/vue/core/viewport.js` assegna `data-device` e calcola due misure diverse:

- `--viewport-index`: rapporto larghezza / altezza, usato per la composizione;
- `--viewport-size-index`: dimensione ottica del viewport, usata per font e controlli.

## Phone

Short side <= 600 CSS px. Portrait e landscape sono due composizioni reali, non lo stesso layout ristretto.

In portrait:
- home in colonna;
- blocchi Meteo / Traguardo / Agenda verticali;
- toolbar inferiore con posizioni deterministiche;
- calendario: riga 1 logo + Oggi + Calendari, riga 2 periodo, riga 3 viste.

## Tablet

Classificato soprattutto tramite touch + dimensione. Mantiene touch target ampi e usa piu colonne dove c'e spazio.

## Computer

Laptop e desktop standard. Modali centrate e dimensionate; il timer non diventa fullscreen.

## Display / TV

Viewport CSS molto grandi o ultrawide. Aumenta scala tipografica e distanze senza trasformare la UI in un semplice desktop stirato.

## Regola

I breakpoint non devono essere sparsi nei componenti. La geometria condivisa vive solo in `assets/css/responsive.css`.

## TV 1080p e forzatura del profilo

Dal solo CSS non e possibile conoscere la diagonale fisica dello schermo: un televisore 1920x1080 e un monitor 1920x1080 espongono la stessa area CSS. In automatico, quindi, il profilo **Display/TV** viene scelto solo per canvas realmente grandi (tipicamente 4K).

Per un TV Full HD si puo impostare senza ricompilare in `config/runtime.js`:

```js
deviceProfile: 'display'
```

Valori ammessi: `auto`, `phone`, `tablet`, `computer`, `display`.
