# Sorgenti Vue

La cartella contiene la struttura sorgente della UI di Istante v4.

- `components/layout/`: shell, topbar, dashboard e toolbar.
- `components/calendar/`: vista calendario.
- `components/dialogs/`: modali e pannelli.
- `components/docs/`: area documentazione.
- `core/viewport.js`: stato reattivo del viewport e scale automatiche.
- `core/service-loader.js`: avvio dei servizi applicativi dopo il mount Vue.
- `bootstrap.js`: mount dell'app principale.
- `docs-bootstrap.js`: mount della pagina documenti.

Per la pubblicazione non è necessaria una build: i bundle browser già pronti sono
`assets/vue/istante-vue.js` e `assets/vue/istante-docs-vue.js`. Quando modifichi i
sorgenti Vue, rigenera i bundle concatenando i file nello stesso ordine descritto
in `docs/ARCHITETTURA-VUE.md` oppure introduci in futuro Vite mantenendo invariato
il contratto dei componenti.
