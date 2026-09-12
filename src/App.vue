<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useSettingsStore } from './stores/settings.store'
import { usePhrasesStore } from './stores/phrases.store'
import { useRadioStore } from './stores/radio.store'
import { useCalendarStore } from './stores/calendar.store'
import { useRadioSchedulesStore } from './stores/radioSchedules.store'
import GlobalOverlays from './components/overlays/GlobalOverlays.vue'
import { useDeviceProfile } from './composables/useDeviceProfile'
const settings=useSettingsStore(),phrases=usePhrasesStore(),radio=useRadioStore(),calendar=useCalendarStore(),radioSchedules=useRadioSchedulesStore();const{profile}=useDeviceProfile();const classes=computed(()=>[`family-${profile.value.family}`,`orientation-${profile.value.orientation}`,`shape-${profile.value.shape}`])
function applyTheme(theme:string){const resolved=theme==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):theme;document.documentElement.dataset.theme=resolved}watch(()=>settings.data.theme,applyTheme,{immediate:true});onMounted(async()=>{await Promise.all([settings.init(),phrases.init(),radio.init(),calendar.init()]);await radioSchedules.init();applyTheme(settings.data.theme)})
</script>
<template><main class="app-root" :class="classes"><RouterView/><GlobalOverlays/></main></template>
