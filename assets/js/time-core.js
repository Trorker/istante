/* Pure time calculations: local civil schedule, absolute timer deadline. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IstanteTime=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const pad=n=>String(n).padStart(2,'0');
 function minute(value){if(typeof value!=='string'||!/^\d{2}:\d{2}$/.test(value))return null;const [h,m]=value.split(':').map(Number);return h<24&&m<60?h*60+m:null;}
 function days(value){return [...new Set(String(value).split(',').filter(x=>/^[0-6]$/.test(x)).map(Number))].sort();}
 function dayKey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
 function windowAt(now,settings){
  if(!settings.radioEnabled||!settings.radioScheduleEnabled)return null;
  const start=minute(settings.radioStart),end=minute(settings.radioStop),validDays=days(settings.radioDays);
  if(start===null||end===null||start===end||!validDays.length)return null;
  // Construct local dates, not 24-hour millisecond offsets: follows DST changes.
  for(const offset of [0,-1]){
   const base=new Date(now.getFullYear(),now.getMonth(),now.getDate()+offset);
   if(!validDays.includes(base.getDay()))continue;
   const from=new Date(base.getFullYear(),base.getMonth(),base.getDate(),Math.floor(start/60),start%60);
   const to=new Date(base.getFullYear(),base.getMonth(),base.getDate()+(end<=start?1:0),Math.floor(end/60),end%60);
   if(+now>=+from&&+now<+to)return {key:dayKey(base)+':'+settings.radioStart+'-'+settings.radioStop,start:+from,end:+to};
  }
  return null;
 }
 function nextStart(now,settings){
  if(!settings.radioEnabled||!settings.radioScheduleEnabled)return null;
  const start=minute(settings.radioStart),end=minute(settings.radioStop),validDays=days(settings.radioDays);
  if(start===null||end===null||start===end||!validDays.length)return null;
  for(let offset=0;offset<=7;offset++){const candidate=new Date(now.getFullYear(),now.getMonth(),now.getDate()+offset,Math.floor(start/60),start%60);if(+candidate>+now&&validDays.includes(candidate.getDay()))return +candidate;}
  return null;
 }
 function remaining(timer,now=Date.now()){if(timer.state==='running')return Math.max(0,timer.deadline-now);return Math.max(0,timer.remaining||0);}
 function cleanTimer(raw){
  const base={state:'idle',duration:1500000,remaining:1500000,deadline:0,id:''};
  if(!raw||typeof raw!=='object'||!['idle','running','paused','done'].includes(raw.state))return base;
  const duration=Number(raw.duration),deadline=Number(raw.deadline),left=Number(raw.remaining);
  if(!Number.isFinite(duration)||duration<1000||duration>86400000)return base;
  if(raw.state==='running'&&(!Number.isFinite(deadline)||deadline<=0||deadline>Date.now()+86400000))return base;
  return{state:raw.state,duration,remaining:Math.min(duration,Math.max(0,Number.isFinite(left)?left:duration)),deadline:Number.isFinite(deadline)?deadline:0,id:typeof raw.id==='string'?raw.id:''};
 }
 function display(ms){const seconds=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(seconds/3600),m=Math.floor(seconds/60)%60,s=seconds%60;return(h?pad(h)+':':'')+pad(m)+':'+pad(s);}
 return{minute,days,dayKey,windowAt,nextStart,remaining,cleanTimer,display};
});
