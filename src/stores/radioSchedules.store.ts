import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { RadioSchedule } from '../types/models'
import { dbDelete, dbGetAll, dbPut } from '../services/storage/db'
import { useRadioStore } from './radio.store'
export const useRadioSchedulesStore=defineStore('radioSchedules',()=>{
  const schedules=ref<RadioSchedule[]>([]),now=ref(new Date());let interval=0,lastTriggered=''
  async function init(){schedules.value=await dbGetAll<RadioSchedule>('radioSchedules');startMonitor()}
  function startMonitor(){if(interval)return;interval=window.setInterval(()=>{now.value=new Date();void evaluate()},30000);void evaluate()}
  function mins(t:string){const [h,m]=t.split(':').map(Number);return h*60+m}
  function activeOn(s:RadioSchedule,d:Date){return s.enabled&&s.days.includes(d.getDay())}
  async function evaluate(){const d=new Date(),m=d.getHours()*60+d.getMinutes(),radio=useRadioStore();for(const s of schedules.value){if(!activeOn(s,d))continue;const a=mins(s.start),b=mins(s.end);const inside=b>=a?m>=a&&m<b:m>=a||m<b;if(inside){const key=`${s.id}:${d.toDateString()}:${d.getHours()}:${d.getMinutes()}`;if(key!==lastTriggered&&radio.currentId!==s.stationId){const station=radio.stations.find(x=>x.id===s.stationId);if(station?.streamUrl){lastTriggered=key;void radio.play(station)}}}}}
  const next=computed(()=>{void now.value;const base=new Date();let best:{date:Date;s:RadioSchedule}|null=null;for(let add=0;add<8;add++){const d=new Date(base);d.setDate(base.getDate()+add);for(const s of schedules.value){if(!s.enabled||!s.days.includes(d.getDay()))continue;const [h,m]=s.start.split(':').map(Number);const when=new Date(d);when.setHours(h,m,0,0);if(+when<=+base)continue;if(!best||+when<+best.date)best={date:when,s}}}return best})
  async function add(input:Omit<RadioSchedule,'id'>){const s:RadioSchedule={id:crypto.randomUUID(),...input};schedules.value.push(s);await dbPut('radioSchedules',s)}
  async function remove(id:string){schedules.value=schedules.value.filter(s=>s.id!==id);await dbDelete('radioSchedules',id)}
  async function toggle(s:RadioSchedule){s.enabled=!s.enabled;await dbPut('radioSchedules',{...s})}
  return{schedules,next,init,add,remove,toggle,evaluate}
})
