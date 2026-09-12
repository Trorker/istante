<script setup lang="ts">
import { computed,onBeforeUnmount,onMounted,ref } from 'vue'
import { useSettingsStore } from '../stores/settings.store'
import { moonPhase,solarTimes } from '../services/astronomy'
const s=useSettingsStore(),now=ref(new Date());let id=0
onMounted(()=>id=window.setInterval(()=>now.value=new Date(),30000));onBeforeUnmount(()=>clearInterval(id))
const astro=computed(()=>{const n=now.value,lat=s.data.latitude,lon=s.data.longitude;let rise=new Date(n),set=new Date(n);if(lat!=null&&lon!=null){const t=solarTimes(n,lat,lon);rise=t.sunrise;set=t.sunset}else{rise.setHours(6,30,0,0);set.setHours(19,30,0,0)}const isDay=+n>=+rise&&+n<+set;let p:number;if(isDay)p=(+n-+rise)/Math.max(1,+set-+rise);else{const nightStart=+n<+rise?+set-86400000:+set;const nextRise=+n<+rise?+rise:+rise+86400000;p=(+n-nightStart)/Math.max(1,nextRise-nightStart)}return{isDay,p:Math.max(0,Math.min(1,p)),phase:moonPhase(n)}})
const style=computed(()=>({left:`${8+84*astro.value.p}%`,top:`${58-42*Math.sin(Math.PI*astro.value.p)}%`}))
</script>
<template><div class="astronomy" aria-hidden="true"><div v-if="!astro.isDay" class="stars"><i v-for="n in 24" :key="n" :style="{left:`${(n*37)%96}%`,top:`${(n*53)%72}%`,opacity:String(.18+(n%5)*.08)}"/></div><div class="orb" :class="astro.isDay?'sun':'moon'" :style="style"><span v-if="!astro.isDay" :style="{'--phase':astro.phase}"/></div></div></template>
<style scoped>
.astronomy{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}.orb{position:absolute;transform:translate(-50%,-50%);width:clamp(52px,4.2vw,82px);aspect-ratio:1;border-radius:50%;opacity:.78;transition:left 20s linear,top 20s linear}.sun{background:radial-gradient(circle at 42% 42%,#fff7d0 0 12%,#f0d89e 42%,rgba(227,190,112,.24) 68%,rgba(227,190,112,0) 74%);box-shadow:0 0 55px rgba(228,196,126,.16)}.moon{width:clamp(48px,3.8vw,76px);background:radial-gradient(circle at 35% 32%,#eae9dd,#bfc1b8 64%,#8c918c);box-shadow:0 0 42px rgba(211,222,214,.13);overflow:hidden}.moon span{position:absolute;width:100%;height:100%;border-radius:50%;background:rgba(16,20,18,.5);transform:translateX(calc((var(--phase) - .5) * 95%))}.stars i{position:absolute;width:1.5px;height:1.5px;background:var(--ink);border-radius:50%}@media(max-width:740px){.orb{width:50px;opacity:.55}.moon{width:46px}}:global(.family-display) .orb{width:100px}:global(.family-display) .moon{width:92px}
</style>
