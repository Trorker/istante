# Terze parti e servizi

Istante usa risorse locali per la propria interfaccia. Solo le funzioni online attivate dall'utente contattano servizi esterni. La licenza del progetto non attribuisce diritti sulle fotografie, sui marchi o sui brani delle radio.

## Material Icons

Le icone dei comandi sono un sottoinsieme SVG locale di Material Icons, con adattamenti. Licenza Apache 2.0. Sono conservati il testo della licenza e il notice originali.

[Progetto Material Icons](https://developers.google.com/fonts/docs/material_icons) · [Testo della licenza](licenses/MATERIAL-ICONS-LICENSE.txt) · [Notice](licenses/MATERIAL-ICONS-NOTICE.txt)

## Icone dei social

Le sole icone di GitHub, Instagram e LinkedIn provengono da Bootstrap Icons, versione 1.13.1, e sono incluse come SVG locali. Copyright 2019-2024 The Bootstrap Authors. Licenza MIT. Non vengono caricati font esterni e non sono inclusi altri componenti Bootstrap. I marchi restano dei rispettivi proprietari.

[Bootstrap Icons](https://icons.getbootstrap.com/) · [Licenza delle icone social](licenses/BOOTSTRAP-ICONS-LICENSE.txt)

## Sole e calcolo locale

Il calcolo solare locale utilizza l'implementazione già inclusa nel progetto, basata su SunCalc. Le informazioni solari permettono il tema diurno e notturno anche senza una nuova risposta del servizio, quando le coordinate sono salvate.

[SunCalc](https://github.com/mourner/suncalc) · [Licenza SunCalc](licenses/SUNCALC-LICENSE.txt)

## Fotografie

Lorem Picsum fornisce le foto automatiche. Le richieste e le immagini provengono dal servizio esterno; la disponibilità non è controllata da Istante. La foto personale resta sul dispositivo. Le cartoline di condivisione usano una composizione grafica locale e non ridistribuiscono le immagini di sfondo.

[Lorem Picsum](https://picsum.photos/)

## Località e meteo

Open-Meteo fornisce dati meteo e solari; la ricerca delle località usa il suo servizio di geocoding basato su GeoNames. Le coordinate vengono inviate quando viene richiesta questa funzione. I dati non recenti sono segnalati o nascosti, non inventati.

Per l'endpoint gratuito Open-Meteo valgono le condizioni d'uso del servizio, incluso l'ambito non commerciale; verifica il piano adatto per un impiego commerciale. I dati meteo hanno condizioni di attribuzione proprie.

[Documentazione Open-Meteo](https://open-meteo.com/en/docs) · [Condizioni del servizio](https://open-meteo.com/en/terms) · [GeoNames](https://www.geonames.org/)

## Radio e catalogo

Gli stream appartengono alle rispettive emittenti. Per alcune voci il collegamento viene risolto attraverso il registro pubblico Radio Browser. URL ambigui o non raggiungibili non vengono sostituiti silenziosamente con altre emittenti.

Le connessioni audio partono su richiesta o da automazioni autorizzate. Istante non salva, scarica o distribuisce i brani. Non garantisce disponibilità continua, qualità lossless o diritti di riproduzione in luoghi pubblici. Le emittenti e i servizi vedono le normali richieste di rete del dispositivo.

[Radio Browser](https://www.radio-browser.info/)

## Condivisione e pagine informative

Il generatore di cartoline usa Canvas e il lettore Markdown è implementato localmente senza librerie caricate da CDN. Il QR dinamico codifica il sito ufficiale e la frase nel frammento del link; la generazione avviene sul dispositivo. La condivisione usa il menu del dispositivo dove disponibile; l'applicazione di destinazione può gestire separatamente immagine e testo.

Preferenze e immagini non vengono inviate a un servizio di generazione. Scegliere una destinazione nel menu di condivisione autorizza invece l'invio a quell'applicazione. Istante non include analytics o tracciamento aggiuntivo.

[Licenza del progetto](LICENZA.md) · [Il progetto](../README.md)

## Cielo locale dalla v3.5.0

`assets/js/scene.js` contiene anche un adattamento delle formule di fase e
illuminazione lunare di **SunCalc 1.9.0**, Vladimir Agafonkin. Resta valida la
licenza BSD-2-Clause conservata in `docs/licenses/SUNCALC-LICENSE.txt`. La fase
non richiede alcuna chiamata remota. La traiettoria grafica è decorativa.

La nuova licenza non commerciale di Istante riguarda solo le parti originali
per cui l’autore dispone dei diritti; non sostituisce MIT, BSD o Apache delle
componenti terze. [Riferimento SunCalc](https://github.com/mourner/suncalc/tree/v1.9.0).


## Suoni ambientali e backup locali (dalla v3.8.0)

Il generatore di rumore rosa, marrone, pioggia e vento usa codice procedurale
originale e le primitive Web Audio del browser. Non contiene registrazioni,
tracce radio o librerie di campioni di terzi. I buffer sono temporanei, in RAM;
il codice dell'applicazione è comunque parte della cache offline.

Il backup usa File, Blob e JSON del browser: nessun caricamento a un server.
Le icone aggiuntive restano SVG locali nello stesso stile dei comandi.

Riferimenti tecnici: [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext),
[creazione dei buffer](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBuffer),
[buone pratiche Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices),
[File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications).


## QR dinamico e calendari (v3.9.0)

Il modulo JavaScript `assets/js/qr.js` adatta tabelle Reed-Solomon e costruzione
della matrice byte-mode da python-qrcode 8.2 (Lincoln Loop e contributori), sotto
licenza BSD-3-Clause. Non esegue Python nel browser. Il testo integrale della
licenza è conservato qui: [licenza QR](licenses/PYTHON-QRCODE-LICENSE.txt).
[Riferimento python-qrcode](https://github.com/lincolnloop/python-qrcode).

Il lettore ICS è un'implementazione locale mirata: non include ICAL.js, non
esegue HTML dagli appuntamenti e non scarica script dal calendario. Non pretende
di implementare l'intero standard. I calendari remoti appartengono ai rispettivi
fornitori e vengono richiesti solo quando l'utente li collega. Il fornitore
riceve la normale richiesta HTTPS; URL con token privati vanno custoditi come
credenziali. I file importati restano locali.
[Riferimento iCalendar](https://datatracker.ietf.org/doc/html/rfc5545).

Rintocco e grana usano primitive Web Audio e SVG del browser, senza registrazioni,
font o librerie di campioni aggiuntivi. Le condizioni delle componenti terze
restano distinte dalla licenza non commerciale delle parti originali di Istante.


## Fusi Windows, festività e citazioni (v3.10.0)

La tabella di alias Windows/IANA in calendar-core.js usa un sottoinsieme delle
mappature Unicode CLDR. Per W. Europe Standard Time viene usata la zona italiana
Europe/Rome. Sono conservati attribuzione e testo integrale della
[Unicode License v3](licenses/UNICODE-LICENSE.txt).
[Riferimento CLDR](https://raw.githubusercontent.com/unicode-org/cldr/main/common/supplemental/windowsZones.xml).

Le festività nazionali italiane sono generate localmente, senza librerie o feed
remoti. La festa nazionale di San Francesco d'Assisi (4 ottobre) è inclusa dal
2026 in base alla [legge 8 ottobre 2025, n. 151](https://www.normattiva.it/eli/id/2025/10/10/25G00153/),
con decorrenza indicata nell'articolo 3. Il calendario è informativo e non sostituisce
le disposizioni applicabili a una specifica scuola, azienda o comune.

Le dieci citazioni classiche riportano testi di opere in pubblico dominio, non
traduzioni moderne; autore, opera e collegamento al testo consultato sono
in [Fonti delle citazioni](FONTI-CITAZIONI.md) e nei JSON della raccolta.
Non è stato incorporato il sito Wikisource o il suo apparato editoriale.
I nuovi pensieri motivazionali e poetici sono testi originali della raccolta di
Istante, non citazioni falsamente attribuite.


## Excalifont

Istante offre **Excalifont** come stile tipografico facoltativo per i contenuti editoriali. Il font non è incluso nel pacchetto di Istante: viene richiesto soltanto quando selezionato, tramite una risorsa del progetto Excalidraw/CDN. Se la rete non è disponibile, l'interfaccia usa il carattere locale di fallback.

Excalifont è distribuito dal progetto Excalidraw con licenza **SIL Open Font License 1.1**. Istante non modifica né ridistribuisce il file del font.

[Progetto Excalidraw](https://github.com/excalidraw/excalidraw) · [SIL Open Font License 1.1](https://openfontlicense.org/)

## Vue 3

La UI della v4.1 usa Vue 3.5.13 incluso localmente in `vendor/vue.global.prod.js`.
Licenza MIT: `docs/licenses/VUE-LICENSE.txt`.
