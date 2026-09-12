# Istante 4.0.0-alpha.1

> Prima alpha della nuova architettura Vue. Non sostituisce ancora la 3.14.1 in produzione.

Nuova architettura di **Istante**, riscritta da zero in Vue 3 + TypeScript.

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

La cartella `dist/` è pronta per hosting statico. `public/calendar.php` può essere pubblicato separatamente o sostituito dal proxy configurato in `public/config/runtime.js`.

## Architettura

- Vue 3, Composition API, `<script setup>`
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus usato solo nei controlli complessi, senza `app.use(ElementPlus)`
- IndexedDB schema 4
- Service Worker / PWA
- 4 composizioni: phone, tablet, desktop, display

La versione 3.14.1 è usata solo come riferimento e sorgente di **contenuti** (frasi, stazioni, font, icone). Il codice applicativo 3.x non è stato riutilizzato.

## Test

```bash
npm run typecheck
npm test
```

Viewport di accettazione definiti in `docs/RESPONSIVE.md`.
