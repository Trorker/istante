<script setup lang="ts">
import { computed,onBeforeUnmount,onMounted,watch } from 'vue'
import { RouterView } from 'vue-router'
import { useSettingsStore } from './stores/settings.store'
import { usePhrasesStore } from './stores/phrases.store'
import { useRadioStore } from './stores/radio.store'
import { useCalendarStore } from './stores/calendar.store'
import { useRadioSchedulesStore } from './stores/radioSchedules.store'
import GlobalOverlays from './components/overlays/GlobalOverlays.vue'
import { useDeviceProfile } from './composables/useDeviceProfile'
const settings=useSettingsStore(),phrases=usePhrasesStore(),radio=useRadioStore(),calendar=useCalendarStore(),radioSchedules=useRadioSchedulesStore();const{profile}=useDeviceProfile();const classes=computed(()=>[`family-${profile.value.family}`,`orientation-${profile.value.orientation}`,`shape-${profile.value.shape}`]);let themeTimer=0
function resolvedTheme(){if(settings.data.theme!=='auto')return settings.data.theme;if(settings.data.followSun){const h=new Date().getHours();return h>=7&&h<19?'light':'dark'}return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}
function applyTheme(){document.documentElement.dataset.theme=resolvedTheme();document.documentElement.style.setProperty('--ui-scale',String(settings.data.uiScale||1))}
watch(()=>[settings.data.theme,settings.data.followSun,settings.data.uiScale],applyTheme,{deep:true,immediate:true});onMounted(async()=>{await Promise.all([settings.init(),phrases.init(),radio.init(),calendar.init()]);await radioSchedules.init();applyTheme();themeTimer=window.setInterval(applyTheme,60000)});onBeforeUnmount(()=>clearInterval(themeTimer))
</script>
<template><main class="app-root" :class="classes"><RouterView/><GlobalOverlays/></main></template>
