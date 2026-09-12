<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '../../stores/calendar.store'
const calendar=useCalendarStore()
const future=computed(()=>calendar.sortedEvents.filter(e=>+new Date(e.end||e.start)>=Date.now()).slice(0,100))
function day(e:string){return new Date(e).toLocaleDateString('it-IT',{weekday:'short',day:'numeric',month:'long'})}
function time(e:string,all:boolean){return all?'Tutto il giorno':new Date(e).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}
</script>
<template><div class="agenda-list"><article v-for="e in future" :key="e.id"><div class="agenda-date"><b>{{day(e.start)}}</b><span>{{time(e.start,e.allDay)}}</span></div><div><h3>{{e.title}}</h3><p v-if="e.location">{{e.location}}</p></div></article><div v-if="!future.length" class="empty">Nessun evento in agenda.</div></div></template>
<style scoped>
.agenda-list{display:grid;max-width:1080px;margin:0 auto}.agenda-list article{display:grid;grid-template-columns:minmax(125px,185px) 1fr;gap:22px;padding:16px 4px;border-bottom:1px solid var(--line)}.agenda-date{display:grid;align-content:start;gap:3px}.agenda-date b{text-transform:capitalize;font-size:10px;font-weight:600}.agenda-date span{color:var(--muted);font-size:9px}h3{margin:0;font-family:var(--serif);font-size:18px;font-weight:400;line-height:1.35}p{margin:4px 0 0;color:var(--muted);font-size:9.5px}.empty{padding:48px 0;text-align:center;color:var(--muted);font-family:var(--serif);font-size:19px}@media(max-width:600px){.agenda-list article{grid-template-columns:1fr;padding:14px 2px;gap:6px}.agenda-date{display:flex;justify-content:space-between;align-items:center}}
</style>
