<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import TimerDialog from './TimerDialog.vue'
import RadioDrawer from './RadioDrawer.vue'
import PhraseDrawer from './PhraseDrawer.vue'
import { useUiStore } from '../../stores/ui.store'

const ui = useUiStore()
const openLibrary = () => { ui.phrasesOpen = true }
const openTimer = () => { ui.timerOpen = true }
const openRadio = () => { ui.radioOpen = true }

onMounted(() => {
  document.addEventListener('istante:open-library', openLibrary)
  document.addEventListener('istante:open-timer', openTimer)
  document.addEventListener('istante:open-radio', openRadio)
})
onBeforeUnmount(() => {
  document.removeEventListener('istante:open-library', openLibrary)
  document.removeEventListener('istante:open-timer', openTimer)
  document.removeEventListener('istante:open-radio', openRadio)
})
</script>
<template><TimerDialog/><RadioDrawer/><PhraseDrawer/></template>
