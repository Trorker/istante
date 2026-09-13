# Terze parti e servizi — Istante 4.0

Istante è progettato per funzionare con interfaccia, font, runtime Vue, QR e logica principale disponibili localmente. Le funzioni online vengono contattate soltanto quando richieste o configurate dall'utente.

La licenza di Istante riguarda esclusivamente le parti originali del progetto e non sostituisce le licenze dei componenti di terze parti.

## Vue 3

Il runtime applicativo usa **Vue 3.5.13** distribuito localmente in:

`assets/vendor/vue.global.prod.js`

Copyright (c) 2018-present Yuxi (Evan) You and Vue contributors. Licenza MIT.

[Testo licenza Vue](licenses/VUE-LICENSE.txt) · [Progetto Vue](https://vuejs.org/)

## Tipografia

### Libre Baskerville

La famiglia CSS `Istante Classic` usa Libre Baskerville come asset locale:

- `assets/fonts/libre-baskerville/LibreBaskerville-VariableFont_wght.ttf`
- `assets/fonts/libre-baskerville/LibreBaskerville-Italic-VariableFont_wght.ttf`

Distribuzione sotto **SIL Open Font License 1.1**.

### Excalifont

Excalifont è distribuito localmente in:

- `assets/fonts/excalifont/Excalifont-Regular.woff2`

Distribuzione sotto **SIL Open Font License 1.1**.

[Testo OFL](licenses/SIL-OFL-1.1.txt) · [Notice Libre Baskerville](licenses/LIBRE-BASKERVILLE-NOTICE.txt) · [Notice Excalifont](licenses/EXCALIFONT-NOTICE.txt)

## Icone

Le icone applicative includono forme derivate/adattate da Material Icons, distribuite secondo Apache 2.0. Le icone social locali derivano da Bootstrap Icons, licenza MIT.

[Licenza Material Icons](licenses/MATERIAL-ICONS-LICENSE.txt) · [Notice Material Icons](licenses/MATERIAL-ICONS-NOTICE.txt) · [Licenza Bootstrap Icons](licenses/BOOTSTRAP-ICONS-LICENSE.txt)

## QR locale

Il motore QR locale adatta logica byte-mode/Reed-Solomon da **python-qrcode**, sotto BSD-3-Clause. Non esegue Python nel browser e non contatta servizi QR esterni.

[Licenza QR](licenses/PYTHON-QRCODE-LICENSE.txt) · [python-qrcode](https://github.com/lincolnloop/python-qrcode)

## Sole, luna e calcolo locale

Le formule astronomiche usate per parte dei calcoli di sole/luna derivano/adattano SunCalc. La relativa licenza è conservata localmente.

[Licenza SunCalc](licenses/SUNCALC-LICENSE.txt) · [SunCalc](https://github.com/mourner/suncalc)

## Fusi Windows / IANA

Il parser calendario contiene un sottoinsieme di alias Windows/IANA basato sulle mappature Unicode CLDR per normalizzare feed Outlook/Windows comuni.

[Licenza Unicode](licenses/UNICODE-LICENSE.txt) · [Unicode CLDR](https://cldr.unicode.org/)

## iCalendar / ICS

Il parser ICS di Istante è un'implementazione locale mirata basata sul formato iCalendar. Non include ICAL.js e non esegue HTML o script contenuti nei calendari.

I calendari remoti appartengono ai rispettivi fornitori. URL ICS privati possono contenere token e devono essere trattati come credenziali.

[RFC 5545 — iCalendar](https://datatracker.ietf.org/doc/html/rfc5545)

## Open-Meteo

Quando il meteo è abilitato, Istante usa Open-Meteo. Le coordinate configurate vengono inviate al servizio per ottenere i dati meteorologici. Istante non aggiunge analytics propri.

[Open-Meteo](https://open-meteo.com/) · [Documentazione](https://open-meteo.com/en/docs) · [Termini](https://open-meteo.com/en/terms)

## Lorem Picsum

Quando lo sfondo `Fotografie casuali` è attivo, le immagini vengono richieste a Lorem Picsum. La disponibilità e le condizioni del servizio sono esterne a Istante.

[Lorem Picsum](https://picsum.photos/)

## Radio

Gli stream audio appartengono alle rispettive emittenti. Istante non registra, salva o ridistribuisce i brani. Alcune informazioni del catalogo possono derivare da servizi pubblici di directory radio; disponibilità e diritti di riproduzione restano responsabilità delle rispettive fonti/utenti.

[Radio Browser](https://www.radio-browser.info/)

## Web Audio

Rumore rosa, rumore marrone, pioggia, vento e le melodie procedurali `Respiro lento`, `Meditazione`, `Notturno` e `Onde lente` vengono generati localmente tramite Web Audio. Non sono file audio di terze parti.

## Festività italiane

Le festività nazionali sono generate localmente. Le regole sono informative e non sostituiscono calendari ufficiali di scuole, aziende o enti locali.

## Privacy tecnica

Preferenze, raccolte, stazioni personali, calendari importati e backup restano nel browser salvo le richieste necessarie alle funzioni online esplicitamente configurate. Istante non integra analytics o tracciamento applicativo proprio.
