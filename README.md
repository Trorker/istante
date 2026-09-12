# Istante 4.0.0-alpha.2

> Alpha Vue dedicata alla **parità visiva con Istante 3.14.1**. La 3.14.1 resta la versione stabile di produzione.

Istante 4 cambia architettura, non identità: colori, testi, gerarchie, menu, font e atmosfera restano quelli della 3.14.1. Il lavoro della nuova base Vue è soprattutto rendere l’interfaccia più solida e realmente responsive su telefono, tablet, laptop/PC e TV.

## Requisiti

Node.js 20.19+ oppure 22.12+ (requisito di Vite 8).

## Avvio

```bash
npm install
npm run dev
```

Build produzione:

```bash
npm run build
```

La cartella `dist/` è pronta per hosting statico. `public/calendar.php` può essere pubblicato insieme al frontend oppure sostituito dal proxy configurato in `public/config/runtime.js`.

## Architettura

- Vue 3, Composition API, `<script setup>`
- TypeScript + Vite
- Pinia + Vue Router
- IndexedDB schema 4
- Service Worker / PWA
- quattro composizioni responsive: phone, tablet, desktop, display
- font e icone locali, nessuna CDN runtime obbligatoria

La versione 3.14.1 è il riferimento funzionale **e visivo**. Il vecchio codice 3.x non viene riutilizzato come architettura applicativa.

## Test

```bash
npm run typecheck
npm test
```

I viewport di accettazione sono definiti in `docs/RESPONSIVE.md`.
