/* Bounded iCalendar reader for local / public read-only calendars.
 * Supports DATE, UTC, floating times, IANA TZID, common RRULE frequencies,
 * RDATE, EXDATE and RECURRENCE-ID. Unsupported rules/zones are reported,
 * never silently interpreted as a different recurrence or time zone.
 */
(function(root){'use strict';
const DAY=86400000,weekdays={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6},formatters=new Map();
function prop(line){let quoted=false,pos=-1;for(let i=0;i<line.length;i++){if(line[i]==='"')quoted=!quoted;if(line[i]===':'&&!quoted){pos=i;break;}}if(pos<0)return null;const parts=line.slice(0,pos).split(/;(?=(?:[^"]*"[^"]*")*[^"]*$)/),params={};for(const p of parts.slice(1)){const at=p.indexOf('=');if(at>=0)params[p.slice(0,at).toUpperCase()]=p.slice(at+1).replace(/^"|"$/g,'');}return{name:parts[0].toUpperCase(),params,value:line.slice(pos+1)};}
function text(s){return String(s||'').replace(/\\([nN,;\\])/g,(_,c)=>c.toLowerCase()==='n'?'\n':c);}
function parse(source){
 if(typeof source!=='string'||source.length>1100000)throw Error('Calendario troppo grande (massimo 1 MB).');
 const lines=source.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').replace(/\n[ \t]/g,'').split('\n');
 if(!lines.some(l=>l.trim().toUpperCase()==='BEGIN:VCALENDAR')||!lines.some(l=>l.trim().toUpperCase()==='END:VCALENDAR'))throw Error('Il file non contiene un calendario ICS valido.');
 const events=[],stack=[];let current=null,title='',zones=[];
 for(const l of lines){const p=prop(l);if(!p)continue;if(p.name==='BEGIN'){stack.push(p.value.toUpperCase());if(p.value.toUpperCase()==='VEVENT'){current={};if(events.length>=5000)throw Error('Troppi eventi: massimo 5.000 per calendario.');}continue;}
  if(p.name==='END'){if(p.value.toUpperCase()==='VEVENT'&&current){events.push(current);current=null;}stack.pop();continue;}
  if(current&&stack[stack.length-1]==='VEVENT'){(current[p.name]||(current[p.name]=[])).push(p);}
  else if(stack.length===1&&p.name==='X-WR-CALNAME')title=text(p.value);
  else if(stack[stack.length-1]==='VTIMEZONE'&&p.name==='TZID')zones.push(p.value);
 }
 return{events,title,zones};
}
function date(p){
 if(!p)return null;const m=/^(\d{4})(\d\d)(\d\d)(?:T(\d\d)(\d\d)(\d\d)?(Z)?)?$/.exec(p.value);if(!m)throw Error('Data ICS non riconosciuta.');
 const y=+m[1],mo=+m[2],d=+m[3],h=+(m[4]||0),mi=+(m[5]||0),s=+(m[6]||0),wall=Date.UTC(y,mo-1,d,h,mi,s),check=new Date(wall);
 if(y<1900||y>2200||mo<1||mo>12||d<1||d>31||h>23||mi>59||s>59||check.getUTCMonth()!==mo-1||check.getUTCDate()!==d)throw Error('Data ICS fuori intervallo o non valida.');
 return{wall,allDay:!m[4]||p.params.VALUE==='DATE',zone:m[7]?'UTC':p.params.TZID||''};
}
function inZone(wall,zone){
 const d=new Date(wall);if(!zone)return new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds()).getTime();if(zone==='UTC'||zone==='Etc/UTC'||zone==='GMT')return wall;
 let fmt=formatters.get(zone);if(!fmt){try{fmt=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});fmt.format(wall);}catch(_){throw Error('Fuso non riconosciuto: '+zone+'. Esporta il calendario con fusi IANA (es. Europe/Rome) o UTC.');}formatters.set(zone,fmt);}
 let guess=wall;for(let i=0;i<4;i++){const parts={};fmt.formatToParts(guess).forEach(p=>{if(p.type!=='literal')parts[p.type]=+p.value;});const shown=Date.UTC(parts.year,parts.month-1,parts.day,parts.hour===24?0:parts.hour,parts.minute,parts.second),diff=wall-shown;if(diff===0){const before=guess-DAY,old={};fmt.formatToParts(before).forEach(p=>{if(p.type!=='literal')old[p.type]=+p.value;});const oldWall=Date.UTC(old.year,old.month-1,old.day,old.hour===24?0:old.hour,old.minute,old.second),earlier=wall-(oldWall-before);if(earlier<guess){const fold={};fmt.formatToParts(earlier).forEach(p=>{if(p.type!=='literal')fold[p.type]=+p.value;});if(Date.UTC(fold.year,fold.month-1,fold.day,fold.hour===24?0:fold.hour,fold.minute,fold.second)===wall)return earlier;}return guess;}guess+=diff;}
 throw Error('Un evento cade in un orario locale inesistente durante il cambio di ora.');
}
function stamp(d){return inZone(d.wall,d.allDay?'':d.zone);}
function duration(raw){if(!raw)return null;const m=/^P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(raw);if(!m)throw Error('Durata ICS non supportata.');return((+m[1]||0)*7+(+m[2]||0))*DAY+(+m[3]||0)*3600000+(+m[4]||0)*60000+(+m[5]||0)*1000;}
function rule(raw){const r={};for(const p of raw.split(';')){const [k,v]=p.split('=');r[k]=v;}const keys=['FREQ','INTERVAL','COUNT','UNTIL','WKST','BYDAY','BYMONTHDAY','BYMONTH','BYSETPOS'];if(Object.keys(r).some(k=>!keys.includes(k)))throw Error('La regola contiene opzioni non supportate (es. BYHOUR/BYMINUTE/BYYEARDAY).');if(!['DAILY','WEEKLY','MONTHLY','YEARLY'].includes(r.FREQ))throw Error('Frequenza non supportata: '+r.FREQ+'.');r.INTERVAL=Number(r.INTERVAL||1);if(!Number.isSafeInteger(r.INTERVAL)||r.INTERVAL<1||r.INTERVAL>1000)throw Error('Intervallo di ricorrenza non valido.');
 if(r.COUNT){r.COUNT=Number(r.COUNT);if(!Number.isSafeInteger(r.COUNT)||r.COUNT<1||r.COUNT>100000)throw Error('Numero di ricorrenze non valido.');}
 for(const key of ['BYMONTH','BYMONTHDAY','BYSETPOS'])if(r[key]){r[key]=r[key].split(',').map(Number);const limit=key==='BYMONTH'?12:key==='BYMONTHDAY'?31:366;if(r[key].some(n=>!Number.isInteger(n)||n===0||Math.abs(n)>limit||key==='BYMONTH'&&n<1))throw Error('Valori '+key+' non validi.');}
 if(r.BYDAY)r.BYDAY=r.BYDAY.split(',').map(x=>{const m=/^([+-]?\d+)?(SU|MO|TU|WE|TH|FR|SA)$/.exec(x);if(!m)throw Error('Giorno della ricorrenza non valido.');const n=m[1]?Number(m[1]):0;if(Math.abs(n)>53||n&&!['MONTHLY','YEARLY'].includes(r.FREQ))throw Error('Posizione del giorno non supportata.');return{n,day:weekdays[m[2]]};});
 if(r.WKST&&!Object.hasOwn(weekdays,r.WKST))throw Error('Inizio settimana non valido.');return r;}
function occurrences(start,r,to,from,warnings){
 const d=new Date(start.wall),time=((d.getUTCHours()*60+d.getUTCMinutes())*60+d.getUTCSeconds())*1000,firstDay=Math.floor(start.wall/DAY)*DAY,wkst=weekdays[r.WKST||'MO'];
 let base=r.FREQ==='DAILY'?firstDay:r.FREQ==='WEEKLY'?firstDay-((d.getUTCDay()-wkst+7)%7)*DAY:r.FREQ==='MONTHLY'?Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1):Date.UTC(d.getUTCFullYear(),0,1),until=r.UNTIL?date({value:r.UNTIL,params:{}}):null;
 if(until&& !/Z$/.test(r.UNTIL))until.zone=start.zone;
 const untilStamp=until?stamp(until)+(until.allDay?DAY-1:0):Infinity,values=[start.wall];let count=1,steps=0;
 if(r.COUNT===1)return values;
 // Skip old periods only when COUNT does not require counting them.
 if(!r.COUNT&&from>base+400*DAY){const lookback=new Date(from-400*DAY);if(r.FREQ==='DAILY'||r.FREQ==='WEEKLY'){const size=(r.FREQ==='DAILY'?1:7)*r.INTERVAL*DAY;base+=Math.max(0,Math.floor((+lookback-base)/size))*size;}else if(r.FREQ==='MONTHLY'){const delta=(lookback.getUTCFullYear()-d.getUTCFullYear())*12+lookback.getUTCMonth()-d.getUTCMonth();base=Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+Math.max(0,Math.floor(delta/r.INTERVAL))*r.INTERVAL,1);}else base=Date.UTC(d.getUTCFullYear()+Math.max(0,Math.floor((lookback.getUTCFullYear()-d.getUTCFullYear())/r.INTERVAL))*r.INTERVAL,0,1);}
 while(base<to+3*DAY&&steps++<50000){const b=new Date(base);let end=r.FREQ==='DAILY'?base+DAY:r.FREQ==='WEEKLY'?base+7*DAY:r.FREQ==='MONTHLY'?Date.UTC(b.getUTCFullYear(),b.getUTCMonth()+1,1):Date.UTC(b.getUTCFullYear()+1,0,1),candidates=[];
  for(let day=base;day<end;day+=DAY){const c=new Date(day),m=c.getUTCMonth()+1,md=c.getUTCDate(),ndays=new Date(Date.UTC(c.getUTCFullYear(),m,0)).getUTCDate();if(r.BYMONTH&&!r.BYMONTH.includes(m))continue;
   if(r.FREQ==='YEARLY'&&!r.BYMONTH&&!r.BYDAY&&!r.BYMONTHDAY&&m!==d.getUTCMonth()+1)continue;
   if(r.BYMONTHDAY&&!r.BYMONTHDAY.some(n=>md===(n>0?n:ndays+n+1)))continue;
   if(r.BYDAY){if(!r.BYDAY.some(x=>{if(c.getUTCDay()!==x.day)return false;if(!x.n)return true;if(r.FREQ==='YEARLY'&&!r.BYMONTH){const y0=Date.UTC(c.getUTCFullYear(),0,1),y1=Date.UTC(c.getUTCFullYear()+1,0,1),ordinal=Math.floor((day-y0)/DAY)+1,last=Math.floor((y1-day)/DAY);return x.n>0?Math.ceil(ordinal/7)===x.n:-Math.ceil(last/7)===x.n;}return x.n>0?Math.ceil(md/7)===x.n:-Math.ceil((ndays-md+1)/7)===x.n;}))continue;}
   else if(r.FREQ==='WEEKLY'&&c.getUTCDay()!==d.getUTCDay())continue;
   if(['MONTHLY','YEARLY'].includes(r.FREQ)&&!r.BYDAY&&!r.BYMONTHDAY&&md!==d.getUTCDate())continue;
   candidates.push(day+time);
  }
  if(r.BYSETPOS)candidates=[...new Set(r.BYSETPOS.map(n=>candidates[n>0?n-1:candidates.length+n]).filter(x=>x!==undefined))].sort((a,b)=>a-b);
  for(const wall of candidates){if(wall<=start.wall)continue;let ts;try{ts=stamp({...start,wall});}catch(error){if(error.message.includes('orario locale inesistente')){if(!warnings.includes(error.message))warnings.push(error.message+' La singola ricorrenza viene saltata.');continue;}throw error;}if(ts>untilStamp)return values;if(r.COUNT&&count>=r.COUNT)return values;count++;values.push(wall);if(values.length>10000){warnings.push('Ricorrenza limitata a 10.000 istanze.');return values;}}
  base=r.FREQ==='DAILY'?base+r.INTERVAL*DAY:r.FREQ==='WEEKLY'?base+7*r.INTERVAL*DAY:r.FREQ==='MONTHLY'?Date.UTC(b.getUTCFullYear(),b.getUTCMonth()+r.INTERVAL,1):Date.UTC(b.getUTCFullYear()+r.INTERVAL,0,1);
 }
 if(steps>=50000)warnings.push('Ricorrenza molto estesa: raggiunto il limite di elaborazione.');return values;
}
const first=(e,name)=>e[name]?.[0];
function expand(sources,from,to){
 if(!Number.isFinite(from)||!Number.isFinite(to)||to<=from||to-from>400*DAY)throw Error('Intervallo di calendario non valido.');
 const output=[],warnings=[],begin=Date.now();
 for(const source of sources){if(source.enabled===false)continue;let parsed;try{parsed=parse(source.ics);}catch(e){warnings.push(source.name+': '+e.message);continue;}const groups=new Map();
  for(const [index,e]of parsed.events.entries()){const uid=first(e,'UID')?.value||'event-'+index;let g=groups.get(uid);if(!g){g={master:null,exceptions:[]};groups.set(uid,g);}if(e['RECURRENCE-ID'])g.exceptions.push(e);else if(!g.master||Number(first(e,'SEQUENCE')?.value||0)>=Number(first(g.master,'SEQUENCE')?.value||0))g.master=e;}
  function render(e,wall,seriesStart,uid,recurring,occurrence){if(first(e,'STATUS')?.value.toUpperCase()==='CANCELLED')return;const start=seriesStart||date(first(e,'DTSTART'));if(!start)return;const end=date(first(e,'DTEND')),dur=duration(first(e,'DURATION')?.value);const when=occurrence||{...start,wall},ts=stamp(when);let finish;
   if(start.allDay){const days=end?Math.max(1,Math.round((end.wall-start.wall)/DAY)):dur?Math.max(1,Math.round(dur/DAY)):1;finish=stamp({...when,wall:wall+days*DAY});}else{const ms=end?stamp(end)-stamp(start):dur??0;if(ms<0)throw Error('Fine evento precedente all\u2019inizio.');finish=ts+ms;}
   if(ts>=to||finish<=from&&ts<from)return;const url=first(e,'URL')?.value||'';
   output.push({id:source.id+'|'+uid+'|'+ts,sourceId:source.id,title:text(first(e,'SUMMARY')?.value||'Senza titolo').slice(0,500),description:text(first(e,'DESCRIPTION')?.value).slice(0,10000),location:text(first(e,'LOCATION')?.value).slice(0,500),url:/^https?:\/\//i.test(url)?url:'',start:ts,end:finish,allDay:start.allDay,recurring:!!recurring});
  }
  for(const [uid,g]of groups){if(output.length>=10000||Date.now()-begin>3500){warnings.push('Calendario molto grande: risultati limitati. Restringi la vista per vedere meno eventi.');break;}
   const e=g.master;
   try{
    const overrides=new Map();for(const x of g.exceptions){const rid=date(first(x,'RECURRENCE-ID'));if(!rid)continue;if(first(x,'RECURRENCE-ID').params.RANGE)warnings.push('Eccezione RANGE=THISANDFUTURE non supportata; applicata solo alla singola data.');const ridStamp=stamp(rid),old=overrides.get(ridStamp);if(!old||Number(first(x,'SEQUENCE')?.value||0)>=Number(first(old,'SEQUENCE')?.value||0))overrides.set(ridStamp,x);}
    if(e&&first(e,'STATUS')?.value.toUpperCase()!=='CANCELLED'){
     const start=date(first(e,'DTSTART'));if(!start)continue;stamp(start);let list=[start.wall];
     if(e.RRULE){try{if(e.RRULE.length>1)throw Error('Piu\u00f9 RRULE nello stesso evento non supportate.');list=occurrences(start,rule(first(e,'RRULE').value),to,from,warnings);}catch(err){warnings.push(text(first(e,'SUMMARY')?.value||'Evento')+': '+err.message+' Mostro soltanto la prima data e le RDATE esplicite.');}}
     list=list.map(wall=>({...start,wall}));
     for(const p of e.RDATE||[]){for(const value of p.value.split(',')){if(value.includes('/')){warnings.push('RDATE di tipo PERIOD non supportata.');continue;}const rd=date({...p,value});if(rd.allDay!==start.allDay){warnings.push("RDATE con tipo diverso da DTSTART: ignorata.");continue;}list.push(rd);}}
     const exclusions=new Set();for(const p of e.EXDATE||[])for(const value of p.value.split(',')){const ex=date({...p,value});exclusions.add(stamp(ex));}
     const unique=new Map(list.map(dt=>[stamp(dt),dt]));for(const [ts,dt]of unique){if(exclusions.has(ts)||overrides.has(ts))continue;render(e,dt.wall,start,uid,!!e.RRULE||!!e.RDATE,dt);}
    }
    for(const x of overrides.values()){if(first(e||{},'STATUS')?.value.toUpperCase()==='CANCELLED')continue;if(first(x,'STATUS')?.value.toUpperCase()==='CANCELLED')continue;const dt=date(first(x,'DTSTART'));if(dt){const effective={...(e||{}),...x};if(!x.DTEND&&!x.DURATION){delete effective.DTEND;const originalStart=date(first(e||{},'DTSTART')),originalEnd=date(first(e||{},'DTEND'));if(originalStart&&originalEnd)effective.DURATION=[{value:'PT'+Math.max(0,Math.round((stamp(originalEnd)-stamp(originalStart))/1000))+'S',params:{}}];}render(effective,dt.wall,dt,uid,true);}}
   }catch(err){warnings.push(source.name+' / '+text(first(e||g.exceptions[0]||{},'SUMMARY')?.value||'Evento')+': '+err.message);}
  }
 }
 return{events:output.sort((a,b)=>a.start-b.start||a.title.localeCompare(b.title)),warnings:[...new Set(warnings)].slice(0,20)};
}
function cleanSources(input){if(!Array.isArray(input)||input.length>8)throw Error('Puoi conservare al massimo otto calendari.');const ids=new Set();return input.map((s,i)=>{if(!s||typeof s.ics!=='string'||typeof s.id!=='string'||!/^cal-[a-z0-9-]+$/.test(s.id)||ids.has(s.id))throw Error('Calendario salvato non valido.');ids.add(s.id);parse(s.ics);let url='';if(s.url){const u=new URL(s.url);if(u.protocol!=='https:'||u.username||u.password)throw Error('Il calendario condiviso richiede un URL HTTPS senza credenziali.');url=u.href;}return{id:s.id,name:String(s.name||'Calendario '+(i+1)).slice(0,80),ics:s.ics,url,enabled:s.enabled!==false,color:Number.isInteger(s.color)?Math.max(0,Math.min(7,s.color)):i%8,updatedAt:Number.isFinite(s.updatedAt)?s.updatedAt:Date.now()};});}
root.IstanteCalendarCore={parse,expand,date,stamp,inZone,rule,cleanSources};if(typeof module!=='undefined')module.exports=root.IstanteCalendarCore;
})(typeof self==='undefined'?globalThis:self);
