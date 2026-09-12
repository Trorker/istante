<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '../../stores/calendar.store'
const calendar=useCalendarStore()
const months=computed(()=>Array.from({length:12},(_,m)=>new Date(calendar.cursor.getFullYear(),m,1)))
function count(m:Date){return calendar.events.filter(e=>{const d=new Date(e.start);return d.getFullYear()===m.getFullYear()&&d.getMonth()===m.getMonth()}).length}
function open(m:Date){calendar.cursor=m;calendar.view='month'}
</script>
<template><div class="year-grid"><button v-for="m in months" :key="m.getMonth()" @click="open(m)"><span>{{m.toLocaleDateString('it-IT',{month:'long'})}}</span><div><b>{{count(m)}}</b><small>eventi</small></div></button></div></template>
<style scoped>
.year-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:13px;overflow:hidden}.year-grid button{min-height:145px;border:0;background:var(--bg);color:var(--ink);padding:15px;text-align:left;display:grid;align-content:space-between;text-transform:capitalize}.year-grid button:hover{background:var(--accent-soft)}.year-grid>button>span{font-family:var(--serif);font-size:17px}.year-grid div{display:flex;align-items:baseline;gap:7px}.year-grid b{font-size:24px;font-weight:300;color:var(--accent);font-variant-numeric:tabular-nums}.year-grid small{color:var(--muted);font-size:8px}@media(max-width:850px){.year-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:600px){.year-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.year-grid button{min-height:102px;padding:12px}.year-grid>button>span{font-size:15px}}
</style>
