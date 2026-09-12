<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '../../stores/calendar.store'
const calendar=useCalendarStore()
const list=computed(()=>calendar.sortedEvents.filter(e=>new Date(e.start).toDateString()===calendar.cursor.toDateString()))
</script>
<template><div class="day-list"><div v-if="!list.length" class="empty">Nessun evento per questo giorno.</div><article v-for="e in list" :key="e.id"><div class="eyebrow">{{e.allDay?'Tutto il giorno':new Date(e.start).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}}</div><h3>{{e.title}}</h3><p v-if="e.location">{{e.location}}</p><p v-if="e.description" class="description">{{e.description}}</p></article></div></template>
<style scoped>
.day-list{display:grid;max-width:900px;margin:auto}.day-list article{padding:17px 3px;border-bottom:1px solid var(--line)}.eyebrow{color:var(--accent);font-size:8px;letter-spacing:.14em;text-transform:uppercase}.day-list h3{font:400 20px/1.35 var(--serif);margin:5px 0}.day-list p{margin:3px 0;color:var(--muted);font-size:10px;line-height:1.5}.description{max-width:720px}.empty{padding:48px 0;text-align:center;color:var(--muted);font-family:var(--serif);font-size:19px}
</style>
