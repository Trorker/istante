/* Istante v3.5.0 - application and local preferences. */
(function () {
'use strict';
const C = window.IstanteCore;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const KEY = 'istante.original1.';
// Import only user content once. Old experimental appearance settings stay separate.
try{if(localStorage.getItem(KEY+'migrated')!=='1'){for(const key of ['collection','favorites','photo']){const old=localStorage.getItem('istante.v2.'+key);if(old!==null&&localStorage.getItem(KEY+key)===null)localStorage.setItem(KEY+key,old);}localStorage.setItem(KEY+'migrated','1');}}catch(_){}
const icon = name => window.IstanteIcons.render(name);
$$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
let storageFailed = false;
const store = {
 read(key, fallback) { try { const v = localStorage.getItem(KEY + key); return v === null ? fallback : JSON.parse(v); } catch (_) { return fallback; } },
 write(key, value) { try { localStorage.setItem(KEY + key, JSON.stringify(value)); return true; } catch (_) { storageFailed = true; return false; } },
 remove(key) { try { localStorage.removeItem(KEY + key); } catch (_) {} }
};
let settings = C.cleanSettings(store.read('settings', {}));
let originalPayload = window.ISTANTE_PHRASES, customPayload = store.read('collection', null), phrases;
try { phrases = C.parsePhrases(customPayload || originalPayload); }
catch (_) { customPayload = null; store.remove('collection'); phrases = C.parsePhrases(originalPayload); }
let deck = C.buildDeck(phrases);
const savedFavorites = store.read('favorites', []);
const favorites = new Set(Array.isArray(savedFavorites) ? savedFavorites.filter(x => typeof x === 'string') : []);
let photo = store.read('photo', '');
if (typeof photo !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(photo)) photo = '';
let current = null, slotKey = '', schedule = null, quoteTimer, toastTimer, idleTimer, clockTimer;
let favoriteOnly = false, visibleLimit = 40, searchTimer, previousFocus = null;
let wakeSentinel = null, acquiringWake = false, lastClock = '', lastDate = '', lastGoalMinute = '';
let draftPhoto = photo, lastActivity = 0;
const openingSession = Date.now() + ':' + Math.random().toString(36).slice(2);
const timeFormatter = {format:value=>window.IstanteTime.formatTime(value,settings.timeFormat)};
const dateFormatter = new Intl.DateTimeFormat('it-IT', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
const goalDateFormatter = new Intl.DateTimeFormat('it-IT', { day:'numeric', month:'long', year:'numeric' });
const pad = n => String(n).padStart(2, '0');
const modeNames = { twice:'Mattina & sera', daily:'Una al giorno', opening:'A ogni apertura' };
const FX=window.IstanteEffects.create({getSettings:()=>settings});
const previewFX=window.IstanteEffects.create({getSettings:readDraftSettings,element:$('#preview-fx'),preview:true,statusNode:$('#effects-status')});
const effectHub={sync(context){FX.sync(context);previewFX.sync(context);}};
const stationLibrary=window.IstanteStationLibrary.create(window.IstanteStations||[],toast);window.IstanteRadioLibrary=stationLibrary;
const radio=window.IstanteRadio.create({library:stationLibrary,getSettings:()=>settings,save:(key,value)=>{settings[key]=value;saveNotice(store.write('settings',settings));},icon,notify:toast});
const X=window.IstanteExperience.create({getSettings:()=>settings,getPhoto:()=>photo,store,icon,effects:effectHub,notify:toast,onChange:()=>applyAppearance(new Date())});
const stationManager=window.IstanteStationManager.create({library:stationLibrary,icon,notify:toast});
const scheduleEditor=window.IstanteSchedules.create({icon,onChange:updateSettingsFields});
let appearanceReady=false;
const moments=window.IstanteMoments.create({getSettings:()=>settings,getDraft:readDraftSettings,radio,notify:toast,openTimer:()=>openDialog('timer'),icon});

const scene=window.IstanteScene.create({getSettings:()=>settings,getSun:()=>X.solar(new Date()),store,openWelcome:()=>openDialog('welcome')});
const sharing=window.IstanteShare.create({getSnapshot:()=>({phrase:current?.text||'Un momento, per te.',time:timeFormatter.format(new Date()),theme:document.documentElement.dataset.theme||'dark',date:dateFormatter.format(new Date()),greeting:$('#moment-greeting').textContent,clockStyle:settings.clockStyle,hours:new Date().getHours(),minutes:new Date().getMinutes(),sky:scene.describe(),goal:C.getGoal(new Date(),settings),station:settings.radioEnabled?radio.station().name:''}),open:()=>openDialog('share'),notify:toast});

function toast(message) {
 const el = $('#toast'); ($('dialog[open]:not(.is-leaving)') || document.body).append(el);
 el.textContent = message; window.IstanteMotion.show(el);
 clearTimeout(toastTimer); toastTimer = setTimeout(() => window.IstanteMotion.hide(el), 4100);
}
function saveNotice(ok) { if (!ok) toast('Memoria del browser non disponibile o piena: le modifiche restano solo in questa sessione.'); }
function isPanelOpen() { return !!$('dialog[open]')||$('#radio-mini').classList.contains('is-open'); }
function activity() {
 document.body.classList.remove('is-idle');
 if (Date.now() - lastActivity < 250) return;
 lastActivity = Date.now(); clearTimeout(idleTimer);
 if (settings.hideControls && !isPanelOpen()) idleTimer = setTimeout(() => {
  if (!isPanelOpen() && settings.hideControls) document.body.classList.add('is-idle');
 }, 10000);
}
function randomIndex(length) {
 if (window.crypto && window.crypto.getRandomValues) {
  const a = new Uint32Array(1), limit = Math.floor(4294967296 / length) * length;
  do { window.crypto.getRandomValues(a); } while (a[0] >= limit);
  return a[0] % length;
 }
 return Math.floor(Math.random() * length);
}
function chooseOpening() {
 const last = store.read('lastPhrase', ''), group = typeof last === 'string' ? C.themeKey(last) : '';
 let candidates = deck.items.filter(p => p.group !== group);
 if (!candidates.length) candidates = deck.items.filter(p => p.text !== last);
 if (!candidates.length) candidates = deck.items;
 return candidates[randomIndex(candidates.length)];
}
function updateFavoriteButton() {
 if (!current) return;
 const saved = favorites.has(current.text), el = $('#favorite-current');
 el.setAttribute('aria-pressed', String(saved));
 el.setAttribute('aria-label', saved ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'); el.title = el.getAttribute('aria-label');
}
function renderPhrase(phrase, animate) {
 current = phrase; store.write('lastPhrase', phrase.text); updateFavoriteButton();
 const wrap = $('#quote-wrap'), split = C.splitPhrase(phrase.text); clearTimeout(quoteTimer);
 const apply = () => {
  $('#quote-intro').textContent = split.intro; $('#quote-intro').hidden = !split.intro;
  X.write(split.body); wrap.classList.remove('is-changing');
 };
 if (animate && settings.motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  wrap.classList.add('is-changing'); quoteTimer = setTimeout(apply, 240);
 } else apply();
}
function updatePhraseMeta(manual) {
 $('#thought-label').textContent = schedule.label;
 $('#phrase-meta').textContent = schedule.nextAt ? 'Prossimo pensiero alle ' + timeFormatter.format(schedule.nextAt) : 'Un nuovo pensiero alla prossima apertura';
 $('#manual-label').hidden = !manual;
}
function syncSchedule(now, force) {
 const next = C.getSchedule(now, settings);
 const key = deck.signature + ':' + next.key + (settings.mode === 'opening' ? ':' + openingSession : '');
 if (key === slotKey && !force) return;
 schedule = next; slotKey = key;
 const override = store.read('override', null);
 let phrase = override && override.key === slotKey ? phrases.find(p => p.id === override.id) : null;
 const manual = !!phrase;
 if (!phrase) phrase = settings.mode === 'opening' ? chooseOpening() : C.pickScheduled(deck.items, schedule.ordinal);
 renderPhrase(phrase, !!current); updatePhraseMeta(manual);
}
function chooseManual(phrase) {
 if (!phrase) return;
 syncSchedule(new Date()); saveNotice(store.write('override', { key:slotKey, id:phrase.id }));
 renderPhrase(phrase, true); updatePhraseMeta(true); activity();
}
function nextPhrase() {
 if (!current) return;
 const idx = deck.items.findIndex(p => p.id === current.id);
 let candidate = deck.items[(idx + 1) % deck.items.length];
 for (let i = 1; i < deck.items.length; i++) {
  const p = deck.items[(idx + i) % deck.items.length];
  if (p.group !== current.group) { candidate = p; break; }
 }
 chooseManual(candidate);
}
function applyAppearance(now) {
 const min=now.getHours()*60+now.getMinutes(),sun=X.solar(now);
 const lightTime=sun?sun.isDay:(min>=360&&min<1080),theme=X.theme(now),old=document.documentElement.dataset.theme;
 document.documentElement.dataset.theme=theme;document.documentElement.dataset.timeFormat=settings.timeFormat;
 try{localStorage.setItem('istante.original.theme',theme);}catch(_){}
 if(appearanceReady&&old!==theme&&!document.documentElement.classList.contains('is-loading'))X.transition(theme);
 appearanceReady=true;
 $('meta[name="theme-color"]').content=theme==='light'?'#f1eee7':'#131615';
 document.body.dataset.background=X.photoAvailable()?'photo':['photo','picsum'].includes(settings.background)?'ambient':settings.background;
 document.body.classList.toggle('no-motion',!settings.motion);document.body.classList.toggle('no-clock',!settings.showClock);
 document.body.style.setProperty('--photo-dim',String(settings.photoDim/100));$('#clock-seconds').hidden=!settings.showSeconds;
 $('#mode-label').textContent=settings.mode==='interval'?'Ogni '+settings.interval+' minuti':modeNames[settings.mode];
 X.update(now);
}
function syncGoal(now, force) {
 const stamp = now.getFullYear()+':'+now.getMonth()+':'+now.getDate()+':'+now.getHours()+':'+now.getMinutes();
 if (stamp === lastGoalMinute && !force) return; lastGoalMinute = stamp;
 const goal = C.getGoal(now,settings); $('#goal-strip').hidden = !goal; if (!goal) return;
 $('#goal-title').textContent = goal.title; $('#goal-days').textContent = pad(goal.days); $('#goal-hours').textContent = pad(goal.hours); $('#goal-minutes').textContent = pad(goal.minutes);
 $('#goal-label').textContent = goal.done ? 'Traguardo raggiunto' : goal.waiting ? 'Il percorso deve ancora iniziare' : 'Il prossimo capitolo';
 $('#progress-label').textContent = goal.done ? 'Hai raggiunto la tua data' : goal.waiting ? 'Inizia il '+goalDateFormatter.format(goal.start) : settings.goalMode === 'year' ? 'Il percorso di quest\'anno' : 'Il tuo percorso';
 const value = goal.progress.toLocaleString('it-IT',{minimumFractionDigits:1,maximumFractionDigits:1});
 $('#progress-value').textContent = value+'%'; $('#progress-fill').style.width = goal.progress.toFixed(3)+'%';
 $('#goal-progress').setAttribute('aria-valuenow',goal.progress.toFixed(1)); $('#goal-progress').setAttribute('aria-valuetext',value+' per cento');
 $('#goal-date').textContent = goalDateFormatter.format(goal.end)+' \u00b7 '+timeFormatter.format(goal.end);
}
function tick(force) {
 const now = new Date(), hhmm = pad(now.getHours())+':'+pad(now.getMinutes());
 if (hhmm !== lastClock || force) {
  lastClock = hhmm; const h=now.getHours(); $('#moment-greeting').textContent=h<5||h>=22?'Buonanotte.':h<12?'Buongiorno.':h<18?'Buon pomeriggio.':'Buonasera.'; const displayHour=settings.timeFormat==='12'?(now.getHours()%12||12):now.getHours();$('#clock').innerHTML = pad(displayHour)+'<span class="clock-colon">:</span>'+pad(now.getMinutes());$('#clock-period').hidden=settings.timeFormat!=='12';$('#clock-period').textContent=now.getHours()<12?'AM':'PM';
  $('#clock').setAttribute('datetime',hhmm); $('#clock').setAttribute('aria-label','Sono le '+timeFormatter.format(now)); document.title = timeFormatter.format(now)+' | Istante'; applyAppearance(now);
 }
 $('#clock-seconds').textContent = pad(now.getSeconds());scene.update(now);
 const date = dateFormatter.format(now); if (date !== lastDate) { lastDate = date; $('#date-label').textContent = date; }
 syncSchedule(now,force); syncGoal(now,force);
}
function startClock() { clearTimeout(clockTimer); tick(false); if (!document.hidden) clockTimer = setTimeout(startClock,1000-Date.now()%1000+15); }
function updateLibraryCounts() {
 const count = phrases.filter(p=>favorites.has(p.text)).length;
 $('#collection-count').textContent = phrases.length; $('#all-count').textContent = phrases.length; $('#favorites-count').textContent = count;
 $('#library-subtitle').textContent = phrases.length+' piccoli promemoria. '+(customPayload ? 'La tua raccolta personale.' : 'La tua raccolta originale, sempre con te.');
 $('#restore-phrases').hidden = !customPayload;
}
function toggleFavorite(phrase) {
 if (favorites.has(phrase.text)) favorites.delete(phrase.text); else favorites.add(phrase.text);
 saveNotice(store.write('favorites',[...favorites])); updateFavoriteButton(); updateLibraryCounts();
 if ($('#library-dialog').open) renderLibrary();
}
function actionButton(name,label,callback,pressed) {
 const b = document.createElement('button'); b.type='button'; b.className='icon-button'; b.title=label; b.setAttribute('aria-label',label);
 if (typeof pressed === 'boolean') b.setAttribute('aria-pressed',String(pressed));
 const span=document.createElement('span'); span.className='icon'; span.innerHTML=icon(name); b.append(span); b.addEventListener('click',callback); return b;
}
function renderLibrary(reset) {
 if (reset) visibleLimit=40;
 const query=C.normalized($('#phrase-search').value), selected=phrases.filter(p=>(!favoriteOnly||favorites.has(p.text))&&(!query||p.search.includes(query)));
 const list=$('#phrase-list'), scroller=$('.library-list-wrap'), scrollTop=scroller.scrollTop;
 list.replaceChildren(); const fragment=document.createDocumentFragment();
 selected.slice(0,visibleLimit).forEach(p=>{
  const row=document.createElement('article'); row.className='phrase-row'+(current&&p.id===current.id?' is-current':'');
  const num=document.createElement('span'); num.className='phrase-number'; num.textContent=String(p.sourceIndex+1).padStart(3,'0');
  const text=document.createElement('p'); text.className='phrase-content'; text.textContent=p.text;
  const actions=document.createElement('div'); actions.className='phrase-actions'; const saved=favorites.has(p.text);
  actions.append(actionButton('heart',(saved?'Rimuovi dai preferiti: frase ':'Salva tra le preferite: frase ')+(p.sourceIndex+1),()=>toggleFavorite(p),saved));
  actions.append(actionButton('play','Mostra la frase '+(p.sourceIndex+1),()=>{chooseManual(p);closeDialog($('#library-dialog'));toast('Frase scelta per questo momento. Il cambio automatico resta attivo.');}));
  row.append(num,text,actions);fragment.append(row);
 });
 list.append(fragment); $('#library-empty').hidden=selected.length>0;
 $('#library-empty').textContent=favoriteOnly&&!query?'I pensieri da ritrovare iniziano con un cuore.':'Nessun pensiero trovato. Prova con un\'altra parola.';
 $('#load-more').hidden=selected.length<=visibleLimit; $('#result-count').textContent=selected.length+(selected.length===1?' frase':' frasi');
 $('#filter-all').classList.toggle('active',!favoriteOnly); $('#filter-all').setAttribute('aria-pressed',String(!favoriteOnly));
 $('#filter-favorites').classList.toggle('active',favoriteOnly); $('#filter-favorites').setAttribute('aria-pressed',String(favoriteOnly));
 scroller.scrollTop=reset?0:scrollTop; updateLibraryCounts();
}
function dateInput(date) { return date.getFullYear()+'-'+pad(date.getMonth()+1)+'-'+pad(date.getDate())+'T'+pad(date.getHours())+':'+pad(date.getMinutes()); }
function readDraftSettings(){
 const form=$('#settings-form');if(!$('#settings-dialog').open)return settings;
 const values={...settings,...Object.fromEntries(new FormData(form))};
 for(const key of Object.keys(C.DEFAULTS))if(typeof C.DEFAULTS[key]==='boolean'&&form.elements[key])values[key]=form.elements[key].checked;
 values.radioSchedules=scheduleEditor.value();return C.cleanSettings(values);
}
function sectionSummaries(){
 const f=$('#settings-form').elements,choice=name=>f[name]?.selectedOptions?.[0]?.textContent||'';
 const themes={dark:'Notte',light:'Carta',auto:'Tema del dispositivo',solar:'Segui il sole'};
 const data={appearance:(themes[f.theme.value]||'Tema')+' \u00b7 '+choice('background'),phrases:(modeNames[f.mode.value]||choice('mode'))+(f.typing.checked?' \u00b7 Macchina da scrivere':''),sky:$('#place-name').textContent,effects:f.effectsEnabled.checked?choice('effect')+(f.weatherFX.value!=='off'?' \u00b7 '+choice('weatherFX'):''):'Disattivati',radio:f.radioEnabled.checked?choice('radioStation').replace(/^\d+\s+/,''):'Player nascosto',timer:f.timerEnabled.checked?f.timerMinutes.value+' min \u00b7 Scelte nel timer':'Disattivato',goal:choice('goalMode'),screen:f.hideControls.checked?'Comandi a scomparsa':'Comandi sempre visibili'};
 for(const [key,value]of Object.entries(data)){const el=$('[data-summary="'+key+'"]');if(el)el.textContent=value;}
}
function expandSection(target){
 const section=target?.closest('.settings-section');if(section){$$('.settings-section').forEach(el=>el._setOpen?el._setOpen(el===section):el.open=el===section);section.querySelector('summary').scrollIntoView({block:'nearest'});}
}
function validateSettings(form){
 for(const input of [...form.elements]){
  if(!input.willValidate||input.validity.valid)continue;
  if(input.closest('[hidden]:not(input):not(select)'))continue;
  expandSection(input);const focus=input.hidden?input.nextElementSibling:input;focus?.focus({preventScroll:true});
  $('#settings-error').textContent=input.validationMessage||'Controlla il valore inserito.';$('#settings-error').hidden=false;
  return false;
 }
 return true;
}
function fillSettings() {
 const form=$('#settings-form');
 for (const [key,value] of Object.entries(settings)) {
  const el=form.elements.namedItem(key);if(!el)continue;
  if(el instanceof RadioNodeList)el.value=String(value);else if(el.type==='checkbox')el.checked=value;else if(el.tagName==='SELECT')window.IstanteControls.addValue(el,value);else el.value=String(value);
 }
 if(!form.elements.goalStart.value)form.elements.goalStart.value=dateInput(new Date());
 if(!form.elements.goalEnd.value)form.elements.goalEnd.value=dateInput(new Date(new Date().getFullYear()+1,0,1));
 draftPhoto=photo;$('#photo-input').value='';$('#photo-label').textContent=photo?'Sostituisci la fotografia':'Scegli una fotografia';$('#settings-error').hidden=true;
 $('#wake-support').textContent=('wakeLock' in navigator&&window.isSecureContext)?'La richiesta di schermo acceso dipende dalle autorizzazioni e dal risparmio energetico del dispositivo.':'Schermo sempre acceso non disponibile qui: serve un browser compatibile su HTTPS o localhost.';
 scheduleEditor.begin(settings);stationLibrary.syncSelects();form.elements.radioStation.value=settings.radioStation;X.beginSettings();window.IstanteControls.refresh();updateSettingsFields();
}
function updateSettingsFields() {
 const f=$('#settings-form').elements,mode=f.mode.value,hasStations=stationLibrary.list().length>0;
 if(!hasStations)f.radioScheduleEnabled.checked=false;
 function group(id,enabled){const box=$(id);const wasHidden=box.hidden;box.hidden=!enabled;if(enabled&&wasHidden&&$('#settings-dialog').open)window.IstanteMotion.flash(box);box.querySelectorAll('input,select,button').forEach(el=>el.disabled=!enabled);}
 f.morning.required=false;f.evening.required=false;
 group('#schedule-times',['twice','daily'].includes(mode));group('#evening-field',mode==='twice');$('#interval-field').hidden=mode!=='interval';f.interval.disabled=mode!=='interval';
 group('#goal-fields',f.goalMode.value==='custom');group('#photo-fields',f.background.value==='photo');
 const notes={twice:'La frase non cambia ricaricando la pagina. La sera continua anche dopo mezzanotte, fino al mattino.',daily:'Un pensiero dal cambio mattutino fino alla stessa ora del giorno dopo, anche ricaricando la pagina.',interval:'Il cambio segue intervalli regolari dell\'orologio, non il tempo trascorso dall\'apertura.',opening:'La frase cambia a ogni apertura o ricaricamento della pagina. Non cambia da sola mentre resti qui.'};
 $('#schedule-note').textContent=notes[mode];group('#picsum-fields',f.background.value==='picsum');group('#photo-options',['photo','picsum'].includes(f.background.value));group('#typing-fields',f.typing.checked);group('#effects-fields',f.effectsEnabled.checked);group('#radio-fields',f.radioEnabled.checked);
 group('#radio-schedule-fields',f.radioEnabled.checked&&f.radioScheduleEnabled.checked);f.radioScheduleEnabled.disabled=!f.radioEnabled.checked;
 group('#timer-settings-fields',f.timerEnabled.checked);
 f.showSeconds.disabled=!f.showClock.checked;f.showSeconds.closest('label').classList.toggle('is-dependent-disabled',!f.showClock.checked);
 f.photoMotion.disabled=!['photo','picsum'].includes(f.background.value)||!f.motion.checked;
 f.typing.disabled=!f.motion.checked;f.typing.closest('label').classList.toggle('is-dependent-disabled',!f.motion.checked);
 if(!f.motion.checked)$('#typing-fields').querySelectorAll('input,select,button').forEach(el=>el.disabled=true);
 f.transitionFX.disabled=!f.motion.checked;f.breathe.disabled=!f.motion.checked;
 f.effectSunSync.disabled=!f.effectsEnabled.checked||f.effect.value==='none';
 const meteoOption=[...f.weatherFX.options].find(o=>o.value==='auto');meteoOption.disabled=!X.draftHasPlace();
 if(meteoOption.disabled&&f.weatherFX.value==='auto')f.weatherFX.value='off';
 scheduleEditor.syncEnabled(f.radioEnabled.checked&&f.radioScheduleEnabled.checked);
 f.radioVolume.disabled=!f.radioEnabled.checked||!hasStations;f.radioStation.disabled=!f.radioEnabled.checked||!hasStations;f.radioScheduleEnabled.disabled=!f.radioEnabled.checked||!hasStations;f.clockStyle.disabled=!f.showClock.checked;window.IstanteControls.refresh();sectionSummaries();previewFX.sync();
}
function openDialog(which) {
 const dialog=$('#'+which+'-dialog');if(!dialog)return;previousFocus=document.activeElement;dialog._returnFocus=previousFocus;
 radio.close();X.pause();if(which==='settings')fillSettings();else if(which==='library')renderLibrary(true);else if(which==='stations')stationManager.render();else if(which==='share')sharing.prepare();
 clearTimeout(idleTimer);document.body.classList.remove('is-idle');document.body.classList.add('has-panel');document.body.style.overflow='hidden';window.IstanteMotion.present(dialog);
 if(which==='library')$('#phrase-search').focus({preventScroll:true});else dialog.querySelector('.close-button').focus({preventScroll:true});
}
function closeDialog(dialog) { window.IstanteMotion.dismiss(dialog); }
$$('dialog').forEach(dialog=>{
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(dialog);});
 dialog.addEventListener('close',()=>{if(dialog.id==='settings-dialog'){scene.collapseSettings();}const stillOpen=!!$('dialog[open]');document.body.classList.toggle('has-panel',stillOpen);document.body.style.overflow=stillOpen?'hidden':'';const back=dialog._returnFocus;if(back&&back.isConnected)back.focus({preventScroll:true});lastActivity=0;activity();X.resume();});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(dialog);});
});
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openDialog(b.dataset.open)));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
$('#configure-timer').addEventListener('click',()=>{const d=$('#settings-dialog');d.addEventListener('close',()=>moments.open(),{once:true});closeDialog(d);});
$('#settings-form').addEventListener('change',updateSettingsFields);
$('#settings-form').addEventListener('input',()=>{sectionSummaries();previewFX.sync();});
$$('.settings-section').forEach(section=>{window.IstanteMotion.accordion(section);section.addEventListener('toggle',()=>{previewFX.sync();if(section.open&&$('#settings-dialog').open)setTimeout(()=>{if(section.open)section.querySelector('summary').scrollIntoView({block:'start',behavior:settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});},60);});});
new MutationObserver(()=>{sectionSummaries();if($('#settings-dialog').open)updateSettingsFields();}).observe($('#place-name'),{childList:true,subtree:true,characterData:true});
document.addEventListener('selectstart',event=>event.preventDefault());
document.addEventListener('dragstart',event=>{if(!event.target.closest('input[type=file]'))event.preventDefault();});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='a')event.preventDefault();},{capture:true});
$('#settings-form').addEventListener('submit',event=>{
 event.preventDefault();const f=event.currentTarget,values={...settings,...Object.fromEntries(new FormData(f))};
 values.radioSchedules=scheduleEditor.value();
 for(const key of ['celestialSky','showClock','showSeconds','motion','hideControls','wakeLock','typing','solarTimes','weather','transitionFX','photoMotion','breathe','typingErase','effectsEnabled','effectSunSync','radioEnabled','radioScheduleEnabled','timerEnabled'])values[key]=f.elements[key].checked;
 values.interval=Number(values.interval);values.photoDim=Number(values.photoDim);let error='';if(!validateSettings(f))return;
 if(values.mode==='twice'&&C.minutes(values.morning,-1)>=C.minutes(values.evening,-1))error='L\'inizio della sera deve essere successivo all\'inizio della mattina.';
 if(values.goalMode==='custom'&&(!values.goalStart||!values.goalEnd||new Date(values.goalEnd)<=new Date(values.goalStart)))error='Inserisci una data finale successiva alla data di inizio.';
 if(!error&&values.radioEnabled&&values.radioScheduleEnabled)error=scheduleEditor.validate();
 if(values.background==='photo'&&!draftPhoto)error='Scegli una fotografia oppure un altro tipo di sfondo.';
 if(error){expandSection(values.background==='photo'&&!draftPhoto?f.elements.background:values.goalMode==='custom'?f.elements.goalEnd:values.radioEnabled&&values.radioScheduleEnabled?f.elements.radioScheduleEnabled:f.elements.morning);$('#settings-error').textContent=error;$('#settings-error').hidden=false;return;}
 const scheduleChanged=['mode','morning','evening','interval'].some(k=>settings[k]!==values[k]);
 if(values.theme==='solar'&&!X.draftHasPlace())values.theme='auto';
 settings=C.cleanSettings(values);let ok=store.write('settings',settings);
 if(draftPhoto!==photo){photo=draftPhoto;ok=store.write('photo',photo)&&ok;}
 X.commitSettings();radio.apply();moments.apply();applyAppearance(new Date());lastClock='';tick(true);if(schedule)$('#phrase-meta').textContent=schedule.nextAt?'Prossimo pensiero alle '+timeFormatter.format(schedule.nextAt):'Un nuovo pensiero alla prossima apertura';if(scheduleChanged)syncSchedule(new Date(),true);
 closeDialog($('#settings-dialog'));lastActivity=0;activity();
 toast(ok?'Tutto pronto. Questo momento \u00e8 tuo.':'Preferenze applicate solo per questa sessione: memoria del browser non disponibile.');updateWakeLock();
});
async function updateWakeLock(){
 if(!settings.wakeLock||document.hidden){if(wakeSentinel){const old=wakeSentinel;wakeSentinel=null;try{await old.release();}catch(_){}}return;}
 if(!navigator.wakeLock||!window.isSecureContext||wakeSentinel||acquiringWake)return;acquiringWake=true;
 try{const lock=await navigator.wakeLock.request('screen');if(!settings.wakeLock||document.hidden){await lock.release();return;}wakeSentinel=lock;lock.addEventListener('release',()=>{if(wakeSentinel===lock)wakeSentinel=null;});}catch(_){/* May be rejected by OS/browser energy policy. */}finally{acquiringWake=false;}
}
async function toggleFullscreen(){
 try{const full=document.fullscreenElement||document.webkitFullscreenElement;
 if(full){const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);}
 else{const request=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;if(request)await request.call(document.documentElement);else toast('Lo schermo intero non \u00e8 disponibile in questo browser.');}}
 catch(_){toast('Il browser non ha consentito lo schermo intero.');}
}
function syncFullscreenButton(){const full=!!(document.fullscreenElement||document.webkitFullscreenElement);$('#fullscreen .icon').innerHTML=icon(full?'collapse':'expand');$('#fullscreen').setAttribute('aria-label',full?'Esci da schermo intero':'Schermo intero');$('#fullscreen').title=full?'Esci da schermo intero (F)':'Schermo intero (F)';}
$('#fullscreen').addEventListener('click',toggleFullscreen);document.addEventListener('fullscreenchange',syncFullscreenButton);document.addEventListener('webkitfullscreenchange',syncFullscreenButton);
$('#next-phrase').addEventListener('click',nextPhrase);
$('#favorite-current').addEventListener('click',()=>{if(current){toggleFavorite(current);toast(favorites.has(current.text)?'Un pensiero da ritrovare. Salvato nei preferiti.':'Frase rimossa dai preferiti.');}});
$('#copy-phrase').addEventListener('click',async()=>{
 if(!current)return;
 try{if(!navigator.clipboard||!window.isSecureContext)throw new Error('fallback');await navigator.clipboard.writeText(current.text);toast('Frase copiata.');}
 catch(_){const area=document.createElement('textarea');area.value=current.text;area.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(area);area.select();let success=false;try{success=document.execCommand('copy');}catch(_){}area.remove();$('#copy-phrase').focus();toast(success?'Frase copiata.':'Copia non consentita da questo browser. Puoi esportare la raccolta in JSON.');}
});
$('#filter-all').addEventListener('click',()=>{favoriteOnly=false;renderLibrary(true);});$('#filter-favorites').addEventListener('click',()=>{favoriteOnly=true;renderLibrary(true);});
$('#phrase-search').addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>renderLibrary(true),100);});$('#load-more').addEventListener('click',()=>{visibleLimit+=40;renderLibrary();});
function activateCollection(payload){const parsed=C.parsePhrases(payload);phrases=parsed;deck=C.buildDeck(phrases);slotKey='';syncSchedule(new Date(),true);updateLibraryCounts();renderLibrary(true);}
$('#import-phrases').addEventListener('change',async event=>{
 const file=event.target.files[0];if(!file)return;
 try{if(file.size>2*1024*1024)throw new Error('Il JSON deve essere inferiore a 2 MB.');const payload=JSON.parse(await file.text());C.parsePhrases(payload);
 if(!window.confirm('Sostituire la raccolta su questo browser? Il file originale resta intatto e potrai ripristinarlo.'))return;
 const ok=store.write('collection',payload);customPayload=payload;activateCollection(payload);toast(ok?'Raccolta importata: '+phrases.length+' frasi.':'Raccolta importata solo per questa sessione: memoria del browser non disponibile.');}
 catch(error){toast(error instanceof SyntaxError?'Il file non contiene un JSON valido.':error.message);}finally{event.target.value='';}
});
$('#export-phrases').addEventListener('click',()=>{
 const payload={version:'1.0',language:'it',count:phrases.length,phrases:phrases.map(p=>p.text)},blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='istante-frasi.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
});
$('#restore-phrases').addEventListener('click',()=>{if(!window.confirm('Ripristinare la raccolta originale su questo browser? I preferiti non vengono eliminati.'))return;customPayload=null;store.remove('collection');activateCollection(originalPayload);toast('Raccolta originale ripristinata.');});
$('#photo-input').addEventListener('change',async event=>{
 const file=event.target.files[0];if(!file)return;
 try{if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Scegli una foto JPG, PNG o WebP.');if(file.size>15*1024*1024)throw new Error('La fotografia deve essere inferiore a 15 MB.');
 const objectUrl=URL.createObjectURL(file),image=new Image();
 try{await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Impossibile leggere questa fotografia.'));image.src=objectUrl;});}finally{URL.revokeObjectURL(objectUrl);}
 if(image.width*image.height>80000000)throw new Error('La fotografia ha una risoluzione troppo elevata.');
 const scale=Math.min(1,1920/Math.max(image.width,image.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
 const ctx=canvas.getContext('2d');ctx.fillStyle='#131615';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);draftPhoto=canvas.toDataURL('image/jpeg',.83);
 $('#photo-label').textContent=file.name.length>32?file.name.slice(0,29)+'...':file.name;toast('Foto pronta. Salva le impostazioni per applicarla.');}
 catch(error){toast(error.message);}
});
document.addEventListener('keydown',event=>{
 activity();const target=event.target;
 if(event.ctrlKey||event.metaKey||event.altKey||event.repeat||target.closest('input,textarea,select,[contenteditable=true]')||isPanelOpen())return;
 const key=event.key.toLowerCase();if(['f','n','l','s','t'].includes(key))event.preventDefault();
 if(key==='f')toggleFullscreen();if(key==='n')nextPhrase();if(key==='l')openDialog('library');if(key==='s')openDialog('settings');if(key==='t')moments.open();
});
document.addEventListener('pointermove',activity,{passive:true});document.addEventListener('pointerdown',activity,{passive:true,capture:true});
document.addEventListener('visibilitychange',()=>{clearTimeout(clockTimer);if(!document.hidden){startClock();lastActivity=0;activity();}updateWakeLock();});
window.addEventListener('pageshow',()=>{startClock();});window.addEventListener('pagehide',()=>{clearTimeout(clockTimer);if(wakeSentinel)wakeSentinel.release().catch(()=>{});});
window.addEventListener('storage',event=>{if(event.key===KEY+'favorites'){const next=store.read('favorites',[]);favorites.clear();if(Array.isArray(next))next.filter(v=>typeof v==='string').forEach(v=>favorites.add(v));updateFavoriteButton();updateLibraryCounts();if($('#library-dialog').open)renderLibrary();}});
window.IstanteControls.enhance($('#settings-form'));window.IstanteControls.enhance($('#radio-panel'));window.IstanteControls.enhance($('#timer-session-options'));applyAppearance(new Date());updateLibraryCounts();startClock();activity();updateWakeLock();
// The complete collection is local. No redundant fetch is needed during startup.
if(storageFailed)toast('Il browser non consente il salvataggio locale. La pagina funziona comunque in questa sessione.');
window.IstanteUpdates.create({notify:toast});
document.addEventListener('istante:manage-stations',()=>openDialog('stations'));
document.addEventListener('istante:stations-changed',()=>{if(!stationLibrary.list().length){settings.radioScheduleEnabled=false;if(settings.timerAction==='radio')settings.timerAction='sound';settings.timerDuring='silent';store.write('settings',settings);}moments.apply();if($('#settings-dialog').open)updateSettingsFields();});
Promise.all([X.boot(),new Promise(resolve=>setTimeout(resolve,550))]).catch(()=>{}).finally(()=>{
 clearTimeout(window.ISTANTE_FAILSAFE);tick(false);applyAppearance(new Date());
 requestAnimationFrame(()=>{document.documentElement.classList.remove('is-loading');$('#app-shell').inert=false;$('#boot-screen').classList.add('is-done');X.reveal();setTimeout(()=>{$('#boot-screen')?.remove();scene.ready();},500);});
});
})();
