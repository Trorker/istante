# Responsive

Profili: `phone`, `tablet`, `desktop`, `display`. La classificazione usa il viewport effettivo (`visualViewport` quando disponibile), orientamento, lato corto/lungo e rapporto d'aspetto.

## Regola visiva

Il responsive **non crea un'altra grafica**. Tutti i profili mantengono l'identità della 3.14.1: stessi colori, stessi font, stessi testi, stessi menu, stessa atmosfera e stessa gerarchia generale.

Può cambiare solo ciò che serve all'ergonomia:

- posizione e densità dei blocchi;
- spaziature;
- dimensioni entro limiti fluidi;
- disposizione portrait/landscape;
- dimensione e comportamento delle modali;
- quantità di dettagli secondari visibili quando lo spazio è ridotto.

Phone portrait mantiene la composizione verticale. Phone landscape può affiancare orologio e pensiero per sfruttare l'altezza ridotta. Tablet conserva l'impianto della dashboard ma aumenta aree touch e stabilizza modali/toolbar. Desktop usa la composizione 3.14.1 con max-width. Display amplia tipografia e safe-area senza trasformare la dashboard in un'altra UI.

La vista **Settimana** del calendario non viene proposta sui telefoni.

## Viewport di collaudo

- Phone: 390×844, 430×932, 844×390, 932×430
- Tablet: 768×1024, 820×1180, 1024×768, 1180×820
- Desktop: 1366×768, 1440×900, 1920×1080, 2560×1440, 3440×1440
- Display: 2560×1440 (override), 3840×2160

Per ogni viewport verificare: nessun clipping, testi completi, toolbar raggiungibile, calendario leggibile, modali dentro il viewport e safe-area iOS rispettata.
