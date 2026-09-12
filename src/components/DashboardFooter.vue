<script setup lang="ts">
import AppToolbar from './AppToolbar.vue'
import IstanteIcon from './IstanteIcon.vue'
import { usePhrasesStore } from '../stores/phrases.store'
import { useUiStore } from '../stores/ui.store'
const phrases=usePhrasesStore(),ui=useUiStore()
</script>
<template><footer class="bottom-bar chrome"><button class="collection-summary" type="button" title="La tua biblioteca" @click="ui.phrasesOpen=true"><IstanteIcon name="collection" :size="17"/><span>La raccolta</span><b>{{phrases.phrases?.length||1000}}</b></button><AppToolbar/><div class="day-mode"><IstanteIcon name="sun" :size="17"/><span>Mattina &amp; sera</span></div></footer></template>
<style scoped>
.bottom-bar{display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center;min-height:48px;width:100%}.collection-summary{justify-self:start;display:flex;align-items:center;gap:10px;min-height:44px;padding:0;border:0;background:transparent;color:var(--muted);font:400 11px/1 var(--sans)}.collection-summary b{font-weight:400;color:var(--faint);font-variant-numeric:tabular-nums}.day-mode{justify-self:end;display:flex;align-items:center;gap:9px;font-size:11px;color:var(--muted)}.day-mode :deep(svg){color:var(--accent)}@media(max-width:740px){.bottom-bar{grid-template-columns:1fr;justify-items:center;gap:4px}.collection-summary,.day-mode{display:none}}
</style>
