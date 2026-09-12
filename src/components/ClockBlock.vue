<script setup lang="ts">
import { computed } from 'vue'
import { useClock } from '../composables/useClock'
import { useSettingsStore } from '../stores/settings.store'
const s=useSettingsStore(),c=useClock(()=>s.data.clock24,()=>s.data.showSeconds)
const timeParts=computed(()=>{const raw=c.time.value.replace(/\s/g,'');const ampm=raw.match(/[AP]M/i)?.[0]||'';const clean=raw.replace(/[AP]M/i,'');const bits=clean.split(':');return{main:`${bits[0]||'00'}:${bits[1]||'00'}`,seconds:bits[2]||'',ampm}})
</script>
<template><section class="clock-block"><div class="greeting">{{c.greeting}}</div><div class="date-label">{{c.date}}</div><div class="clock-line"><span class="clock">{{timeParts.main}}</span><span v-if="timeParts.seconds" class="clock-seconds">{{timeParts.seconds}}</span><span v-if="timeParts.ampm" class="clock-ampm">{{timeParts.ampm}}</span></div></section></template>
<style scoped>
.clock-block{text-align:center;min-width:0}.greeting{font:italic 14px/1.2 var(--serif);color:var(--accent);margin-bottom:10px}.date-label{color:var(--muted);font:500 11px/1.2 var(--sans);letter-spacing:.19em;text-transform:uppercase;margin-bottom:11px}.clock-line{display:flex;justify-content:center;align-items:baseline;gap:13px;min-width:0}.clock{font:250 clamp(110px,12.1vw,183px)/1.06 var(--sans);letter-spacing:-.065em;font-variant-numeric:tabular-nums;font-feature-settings:'tnum';display:block;margin-left:-.025em;white-space:nowrap}.clock-seconds,.clock-ampm{font:400 23px/1 var(--sans);letter-spacing:-.05em;color:var(--muted);font-variant-numeric:tabular-nums;min-width:28px}.clock-ampm{font-size:12px;letter-spacing:.08em;text-transform:uppercase}@media(max-width:740px){.greeting{font-size:12px;margin-bottom:7px}.date-label{font-size:9.5px;margin-bottom:6px}.clock{font-size:clamp(70px,24vw,116px);line-height:.98}.clock-seconds{font-size:16px}.clock-line{gap:8px}}@media(max-width:740px) and (orientation:landscape){.greeting{display:none}.date-label{font-size:8.5px}.clock{font-size:clamp(62px,19vh,100px)}}
</style>
