<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '../../stores/calendar.store'
const calendar=useCalendarStore()
const days=computed(()=>{const d=new Date(calendar.cursor),dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow);return Array.from({length:7},(_,i)=>{const x=new Date(d);x.setDate(d.getDate()+i);return x})})
function events(d:Date){return calendar.sortedEvents.filter(e=>new Date(e.start).toDateString()===d.toDateString())}
</script>
<template><div class="week-grid"><section v-for="d in days" :key="d.toISOString()"><header><b>{{d.toLocaleDateString('it-IT',{weekday:'short'})}}</b><span>{{d.getDate()}}</span></header><article v-for="e in events(d)" :key="e.id"><small>{{e.allDay?'giorno':new Date(e.start).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}}</small><b>{{e.title}}</b></article></section></div></template>
<style scoped>
.week-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:13px;overflow:hidden}.week-grid>section{min-height:390px;background:var(--bg);padding:10px 8px}.week-grid header{display:flex;justify-content:space-between;text-transform:capitalize;color:var(--muted);margin-bottom:10px;font-size:9px}.week-grid header b{font-weight:600}.week-grid article{display:grid;gap:2px;padding:7px;border-radius:7px;background:var(--accent-soft);margin-bottom:5px}.week-grid article small{color:var(--muted);font-size:8px}.week-grid article b{font-family:var(--serif);font-size:11px;font-weight:400;line-height:1.25}@media(max-width:850px){.week-grid{grid-template-columns:1fr;border-radius:10px}.week-grid>section{min-height:auto;border-bottom:1px solid var(--line)}}
</style>
