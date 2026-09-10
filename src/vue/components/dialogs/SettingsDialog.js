/* Istante v4 · Vue component: SettingsDialog */
(function(){
  'use strict';
  const registry = window.IstanteVueComponents = window.IstanteVueComponents || {};
  registry.SettingsDialog = {
    name: 'SettingsDialog',
    template: `<dialog aria-labelledby="settings-title" class="panel" id="settings-dialog">
<div class="panel-head">
<div>
<p class="section-label">
      A modo tuo
     </p>
<h2 id="settings-title">
      Il tuo istante.
     </h2>
</div>
<button aria-label="Chiudi impostazioni" class="icon-button close-button" data-close="" type="button">
<span class="icon" data-icon="close">
</span>
</button>
</div>
<form id="settings-form" novalidate="">
<div class="panel-content">
<details class="settings-section" data-section="appearance" id="section-appearance" name="istante-settings">
<summary>
<span class="icon section-icon" data-icon="contrast">
</span>
<span class="section-heading">
<strong>
         Aspetto e schermo
        </strong>
<small data-summary="appearance">Tema, sfondo, grana e prestazioni</small>
</span>
<span class="icon section-chevron" data-icon="chevron">
</span>
</summary>
<div class="settings-section-body">
<fieldset>
<legend>
         L'atmosfera
        </legend>
<div aria-label="Tema" class="segmented">
<label>
<input name="theme" type="radio" value="dark"/>
<span class="icon" data-icon="moon">
</span>
<span class="theme-option-name">
           Notte
          </span>
</label>
<label>
<input name="theme" type="radio" value="light"/>
<span class="icon" data-icon="sun">
</span>
<span class="theme-option-name">
           Carta
          </span>
</label>
<label>
<input name="theme" type="radio" value="auto"/>
<span class="icon" data-icon="contrast">
</span>
<span class="theme-option-name">
           Auto
          </span>
</label>
<label hidden="" id="solar-theme-choice">
<input name="theme" type="radio" value="solar"/>
<span class="icon" data-icon="sunrise">
</span>
<span class="theme-option-name">
           Segui il sole
          </span>
</label>
</div>
<p class="field-note" style="margin-top:12px">
         Auto segue il dispositivo. Con una località puoi anche usare
         <strong>Segui il sole</strong>.
        </p>
<label class="stacked-label">
         Sfondo
         <select name="background">
<option value="ambient">
           Sfumatura delicata
          </option>
<option value="plain">
           Tinta unita
          </option>
<option value="photo">
           Una mia fotografia
          </option>
<option value="picsum">
           Fotografie automatiche · Picsum
          </option>
</select>
</label>
<div class="photo-fields" hidden="" id="photo-fields">
<label class="file-control">
<span class="icon" data-icon="image">
</span>
<span id="photo-label">
           Scegli una fotografia
          </span>
<input accept="image/jpeg,image/png,image/webp" id="photo-input" type="file"/>
</label>
<p class="field-note">
          La foto resta su questo dispositivo.
         </p>
</div>
<div hidden="" id="picsum-fields">
<label class="stacked-label">
          Una nuova fotografia ogni
          <select data-custom-max="1440" data-custom-min="1" data-custom-unit="minuti" name="picsumMinutes">
<option value="5">
            5 minuti
           </option>
<option value="15">
            15 minuti
           </option>
<option value="30">
            30 minuti
           </option>
<option value="60">
            1 ora
           </option>
<option value="180">
            3 ore
           </option>
<option value="720">
            12 ore
           </option>
<option value="1440">
            Un giorno
           </option>
</select>
</label>
<p class="field-note">
          Foto da Picsum. Senza rete resta l’ultima disponibile.
         </p>
</div>
<div hidden="" id="photo-options">
<label class="stacked-label">
          Oscuramento della fotografia
          <input max="85" min="35" name="photoDim" step="5" type="range"/>
</label>
<label class="toggle-row">
<span>
           Movimento lento della fotografia
          </span>
<input name="photoMotion" role="switch" type="checkbox"/>
</label>
</div>
<fieldset class="binary-setting text-size-setting">
<legend>Dimensione dei testi</legend>
<div aria-label="Dimensione dei testi" class="binary-tabs text-size-tabs" role="radiogroup"><label><input name="fontSize" type="radio" value="small"/><span>Piccolo</span></label><label><input checked="" name="fontSize" type="radio" value="medium"/><span>Normale</span></label><label><input name="fontSize" type="radio" value="large"/><span>Grande</span></label></div>
<p class="field-note" id="font-size-help">Tre misure semplici, come nelle versioni precedenti: piccolo, normale e grande.</p>
</fieldset>
<fieldset class="binary-setting font-style-setting"><legend>Stile del carattere</legend><div aria-label="Stile del carattere" class="binary-tabs" role="radiogroup"><label><input checked="" name="fontStyle" type="radio" value="current"/><span>Classic</span></label><label><input name="fontStyle" type="radio" value="excalifont"/><span>Excalifont</span></label></div><p class="field-note">Classic mantiene il carattere originale di Istante. Excalifont rende più editoriali frasi, titoli e momenti principali.</p></fieldset>
<label class="toggle-row custom-cursor-setting"><span>Cursore personalizzato<small>Puntino e anello discreti. Disattivato di default e disponibile solo con mouse o trackpad.</small></span><input name="customCursor" role="switch" type="checkbox"/></label>
<fieldset class="binary-setting clock-style-setting"><legend>Stile dell’orologio</legend><div aria-label="Stile dell’orologio" class="binary-tabs" role="radiogroup"><label><input checked="" name="clockStyle" type="radio" value="digital"/><span>Digitale</span></label><label><input name="clockStyle" type="radio" value="analog"/><span>Analogico</span></label></div></fieldset>
<fieldset class="binary-setting time-format-setting"><legend>Formato dell'orario</legend><div aria-label="Formato dell’orario" class="binary-tabs" role="radiogroup"><label><input checked="" name="timeFormat" type="radio" value="24"/><span>24 ore <small>18:30</small></span></label><label><input name="timeFormat" type="radio" value="12"/><span>12 ore <small>06:30 PM</small></span></label></div></fieldset>
<label class="toggle-row">
<span>
          Mostra l'orologio
          <small>
           Disattivalo per lasciare spazio alla frase.
          </small>
</span>
<input name="showClock" role="switch" type="checkbox"/>
</label>
<label class="toggle-row">
<span>
          Mostra i secondi
         </span>
<input name="showSeconds" role="switch" type="checkbox"/>
</label>
<label class="toggle-row">
<span>
          Transizioni dell’interfaccia
          <small>
           Per frase, foto e passaggi morbidi. Gli effetti di sfondo si regolano nella loro sezione.
          </small>
</span>
<input name="motion" role="switch" type="checkbox"/>
</label>
</fieldset>
<label class="stacked-label" id="performance-setting">Qualità delle animazioni<select name="performance"><option value="auto">Automatica</option><option value="light">Leggera · tablet meno recenti</option><option value="full">Completa</option></select><small>Regola cielo, particelle e transizioni. Automatica riduce il carico sui dispositivi meno potenti.</small></label><label class="toggle-row"><span>Grana analogica<small>Una trama leggera, come carta. Statica e senza animazione.</small></span><input name="grain" role="switch" type="checkbox"/></label><label class="stacked-label" id="grain-fields">Intensità della grana<input max="35" min="5" name="grainOpacity" step="1" type="range"/></label></div>
</details>
<details class="settings-section" data-section="phrases" id="section-phrases" name="istante-settings">
<summary>
<span class="icon section-icon" data-icon="collection">
</span>
<span class="section-heading">
<strong>
         Frasi e scrittura
        </strong>
<small data-summary="phrases">
         Rotazione, ritmo e macchina da scrivere
        </small>
</span>
<span class="icon section-chevron" data-icon="chevron">
</span>
</summary>
<div class="settings-section-body">
<fieldset>
<legend>
         Il ritmo delle frasi
        </legend>
<p class="field-note">
         Casuali, senza ripetizioni ravvicinate.
        </p>
<div class="mode-grid">
<label class="choice-card">
<input name="mode" type="radio" value="twice"/>
<span class="icon" data-icon="sunrise">
</span>
<strong>
           Mattina &amp; sera
          </strong>
<small>
           Due pensieri al giorno
          </small>
</label>
<label class="choice-card">
<input name="mode" type="radio" value="daily"/>
<span class="icon" data-icon="sun">
</span>
<strong>
           Una al giorno
          </strong>
<small>
           Un pensiero, senza fretta
          </small>
</label>
<label class="choice-card">
<input name="mode" type="radio" value="interval"/>
<span class="icon" data-icon="clock">
</span>
<strong>
           A intervalli
          </strong>
<small>
           Un nuovo pensiero ogni tanto
          </small>
</label>
<label class="choice-card">
<input name="mode" type="radio" value="opening"/>
<span class="icon" data-icon="shuffle">
</span>
<strong>
           A ogni apertura
          </strong>
<small>
           Ogni volta una sorpresa
          </small>
</label>
</div>
<div class="form-row" id="schedule-times">
<label>
          Inizio mattina
          <input name="morning" required="" type="time"/>
</label>
<label id="evening-field">
          Inizio sera
          <input name="evening" required="" type="time"/>
</label>
</div>
<div hidden="" id="interval-field">
<label class="stacked-label">
          Cambia frase ogni
          <select name="interval">
<option value="5">
            5 minuti
           </option>
<option value="15">
            15 minuti
           </option>
<option value="30">
            30 minuti
           </option>
<option value="60">
            60 minuti
           </option>
</select>
</label>
</div>
<p class="field-note schedule-note" id="schedule-note">
         Il pensiero resta stabile nella sua fascia oraria.
        </p>
</fieldset>
<fieldset>
<legend>
         La scrittura
        </legend>
<label class="toggle-row">
<span>
          Macchina da scrivere
          <small>
           Carattere per carattere. La frase resta sempre la stessa.
          </small>
</span>
<input name="typing" role="switch" type="checkbox"/>
</label>
<div id="typing-fields">
<div class="form-row">
<label>
           Pausa tra le ripetizioni
           <select data-custom-max="3600" data-custom-min="10" data-custom-unit="secondi" name="typingRepeat">
<option value="0">
             Solo al cambio frase
            </option>
<option value="20">
             20 secondi
            </option>
<option value="30">
             30 secondi
            </option>
<option value="60">
             1 minuto
            </option>
<option value="120">
             2 minuti
            </option>
<option value="300">
             5 minuti
            </option>
</select>
</label>
<label>
           Velocità
           <select data-custom-max="150" data-custom-min="15" data-custom-unit="millisecondi" name="typingSpeed">
<option value="20">
             Veloce
            </option>
<option value="35">
             Scorrevole
            </option>
<option value="50">
             Naturale
            </option>
<option value="65">
             Lenta
            </option>
</select>
</label>
</div>
<div class="form-row">
<label>
           Ritmo
           <select name="typingRhythm">
<option value="natural">
             Umano · pause variabili
            </option>
<option value="steady">
             Regolare
            </option>
</select>
</label>
<label>
           Piccoli errori
           <select name="typingMistakes">
<option value="off">
             Mai
            </option>
<option value="rare">
             Ogni tanto
            </option>
<option value="often">
             Più frequenti
            </option>
</select>
</label>
</div>
<label class="toggle-row">
<span>
           Cancella prima di riscrivere
           <small>
            Backspace rapido, poi ricomincia con calma.
           </small>
</span>
<input name="typingErase" role="switch" type="checkbox"/>
</label>
<p class="field-note">
          Errori e correzioni sono solo visivi. La frase salvata non cambia.
         </p>
</div>
</fieldset>
</div>
</details>
<details class="settings-section" data-section="sky" id="section-sky" name="istante-settings">
<summary>
<span class="icon section-icon" data-icon="location">
</span>
<span class="section-heading">
<strong>
         Località e cielo
        </strong>
<small data-summary="sky">
         Posizione, alba, tramonto e meteo
        </small>
</span>
<span class="icon section-chevron" data-icon="chevron">
</span>
</summary>
<div class="settings-section-body">
<fieldset>
<legend>
         Il ritmo del cielo
        </legend>
<p class="field-note">
         Meteo, alba e tramonto in una sola riga.
        </p>
<div class="location-current">
<span class="icon" data-icon="sunrise">
</span>
<div>
<strong id="place-name">
           Nessuna località
          </strong>
<small id="place-status">
           Scegli la posizione per attivare alba, tramonto e meteo.
          </small>
</div>
<button class="text-button" hidden="" id="remove-place" type="button">
          Rimuovi
         </button>
</div>
<div class="location-search">
<input aria-label="Cerca una citta" autocomplete="off" id="city-search" placeholder="Cerca città..." type="search"/>
<button class="secondary-button" id="city-find" type="button">
          Cerca
         </button>
</div>
<div aria-live="polite" class="city-results" id="city-results">
</div>
<button class="text-button" id="locate-me" type="button">
<span class="icon" data-icon="location">
</span>
         Usa la mia posizione
        </button>
<details class="coordinates">
<summary>
          Oppure inserisci le coordinate
         </summary>
<div class="form-row">
<label>
           Latitudine
           <input id="place-lat" inputmode="decimal" max="90" min="-90" placeholder="45.46" step="any" type="number"/>
</label>
<label>
           Longitudine
           <input id="place-lon" inputmode="decimal" max="180" min="-180" placeholder="9.19" step="any" type="number"/>
</label>
</div>
<button class="text-button" id="use-coordinates" type="button">
          Usa queste coordinate
         </button>
</details>
<p class="field-note">
         La posizione è facoltativa e resta salvata solo qui.
        </p>
<label class="toggle-row">
<span>
          Mostra alba e tramonto
         </span>
<input name="solarTimes" role="switch" type="checkbox"/>
</label>
<label class="toggle-row">
<span>
          Mostra il meteo
          <small>
           Una piccola icona e la temperatura, senza previsioni ingombranti.
          </small>
</span>
<input name="weather" role="switch" type="checkbox"/>
</label>
<label class="toggle-row">
<span>
          Passaggio tra sole e luna
          <small>
           Una sfumatura di luce al cambio del tema, senza aggiungere un secondo sole o una seconda luna.
          </small>
</span>
<input name="transitionFX" role="switch" type="checkbox"/>
</label>
<button class="text-button" id="preview-transition" type="button">
         Anteprima del passaggio
        </button>
<label class="toggle-row">
<span>
          Respiro dello sfondo
          <small>
           Una variazione di luce molto lenta. Opzionale.
          </small>
</span>
<input name="breathe" role="switch" type="checkbox"/>
</label>
<p class="field-note source-note">
<a href="https://open-meteo.com/" rel="noopener noreferrer" target="_blank">
          Open-Meteo
         </a>
         ·
         <a href="https://www.geonames.org/" rel="noopener noreferrer" target="_blank">
          GeoNames
         </a>
         . Il sole continua a funzionare anche offline.
        </p>
<label class="toggle-row"><span>Il cielo, sempre con te<small>Sole di giorno, luna con la sua fase e stelle di notte. Funziona anche senza rete; senza località il ritmo è indicativo.</small></span><input name="celestialSky" role="switch" type="checkbox"/></label></fieldset>
</div>
</details>
<details class="settings-section" data-section="effects" id="section-effects" name="istante-settings">
<summary>
<span class="icon section-icon" data-icon="effects">
</span>
<span class="section-heading">
<strong>
         Effetti ambientali
        </strong>
<small data-summary="effects">
         Aloni, particelle, aurora e tempo
        </small>
</span>
<span class="icon section-chevron" data-icon="chevron">
</span>
</summary>
<div class="settings-section-body"><p class="field-note">Riduce gli effetti per dispositivi meno potenti.</p>
<fieldset>
<legend>
         Un po' di movimento
        </legend>
<p class="field-note">
         Effetti discreti, lontani dal testo.
        </p>
<label class="toggle-row">
<span>
          Attiva gli effetti di sfondo
          <small>
           Tutto resta facoltativo, anche senza Internet.
          </small>
</span>
<input name="effectsEnabled" role="switch" type="checkbox"/>
</label>
<div hidden="" id="effects-fields">
<label class="stacked-label">
          Animazione
          <select name="effect">
<option value="halos">
            Aloni di luce
           </option>
<option value="particles">
            Particelle sospese
           </option>
<option value="aurora">
            Aurora morbida
           </option>
<option value="none">
            Nessuna · solo effetto meteo
           </option>
</select>
</label>
<label class="toggle-row">
<span>
           Colori in sintonia con il sole
           <small>
            Caldi all'alba e al tramonto, più freddi di notte. Senza posizione seguono il tema.
           </small>
</span>
<input name="effectSunSync" role="switch" type="checkbox"/>
</label>
<div class="form-row">
<label>
           Intensità
           <input max="70" min="10" name="effectIntensity" step="5" type="range"/>
</label>
<label>
           Movimento
           <input max="100" min="20" name="effectSpeed" step="10" type="range"/>
</label>
</div>
<label class="stacked-label">
          Effetto meteo
          <select name="weatherFX">
<option value="off">
            Nessuno
           </option>
<option value="auto">
            Segui il meteo attuale
           </option>
<option value="sun">
            Luce del sole
           </option>
<option value="clouds">
            Nuvole leggere
           </option>
<option value="rain">
            Pioggia sottile
           </option>
<option value="snow">
            Fiocchi di neve
           </option>
<option value="storm">
            Temporale soffuso
           </option>
<option value="fog">
            Nebbia lenta
           </option>
</select>
</label>
<p class="field-note">
          Il meteo automatico usa dati recenti; gli effetti manuali sono decorativi.
         </p>
<div aria-label="Anteprima degli effetti" class="effects-preview" id="effects-preview">
<div aria-hidden="true" class="ambient-fx" id="preview-fx">
<div class="fx-halos">
<i>
</i>
<i>
</i>
<i>
</i>
</div>
<div class="fx-aurora">
</div>
<div class="fx-weather-light">
</div>
<div class="fx-clouds">
</div>
<canvas class="fx-canvas">
</canvas>
</div>
<div class="effects-preview-caption">
<span class="section-label">
            Anteprima in tempo reale
           </span>
<span class="preview-word">
            Un po' di meraviglia.
           </span>
</div>
</div>
<p class="field-note" id="effects-status" role="status">
</p>
</div>
<p class="field-note" id="effects-accessibility">
         Con movimento ridotto, gli effetti restano più statici.
        </p>
</fieldset>
</div>
</details>
<details class="settings-section" data-section="radio" id="section-radio" name="istante-settings">
<summary>
<span class="icon section-icon" data-icon="headphones">
</span>
<span class="section-heading">
<strong>
         Radio e audio
        </strong>
<small data-summary="radio">
         22 stazioni, una colonna sonora
        </small>
</span>
<span class="icon section-chevron" data-icon="chevron">
</span>
</summary>
<div class="settings-section-body">
<fieldset>
<legend>
         La tua colonna sonora
        </legend>
<label class="toggle-row">
<span>Abilita la radio <small>Le tue stazioni nel mini player.</small>
</span>
<input name="radioEnabled" role="switch" type="checkbox"/>
</label>
<div id="radio-fields">
<label class="stacked-label">
          Stazione iniziale
          <select data-search="true" name="radioStation">
<option value="lofigirl">
            01  Lofi Girl (Community Relay)
           </option>
<option value="laut-lofi">
            02  Laut.FM | Lofi 24/7
           </option>
<option value="zeno-study">
            03  Zeno FM | Study Lofi
           </option>
<option value="zeno-chill">
            04  Zeno FM | Chill Beats
           </option>
<option value="zeno-hiphop">
            05  Zeno FM | Lofi Hip Hop
           </option>
<option value="zeno-box">
            06  Zeno FM | Box Lofi
           </option>
<option value="zeno-bootleg">
            07  Zeno FM | The Bootleg Boy
           </option>
<option value="fastcast-lofi">
            08  Fastcast4u | Chill Lofi
           </option>
<option value="chillhop">
            09  FluxFM | Chillhop
           </option>
<option value="chillsynth">
            10  Nightride FM | Chillsynth
           </option>
<option value="secretagent">
            11  SomaFM | Secret Agent
           </option>
<option value="deepspaceone">
            12  SomaFM | Deep Space One (Deep Ambient)
           </option>
<option value="groovesalad">
            13  SomaFM | Groove Salad
           </option>
<option value="dronezone">
            14  SomaFM | Drone Zone
           </option>
<option value="defcon">
            15  SomaFM | DEF CON Radio
           </option>
<option value="spacestation">
            16  SomaFM | Space Station
           </option>
<option value="vaporwaves">
            17  SomaFM | Vaporwaves
           </option>
<option value="synphaera">
            18  SomaFM | Synphaera
           </option>
<option value="intense">
            19  Intense Radio | FLAC / OGG
           </option>
<option value="pinkfloyd">
            20  Exclusively Pink Floyd
           </option>
<option value="pinkfloyd-hits">
            21  Exclusively Pink Floyd | Hits
           </option>
<option value="paradise-mellow">
            22  Radio Paradise | Mellow Mix (FLAC Lossless)
           </option>
</select>
</label>
<button class="text-button manage-stations-button" data-open="stations" type="button">
<span class="icon" data-icon="collection">
</span>
          Gestisci le stazioni
         </button>
<label class="stacked-label">
          Volume
          <input max="100" min="0" name="radioVolume" step="1" type="range"/>
</label>
<label class="toggle-row"><span>Gesture volume nell’angolo destro<small>Swipe verso l’alto per alzare e verso il basso per abbassare, a passi di 10. Il doppio tap alterna Play/Pausa sulla dashboard.</small></span><input name="audioVolumeGesture" role="switch" type="checkbox"/></label>
<p class="field-note">
          Radio attiva con Play, timer o programmazione.
         </p>
<div class="settings-subgroup">
<label class="toggle-row">
<span>
            Programma la radio
            <small>
             La tua colonna sonora, negli orari che scegli.
            </small>
</span>
<input name="radioScheduleEnabled" role="switch" type="checkbox"/>
</label>
<div hidden="" id="radio-schedule-fields">
<div aria-label="Fasce radio" id="schedule-list">
</div>
<button class="secondary-button" id="schedule-add" type="button">
<span class="icon" data-icon="plus">
</span>
            Aggiungi fascia
           </button>
<p class="field-note">
            Fino a 20 fasce, anche oltre mezzanotte.
           </p>
<button class="secondary-button" id="schedule-authorize" type="button">
<span class="icon" data-icon="volume">
</span>
            Abilita audio per questa sessione
           </button>
<p class="field-note" id="schedule-settings-status" role="status">
            Salva le fasce e autorizza l'audio.
           </p>
</div>
</div>
</div>
<div class="settings-subgroup ambient-settings"><label class="toggle-row"><span>Suoni ambientali offline<small>Un'alternativa alla radio, senza streaming.</small></span><input name="ambientEnabled" role="switch" type="checkbox"/></label><div id="ambient-settings-fields"><label class="stacked-label">Suono iniziale<select name="ambientType"><option value="pink">Rumore rosa</option><option value="brown">Rumore marrone</option><option value="rain">Pioggia</option><option value="wind">Vento</option></select></label><label class="stacked-label">Volume ambiente<input max="100" min="0" name="ambientVolume" step="1" type="range"/></label><p class="field-note">Radio e ambiente non suonano insieme.</p></div></div></fieldset>
</div>
</details>
<details class="settings-section" data-section="timer" id="section-timer">
<summary>
<span class="icon section-icon" data-icon="clock">
</span>
<span class="section-heading">
<strong>
         Un tempo per te
        </strong>
<small data-summary="timer">
         Timer e suono finale
        </small>
</span>
<span class="icon section-chevron" data-icon="chevron">
</span>
</summary>
<div class="settings-section-body">
<fieldset>
<legend>
         Una pausa, senza fretta
        </legend>
<label class="toggle-row">
<span>
          Attiva il timer
          <small>
           Disattivandolo annulli anche un timer in corso.
          </small>
</span>
<input name="timerEnabled" role="switch" type="checkbox"/>
</label>
<div id="timer-settings-fields">
<label class="stacked-label">Durata iniziale, in minuti<input inputmode="numeric" max="1440" min="1" name="timerMinutes" step="1" type="number"/></label>
<label class="stacked-label">Durante la pausa<select name="timerDuring"><option value="silent">Nessun avvio automatico</option><option value="radio">Ascolta la radio</option><option value="ambient">Ascolta il suono rilassante</option></select></label>
<label class="stacked-label">Alla fine del timer<select name="timerAction"><option value="sound">Un suono delicato</option><option value="radio">Avvia / continua la radio</option><option value="silent">Solo avviso visivo</option></select></label>
<div id="timer-sound-settings"><label class="stacked-label">Suono finale<select name="timerSound"><option value="chime">Piccoli rintocchi</option><option value="bell">Campana morbida</option><option value="pulse">Segnale delicato</option></select></label>
<label class="stacked-label">Volume del suono <output id="timer-volume-label">65%</output><input max="100" min="0" name="timerVolume" type="range" value="65"/></label>
<button class="text-button" id="timer-sound-preview" type="button"><span class="icon" data-icon="volume"></span>Prova il suono</button></div>
<p class="field-note" id="timer-settings-note">Le modifiche valgono dai prossimi timer.</p>
<button class="secondary-button" id="configure-timer" type="button"><span class="icon" data-icon="clock"></span>Salva e apri il timer</button>
</div>
</fieldset>
</div>
</details><details class="settings-section" data-section="chime" id="section-chime" name="istante-settings"><summary><span class="icon section-icon" data-icon="volume"></span><span class="section-heading"><strong>Rintocco consapevole</strong><small>Una nota, allo scoccare dell'ora</small></span><span class="icon section-chevron" data-icon="chevron"></span></summary><div class="settings-section-body"><label class="toggle-row"><span>Un richiamo al presente<small>Un solo suono ogni ora. Non recupera le ore perse quando riapri la pagina.</small></span><input name="chimeEnabled" role="switch" type="checkbox"/></label><div id="chime-fields"><label class="stacked-label">Timbro<select name="chimeType"><option value="bowl">Campana morbida</option><option value="fork">Diapason</option></select></label><label class="stacked-label">Volume<input max="100" min="0" name="chimeVolume" type="range"/></label><button class="secondary-button" id="chime-test" type="button"><span class="icon" data-icon="volume"></span>Ascolta il rintocco</button><label class="toggle-row"><span>Fascia di silenzio</span><input name="chimeQuiet" role="switch" type="checkbox"/></label><div class="two-fields" id="chime-quiet-fields"><label class="stacked-label">Da<input name="chimeQuietStart" type="time"/></label><label class="stacked-label">A<input name="chimeQuietEnd" type="time"/></label></div><p class="field-note">Segue l’orologio del dispositivo. Con la pagina sospesa il rintocco non è garantito.</p></div></div></details>
<details class="settings-section" data-section="goal" id="section-goal" name="istante-settings">
<summary>
<span class="icon section-icon" data-icon="calendar">
</span>
<span class="section-heading">
<strong>
         Il tuo traguardo
        </strong>
<small data-summary="goal">
         Una data da aspettare
        </small>
</span>
<span class="icon section-chevron" data-icon="chevron">
</span>
</summary>
<div class="settings-section-body">
<fieldset>
<legend>
         Il prossimo traguardo
        </legend>
<label class="stacked-label">
         Conto alla rovescia
         <select name="goalMode">
<option value="year">
           Il nuovo anno
          </option>
<option value="custom">
           Una data importante
          </option>
<option value="off">
           Nascondi
          </option>
</select>
</label>
<div hidden="" id="goal-fields">
<label class="stacked-label">
          Nome del traguardo
          <input maxlength="90" name="goalTitle" placeholder="Il mio prossimo viaggio" type="text"/>
</label>
<label class="stacked-label">
          Inizio del percorso
          <input name="goalStart" type="datetime-local"/>
</label>
<label class="stacked-label">
          Data del traguardo
          <input name="goalEnd" type="datetime-local"/>
</label>
<div aria-label="Impostazione rapida del traguardo" class="goal-quick">
<p class="field-note">Oppure scegli una distanza da oggi.</p>
<div class="goal-quick-row">
<label class="goal-quick-value"><span>Tra</span><input id="goal-offset-value" inputmode="numeric" max="120" min="1" step="1" type="number" value="1"/></label>
<label class="goal-quick-unit"><span>Periodo</span><select id="goal-offset-unit"><option value="months">mesi</option><option value="years">anni</option></select></label>
<button class="secondary-button" id="goal-offset-apply" type="button"><span class="icon" data-icon="arrow"></span>Imposta</button>
</div>
</div>
</div>
<p class="field-note">
         Mostra quanto manca al tuo traguardo.
        </p>
</fieldset>
</div>
</details>
<details class="settings-section" data-section="calendar" id="section-calendar" name="istante-settings"><summary><span class="icon section-icon" data-icon="calendar"></span><span class="section-heading"><strong>Spazio per i tuoi giorni</strong><small data-summary="calendar">Calendari, prossimi impegni e ritorno</small></span><span class="icon section-chevron" data-icon="chevron"></span></summary><div class="settings-section-body"><label class="toggle-row"><span>Abilita il calendario<small>Una vista calendario nello stesso Istante.</small></span><input name="calendarEnabled" role="switch" type="checkbox"/></label><div id="calendar-settings-fields"><label class="toggle-row"><span>Il prossimo impegno sulla dashboard<small>Mostra il prossimo appuntamento nella dashboard.</small></span><input name="calendarUpcoming" role="switch" type="checkbox"/></label><label class="toggle-row"><span>Festività italiane<small>Aggiunge le festività italiane, anche offline.</small></span><input name="calendarHolidays" role="switch" type="checkbox"/></label><label class="toggle-row calendar-excalifont-setting" id="calendar-excalifont-setting"><span>Excalifont nel calendario<small>Usa il tratto scritto a mano solo nel calendario, lasciando Classic nel resto di Istante.</small></span><input name="calendarExcalifont" role="switch" type="checkbox"/></label><label class="stacked-label calendar-default-view-setting">Vista iniziale<select name="calendarViewMode"><option value="last">Riprendi l’ultima vista</option><option value="year">Anno</option><option value="month">Mese</option><option value="week">Settimana</option><option value="day">Giorno</option><option value="agenda">Agenda</option></select></label><label class="stacked-label calendar-return-setting">Ritorna allo screensaver dopo<select data-custom-max="3600" data-custom-min="10" data-custom-unit="secondi" name="calendarReturn"><option value="0">Mai automaticamente</option><option value="30">30 secondi di inattività</option><option value="60">1 minuto di inattività</option><option value="120">2 minuti di inattività</option><option value="300">5 minuti di inattività</option><option value="600">10 minuti di inattività</option></select></label><p class="field-note">Sul calendario lo swipe cambia mese o settimana. Il ritorno alla dashboard con gesto avviene solo dalla fascia bassa dello schermo.</p><label class="toggle-row"><span>Swipe anche con il mouse<small>Trascina orizzontalmente in uno spazio libero della pagina.</small></span><input name="mouseSwipe" role="switch" type="checkbox"/></label><p class="field-note">Fino a 8 calendari ICS, attivi insieme.</p></div></div></details><details class="settings-section" data-section="screen" id="section-screen" name="istante-settings">
<summary>
<span class="icon section-icon" data-icon="expand">
</span>
<span class="section-heading">
<strong>
         Modalità screensaver
        </strong>
<small data-summary="screen">
         Comandi e schermo acceso
        </small>
</span>
<span class="icon section-chevron" data-icon="chevron">
</span>
</summary>
<div class="settings-section-body">
<fieldset>
<legend>
         Modalità screensaver
        </legend>
<label class="toggle-row">
<span>
          Nascondi i comandi
          <small>
           Dopo 10 secondi di inattività. Muovi il mouse o tocca per ritrovarli.
          </small>
</span>
<input name="hideControls" role="switch" type="checkbox"/>
</label>
<label class="toggle-row">
<span>
          Compatta i dati durante l’inattività
          <small>
           Riduce meteo, prossimo capitolo e calendario nella barra sintetica. Disattivala per lasciare sempre la barra completa.
          </small>
</span>
<input name="compactIdleBar" role="switch" type="checkbox"/>
</label>
<label class="toggle-row">
<span>
          Mantieni lo schermo acceso
          <small>
           Quando supportato dal browser. Si disattiva uscendo dalla pagina.
          </small>
</span>
<input name="wakeLock" role="switch" type="checkbox"/>
</label>
<p class="field-note" id="wake-support">
</p>
<div class="settings-subgroup touch-feedback-settings"><label class="toggle-row"><span>Suono dei tocchi<small>Un feedback breve quando usi pulsanti e controlli. Disattivato di default.</small></span><input name="touchSoundEnabled" role="switch" type="checkbox"/></label><div id="touch-sound-fields"><label class="stacked-label">Timbro<select name="touchSoundType"><option value="soft">Morbido</option><option value="paper">Carta</option><option value="glass">Vetro</option><option value="wood">Legno</option></select></label><label class="stacked-label touch-volume-field">Volume del tocco<input max="100" min="0" name="touchSoundVolume" step="1" type="range"/></label><button class="text-button" id="touch-sound-preview" type="button"><span class="icon" data-icon="volume"></span>Prova il tocco</button></div></div>
</fieldset>
</div>
</details>
<details class="settings-section" data-section="backup" id="section-backup"><summary><span class="icon section-icon" data-icon="download"></span><span class="section-heading"><strong>Porta con te il tuo istante</strong><small>Backup e ripristino JSON</small></span><span class="icon section-chevron" data-icon="chevron"></span></summary><div class="settings-section-body"><p class="field-note">Esporta o ripristina il tuo Istante in un file JSON.</p><label class="toggle-row"><span>Includi la località<small>Facoltativo: contiene le coordinate salvate.</small></span><input id="backup-place" role="switch" type="checkbox"/></label><label class="toggle-row"><span>Includi i calendari<small>Facoltativo: possono contenere eventi privati e link di accesso.</small></span><input id="backup-calendars" role="switch" type="checkbox"/></label><div class="backup-actions"><button class="secondary-button" id="backup-export" type="button"><span class="icon" data-icon="download"></span>Esporta JSON</button><button class="secondary-button" id="backup-import" type="button"><span class="icon" data-icon="upload"></span>Ripristina JSON</button></div><input accept=".json,application/json" hidden="" id="backup-file" type="file"/><p class="local-note">Il file non viene caricato su un server. Non include fotografie, cache meteo, file audio o timer in corso. Prima dell'esportazione salva eventuali modifiche aperte.</p></div></details><details class="settings-section" data-section="about" id="section-about" name="istante-settings">
<summary>
<span class="icon section-icon" data-icon="info">
</span>
<span class="section-heading">
<strong>
         Informazioni su Istante
        </strong>
<small data-summary="about">
         Versione 4.1.0
        </small>
</span>
<span class="icon section-chevron" data-icon="chevron">
</span>
</summary>
<div class="settings-section-body">
<div class="about-intro">
<div class="about-wordmark-lockup"><img alt="" aria-hidden="true" class="about-wordmark-logo" src="assets/icons/icon.svg"/><span class="about-wordmark">
         istante.
        </span></div>
<p>
         Prenditi un momento per te.
        </p>
</div>
<p class="about-copy">
        Una dashboard e uno screensaver che ti fanno compagnia dalla mattina alla sera: musica leggera, pensieri da ritrovare e il tempo che ti separa dal tuo prossimo obiettivo. Sullo schermo che preferisci, un piccolo spazio per respirare.
       </p><p class="official-link"><a href="https://istante.ruslan-dzyuba.it/" rel="noopener" target="_blank">istante.ruslan-dzyuba.it</a></p>
<p class="about-author">
        Un progetto di
        <strong>
         Ruslan Dzyuba
        </strong>
        .
       </p>
<nav aria-label="Profili dell'autore" class="about-links">
<a aria-label="GitHub di Ruslan Dzyuba" class="social-icon-link" data-istante-tooltip="GitHub" href="https://github.com/Trorker" rel="noopener noreferrer" target="_blank">
<svg aria-hidden="true" class="brand-icon" focusable="false" viewbox="0 0 16 16">
<use href="assets/icons/social/github.svg#brand">
</use>
</svg>
</a>
<a aria-label="Instagram di Ruslan Dzyuba" class="social-icon-link" data-istante-tooltip="Instagram" href="https://www.instagram.com/trorker/" rel="noopener noreferrer" target="_blank">
<svg aria-hidden="true" class="brand-icon" focusable="false" viewbox="0 0 16 16">
<use href="assets/icons/social/instagram.svg#brand">
</use>
</svg>
</a>
<a aria-label="LinkedIn di Ruslan Dzyuba" class="social-icon-link" data-istante-tooltip="LinkedIn" href="https://www.linkedin.com/in/ruslan-dzyuba/" rel="noopener noreferrer" target="_blank">
<svg aria-hidden="true" class="brand-icon" focusable="false" viewbox="0 0 16 16">
<use href="assets/icons/social/linkedin.svg#brand">
</use>
</svg>
</a>
</nav>
<div class="update-panel">
<div class="update-heading">
<span class="icon" data-icon="download">
</span>
<strong>
          Versione
          <span id="app-version">
           4.1.0
          </span>
</strong>
<span class="small-chip" hidden="" id="update-status-chip">
          Novità
         </span>
</div>
<p class="field-note" id="offline-status" role="status">
         Preparazione della copia offline...
        </p>
<p class="field-note" id="update-status" role="status">
         Verifica degli aggiornamenti...
        </p>
<div class="update-actions">
<button class="secondary-button" id="check-update" type="button">
          Verifica aggiornamenti
         </button>
<button class="primary-button" hidden="" id="apply-update" type="button">
          Aggiorna
         </button>
</div>
<p class="field-note" id="update-note">
         L’aggiornamento ricarica la pagina senza perdere le preferenze.
        </p>
</div>
<div class="about-docs">
<a class="about-doc-link" href="leggi.html?doc=progetto"><span class="icon" data-icon="collection">
</span><span>Leggi il progetto</span></a>
<a class="about-doc-link" href="leggi.html?doc=novita"><span class="icon" data-icon="effects">
</span><span>Tutte le novità</span></a>
<a class="about-doc-link" href="leggi.html?doc=release"><span class="icon" data-icon="download">
</span><span>Questa release</span></a>
<a class="about-doc-link" href="leggi.html?doc=licenza"><span class="icon" data-icon="shield">
</span><span>Licenza</span></a>
<a class="about-doc-link" href="leggi.html?doc=terze-parti"><span class="icon" data-icon="info">
</span><span>Terze parti</span></a>
<a class="about-doc-link" href="leggi.html?doc=visione"><span class="icon" data-icon="effects"></span><span>Visione e design</span></a>
</div>
<p class="local-note" id="persistent-storage-status" role="status">Verifico la protezione dei dati locali...</p><button class="text-button" id="storage-request" type="button">Richiedi memoria persistente</button><button class="text-button" id="welcome-reopen" type="button">Rivedi benvenuto e guida</button><p class="local-note">Sorgente disponibile per uso non commerciale. Istante di Ruslan Dzyuba.</p></div>
</details>
<p class="privacy-note">
<span class="icon" data-icon="shield">
</span>
<span>
       Preferenze, foto e raccolta restano in questo browser. Foto, meteo e radio usano servizi esterni solo quando richiesti. Nessun tracciamento aggiunto da Istante.
      </span>
</p>
<small class="build-note">
      Istante 4.1.0
     </small>
<div class="keyboard-note">
<kbd>
       F
      </kbd>
      Schermo intero
      <kbd>
       N
      </kbd>
      Altra frase
      <kbd>
       L
      </kbd>
      Raccolta
      <kbd>
       S
      </kbd>
      Impostazioni
      <kbd>
       T
      </kbd>
      Timer
     </div>
</div>
<div class="panel-footer">
<p class="form-error" hidden="" id="settings-error" role="alert">
</p>
<button class="text-button" data-close="" type="button">
      Annulla
     </button>
<button class="primary-button" type="submit">
      Salva impostazioni
      <span class="icon" data-icon="arrow">
</span>
</button>
</div>
</form>
</dialog>`
  };
})();
