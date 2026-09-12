<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '../../stores/calendar.store'
const calendar=useCalendarStore()
const days=computed(()=>{const d=calendar.cursor,y=d.getFullYear(),m=d.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,count=new Date(y,m+1,0).getDate(),out:Array<{key:string,date?:Date}>=[];for(let i=0;i<first;i++)out.push({key:`p${i}`});for(let i=1;i<=count;i++)out.push({key:`d${i}`,date:new Date(y,m,i)});return out})
function eventsFor(d?:Date){if(!d)return[];return calendar.sortedEvents.filter(e=>{const x=new Date(e.start);return x.getFullYear()===d.getFullYear()&&x.getMonth()===d.getMonth()&&x.getDate()===d.getDate()}).slice(0,3)}
</script>
<template><div class="month"><div v-for="w in ['Lun','Mar','Mer','Gio','Ven','Sab','Dom']" :key="w" class="weekday">{{w}}</div><div v-for="d in days" :key="d.key" class="day" :class="{blank:!d.date,today:d.date?.toDateString()===new Date().toDateString()}"><b v-if="d.date">{{d.date.getDate()}}</b><div v-if="d.date" class="markers"><span v-for="e in eventsFor(d.date)" :key="e.id" :title="e.title">{{e.title}}</span></div></div></div></template>
<style scoped>
.month{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:13px;overflow:hidden}.weekday{padding:10px 6px;text-align:center;font-size:8.5px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);background:var(--surface)}.day{min-height:112px;background:var(--bg);padding:8px;overflow:hidden}.day.blank{background:color-mix(in srgb,var(--surface) 40%,var(--bg))}.day b{display:grid;place-items:center;width:27px;height:27px;font-size:10px;font-weight:500;color:var(--muted);font-variant-numeric:tabular-nums}.day.today b{border-radius:50%;background:var(--accent);color:var(--bg)}.markers{display:grid;gap:4px;margin-top:6px}.markers span{font-size:9px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:5px 6px;border-radius:6px;background:var(--accent-soft);color:var(--ink)}
@media(max-width:700px){.weekday{padding:8px 1px;font-size:7px}.day{min-height:58px;padding:4px}.day b{width:23px;height:23px;font-size:9px}.markers span{font-size:0;width:5px;height:5px;border-radius:50%;padding:0;background:var(--accent);display:inline-block}.markers{display:flex;gap:3px;margin:4px 0 0 5px}}
</style>
