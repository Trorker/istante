<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUiStore } from '../../stores/ui.store'
import { usePhrasesStore } from '../../stores/phrases.store'
import IstanteIcon from '../IstanteIcon.vue'

const ui = useUiStore()
const phrases = usePhrasesStore()
const query = ref('')
const list = computed(() => phrases.phrases.filter(item =>
  (!ui.phraseFavoritesOnly || item.favorite) &&
  (!query.value || item.text.toLowerCase().includes(query.value.toLowerCase()))
).slice(0, 250))

function choose(id: string) {
  phrases.select(id)
  ui.phrasesOpen = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="panel-fade">
      <div v-if="ui.phrasesOpen" class="library-backdrop" @click.self="ui.phrasesOpen=false">
        <section class="library-panel" role="dialog" aria-modal="true" aria-labelledby="library-title">
          <header class="panel-head">
            <div>
              <p class="section-label">Parole da tenere con te</p>
              <h2 id="library-title">La tua biblioteca.</h2>
              <p class="library-subtitle">1000 piccoli promemoria.</p>
            </div>
            <button class="icon-button close-button" aria-label="Chiudi raccolta" @click="ui.phrasesOpen=false"><IstanteIcon name="close" /></button>
          </header>

          <div class="library-tools">
            <div class="library-current"><IstanteIcon name="collection" :size="17"/><span><small>Raccolta attiva</small><strong>Pensieri di Istante</strong></span></div>
            <div class="library-search-row">
              <label class="search-field"><IstanteIcon name="collection" :size="15"/><input v-model="query" type="search" placeholder="Cerca una parola, un pensiero..." /></label>
            </div>
            <div class="library-tabs">
              <button :class="{active:!ui.phraseFavoritesOnly}" @click="ui.phraseFavoritesOnly=false">Tutte <span>{{ phrases.phrases.length }}</span></button>
              <button :class="{active:ui.phraseFavoritesOnly}" @click="ui.phraseFavoritesOnly=true"><IstanteIcon name="heart" :size="13"/>Preferite <span>{{ phrases.phrases.filter(x=>x.favorite).length }}</span></button>
            </div>
          </div>

          <div class="library-list-wrap">
            <article v-for="(item,index) in list" :key="item.id" class="phrase-row" :class="{'is-current':item.id===phrases.current?.id}">
              <span class="phrase-number">{{ String(index+1).padStart(3,'0') }}</span>
              <button class="phrase-content" @click="choose(item.id)">{{ item.text }}</button>
              <div class="phrase-actions"><button class="icon-button" :aria-label="item.favorite?'Togli dai preferiti':'Aggiungi ai preferiti'" @click="phrases.toggleFavorite(item)"><IstanteIcon name="heart" :filled="item.favorite" /></button></div>
            </article>
            <div v-if="!list.length" class="empty-state">Nessuna frase trovata.</div>
          </div>

          <footer class="library-footer"><span>{{ list.length }} pensieri</span><span class="local-note">Solo sul tuo dispositivo</span></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.library-backdrop{position:fixed;inset:0;z-index:120;background:color-mix(in srgb,#000 34%,transparent);display:grid;place-items:center;padding:14px}.library-panel{width:min(980px,calc(100vw - 28px));height:min(820px,calc(100dvh - 28px));background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;padding:24px 28px 17px;border-bottom:1px solid var(--line)}.section-label{margin:0 0 5px;color:var(--accent);font-size:9px;font-weight:700;letter-spacing:.17em;text-transform:uppercase}.panel-head h2{margin:0;font-family:var(--serif);font-size:30px;font-weight:400}.library-subtitle{margin:5px 0 0;color:var(--muted);font-size:12px;line-height:1.45}.icon-button{width:40px;height:40px;border:0;border-radius:50%;background:transparent;color:var(--muted);display:grid;place-items:center;cursor:pointer}.icon-button:hover{background:var(--accent-soft);color:var(--ink)}.library-tools{padding:12px 28px 10px;border-bottom:1px solid var(--line);display:grid;grid-template-areas:'current tabs' 'search search';grid-template-columns:1fr auto;gap:12px}.library-current{grid-area:current;display:flex;align-items:center;gap:10px;color:var(--accent);min-width:0}.library-current>span{display:grid;gap:2px;min-width:0}.library-current small{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}.library-current strong{font-size:12px;font-weight:500;color:var(--ink)}.library-search-row{grid-area:search}.search-field{display:flex;align-items:center;gap:9px;border:1px solid var(--line);border-radius:10px;background:var(--surface-2);padding:0 12px;max-width:650px;margin:auto}.search-field svg{color:var(--faint)}.search-field input{width:100%;height:40px;border:0;background:transparent;color:var(--ink);font:inherit;font-size:11px;outline:none}.search-field input::placeholder{color:var(--faint)}.library-tabs{grid-area:tabs;display:flex;align-items:end;gap:18px}.library-tabs button{border:0;background:transparent;color:var(--muted);padding:8px 0 9px;display:flex;align-items:center;gap:6px;font-size:10px;border-bottom:1px solid transparent;cursor:pointer}.library-tabs button.active{color:var(--ink);border-bottom-color:var(--accent)}.library-tabs span{color:var(--faint);font-variant-numeric:tabular-nums}.library-list-wrap{flex:1;overflow:auto;padding:0 28px 18px}.phrase-row{display:grid;grid-template-columns:34px minmax(0,1fr) 88px;gap:15px;align-items:start;padding:16px 2px;border-bottom:1px solid var(--line)}.phrase-row.is-current .phrase-content{color:var(--accent)}.phrase-number{font-size:10px;color:var(--faint);margin-top:6px}.phrase-content{border:0;background:transparent;color:var(--ink);font-family:var(--serif);font-size:20px;line-height:1.42;text-align:left;padding:0;cursor:pointer}.phrase-actions{display:flex;justify-content:flex-end}.empty-state{font-family:var(--serif);font-size:23px;text-align:center;padding:55px 14px;line-height:1.5;color:var(--muted)}.library-footer{display:flex;align-items:center;gap:20px;padding:11px 28px;min-height:54px;border-top:1px solid var(--line);color:var(--muted);font-size:10px}.local-note{margin-left:auto;color:var(--faint);font-size:9px}.panel-fade-enter-active,.panel-fade-leave-active{transition:opacity .18s ease}.panel-fade-enter-from,.panel-fade-leave-to{opacity:0}
@media(max-width:650px){.library-backdrop{padding:0;place-items:end stretch}.library-panel{width:100%;height:min(88dvh,760px);border-radius:18px 18px 0 0;border-left:0;border-right:0;border-bottom:0}.panel-head{padding:20px 18px 15px}.panel-head h2{font-size:27px}.library-tools{padding:10px 18px;grid-template-areas:'current' 'search' 'tabs';grid-template-columns:1fr}.library-tabs{justify-content:flex-end}.library-list-wrap{padding:0 18px 16px}.phrase-row{grid-template-columns:28px minmax(0,1fr) 42px;gap:10px;padding:14px 0}.phrase-content{font-size:18px}.library-footer{padding:10px 18px calc(10px + env(safe-area-inset-bottom))}}
</style>
