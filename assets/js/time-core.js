/* Pure time calculations: local civil schedule, absolute timer deadline. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstanteTime=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const pad=n=>String(n).padStart(2,'0');
 function minute(value){if(typeof value!=='string'||!/^\d{2}:\d{2}$/.test(value))return null;const [h,m]=value.split(':').map(Number);return h<24&&m<60?h*60+m:null;}
 function days(value){return [...new Set(String(value).split(',').filter(x=>/^[0-6]$/.test(x)).map(Number))].sort();}
 function dayKey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
 function rows(settings){
  if(Array.isArray(settings.radioSchedules))return settings.radioSchedules;
  return [{id:'legacy',enabled:true,start:settings.radioStart,stop:settings.radioStop,days:settings.radioDays}];
 }
 function intervals(now,settings){
  if(!settings.radioEnabled||!settings.radioScheduleEnabled)return [];
  const result=[];
  for(const row of rows(settings)){
   const start=minute(row.start),end=minute(row.stop),validDays=days(row.days);
   if(row.enabled===false||start===null||end===null||start===end||!validDays.length)continue;
   for(let offset=-8;offset<=8;offset++){
    const base=new Date(now.getFullYear(),now.getMonth(),now.getDate()+offset);
    if(!validDays.includes(base.getDay()))continue;
    const from=new Date(base.getFullYear(),base.getMonth(),base.getDate(),Math.floor(start/60),start%60);
    const to=new Date(base.getFullYear(),base.getMonth(),base.getDate()+(end<start?1:0),Math.floor(end/60),end%60);
    result.push({start:+from,end:+to,key:row.id+':'+dayKey(base),names:[row.name||'Fascia']});
   }
  }
  // Treat overlapping and touching windows as a single continuous session.
  const merged=[];
  for(const item of result.sort((a,b)=>a.start-b.start||a.end-b.end)){
   const last=merged[merged.length-1];
   if(last&&item.start<=last.end){last.end=Math.max(last.end,item.end);last.names=[...new Set([...last.names,...item.names])];}
   else merged.push({...item});
  }
  return merged;
 }
 function windowAt(now,settings){return intervals(now,settings).find(r=>+now>=r.start&&+now<r.end)||null;}
 function nextStart(now,settings){return intervals(now,settings).find(r=>r.start>+now)?.start||null;}
 function formatTime(value,format='24',zone){
  const options={hour:'2-digit',minute:'2-digit',hourCycle:format==='12'?'h12':'h23'};
  if(zone)options.timeZone=zone;
  const date=typeof value==='string'&&minute(value)!==null?new Date(2000,0,1,...value.split(':').map(Number)):new Date(value);
  if(!Number.isFinite(+date))return '\u2014';
  return new Intl.DateTimeFormat(format==='12'?'en-GB':'it-IT',options).format(date).replace(/am/i,'AM').replace(/pm/i,'PM');
 }
 function remaining(timer,now=Date.now()){if(timer.state==='running')return Math.max(0,timer.deadline-now);return Math.max(0,timer.remaining||0);}
 function timerOptions(raw={}){raw=raw&&typeof raw==='object'?raw:{};return{timerDuring:['silent','radio','ambient'].includes(raw.timerDuring)?raw.timerDuring:'silent',timerAction:['sound','radio','silent'].includes(raw.timerAction)?raw.timerAction:'sound',timerSound:['chime','bell','pulse'].includes(raw.timerSound)?raw.timerSound:'chime',timerVolume:Number.isFinite(Number(raw.timerVolume))?Math.max(0,Math.min(100,Number(raw.timerVolume))):65};}
 function cleanTimer(raw){
  const base={state:'idle',duration:1500000,remaining:1500000,deadline:0,id:''};
  if(!raw||typeof raw!=='object'||!['idle','running','paused','done'].includes(raw.state))return base;
  const duration=Number(raw.duration),deadline=Number(raw.deadline),left=Number(raw.remaining);
  if(!Number.isFinite(duration)||duration<1000||duration>86400000)return base;
  if(raw.state==='running'&&(!Number.isFinite(deadline)||deadline<=0||deadline>Date.now()+86400000))return base;
  return{options:timerOptions(raw.options),state:raw.state,duration,remaining:Math.min(duration,Math.max(0,Number.isFinite(left)?left:duration)),deadline:Number.isFinite(deadline)?deadline:0,id:typeof raw.id==='string'?raw.id:''};
 }
 function display(ms){const seconds=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(seconds/3600),m=Math.floor(seconds/60)%60,s=seconds%60;return(h?pad(h)+':':'')+pad(m)+':'+pad(s);}
 return{minute,days,dayKey,rows,intervals,windowAt,nextStart,formatTime,remaining,cleanTimer,timerOptions,display};
});
