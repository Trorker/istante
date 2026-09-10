/* Istante v4 · Vue component: DocumentApp */
(function(){
 'use strict';
 const registry=window.IstanteVueComponents=window.IstanteVueComponents||{};
 registry.DocumentApp={name:'DocumentApp',template:`<div class="document-shell">
<header class="document-header"><a aria-label="Istante, torna alla schermata" class="document-brand" href="./">istante.</a><a class="document-back" href="./"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="m12 4 1.41 1.41L7.83 11H20v2H7.83l5.58 5.59L12 20l-8-8z"></path></svg>Torna al tuo istante</a></header>
<nav aria-label="Pagine informative" class="document-nav"><a data-doc="progetto" href="leggi.html?doc=progetto">Il progetto</a><a data-doc="novita" href="leggi.html?doc=novita">Tutte le novità</a><a data-doc="release" href="leggi.html?doc=release">Release 4.1.0</a><a data-doc="licenza" href="leggi.html?doc=licenza">Licenza</a><a data-doc="terze-parti" href="leggi.html?doc=terze-parti">Terze parti</a><a data-doc="visione" href="leggi.html?doc=visione">Visione e design</a></nav>
<main><p class="document-eyebrow" id="document-label">Un po' di Istante</p><article aria-busy="true" class="document-article" id="document-content"><p>Un istante, preparo la lettura...</p></article></main>
<footer class="document-footer"><span>Istante 4.1.0 · Un momento, per te.</span><a hidden="" href="README.md" id="document-source" rel="noopener" target="_blank">Apri il Markdown originale</a></footer>
<noscript><p>Per caricare i file Markdown abilita JavaScript, oppure apri <a href="README.md">README</a>, <a href="CHANGELOG.md">changelog</a>, <a href="docs/LICENZA.md">licenza</a> e <a href="docs/TERZE-PARTI.md">terze parti</a>.</p></noscript>
</div>`};
})();
