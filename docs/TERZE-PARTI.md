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

Il generatore di cartoline usa Canvas e il lettore Markdown è implementato localmente senza librerie caricate da CDN. Il QR statico codifica soltanto l'indirizzo pubblico di Istante. La condivisione usa il menu del dispositivo dove disponibile; l'applicazione di destinazione può gestire separatamente immagine e testo.

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
