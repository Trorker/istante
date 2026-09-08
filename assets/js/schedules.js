/* Independent radio slots. Edits remain a draft until the settings form is saved. */
(function(){
 'use strict';
 function create({icon,onChange}){
  const root=document.getElementById('schedule-list'),add=document.getElementById('schedule-add');
  let draft=[];
  const labels=['Domenica','Luned\u00ec','Marted\u00ec','Mercoled\u00ec','Gioved\u00ec','Venerd\u00ec','Sabato'];
  function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
  function render(){
   root.replaceChildren();
   draft.forEach((r,index)=>{
    const item=node('article','schedule-row');item.dataset.slot=r.id;
    const head=node('div','schedule-row-head'),name=node('input');name.type='text';name.maxLength=48;name.value=r.name;name.setAttribute('aria-label','Nome della fascia '+(index+1));
    name.addEventListener('input',()=>{r.name=name.value;onChange();});
    const enabledLabel=node('label','slot-toggle'),enabled=node('input');enabled.type='checkbox';enabled.role='switch';enabled.checked=r.enabled;enabled.setAttribute('aria-label','Attiva la fascia '+(index+1));enabledLabel.append(enabled);
    const remove=node('button','icon-button');remove.type='button';remove.innerHTML='<span class="icon">'+icon('trash')+'</span>';remove.setAttribute('aria-label','Elimina fascia '+(index+1));remove.addEventListener('click',()=>{draft.splice(index,1);render();onChange();});
    head.append(name,enabledLabel,remove);item.append(head);
    const fields=node('div','slot-fields'),times=node('div','form-row');
    for(const [key,title]of [['start','Accendi alle'],['stop','Spegni alle']]){
     const label=node('label',null,title),input=node('input');input.type='time';input.value=r[key];input.dataset.slotField=key;input.setAttribute('aria-label',title+' \u00b7 fascia '+(index+1));
     input.addEventListener('change',()=>{r[key]=input.value;onChange();});label.append(input);times.append(label);
    }
    fields.append(times);const days=node('div','weekday-choices');days.role='group';days.setAttribute('aria-label','Giorni di partenza della fascia '+(index+1));
    for(const day of [1,2,3,4,5,6,0]){
     const b=node('button',null,labels[day][0]);b.type='button';b.setAttribute('aria-label',labels[day]);b.setAttribute('aria-pressed',String(r.days.split(',').includes(String(day))));
     b.addEventListener('click',()=>{const set=new Set(r.days.split(',').filter(Boolean));set.has(String(day))?set.delete(String(day)):set.add(String(day));r.days=[...set].sort().join(',');b.setAttribute('aria-pressed',String(set.has(String(day))));onChange();});days.append(b);
    }
    fields.append(days);item.append(fields);root.append(item);
    const sync=()=>{item.classList.toggle('slot-disabled',!r.enabled);fields.querySelectorAll('input,button').forEach(e=>e.disabled=!r.enabled);window.IstanteControls.refresh();};
    enabled.addEventListener('change',()=>{r.enabled=enabled.checked;sync();onChange();});window.IstanteControls.enhance(item);sync();
   });
   if(!draft.length)root.append(node('p','field-note','Nessuna fascia. Aggiungine una per la mattina, il pranzo o la sera.'));
   add.disabled=draft.length>=20;
  }
  add.addEventListener('click',()=>{
   if(draft.length>=20)return;
   const presets=[['Mattina','08:00','10:00'],['Pausa pranzo','12:00','14:00'],['Sera','19:00','22:00']];
   const [name,start,stop]=presets[draft.length]||['Fascia '+(draft.length+1),'09:00','10:00'];
   draft.push({id:'slot-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6),name,enabled:true,start,stop,days:'0,1,2,3,4,5,6'});render();onChange();
   root.lastElementChild?.scrollIntoView({block:'nearest',behavior:'smooth'});
  });
  return {begin(settings){draft=structuredClone(settings.radioSchedules||[]);render();},value:()=>structuredClone(draft),validate(){
   for(const [i,r]of draft.entries())if(r.enabled&&(window.IstanteTime.minute(r.start)===null||window.IstanteTime.minute(r.stop)===null||r.start===r.stop||!r.days))return 'Fascia '+(i+1)+': scegli almeno un giorno e orari di inizio e fine diversi.';
   if(!draft.some(r=>r.enabled))return 'Attiva almeno una fascia oppure disattiva la programmazione.';return '';
  },syncEnabled(enabled){root.querySelectorAll('.schedule-row').forEach((el,i)=>{el.querySelectorAll('input,button').forEach(e=>{e.disabled=!enabled||!!e.closest('.slot-fields')&&!draft[i].enabled;});});add.disabled=!enabled||draft.length>=20;window.IstanteControls.refresh();}};
 }
 window.IstanteSchedules={create};
})();
