/* Istante v3.14.2 - application and local preferences. */
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
// 3.6 moves the former per-session preferences into the main configuration once.
let rawSettings=store.read('settings', {});
if(!store.read('timer-options-migrated-360',false)){
 const legacy=store.read('timer-options',null);
 if(legacy&&typeof legacy==='object'&&!Array.isArray(legacy))rawSettings={...rawSettings,...window.IstanteTime.timerOptions(legacy)};
 if(store.write('settings',rawSettings)){store.write('timer-options-migrated-360',true);store.remove('timer-options');}
}
let settings = C.cleanSettings(rawSettings);
let returnToTimer=false;
let originalPayload = window.ISTANTE_PHRASES, customPayload = store.read('collection', null), phrases;
// Upgrade only a byte-equivalent old standard collection, never personal imports.
try { const old = Array.isArray(customPayload) ? customPayload : customPayload?.phrases;
 if(Array.isArray(old) && old.length===700 && C.hash(old.join('\n'))===943093509) { customPayload=null;store.remove('collection'); }
} catch (_) {}
const collections=window.IstanteCollections.create({store,core:C,original:originalPayload,legacy:customPayload,notify:toast,onChange(payload){customPayload=payload;if(payload)store.write('collection',payload);else store.remove('collection');activateCollection(payload||originalPayload);}});
customPayload=collections.payload();
const phraseHistory=window.IstantePhraseHistory.create({store});
try { phrases = C.parsePhrases(customPayload || originalPayload); }
catch (_) { customPayload = null; store.remove('collection'); phrases = C.parsePhrases(originalPayload); }
let deck = C.buildDeck(phrases);
const savedFavorites = store.read('favorites', []);
const favorites = new Set(Array.isArray(savedFavorites) ? savedFavorites.filter(x => typeof x === 'string') : []);
let photo = store.read('photo', '');
if (typeof photo !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(photo)) photo = '';
let current = null, slotKey = '', schedule = null, quoteTimer, toastTimer, idleTimer, preIdleTimer, clockTimer;
let favoriteOnly = false, visibleLimit = 40, searchTimer, previousFocus = null;
let wakeSentinel = null, acquiringWake = false, lastClock = '', lastDate = '', lastGoalMinute = '';
let draftPhoto = photo, lastActivity = 0;
const openingSession = Date.now() + ':' + Math.random().toString(36).slice(2);
const timeFormatter = {format:value=>window.IstanteTime.formatTime(value,settings.timeFormat)};
const dateFormatter = new Intl.DateTimeFormat('it-IT', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
const goalDateFormatter = new Intl.DateTimeFormat('it-IT', { day:'numeric', month:'long', year:'numeric' });
const pad = n => String(n).padStart(2, '0');
const modeNames = { twice:'Mattina & sera', daily:'Una al giorno', opening:'A ogni apertura' };
window.IstantePerformance.apply(settings);
const companion=window.IstanteCompanion.create({getSettings:()=>settings,notify:toast});
const FX=window.IstanteEffects.create({getSettings:()=>settings});
const previewFX=window.IstanteEffects.create({getSettings:readDraftSettings,element:$('#preview-fx'),preview:true,statusNode:$('#effects-status')});
const effectHub={sync(context){FX.sync(context);previewFX.sync(context);}};
const stationLibrary=window.IstanteStationLibrary.create(window.IstanteStations||[],toast);window.IstanteRadioLibrary=stationLibrary;
const radio=window.IstanteRadio.create({library:stationLibrary,getSettings:()=>settings,save:(key,value)=>{settings[key]=value;saveNotice(store.write('settings',settings));},icon,notify:toast});
const ambient=window.IstanteAmbient.create({getSettings:()=>settings,save:(key,value)=>{settings[key]=value;saveNotice(store.write('settings',settings));},radio,notify:toast,icon});
const X=window.IstanteExperience.create({getSettings:()=>settings,getPhoto:()=>photo,store,icon,effects:effectHub,notify:toast,onChange:()=>applyAppearance(new Date())});
const stationManager=window.IstanteStationManager.create({library:stationLibrary,icon,notify:toast});
const scheduleEditor=window.IstanteSchedules.create({icon,onChange:updateSettingsFields});
let appearanceReady=false;
const moments=window.IstanteMoments.create({getSettings:()=>settings,getDraft:readDraftSettings,radio,ambient,notify:toast,openTimer:()=>openDialog('timer'),icon});
const touchFeedback=window.IstanteTouchFeedback.create({getSettings:()=>settings});

const calendar=window.IstanteCalendar.create({getSettings:()=>settings,saveSetting:(key,value)=>{settings=C.cleanSettings({...settings,[key]:value});const ok=store.write('settings',settings);const field=$('#settings-form')?.elements?.namedItem(key);if(field?.type==='checkbox')field.checked=!!settings[key];saveNotice(ok);return true;},notify:toast});
const pages=window.IstantePages.create({getSettings:()=>settings,calendar,onChange:()=>{radio.close();X.pause();effectHub.sync();if(!document.body.classList.contains('view-calendar')&&!document.body.classList.contains('view-timer'))X.resume();}});
const scene=window.IstanteScene.create({getSettings:()=>settings,getSun:()=>X.solar(new Date()),getWeather:now=>X.weather(now),store,openGuide:which=>openDialog(which)});

function shareWeatherSnapshot(now){
 const place=X.place();
 if(!settings.weather||!place)return null;
 const current=X.weather(now);
 if(!current||!Number.isFinite(current.temperature_2m)||!Number.isFinite(current.weather_code))return null;
 const [condition]=window.IstanteSolar.weather(current.weather_code,current.is_day===1);
 const visiblePlace=X.placeLabel?.()||'';
 return{available:true,temperature:Math.round(current.temperature_2m)+'°',condition,place:visiblePlace||undefined};
}
function shareSnapshot(){
 const now=new Date();
 return{
  phrase:current?.text||'Un momento, per te.',
  time:timeFormatter.format(now),
  theme:document.documentElement.dataset.theme||'dark',
  date:dateFormatter.format(now),
  greeting:$('#moment-greeting').textContent,
  clockStyle:settings.clockStyle,
  fontStyle:settings.fontStyle||'current',
  hours:now.getHours(),
  minutes:now.getMinutes(),
  sky:window.IstanteSceneSnapshot.capture(scene.describe(),settings),
  weather:shareWeatherSnapshot(now),
  goal:C.getGoal(now,settings),
  station:(()=>{
   if(settings.audioSource==='radio')return settings.radioEnabled&&radio.getState?.().state==='playing'?radio.station().name:'';
   if(['ambient','melody'].includes(settings.audioSource)){
    const enabled=settings.audioSource==='ambient'?settings.ambientEnabled:settings.melodyEnabled;
    return enabled&&ambient.inspect?.().playing?ambient.label():'';
   }
   return '';
  })()
 };
}
const sharing=window.IstanteShare.create({getSnapshot:shareSnapshot,open:()=>openDialog('share'),notify:toast});

/* Keep the lower information ribbon adaptive without layout ghosts. The three
 * modules own their hidden state; this observer only translates that state into
 * a stable layout descriptor used by the canonical responsive stylesheet. */
const infoStrip=$('#active-info-strip');
function syncInfoStripLayout(){
 if(!infoStrip)return;
 const modules=[['weather',$('#environment-line')],['goal',$('#goal-strip')],['event',$('#upcoming-event')]];
 const visible=modules.filter(([,node])=>node&&!node.hidden);
 infoStrip.dataset.layout=visible.map(([name])=>name).join('-')||'none';
 infoStrip.dataset.visibleCount=String(visible.length);
 modules.forEach(([,node])=>node?.classList.remove('is-ribbon-first','is-ribbon-last','is-ribbon-divider'));
 visible.forEach(([,node],index)=>{
  node.classList.toggle('is-ribbon-first',index===0);
  node.classList.toggle('is-ribbon-last',index===visible.length-1);
  node.classList.toggle('is-ribbon-divider',index<visible.length-1);
 });
}
if(infoStrip){
 const ribbonObserver=new MutationObserver(records=>{
  if(records.some(record=>record.type==='attributes'&&record.attributeName==='hidden'))requestAnimationFrame(syncInfoStripLayout);
 });
 ['environment-line','goal-strip','upcoming-event'].forEach(id=>{const node=$('#'+id);if(node)ribbonObserver.observe(node,{attributes:true,attributeFilter:['hidden']});});
 syncInfoStripLayout();
}

function toast(message) {
 const el=$('#toast'),host=$('#toast-host');
 clearTimeout(toastTimer);
 // Top-layer popover escapes dialog transforms and clipping without stealing focus.
 if(typeof host.showPopover==='function'){
  try { if(host.matches(':popover-open'))host.hidePopover();host.showPopover(); } catch(_){}
 }else{
  host.classList.add('toast-fallback');
  const parent=$('dialog[open]:not(.is-leaving)')||document.body;
  parent.append(host);
 }
el.style.removeProperty('opacity');el.style.removeProperty('transform');el.textContent=message;window.IstanteMotion.show(el);
 toastTimer=setTimeout(()=>window.IstanteMotion.hide(el),4100);
}

function saveNotice(ok) { if (!ok) toast('Memoria del browser non disponibile o piena: le modifiche restano solo in questa sessione.'); }
function isPanelOpen() { return !!$('dialog[open]')||$('#radio-mini').classList.contains('is-open'); }
function activity() {
 document.body.classList.remove('is-idle','is-idle-pre');
 if (Date.now() - lastActivity < 250) return;
 lastActivity = Date.now(); clearTimeout(idleTimer); clearTimeout(preIdleTimer);
 if (settings.hideControls && !isPanelOpen()) {
  preIdleTimer = setTimeout(() => {
   if (!isPanelOpen() && settings.hideControls) document.body.classList.add('is-idle-pre');
  }, 8200);
  idleTimer = setTimeout(() => {
   if (!isPanelOpen() && settings.hideControls) document.body.classList.add('is-idle');
  }, 10000);
 }
}
function randomIndex(length) {
 if (window.crypto && window.crypto.getRandomValues) {
  const a = new Uint32Array(1), limit = Math.floor(4294967296 / length) * length;
  do { window.crypto.getRandomValues(a); } while (a[0] >= limit);
  return a[0] % length;
 }
 return Math.floor(Math.random() * length);
}
function updateFavoriteButton() {
 if (!current) return;
 const saved = favorites.has(current.text), el = $('#favorite-current');
 el.setAttribute('aria-pressed', String(saved));
 el.setAttribute('aria-label', saved ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'); el.dataset.istanteTooltip = el.getAttribute('aria-label');
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
 const selection = phraseHistory.resolve(phrases, slotKey);
 const phrase=selection.phrase;
 // Forced clock / settings refresh must not restart the phrase or consume history.
 if(!current || current.id!==phrase.id) renderPhrase(phrase, !!current);
 updatePhraseMeta(selection.manual);updateLibraryCounts();
}
function chooseManual(phrase) {
 if (!phrase) return;
 syncSchedule(new Date());
 const selection=phraseHistory.select(phrases,slotKey,phrase);
 renderPhrase(selection.phrase,true);updatePhraseMeta(true);updateLibraryCounts();activity();
}
function nextPhrase() {
 if (!current) return;
 syncSchedule(new Date());
 const selection=phraseHistory.next(phrases,slotKey);
 renderPhrase(selection.phrase,true);updatePhraseMeta(true);updateLibraryCounts();activity();
}
async function copyCurrentPhrase(){
 if(!current?.text)return;
 let ok=false;
 try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(current.text);ok=true;}}catch(_){}
 if(!ok){const area=document.createElement('textarea');area.value=current.text;area.setAttribute('readonly','');area.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.append(area);area.select();try{ok=document.execCommand('copy');}catch(_){}area.remove();}
 toast(ok?'Frase copiata.':'Non riesco a copiare automaticamente in questo browser.');
 activity();
}

const coarsePointer=matchMedia('(pointer:coarse)');
function mayFocusText(){return !coarsePointer.matches&&matchMedia('(hover:hover) and (pointer:fine)').matches;}
function updateViewportIndex(){
 const vp=window.visualViewport,w=Math.max(1,Math.round(vp?.width||innerWidth||1)),h=Math.max(1,Math.round(vp?.height||innerHeight||1)),ratio=w/h;
 const root=document.documentElement;root.style.setProperty('--viewport-index',ratio.toFixed(4));root.style.setProperty('--viewport-w',w);root.style.setProperty('--viewport-h',h);
 document.body.dataset.viewportShape=ratio>1.65?'wide':ratio<.78?'tall':'balanced';
}
function applyAppearance(now) {
 window.IstantePerformance.apply(settings);companion.apply();
 const min=now.getHours()*60+now.getMinutes(),sun=X.solar(now);
 const lightTime=sun?sun.isDay:(min>=360&&min<1080),theme=X.theme(now),old=document.documentElement.dataset.theme;
 document.documentElement.dataset.theme=theme;document.documentElement.dataset.timeFormat=settings.timeFormat;document.documentElement.dataset.fontStyle=settings.fontStyle||'current';document.documentElement.dataset.fontScope='all';document.documentElement.dataset.calendarFont=(settings.fontStyle==='excalifont'||settings.calendarExcalifont)?'excalifont':'classic';updateViewportIndex();window.IstanteCursor?.apply(!!settings.customCursor);
 try{localStorage.setItem('istante.original.theme',theme);}catch(_){}
 if(appearanceReady&&old!==theme&&!document.documentElement.classList.contains('is-loading'))X.transition(theme);
 appearanceReady=true;
 $('meta[name="theme-color"]').content=theme==='light'?'#f1eee7':'#131615';
 document.body.dataset.background=X.photoAvailable()?'photo':['photo','picsum'].includes(settings.background)?'ambient':settings.background;
 document.body.classList.toggle('no-motion',!settings.motion);document.body.classList.toggle('no-clock',!settings.showClock);
 document.body.style.setProperty('--photo-dim',String(settings.photoDim/100));$('#clock-seconds').hidden=!settings.showSeconds;
 const modeLabel=$('#mode-label');if(modeLabel)modeLabel.textContent=settings.mode==='interval'?'Ogni '+settings.interval+' minuti':modeNames[settings.mode];
 X.update(now);
}
function syncGoal(now, force) {
 const stamp = now.getFullYear()+':'+now.getMonth()+':'+now.getDate()+':'+now.getHours()+':'+now.getMinutes();
 if (stamp === lastGoalMinute && !force) return; lastGoalMinute = stamp;
 const goal = C.getGoal(now,settings),strip=$('#goal-strip'),progress=strip.querySelector('.goal-progress'),countdown=$('#countdown');strip.hidden=!goal;strip.classList.toggle('is-empty',!goal);
 if(!goal){countdown.hidden=true;progress.hidden=true;return;}
 countdown.hidden=false;progress.hidden=false;
 $('#goal-title').textContent = goal.title; const parts=window.IstanteCompanion.goalParts(now,goal.end);['goal-days','goal-hours','goal-minutes'].forEach((id,i)=>{ $('#'+id).textContent=pad(parts[i].value);$('#goal-unit'+(i+1)).textContent=parts[i].unit;});
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
 if(settings.showSeconds)$('#clock-seconds').textContent = pad(now.getSeconds());scene.update(now);companion.tick(now);
 const date = dateFormatter.format(now); if (date !== lastDate) { lastDate = date; $('#date-label').textContent = date; }
 syncSchedule(now,force); syncGoal(now,force);
}
function startClock() { clearTimeout(clockTimer); tick(false); if (!document.hidden) clockTimer = setTimeout(startClock,1000-Date.now()%1000+15); }
function updateLibraryCounts() {
 const count = phrases.filter(p=>favorites.has(p.text)).length;
 const setText=(id,value)=>{const el=$('#'+id);if(el)el.textContent=String(value);};
 setText('collection-count',phrases.length);
 setText('all-count',phrases.length);
 setText('favorites-count',count);
 const progress=phraseHistory.stats(phrases);
 setText('library-subtitle',phrases.length.toLocaleString('it-IT')+' pensieri. '+(customPayload?'La tua raccolta. ':'')+'Casuale senza ripetizioni: '+progress.seen+' / '+progress.total+' in questo ciclo.');
 const restore=$('#restore-phrases');if(restore)restore.hidden=!customPayload;
}
function toggleFavorite(phrase) {
 if (favorites.has(phrase.text)) favorites.delete(phrase.text); else favorites.add(phrase.text);
 saveNotice(store.write('favorites',[...favorites])); updateFavoriteButton(); updateLibraryCounts();
 if ($('#library-dialog').open) renderLibrary();
}
function actionButton(name,label,callback,pressed) {
 const b = document.createElement('button'); b.type='button'; b.className='icon-button'; b.dataset.istanteTooltip=label; b.setAttribute('aria-label',label);
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
 $('#load-more').hidden=selected.length<=visibleLimit; const resultCount=$('#result-count');if(resultCount)resultCount.textContent=selected.length+(selected.length===1?' frase':' frasi');
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
const FONT_SIZE_LEVELS=['small','medium','large'];
function syncFontSizeRange(value){
 const target=document.querySelector('input[name="fontSize"][value="'+(FONT_SIZE_LEVELS.includes(value)?value:'medium')+'"]');
 if(target)target.checked=true;
}
function syncFontSizeFromRange(){sectionSummaries();}
function sectionSummaries(){
 const f=$('#settings-form').elements,choice=name=>{const field=f[name];if(!field)return'';if(field instanceof RadioNodeList){const checked=[...document.querySelectorAll('[name="'+name+'"]')].find(x=>x.checked);return checked?.closest('label')?.querySelector('span')?.textContent?.trim()||checked?.value||'';}return field.selectedOptions?.[0]?.textContent?.trim()||field.value||'';};
 const themes={dark:'Notte',light:'Carta',auto:'Tema del dispositivo',solar:'Segui il sole'};
 const fontNames={small:'Piccolo',medium:'Normale',large:'Grande'},fontStyles={current:'Classic',excalifont:'Excalifont'};const data={appearance:(themes[f.theme.value]||'Tema')+' \u00b7 '+choice('background')+' \u00b7 '+(fontNames[f.fontSize.value]||'Medio')+' \u00b7 '+(fontStyles[f.fontStyle.value]||'Attuale'),phrases:(modeNames[f.mode.value]||choice('mode'))+(f.typing.checked?' \u00b7 Macchina da scrivere':''),sky:$('#place-name').textContent,effects:f.effectsEnabled.checked?choice('effect')+(f.weatherFX.value!=='off'?' \u00b7 '+choice('weatherFX'):''):'Disattivati',radio:[f.radioEnabled.checked?'Radio':'',f.ambientEnabled.checked?'Ambiente offline':'',f.melodyEnabled.checked?'Melodie offline':''].filter(Boolean).join(' \u00b7 ')||'Player nascosto',timer:f.timerEnabled.checked?f.timerMinutes.value+' min \u00b7 '+choice('timerAction'):'Disattivato',goal:choice('goalMode'),calendar:f.calendarEnabled.checked?(f.calendarUpcoming.checked?'Calendario e prossimo impegno':'Calendario attivo'):'Disattivato',screen:f.hideControls.checked?'Comandi a scomparsa':'Comandi sempre visibili'};
 for(const [key,value]of Object.entries(data)){const el=$('[data-summary="'+key+'"]');if(el)el.textContent=value;}
}
function expandSection(target){
 const section=target?.closest('.settings-section');if(section){$$('.settings-section').forEach(el=>el._setOpen?el._setOpen(el===section):el.open=el===section);section.querySelector('summary').scrollIntoView({block:'nearest'});}
}
function validateSettings(form){
 for(const input of [...form.elements]){
  if(!input.willValidate||input.validity.valid)continue;
  if(input.closest('[hidden]:not(input):not(select)'))continue;
  expandSection(input);const focus=input.hidden?input.nextElementSibling:input;if(focus){focus.scrollIntoView?.({block:'nearest'});const textLike=focus.matches?.('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=button]),textarea');if(!textLike||mayFocusText())focus.focus?.({preventScroll:true});}
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
 scheduleEditor.begin(settings);stationLibrary.syncSelects();form.elements.radioStation.value=settings.radioStation;syncFontSizeRange(settings.fontSize);X.beginSettings();window.IstanteControls.refresh();updateSettingsFields();
}
function updateSettingsFields() {
 const f=$('#settings-form').elements,mode=f.mode.value,hasStations=stationLibrary.list().length>0;
 if(!hasStations)f.radioScheduleEnabled.checked=false;
 function group(id,enabled){const box=$(id);const wasHidden=box.hidden;box.hidden=!enabled;if(enabled&&wasHidden&&$('#settings-dialog').open)window.IstanteMotion.flash(box);box.querySelectorAll('input,select,button').forEach(el=>el.disabled=!enabled);}
 group('#calendar-settings-fields',f.calendarEnabled.checked);group('#touch-sound-fields',f.touchSoundEnabled.checked);group('#grain-fields',f.grain.checked);group('#chime-fields',f.chimeEnabled.checked);group('#chime-quiet-fields',f.chimeEnabled.checked&&f.chimeQuiet.checked);
 f.morning.required=false;f.evening.required=false;
 group('#schedule-times',['twice','daily'].includes(mode));group('#evening-field',mode==='twice');$('#interval-field').hidden=mode!=='interval';f.interval.disabled=mode!=='interval';
 group('#goal-fields',f.goalMode.value==='custom');group('#photo-fields',f.background.value==='photo');
 const notes={twice:'La frase non cambia ricaricando la pagina. La sera continua anche dopo mezzanotte, fino al mattino.',daily:'Un pensiero dal cambio mattutino fino alla stessa ora del giorno dopo, anche ricaricando la pagina.',interval:'Il cambio segue intervalli regolari dell\'orologio, non il tempo trascorso dall\'apertura.',opening:'La frase cambia a ogni apertura o ricaricamento della pagina. Non cambia da sola mentre resti qui.'};
 $('#schedule-note').textContent=notes[mode];group('#picsum-fields',f.background.value==='picsum');group('#photo-options',['photo','picsum'].includes(f.background.value));group('#typing-fields',f.typing.checked);group('#effects-fields',f.effectsEnabled.checked);group('#radio-fields',f.radioEnabled.checked);
 group('#ambient-settings-fields',f.ambientEnabled.checked);group('#melody-settings-fields',f.melodyEnabled.checked);
 group('#radio-schedule-fields',f.radioEnabled.checked&&f.radioScheduleEnabled.checked);f.radioScheduleEnabled.disabled=!f.radioEnabled.checked;
 group('#timer-settings-fields',f.timerEnabled.checked);
 const calendarFont=$('#calendar-excalifont-setting');if(calendarFont){const visible=f.fontStyle.value!=='excalifont';calendarFont.hidden=!visible;calendarFont.querySelectorAll('input').forEach(el=>el.disabled=!visible);}
 const timerRadioAvailable=f.radioEnabled.checked&&hasStations;
 for(const field of [f.timerDuring,f.timerAction]){
  for(const option of field.options)if(option.value==='radio')option.disabled=!timerRadioAvailable;
  if(!timerRadioAvailable&&field.value==='radio')field.value=field===f.timerDuring?'silent':'sound';
 }
 for(const option of f.timerDuring.options)if(option.value==='ambient')option.disabled=!f.ambientEnabled.checked;if(!f.ambientEnabled.checked&&f.timerDuring.value==='ambient')f.timerDuring.value='silent';
 group('#timer-sound-settings',f.timerEnabled.checked&&f.timerAction.value==='sound');
 $('#timer-volume-label').textContent=f.timerVolume.value+'%';
 f.showSeconds.disabled=!f.showClock.checked;f.showSeconds.closest('label').classList.toggle('is-dependent-disabled',!f.showClock.checked);
 f.photoMotion.disabled=!['photo','picsum'].includes(f.background.value)||!f.motion.checked;
 f.typing.disabled=!f.motion.checked;f.typing.closest('label').classList.toggle('is-dependent-disabled',!f.motion.checked);
 if(!f.motion.checked)$('#typing-fields').querySelectorAll('input,select,button').forEach(el=>el.disabled=true);
 f.transitionFX.disabled=!f.motion.checked;f.breathe.disabled=!f.motion.checked;
 f.effectSunSync.disabled=!f.effectsEnabled.checked||f.effect.value==='none';
 const meteoOption=[...f.weatherFX.options].find(o=>o.value==='auto');meteoOption.disabled=!X.draftHasPlace();
 if(meteoOption.disabled&&f.weatherFX.value==='auto')f.weatherFX.value='off';
 scheduleEditor.syncEnabled(f.radioEnabled.checked&&f.radioScheduleEnabled.checked);
 f.radioVolume.disabled=!f.radioEnabled.checked||!hasStations;f.radioStation.disabled=!f.radioEnabled.checked||!hasStations;f.radioScheduleEnabled.disabled=!f.radioEnabled.checked||!hasStations;document.querySelectorAll('[name=clockStyle]').forEach(el=>el.disabled=!f.showClock.checked);window.IstanteControls.refresh();sectionSummaries();previewFX.sync();
}
function setLibraryView(mode='phrases') {
 const dialog=$('#library-dialog');if(!dialog)return;const collectionsMode=mode==='collections';
 dialog.dataset.libraryView=collectionsMode?'collections':'phrases';
 $('#collection-library-inline').hidden=!collectionsMode;
 $('#collection-library-toggle').setAttribute('aria-expanded',String(collectionsMode));
 $('#collection-library-toggle').setAttribute('aria-pressed',String(collectionsMode));
 const toggleText=$('#collection-library-toggle span:last-child');if(toggleText)toggleText.textContent='Vedi raccolte';
 $('#library-phrases-tab')?.setAttribute('aria-pressed',String(!collectionsMode));
 if(collectionsMode){collections.render();if(mayFocusText())requestAnimationFrame(()=>$('#collection-search')?.focus({preventScroll:true}));}
 else{renderLibrary(true);if(mayFocusText())requestAnimationFrame(()=>$('#phrase-search')?.focus({preventScroll:true}));}
}
function populateWeatherDialog(){
 const weather=$('#weather-line'),solar=$('#solar-line'),hasWeather=weather&&!weather.hidden,hasSolar=solar&&!solar.hidden;
 const modalIcon=$('#weather-modal-icon');
 modalIcon.innerHTML=hasWeather?($('#weather-icon').innerHTML||icon('cloud')):icon(hasSolar?'sun':'cloud');
 modalIcon.dataset.weather=hasWeather?($('#weather-icon').dataset.weather||''):'';
 $('#weather-modal-temp').textContent=hasWeather?($('#weather-text').textContent||'—'):'—';
 $('#weather-modal-condition').textContent=hasWeather?($('#weather-condition').textContent||'Meteo'):(settings.weather?'Meteo non disponibile':'Meteo disattivato');
 $('#weather-modal-place').textContent=hasWeather?($('#weather-place').textContent||$('#place-name')?.textContent||'La tua località'):($('#place-name')?.textContent||'Nessuna località');
 $('#weather-modal-sunrise').textContent=hasSolar?($('#sunrise-time').textContent||'—'):'—';
 $('#weather-modal-sunset').textContent=hasSolar?($('#sunset-time').textContent||'—'):'—';
 const moonName=$('.moon-phase-name')?.textContent||'',moonPct=$('.moon-phase-percent')?.textContent||'';
 $('#weather-modal-moon').textContent=[moonName,moonPct].filter(Boolean).join(' · ')||'—';
 const empty=$('#weather-modal-empty');empty.hidden=hasWeather||hasSolar;
 empty.textContent=settings.weather||settings.solarTimes?'Aggiungi una località nelle impostazioni per mostrare qui meteo, alba e tramonto.':'Meteo e alba/tramonto sono disattivati. Puoi riattivarli quando vuoi.';
 $('#weather-modal-status').textContent=hasWeather?($('#weather-line').title||'Dati meteo aggiornati quando servono.'):(hasSolar?'Alba e tramonto calcolati per la località scelta.':'Una vista essenziale del cielo del tuo Istante.');
}
function populateGoalDialog(){
 const goal=C.getGoal(new Date(),settings);if(!goal)return false;
 const now=new Date(),parts=window.IstanteCompanion.goalParts(now,goal.end),value=goal.progress.toLocaleString('it-IT',{minimumFractionDigits:1,maximumFractionDigits:1});
 $('#goal-dialog-label').textContent=goal.done?'Traguardo raggiunto':goal.waiting?'Inizia presto':'Il prossimo capitolo';
 $('#goal-dialog-title').textContent=goal.title;$('#goal-dialog-progress-value').textContent=value+'%';
 const fill=$('#goal-dialog-progress-fill'),track=$('#goal-dialog-progress');fill.style.width=goal.progress.toFixed(3)+'%';track.setAttribute('aria-valuenow',goal.progress.toFixed(1));track.setAttribute('aria-valuetext',value+' per cento');
 ['goal-dialog-days','goal-dialog-hours','goal-dialog-minutes'].forEach((id,i)=>{$('#'+id).textContent=pad(parts[i].value);});
 $('#goal-dialog-date').textContent=goalDateFormatter.format(goal.end)+' · '+timeFormatter.format(goal.end);return true;
}
function openDialog(which) {
 const collectionsMode=which==='collections';if(collectionsMode)which='library';
 const dialog=$('#'+which+'-dialog');if(!dialog)return;previousFocus=document.activeElement;dialog._returnFocus=previousFocus;
 if(which==='share'){const details=$('#share-options-details');if(details)details.open=false;sharing.prepare();}else if(which==='weather')populateWeatherDialog();else if(which==='goal'&&!populateGoalDialog())return;radio.close();X.pause();if(which==='settings')fillSettings();else if(which==='library'){collections.render();renderLibrary(true);setLibraryView(collectionsMode?'collections':'phrases');}else if(which==='stations')stationManager.render();
 clearTimeout(idleTimer);document.body.classList.remove('is-idle');document.body.classList.add('has-panel');document.body.style.overflow='hidden';window.IstanteMotion.present(dialog);
 dialog.querySelector('.close-button').focus({preventScroll:true});
}
function closeDialog(dialog) { window.IstanteMotion.dismiss(dialog); }
$$('dialog').forEach(dialog=>{
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(dialog);});
 dialog.addEventListener('close',()=>{if(dialog.id==='settings-dialog'){scene.collapseSettings();if(returnToTimer){returnToTimer=false;requestAnimationFrame(()=>moments.open());}}const stillOpen=!!$('dialog[open]');document.body.classList.toggle('has-panel',stillOpen);document.body.style.overflow=stillOpen?'hidden':'';const back=dialog._returnFocus;if(back&&back.isConnected){const textLike=back.matches?.('input:not([type=button]):not([type=checkbox]):not([type=radio]):not([type=range]),textarea');if(!textLike||mayFocusText())back.focus({preventScroll:true});}lastActivity=0;activity();X.resume();});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(dialog);});
});
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openDialog(b.dataset.open)));
function openWeatherFromSummary(event){if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;if(event.type==='keydown')event.preventDefault();openDialog('weather');}
{const el=$('#environment-line');if(el){el.addEventListener('click',openWeatherFromSummary);el.addEventListener('keydown',openWeatherFromSummary);}}
function openGoalFromSummary(event){if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;if(event.type==='keydown')event.preventDefault();if(!C.getGoal(new Date(),settings))return;openDialog('goal');}
{const el=$('#goal-strip');if(el){el.addEventListener('click',openGoalFromSummary);el.addEventListener('keydown',openGoalFromSummary);}}
$('#goal-dialog-edit')?.addEventListener('click',()=>{const d=$('#goal-dialog');d.addEventListener('close',()=>requestAnimationFrame(openGoalSettings),{once:true});closeDialog(d);});
$('#weather-configure')?.addEventListener('click',()=>{const d=$('#weather-dialog');d.addEventListener('close',()=>requestAnimationFrame(()=>{openDialog('settings');requestAnimationFrame(()=>{const summary=$('#section-sky summary');expandSection(summary);summary?.scrollIntoView({block:'start',behavior:settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto'});});}),{once:true});closeDialog(d);});
$('#quote-wrap')?.addEventListener('dblclick',event=>{event.preventDefault();void copyCurrentPhrase();});
if($('#quote-wrap')) $('#quote-wrap').dataset.istanteTooltip='Doppio clic per copiare la frase';
$('#collection-library-toggle')?.addEventListener('click',()=>setLibraryView('collections'));
$('#library-phrases-tab')?.addEventListener('click',()=>setLibraryView('phrases'));
$('#collection-library-back')?.addEventListener('click',()=>setLibraryView('phrases'));
$('#collection-library-done')?.addEventListener('click',()=>setLibraryView('phrases'));
document.addEventListener('istante:collection-selected',()=>{if($('#library-dialog')?.open)setLibraryView('phrases');});
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
$('#configure-timer').addEventListener('click',()=>{returnToTimer=true;$('#settings-form').requestSubmit();});
$('#timer-options-open')?.addEventListener('click',()=>{
 const dialog=$('#timer-dialog');dialog.addEventListener('close',()=>{
  returnToTimer=true;openDialog('settings');expandSection($('#section-timer summary'));
 },{once:true});closeDialog(dialog);
});
document.querySelectorAll('input[name="fontSize"]').forEach(el=>el.addEventListener('change',syncFontSizeFromRange));
$('#settings-form').addEventListener('change',updateSettingsFields);
$('#settings-form').addEventListener('input',()=>{$('#timer-volume-label').textContent=$('#settings-form').elements.timerVolume.value+'%';sectionSummaries();previewFX.sync();});
$$('.settings-section').forEach(section=>{window.IstanteMotion.accordion(section);section.addEventListener('toggle',()=>{previewFX.sync();if(section.open&&$('#settings-dialog').open)setTimeout(()=>{if(section.open)section.querySelector('summary').scrollIntoView({block:'start',behavior:settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});},60);});});
new MutationObserver(()=>{sectionSummaries();if($('#settings-dialog').open)updateSettingsFields();}).observe($('#place-name'),{childList:true,subtree:true,characterData:true});
document.addEventListener('selectstart',event=>event.preventDefault());
document.addEventListener('dragstart',event=>{if(!event.target.closest('input[type=file]'))event.preventDefault();});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='a')event.preventDefault();},{capture:true});
$('#touch-sound-preview')?.addEventListener('click',()=>touchFeedback.preview(readDraftSettings().touchSoundType,readDraftSettings().touchSoundVolume));
$('#settings-form').addEventListener('submit',event=>{
 event.preventDefault();const f=event.currentTarget,values={...settings,...Object.fromEntries(new FormData(f))};
 values.radioSchedules=scheduleEditor.value();
 for(const key of ['calendarEnabled','calendarUpcoming','calendarHolidays','calendarExcalifont','mouseSwipe','audioVolumeGesture','customCursor','grain','chimeEnabled','chimeQuiet','ambientEnabled','melodyEnabled','celestialSky','showClock','showSeconds','motion','hideControls','wakeLock','touchSoundEnabled','typing','solarTimes','weather','transitionFX','photoMotion','breathe','typingErase','effectsEnabled','effectSunSync','radioEnabled','radioScheduleEnabled','timerEnabled'])values[key]=f.elements[key].checked;
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
 X.commitSettings();radio.apply();ambient.apply();moments.apply();pages.apply();touchFeedback.apply();applyAppearance(new Date());lastClock='';tick(true);if(schedule)$('#phrase-meta').textContent=schedule.nextAt?'Prossimo pensiero alle '+timeFormatter.format(schedule.nextAt):'Un nuovo pensiero alla prossima apertura';if(scheduleChanged)syncSchedule(new Date(),true);
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
function syncFullscreenButton(){const full=!!(document.fullscreenElement||document.webkitFullscreenElement);$('#fullscreen .icon').innerHTML=icon(full?'collapse':'expand');$('#fullscreen').setAttribute('aria-label',full?'Esci da schermo intero':'Schermo intero');$('#fullscreen').dataset.istanteTooltip=full?'Esci da schermo intero (F)':'Schermo intero (F)';}
$('#fullscreen').addEventListener('click',toggleFullscreen);document.addEventListener('fullscreenchange',syncFullscreenButton);document.addEventListener('webkitfullscreenchange',syncFullscreenButton);
$('#next-phrase').addEventListener('click',nextPhrase);
$('#favorite-current').addEventListener('click',()=>{if(current){toggleFavorite(current);toast(favorites.has(current.text)?'Un pensiero da ritrovare. Salvato nei preferiti.':'Frase rimossa dai preferiti.');}});
$('#filter-all').addEventListener('click',()=>{favoriteOnly=false;renderLibrary(true);});$('#filter-favorites').addEventListener('click',()=>{favoriteOnly=true;renderLibrary(true);});
$('#phrase-search').addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>renderLibrary(true),100);});$('#load-more').addEventListener('click',()=>{visibleLimit+=40;renderLibrary();});


let editingCollectionId='',collectionCreateCommitted=false;
function renderCollectionEditor(){
 const item=collections.get(editingCollectionId),list=$('#collection-edit-list'),empty=$('#collection-edit-empty'),count=$('#collection-edit-count');if(!item||!list)return;
 $('#collection-edit-title').textContent=item.title;$('#collection-edit-meta').textContent=(item.category||'Personale')+' · '+item.phrases.length+' '+(item.phrases.length===1?'frase':'frasi');
 const form=$('#collection-edit-meta-form');form.elements.title.value=item.title;form.elements.category.value=item.category||'';form.elements.description.value=item.description||'';
 list.replaceChildren();item.phrases.forEach((phrase,index)=>{const li=document.createElement('li');li.className='collection-edit-item';const n=document.createElement('span');n.textContent=String(index+1).padStart(2,'0');const p=document.createElement('p');p.textContent=phrase;const b=document.createElement('button');b.type='button';b.className='icon-button';b.setAttribute('aria-label','Rimuovi frase '+(index+1));b.innerHTML='<span class="icon">'+icon('trash')+'</span>';b.addEventListener('click',()=>{try{collections.removePhrase(editingCollectionId,index);renderCollectionEditor();}catch(e){toast(e.message);}});li.append(n,p,b);list.append(li);});
 count.textContent=item.phrases.length+' '+(item.phrases.length===1?'frase':'frasi');empty.hidden=item.phrases.length>0;
}
function reopenCollections(){requestAnimationFrame(()=>{openDialog('collections');});}
function openCollectionEditor(id,returnAfter=true){editingCollectionId=id;if(!collections.get(id))return;const show=()=>{renderCollectionEditor();openDialog('collection-edit');if(returnAfter)$('#collection-edit-dialog').addEventListener('close',reopenCollections,{once:true});};const library=$('#library-dialog');if(library?.open){library.addEventListener('close',show,{once:true});closeDialog(library);}else show();}
$('#collection-create-open')?.addEventListener('click',()=>{const library=$('#library-dialog');const show=()=>{collectionCreateCommitted=false;const form=$('#collection-create-form');form.reset();$('#collection-create-error').hidden=true;openDialog('collection-create');$('#collection-create-dialog').addEventListener('close',()=>{if(!collectionCreateCommitted)reopenCollections();},{once:true});};if(library?.open){library.addEventListener('close',show,{once:true});closeDialog(library);}else show();});
$('#collection-create-form')?.addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,data=Object.fromEntries(new FormData(form));try{const id=collections.createEmpty(data);collectionCreateCommitted=true;const dialog=$('#collection-create-dialog');dialog.addEventListener('close',()=>requestAnimationFrame(()=>openCollectionEditor(id,true)),{once:true});closeDialog(dialog);}catch(error){const box=$('#collection-create-error');box.textContent=error.message;box.hidden=false;}});
document.addEventListener('istante:collection-edit',event=>openCollectionEditor(event.detail?.id,true));
$('#collection-edit-add')?.addEventListener('click',()=>{const input=$('#collection-edit-phrase');try{collections.appendPhrase(editingCollectionId,input.value);input.value='';renderCollectionEditor();if(mayFocusText())input.focus({preventScroll:true});}catch(error){toast(error.message);}});
$('#collection-edit-phrase')?.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();$('#collection-edit-add').click();}});
$('#collection-edit-meta-form')?.addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.currentTarget));try{collections.updateMeta(editingCollectionId,data);renderCollectionEditor();toast('Dettagli della raccolta aggiornati.');}catch(error){toast(error.message);}});
function activateCollection(payload){const parsed=C.parsePhrases(payload);phrases=parsed;deck=C.buildDeck(phrases);slotKey='';syncSchedule(new Date(),true);updateLibraryCounts();renderLibrary(true);}
async function importCollectionFile(file){
 if(file.size>2*1024*1024)throw Error('Scegli un file inferiore a 2 MB.');
 const text=await file.text(),isTxt=/\.txt$/i.test(file.name)||file.type==='text/plain';
 if(isTxt){const phrases=text.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);if(!phrases.length)throw Error('Il TXT non contiene frasi. Inserisci una frase per riga.');return{title:file.name.replace(/\.txt$/i,''),category:'Personale',phrases};}
 try{return JSON.parse(text);}catch(_){throw Error('Il JSON non è valido. Per un TXT usa una frase per riga.');}
}
async function handleCollectionImport(event){const file=event.target.files[0];if(!file)return;try{collections.add(await importCollectionFile(file),file.name.replace(/\.(json|txt)$/i,''));}catch(e){toast(e.message);}finally{event.target.value='';}}
$('#import-phrases').addEventListener('change',handleCollectionImport);
$('#collection-import-file').addEventListener('change',handleCollectionImport);
$('#export-phrases').addEventListener('click',()=>{
 const payload={version:'1.0',title:collections.name(),language:'it',count:phrases.length,phrases:phrases.map(p=>p.text)},blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='istante-frasi.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
});
$('#restore-phrases').addEventListener('click',()=>collections.select('original'));
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

document.addEventListener('istante:onboarding-location-locate',event=>{const done=event.detail?.done;void X.capturePosition().then(place=>{applyAppearance(new Date());done?.(true,'Posizione salvata su questo dispositivo.');}).catch(error=>{done?.(false,error?.code===1?'Permesso posizione non concesso. Puoi configurarla più tardi dalle Impostazioni.':error?.message||'Posizione non disponibile.');});});
function openGoalSettings(){
 const show=()=>{openDialog('settings');requestAnimationFrame(()=>{const goal=$('#section-goal summary');expandSection(goal);const title=$('#settings-form')?.elements?.goalTitle;if(title&&mayFocusText())title.focus({preventScroll:true});});};
 const tour=$('#tour-dialog');
 if(tour?.open){tour.addEventListener('close',()=>requestAnimationFrame(show),{once:true});closeDialog(tour);}else show();
}
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

// Quick relative goal helper: converts months/years into the existing date field.
$('#goal-offset-apply')?.addEventListener('click',()=>{
 const value=Math.max(1,Math.min(120,Number($('#goal-offset-value')?.value)||1));
 const unit=$('#goal-offset-unit')?.value==='years'?'years':'months';
 const startInput=$('[name="goalStart"]'),endInput=$('[name="goalEnd"]');
 let start=startInput.value?new Date(startInput.value):new Date();if(!Number.isFinite(+start))start=new Date();
 const end=new Date(start);if(unit==='years')end.setFullYear(end.getFullYear()+value);else end.setMonth(end.getMonth()+value);
 const local=d=>{const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'T'+z(d.getHours())+':'+z(d.getMinutes());};
 if(!startInput.value){startInput.value=local(start);startInput.dispatchEvent(new Event('change',{bubbles:true}));}
 endInput.value=local(end);endInput.dispatchEvent(new Event('change',{bubbles:true}));window.IstanteControls.refresh();
 toast('Traguardo impostato tra '+value+' '+(unit==='years'?(value===1?'anno':'anni'):(value===1?'mese':'mesi'))+'.');
});
updateViewportIndex();window.addEventListener('resize',updateViewportIndex,{passive:true});window.visualViewport?.addEventListener('resize',updateViewportIndex,{passive:true});
window.IstanteControls.enhance($('#settings-form'));window.IstanteControls.enhance($('#radio-panel'));window.IstanteControls.enhance($('#timer-session-options'));window.IstanteControls.enhance($('#calendar-view'));applyAppearance(new Date());updateLibraryCounts();startClock();activity();updateWakeLock();
// The complete collection is local. No redundant fetch is needed during startup.
if(storageFailed)toast('Il browser non consente il salvataggio locale. La pagina funziona comunque in questa sessione.');
window.IstanteUpdates.create({notify:toast});
window.IstanteBackup.create({
 store,core:C,builtins:window.IstanteStations||[],getSettings:()=>settings,
 notify:toast,open:()=>openDialog('backup'),
 onRestored(){ambient.stop(true);radio.stop();moments.destroy();try{sessionStorage.removeItem('istante.original1.timer.v1');}catch(_){}setTimeout(()=>location.reload(),600);}
});
document.addEventListener('istante:volume-gesture',event=>{
 const delta=Number(event.detail?.delta)||0;if(!delta||!settings.audioVolumeGesture)return;
 const offline=ambient.inspect?.()||{},radioState=radio.getState?.();let key='';
 if(offline.playing)key=offline.source==='melody'?'melodyVolume':'ambientVolume';else if(radioState?.wantsPlay||radioState?.state==='playing')key='radioVolume';else key=settings.audioSource==='melody'?'melodyVolume':settings.audioSource==='ambient'?'ambientVolume':'radioVolume';
 const next=Math.max(0,Math.min(100,(Number(settings[key])||0)+delta));if(next===settings[key])return;settings=C.cleanSettings({...settings,[key]:next});store.write('settings',settings);radio.apply();ambient.apply();
 const field=$('#settings-form')?.elements?.[key];if(field){field.value=String(next);field.dispatchEvent(new Event('input',{bubbles:true}));}const labels={ambientVolume:'Volume ambiente',melodyVolume:'Volume melodie',radioVolume:'Volume radio'};toast((labels[key]||'Volume')+' · '+next+'%');
});
function toggleAudioZone(){if(!settings.audioVolumeGesture)return false;const source=settings.audioSource;if((source==='ambient'&&settings.ambientEnabled)||(source==='melody'&&settings.melodyEnabled)){const state=ambient.inspect?.()||{},was=!!state.playing&&state.source===source;if(was)ambient.stop();else void ambient.start('manual',source);document.dispatchEvent(new CustomEvent(source==='melody'?'istante:melody-manual':'istante:ambient-manual',{detail:{playing:!was}}));toast((was?'Pausa':'Play')+' · '+(source==='melody'?'melodia':'suono ambiente'));return true;}if(!settings.radioEnabled)return false;const state=radio.getState?.()||{};if(state.wantsPlay){radio.stop();document.dispatchEvent(new CustomEvent('istante:radio-manual',{detail:{playing:false}}));toast('Pausa · radio');}else{void radio.start('manual');document.dispatchEvent(new CustomEvent('istante:radio-manual',{detail:{playing:true}}));toast('Play · radio');}return true;}
window.IstanteAudioZoneToggle=toggleAudioZone;document.addEventListener('istante:audio-zone-toggle',toggleAudioZone);
document.addEventListener('istante:manage-stations',()=>openDialog('stations'));
document.addEventListener('istante:stations-changed',()=>{if(!stationLibrary.list().length){settings.radioScheduleEnabled=false;if(settings.timerAction==='radio')settings.timerAction='sound';if(settings.timerDuring==='radio')settings.timerDuring='silent';store.write('settings',settings);}moments.apply();if($('#settings-dialog').open)updateSettingsFields();});
Promise.all([X.boot(),new Promise(resolve=>setTimeout(resolve,550))]).catch(()=>{}).finally(()=>{
 clearTimeout(window.ISTANTE_FAILSAFE);tick(false);applyAppearance(new Date());
 requestAnimationFrame(()=>{document.documentElement.classList.remove('is-loading');$('#app-shell').inert=false;$('#boot-screen').classList.add('is-done');X.reveal();if(document.body.classList.contains('view-calendar'))$('#app-shell').inert=true;setTimeout(()=>{$('#boot-screen')?.remove();scene.ready();window.IstanteShareLink.receive({open:()=>openDialog('received'),save:text=>{collections.add({title:'Pensieri ricevuti',phrases:[text]},'Pensieri ricevuti',true);favorites.add(text);store.write('favorites',[...favorites]);updateFavoriteButton();updateLibraryCounts();}});},500);});
});
})();
