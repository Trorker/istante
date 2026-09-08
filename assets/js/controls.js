/* Accessible local dropdowns, calendars and 24-hour clock dials. */
(function () {
 'use strict';
 const entries=new Map(),pad=n=>String(n).padStart(2,'0');
 const months=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
 let popup=null;
 const formatMode=()=>document.getElementById('settings-dialog')?.open?(document.querySelector('[name="timeFormat"]')?.value||'24'):(document.documentElement.dataset.timeFormat||'24');
 const showTime=value=>window.IstanteTime.formatTime(value,formatMode());
 const motion=()=>window.IstanteMotion;
 const icon=name=>window.IstanteIcons.render(name);
 function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
 function button(text,cls,fn){const b=el('button',cls,text);b.type='button';if(fn)b.addEventListener('click',fn);return b;}
 function fieldLabel(input){const label=input.closest('label');return input.getAttribute('aria-label')||(label?[...label.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim():'Seleziona');}
 function formatted(input){
  if(input.tagName==='SELECT')return input.selectedOptions[0]?.textContent||'Seleziona';
  if(!input.value)return 'Seleziona';if(input.type==='time')return showTime(input.value);
  const [d,t]=input.value.split('T'),[y,m,day]=d.split('-');return `${day} ${months[Number(m)-1].toLowerCase()} ${y}`+(t?' \u00b7 '+showTime(t):'');
 }
 function refresh(){for(const [input,b]of entries){if(!input.isConnected){entries.delete(input);continue;}b.querySelector('.custom-value').textContent=formatted(input);b.disabled=input.disabled;b.setAttribute('aria-label',fieldLabel(input)+': '+formatted(input));}}
 function addValue(input,value){if(input.tagName==='SELECT'&&![...input.options].some(o=>o.value===String(value))){input.add(new Option(value+' '+(input.dataset.customUnit||''),String(value)));}input.value=String(value);refresh();}
 function setValue(input,value){addValue(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));}
 function close(){if(popup)motion().dismiss(popup);}
 function makePopup(input,kind){
  if(popup){motion().cancel(popup);popup.close();}
  const trigger=entries.get(input),d=el('dialog','control-popup '+kind);popup=d;trigger.setAttribute('aria-expanded','true');d.setAttribute('aria-label',fieldLabel(input));
  const head=el('div','control-head'),x=button('','control-close',close);x.innerHTML=icon('close');x.setAttribute('aria-label','Chiudi selettore');head.append(el('span','section-label',fieldLabel(input)),x);d.append(head);
  d.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');d.remove();if(popup===d)popup=null;if(trigger.isConnected&&!trigger.disabled)trigger.focus({preventScroll:true});});
  d.addEventListener('cancel',e=>{e.preventDefault();e.stopPropagation();close();});
  d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();});
  document.body.append(d);return d;
 }
 function openSelect(input){
  const d=makePopup(input,'select-popup'),list=el('div','custom-options');list.setAttribute('role','listbox');list.setAttribute('aria-label',fieldLabel(input));const opts=[];let search;const isStation=input.dataset.stations==='true';if(isStation)d.classList.add('station-select-popup');let favoriteOnly=false,applyFilter=()=>{};
  let searchBar;
  if(isStation||input.dataset.search==='true'||input.options.length>12){
   searchBar=el('div',isStation?'station-search-tools':'select-search-tools');const bar=el('label','select-search-bar'),glyph=el('span','icon');glyph.innerHTML=icon('search');bar.append(glyph);search=el('input','select-search');search.type='search';search.placeholder=isStation?'Cerca una stazione...':'Cerca...';search.setAttribute('aria-label','Cerca nel catalogo');search.autocomplete='off';bar.append(search);searchBar.append(bar);d.append(searchBar);
  }
  if(isStation){const fav=button('','icon-button favorite-search-button',()=>{favoriteOnly=!favoriteOnly;fav.setAttribute('aria-pressed',String(favoriteOnly));fav.setAttribute('aria-label',favoriteOnly?'Mostra tutte le stazioni':'Mostra solo le preferite');applyFilter();});fav.innerHTML='<span class="icon">'+icon('heart')+'</span>';fav.setAttribute('aria-pressed','false');fav.setAttribute('aria-label','Mostra solo le preferite');fav.title='Solo preferite';searchBar.append(fav);}
  for(const o of input.options){
   const b=button('','custom-option',()=>{setValue(input,o.value);close();}),m=o.textContent.match(/^(\d{2})\s+(.+)$/);
   if(m){b.append(el('span','station-no',m[1]),el('span','station-title',m[2]));}else b.append(el('span','option-title',o.textContent));
   b.dataset.search=o.textContent.toLocaleLowerCase('it');b.dataset.favorite=o.dataset.favorite||'false';if(b.dataset.favorite==='true'){const star=el('span','icon option-favorite');star.innerHTML=icon('heart');b.append(star);}b.setAttribute('role','option');b.setAttribute('aria-selected',String(o.selected));b.disabled=o.disabled;list.append(b);opts.push(b);
  }
  const available=()=>opts.filter(b=>!b.hidden&&!b.disabled);
  list.addEventListener('keydown',e=>{const a=available();if(!a.length)return;let i=a.indexOf(document.activeElement);if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();i=e.key==='Home'?0:e.key==='End'?a.length-1:(i+(e.key==='ArrowDown'?1:-1)+a.length)%a.length;a[i].focus();}else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){const target=a.find((b,j)=>j>i&&b.dataset.search.replace(/^\d+\s+/,'').startsWith(e.key.toLowerCase()))||a.find(b=>b.dataset.search.replace(/^\d+\s+/,'').startsWith(e.key.toLowerCase()));target?.focus();}});
  d.append(list);const empty=el('p','select-empty','Nessuna corrispondenza.');empty.hidden=true;d.append(empty);
  applyFilter=()=>{const q=search?.value.trim().toLocaleLowerCase('it')||'';for(const b of opts)b.hidden=!b.dataset.search.includes(q)||(favoriteOnly&&b.dataset.favorite!=='true');empty.textContent=favoriteOnly?'Nessuna preferita in questa ricerca. Aggiungile con il cuore nel player o nella gestione stazioni.':'Nessuna corrispondenza.';empty.hidden=available().length>0;list.scrollTop=0;};
  if(search){search.addEventListener('input',applyFilter);search.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();available()[0]?.focus();}else if(e.key==='Enter'){e.preventDefault();if(available().length===1)available()[0].click();}});}
  if(input.dataset.customUnit){
   const section=el('div','custom-number'),label=el('label',null,'Oppure imposta '+input.dataset.customUnit),n=el('input');n.type='number';n.min=input.dataset.customMin;n.max=input.dataset.customMax;n.step='1';n.inputMode='numeric';n.value=Number(input.value)>0?input.value:n.min;label.append(n);const error=el('p','form-error');error.setAttribute('role','alert');
   const apply=()=>{const value=Number(n.value);if(!n.value||!Number.isInteger(value)||value<+n.min||value>+n.max){error.textContent='Inserisci un valore da '+n.min+' a '+n.max+'.';return;}setValue(input,String(value));close();};section.append(label,button('Applica','secondary-button',apply),error);n.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();apply();}});d.append(section);
  }
  if(isStation){const manage=button('Gestisci stazioni','text-button station-picker-manage',()=>{d.addEventListener('close',()=>document.dispatchEvent(new CustomEvent('istante:manage-stations')),{once:true});close();});d.append(manage);}
  motion().present(d);const selected=opts.find(b=>b.getAttribute('aria-selected')==='true')||opts[0];(selected||d.querySelector('.control-close'))?.focus({preventScroll:true});selected?.scrollIntoView({block:'nearest'});
 }
 function openDate(input){
  const isTime=input.type==='time',hasTime=isTime||input.type==='datetime-local',touch=matchMedia('(pointer: coarse), (max-width: 740px)').matches;
  const twelve=formatMode()==='12';
  const sequential=!isTime&&hasTime&&touch,d=makePopup(input,'date-popup'+(!isTime&&hasTime&&!touch?' wide-picker':'')+(sequential?' step-picker':''));
  let chosen=isTime?new Date():new Date(input.value||Date.now());if(!Number.isFinite(+chosen))chosen=new Date();
  let hour=isTime?Number((input.value||'12:00').slice(0,2)):chosen.getHours(),minute=isTime?Number((input.value||'12:00').slice(3,5)):chosen.getMinutes();
  let year=chosen.getFullYear(),month=chosen.getMonth(),step=sequential?'date':'both',dialMode='hours',dialTimer=0;
  const body=el('div','picker-body'),datePart=el('section','date-part'),timePart=el('section','time-part'),error=el('p','form-error');error.setAttribute('role','alert');
  const steps=el('nav','picker-steps');steps.setAttribute('aria-label','Passaggi');const dateStep=button('1  Giorno','picker-step',()=>setStep('date')),timeStep=button('2  Orario','picker-step',()=>setStep('time'));steps.append(dateStep,timeStep);if(sequential)d.append(steps);
  const calendar=el('div','calendar-grid');calendar.setAttribute('role','grid');calendar.setAttribute('aria-label','Scegli il giorno');
  function drawDate(){
   datePart.replaceChildren();const nav=el('div','calendar-nav'),menu=el('div','month-menu');menu.hidden=true;
   const shift=delta=>{month+=delta;if(month<0){month=11;year--;}if(month>11){month=0;year++;}year=Math.min(2200,Math.max(1900,year));drawDate();};
   const prev=button('','calendar-arrow',()=>shift(-1)),next=button('','calendar-arrow',()=>shift(1));prev.innerHTML=icon('left');next.innerHTML=icon('right');prev.setAttribute('aria-label','Mese precedente');next.setAttribute('aria-label','Mese successivo');prev.disabled=year===1900&&month===0;next.disabled=year===2200&&month===11;
   const title=button(months[month]+' '+year,'calendar-month',()=>{menu.hidden=!menu.hidden;title.setAttribute('aria-expanded',String(!menu.hidden));});title.setAttribute('aria-label','Scegli mese e anno');title.setAttribute('aria-expanded','false');nav.append(prev,title,next);datePart.append(nav);
   const yr=el('label',null,'Anno'),yn=el('input');yn.type='number';yn.min='1900';yn.max='2200';yn.value=year;yn.setAttribute('aria-label','Anno');yn.addEventListener('change',()=>{if(Number.isInteger(+yn.value)&&+yn.value>=1900&&+yn.value<=2200)year=+yn.value;else yn.value=year;});yr.append(yn);menu.append(yr);months.forEach((m,i)=>menu.append(button(m.slice(0,3),'month-choice',()=>{month=i;drawDate();})));datePart.append(menu);
   const weekdays=el('div','calendar-weekdays');['L','M','M','G','V','S','D'].forEach(t=>weekdays.append(el('span',null,t)));datePart.append(weekdays);calendar.replaceChildren();const offset=(new Date(year,month,1).getDay()+6)%7,total=new Date(year,month+1,0).getDate();for(let i=0;i<offset;i++)calendar.append(el('span','calendar-blank'));
   for(let day=1;day<=total;day++){
    const selected=chosen.getFullYear()===year&&chosen.getMonth()===month&&chosen.getDate()===day;
    const b=button(String(day),'calendar-day',()=>{chosen=new Date(year,month,day);drawDate();if(sequential)setStep('time');else calendar.querySelector('[aria-selected=true]')?.focus({preventScroll:true});});b.dataset.day=day;b.setAttribute('role','gridcell');b.setAttribute('aria-selected',String(selected));b.setAttribute('aria-label',`${day} ${months[month]} ${year}`);b.tabIndex=selected?0:-1;if(new Date(year,month,day).toDateString()===new Date().toDateString())b.setAttribute('aria-current','date');calendar.append(b);
   }
   if(!calendar.querySelector('[tabindex="0"]'))calendar.querySelector('button').tabIndex=0;datePart.append(calendar);
  }
  calendar.addEventListener('keydown',e=>{const deltas={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};if(Object.hasOwn(deltas,e.key)&&e.target.dataset.day){e.preventDefault();const target=new Date(year,month,+e.target.dataset.day+deltas[e.key]);if(target.getFullYear()<1900||target.getFullYear()>2200)return;chosen=target;month=target.getMonth();year=target.getFullYear();drawDate();calendar.querySelector('[aria-selected=true]')?.focus();}});
  const timeHeader=el('div','dial-header'),hButton=button('','dial-digits',()=>switchDial('hours')),mButton=button('','dial-digits',()=>switchDial('minutes'));
  hButton.setAttribute('aria-label','Scegli le ore');mButton.setAttribute('aria-label','Scegli i minuti');timeHeader.append(hButton,el('span','dial-colon',':'),mButton);
  const periods=el('div','dial-periods');let am,pm;if(twelve){am=button('AM','period-button',()=>{hour=hour%12;updateDial();});pm=button('PM','period-button',()=>{hour=hour%12+12;updateDial();});periods.append(am,pm);}
  const note=el('p','dial-note'),face=el('div','clock-face');face.tabIndex=0;face.setAttribute('role','group');
  const hand=el('div','clock-hand'),hub=el('div','clock-hub'),marks=el('div','clock-marks');marks.setAttribute('aria-hidden','true');
  for(let i=0;i<60;i++){const tick=el('i','clock-tick'+(i%5===0?' major':''));tick.style.setProperty('--tick',i*6+'deg');marks.append(tick);}
  function updateDial(){
   hButton.textContent=pad(twelve?(hour%12||12):hour);if(twelve){am.setAttribute('aria-pressed',String(hour<12));pm.setAttribute('aria-pressed',String(hour>=12));}mButton.textContent=pad(minute);hButton.setAttribute('aria-pressed',String(dialMode==='hours'));mButton.setAttribute('aria-pressed',String(dialMode==='minutes'));
   note.textContent=dialMode==='hours'?(twelve?'Scegli l\u2019ora \u00b7 12 ore, AM / PM':'Scegli l\u2019ora \u00b7 quadrante 24 ore'):'Scegli i minuti \u00b7 trascina per una scelta precisa';face.setAttribute('aria-label',dialMode==='hours'?'Ore, '+pad(hour)+'. Usa le frecce per regolare.':'Minuti, '+pad(minute)+'. Usa le frecce per regolare.');
   const value=dialMode==='hours'?(twelve?(hour%12||12):hour):minute,angle=dialMode==='hours'?(value%12)*30:value*6,radius=dialMode==='hours'&&!twelve&&(value===0||value>12)?27:40;
   hand.style.setProperty('--hand-angle',angle+'deg');hand.style.setProperty('--hand-length',radius+'%');
   face.querySelectorAll('[data-clock-value]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.clockValue===value)));
  }
  function drawDial(){
   face.replaceChildren(marks,hand,hub);const values=dialMode==='hours'?(twelve?[12,1,2,3,4,5,6,7,8,9,10,11]:[12,1,2,3,4,5,6,7,8,9,10,11,0,13,14,15,16,17,18,19,20,21,22,23]):[0,5,10,15,20,25,30,35,40,45,50,55];
   values.forEach(value=>{const angle=(dialMode==='hours'?value%12*30:value*6)*Math.PI/180,inner=dialMode==='hours'&&(value===0||value>12),r=inner?27:40,b=button(pad(value),'clock-number'+(inner?' inner':''),e=>{if(e.detail===0){choose(value);if(dialMode==='hours')switchDial('minutes');}});b.dataset.clockValue=value;b.style.left=(50+Math.sin(angle)*r)+'%';b.style.top=(50-Math.cos(angle)*r)+'%';b.setAttribute('aria-label',value+(dialMode==='hours'?' ore':' minuti'));face.append(b);});updateDial();
  }
  function choose(value){if(dialMode==='hours')hour=twelve?(value%12+(hour>=12?12:0)):value;else minute=value;updateDial();}
  function switchDial(mode){clearTimeout(dialTimer);dialMode=mode;drawDial();motion().flash(face);}
  let dragging=false;
  function fromPointer(e){const rect=face.getBoundingClientRect(),dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2;const angle=(Math.atan2(dx,-dy)*180/Math.PI+360)%360;if(dialMode==='hours'){const h=Math.round(angle/30)%12;choose(twelve?(h||12):Math.hypot(dx,dy)<rect.width*.335?(h===0?0:h+12):(h===0?12:h));}else choose(Math.round(angle/6)%60);}
  face.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();dragging=true;face.focus({preventScroll:true});face.setPointerCapture(e.pointerId);if(e.target.dataset.clockValue!==undefined)choose(+e.target.dataset.clockValue);else fromPointer(e);});
  face.addEventListener('pointermove',e=>{if(dragging)fromPointer(e);});face.addEventListener('pointerup',()=>{if(!dragging)return;dragging=false;if(dialMode==='hours')dialTimer=setTimeout(()=>switchDial('minutes'),180);});face.addEventListener('pointercancel',()=>dragging=false);
  face.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Enter'].includes(e.key)){e.preventDefault();if(e.key==='Enter'){if(dialMode==='hours')switchDial('minutes');else apply();return;}const max=dialMode==='hours'?(twelve?12:24):60,current=dialMode==='hours'?hour:minute;choose(e.key==='Home'?0:e.key==='End'?max-1:(current+(['ArrowUp','ArrowRight'].includes(e.key)?1:-1)+max)%max);}});
  if(!isTime){drawDate();body.append(datePart);}if(hasTime){timePart.append(timeHeader,periods,note,face);drawDial();body.append(timePart);}d.append(body);
  const manual=el('details','manual-picker'),summary=el('summary',null,'Oppure scrivi '+(isTime?'l\u2019ora':hasTime?'data e ora':'la data')),field=el('input');field.type='text';field.placeholder=isTime?(twelve?'HH:MM AM/PM':'HH:MM'):hasTime?(twelve?'GG/MM/AAAA HH:MM AM/PM':'GG/MM/AAAA HH:MM'):'GG/MM/AAAA';field.setAttribute('aria-label',field.placeholder);field.autocomplete='off';manual.append(summary,field);d.append(manual,error);
  const foot=el('div','control-footer'),back=button('Indietro','text-button',()=>setStep('date')),confirm=button('Conferma','primary-button',()=>{if(sequential&&step==='date'&&!(manual.open&&field.value.trim()))setStep('time');else apply();});foot.append(button('Annulla','text-button',close));if(sequential)foot.append(back);foot.append(confirm);d.append(foot);
  function setStep(next){step=next;datePart.hidden=sequential&&step!=='date';timePart.hidden=sequential&&step!=='time';back.hidden=!sequential||step==='date';confirm.textContent=sequential&&step==='date'?'Scegli orario':'Conferma';dateStep.setAttribute('aria-current',step==='date'?'step':'false');timeStep.setAttribute('aria-current',step==='time'?'step':'false');d.dataset.step=step;if(d.open){motion().flash(step==='date'?datePart:timePart);(step==='time'?hButton:calendar.querySelector('[aria-selected=true]'))?.focus({preventScroll:true});}}
  function apply(){
   let target=new Date(chosen),h=hour,m=minute;
   if(manual.open&&field.value.trim()){
    const raw=field.value.trim(),match=raw.match(isTime?/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i:/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?:\s*(AM|PM))?)?$/i);
    if(!match){error.textContent='Formato non valido: '+field.placeholder+'.';return;}
    if(isTime){h=+match[1];m=+match[2];}else{target=new Date(+match[3],+match[2]-1,+match[1]);if(target.getDate()!==+match[1]||target.getMonth()!==+match[2]-1||+match[3]<1900||+match[3]>2200){error.textContent='Questa data non esiste.';return;}h=match[4]===undefined?h:+match[4];m=match[5]===undefined?m:+match[5];}
    const period=(isTime?match[3]:match[6])?.toUpperCase();if(period){if(h<1||h>12){error.textContent='Con AM / PM le ore vanno da 1 a 12.';return;}h=h%12+(period==='PM'?12:0);}else if(twelve&&(isTime||match[4]!==undefined)){error.textContent='Aggiungi AM oppure PM all\u2019orario.';return;}
   }
   if(h<0||h>23||m<0||m>59){error.textContent='Usa ore da 00 a 23 e minuti da 00 a 59.';return;}
   if(!isTime&&hasTime){const test=new Date(target.getFullYear(),target.getMonth(),target.getDate(),h,m);if(test.getHours()!==h||test.getMinutes()!==m){error.textContent='Questo orario non esiste nel cambio di ora legale. Scegli un altro orario.';return;}}
   const time=pad(h)+':'+pad(m),date=target.getFullYear()+'-'+pad(target.getMonth()+1)+'-'+pad(target.getDate()),value=isTime?time:date+(hasTime?'T'+time:'');
   if((input.min&&value<input.min)||(input.max&&value>input.max)){error.textContent='Il valore non rientra nell\u2019intervallo consentito.';return;}
   setValue(input,value);close();
  }
  field.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();apply();}});d.addEventListener('close',()=>clearTimeout(dialTimer));
  setStep(step);motion().present(d);if(isTime)hButton.focus({preventScroll:true});else calendar.querySelector('[aria-selected=true]')?.focus({preventScroll:true});
 }
 function enhance(root){root.querySelectorAll('select,input[type="time"],input[type="date"],input[type="datetime-local"]').forEach(input=>{if(entries.has(input))return;const b=button('','custom-trigger',()=>{if(!input.disabled)(input.tagName==='SELECT'?openSelect:openDate)(input);});b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-expanded','false');b.append(el('span','custom-value'),el('span','custom-chevron'));b.lastChild.innerHTML=icon(input.tagName==='SELECT'?'chevron':input.type==='time'?'clock':'calendar');input.hidden=true;input.tabIndex=-1;input.after(b);entries.set(input,b);input.addEventListener('change',refresh);b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();b.click();}});});refresh();}
 window.IstanteControls={enhance,refresh,addValue,close};
})();
