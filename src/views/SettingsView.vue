<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IstanteIcon from '../components/IstanteIcon.vue'
import DashboardView from './DashboardView.vue'
import { useSettingsStore } from '../stores/settings.store'
import { useCalendarStore } from '../stores/calendar.store'
import { useRadioStore } from '../stores/radio.store'
import { useRadioSchedulesStore } from '../stores/radioSchedules.store'
import { createBackup, downloadBackup, restoreBackup } from '../services/backup'
import { requestPersistentStorage } from '../services/storage/db'

const settings = useSettingsStore()
const calendar = useCalendarStore()
const radio = useRadioStore()
const schedules = useRadioSchedulesStore()
const router = useRouter()
const route = useRoute()

const requested = String(route.query.section || 'appearance')
const openSection = ref(requested === 'data' ? 'backup' : requested === 'weather' ? 'sky' : requested === 'system' ? 'screen' : requested)
const calName = ref('Personale')
const calUrl = ref('')
const persistent = ref<boolean>()
const scheduleStation = ref('')
const scheduleStart = ref('08:00')
const scheduleEnd = ref('10:00')
const scheduleDays = ref<number[]>([1, 2, 3, 4, 5])
const backupFile = ref<HTMLInputElement>()

const sections = [
  { id: 'appearance', icon: 'sun', title: 'Aspetto e schermo', subtitle: 'Tema, sfondo, grana e prestazioni' },
  { id: 'phrases', icon: 'collection', title: 'Frasi e scrittura', subtitle: 'Rotazione, ritmo e macchina da scrivere' },
  { id: 'sky', icon: 'cloud', title: 'Località e cielo', subtitle: 'Posizione, alba, tramonto e meteo' },
  { id: 'effects', icon: 'sun', title: 'Effetti ambientali', subtitle: 'Aloni, particelle, aurora e tempo' },
  { id: 'radio', icon: 'headphones', title: 'Radio e audio', subtitle: '22 stazioni, una colonna sonora' },
  { id: 'timer', icon: 'clock', title: 'Un tempo per te', subtitle: 'Timer e suono finale' },
  { id: 'chime', icon: 'volume', title: 'Rintocco consapevole', subtitle: "Una nota, allo scoccare dell'ora" },
  { id: 'goal', icon: 'heart', title: 'Il tuo traguardo', subtitle: 'Una data da aspettare' },
  { id: 'calendar', icon: 'calendar', title: 'Spazio per i tuoi giorni', subtitle: 'Calendari, prossimi impegni e ritorno' },
  { id: 'screen', icon: 'expand', title: 'Modalità screensaver', subtitle: 'Comandi e schermo acceso' },
  { id: 'backup', icon: 'arrow', title: 'Porta con te il tuo istante', subtitle: 'Backup e ripristino JSON' },
  { id: 'about', icon: 'settings', title: 'Informazioni su Istante', subtitle: 'Versione 4.0.0-alpha.2' },
] as const

function toggleSection(id: string, ev: Event) {
  const details = ev.currentTarget as HTMLDetailsElement
  if (details.open) openSection.value = id
}

async function addCalendar() {
  if (!calUrl.value.trim()) return
  await calendar.addSource(calName.value, calUrl.value)
  calUrl.value = ''
}

async function addSchedule() {
  if (!scheduleStation.value || !scheduleDays.value.length) return
  await schedules.add({
    stationId: scheduleStation.value,
    start: scheduleStart.value,
    end: scheduleEnd.value,
    days: [...scheduleDays.value],
    enabled: true,
  })
}

async function backup() {
  downloadBackup(await createBackup())
}

async function importBackup(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    await restoreBackup(JSON.parse(await file.text()))
    location.reload()
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Backup non valido')
  } finally {
    input.value = ''
  }
}

async function useLocation() {
  navigator.geolocation?.getCurrentPosition(
    position => {
      settings.data.latitude = position.coords.latitude
      settings.data.longitude = position.coords.longitude
      settings.data.weatherEnabled = true
    },
    () => {},
  )
}

async function persist() {
  persistent.value = await requestPersistentStorage()
}

const nextYear = computed(() => new Date().getFullYear() + 1)

function openDashboardOverlay(name: 'library' | 'timer') {
  router.push('/').then(() => {
    window.setTimeout(() => document.dispatchEvent(new CustomEvent(`istante:open-${name}`)), 0)
  })
}

function fullscreen() {
  void document.documentElement.requestFullscreen?.()
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-underlay" aria-hidden="true"><DashboardView /></div>
    <div class="settings-shade" aria-hidden="true" />
    <div class="settings-panel">
      <header class="panel-head">
        <div class="panel-title">
          <p class="section-label">A modo tuo</p>
          <h1>Il tuo istante.</h1>
        </div>
        <button class="icon-button close-button" aria-label="Chiudi impostazioni" @click="router.push('/')">
          <IstanteIcon name="close" :size="19" />
        </button>
      </header>

      <div class="settings-content">
        <details
          v-for="item in sections"
          :key="item.id"
          class="settings-section"
          :open="openSection === item.id"
          @toggle="toggleSection(item.id, $event)"
        >
          <summary>
            <IstanteIcon class="section-icon" :name="item.icon" :size="18" />
            <span class="section-heading">
              <strong>{{ item.title }}</strong>
              <small>{{ item.subtitle }}</small>
            </span>
            <IstanteIcon class="section-chevron" name="chevron" :size="15" />
          </summary>

          <div class="settings-section-body">
            <template v-if="item.id === 'appearance'">
              <fieldset>
                <legend>L'atmosfera</legend>
                <div class="segmented themes" aria-label="Tema">
                  <label><input v-model="settings.data.theme" type="radio" value="dark" /><span><IstanteIcon name="moon" />Notte</span></label>
                  <label><input v-model="settings.data.theme" type="radio" value="light" /><span><IstanteIcon name="sun" />Carta</span></label>
                  <label><input v-model="settings.data.theme" type="radio" value="auto" /><span><IstanteIcon name="sun" />Auto</span></label>
                </div>
                <p class="field-note">Auto segue il dispositivo. Con una località puoi anche seguire la luce della giornata.</p>
                <label class="stacked-label">Sfondo
                  <select v-model="settings.data.background">
                    <option value="gradient">Sfumatura delicata</option>
                    <option value="photo">Fotografia</option>
                  </select>
                </label>
                <label class="stacked-label">Scala interfaccia
                  <input v-model.number="settings.data.uiScale" min="0.85" max="1.25" step="0.05" type="range" />
                </label>
                <label class="toggle-row"><span>Formato 24 ore<small>L'orologio resta quello centrale di Istante.</small></span><input v-model="settings.data.clock24" role="switch" type="checkbox" /></label>
                <label class="toggle-row"><span>Mostra i secondi<small>Un dettaglio in più, quando lo vuoi.</small></span><input v-model="settings.data.showSeconds" role="switch" type="checkbox" /></label>
              </fieldset>
            </template>

            <template v-else-if="item.id === 'phrases'">
              <label class="toggle-row"><span>Macchina da scrivere<small>Lascia che il pensiero compaia con calma.</small></span><input v-model="settings.data.typewriter" role="switch" type="checkbox" /></label>
              <p class="field-note">La raccolta conserva le 1000 frasi di Istante. Preferite e selezione restano sul dispositivo.</p>
              <button class="secondary-button" type="button" @click="openDashboardOverlay('library')">
                <IstanteIcon name="collection" />Apri la tua biblioteca
              </button>
            </template>

            <template v-else-if="item.id === 'sky'">
              <label class="toggle-row"><span>Meteo sulla dashboard<small>Temperatura e condizioni, accanto ad alba e tramonto.</small></span><input v-model="settings.data.weatherEnabled" role="switch" type="checkbox" /></label>
              <label class="toggle-row"><span>Segui la luce della giornata<small>Alterna Carta e Notte in base all'ora locale.</small></span><input v-model="settings.data.followSun" role="switch" type="checkbox" /></label>
              <button class="secondary-button" type="button" @click="useLocation"><IstanteIcon name="location" />Usa posizione attuale</button>
              <p v-if="settings.data.latitude" class="field-note">{{ settings.data.latitude.toFixed(3) }}, {{ settings.data.longitude?.toFixed(3) }} · Solo sul tuo dispositivo.</p>
            </template>

            <template v-else-if="item.id === 'effects'">
              <p class="field-note">Aloni, luce, grana e cielo restano discreti e seguono il tema. Nella nuova architettura gli effetti vengono adattati al profilo del dispositivo per non appesantire telefono e tablet.</p>
            </template>

            <template v-else-if="item.id === 'radio'">
              <p class="field-note">Le stazioni di Istante restano le stesse. Puoi anche programmare una partenza automatica.</p>
              <div class="schedule-form">
                <label class="stacked-label">Stazione
                  <select v-model="scheduleStation"><option value="">Scegli stazione</option><option v-for="station in radio.stations.filter(x => x.streamUrl)" :key="station.id" :value="station.id">{{ station.name }}</option></select>
                </label>
                <div class="two-fields"><label class="stacked-label">Da<input v-model="scheduleStart" type="time" /></label><label class="stacked-label">A<input v-model="scheduleEnd" type="time" /></label></div>
                <div class="days"><label v-for="d in [[1,'L'],[2,'M'],[3,'M'],[4,'G'],[5,'V'],[6,'S'],[0,'D']]" :key="d[0]"><input v-model="scheduleDays" type="checkbox" :value="d[0]" /><span>{{ d[1] }}</span></label></div>
                <button class="primary-button" type="button" @click="addSchedule">Aggiungi programmazione</button>
              </div>
              <div v-for="entry in schedules.schedules" :key="entry.id" class="source-row"><span><strong>{{ radio.stations.find(s => s.id === entry.stationId)?.name || 'Stazione' }}</strong><small>{{ entry.start }}–{{ entry.end }} · {{ entry.days.length }} giorni</small></span><button class="text-button" @click="schedules.remove(entry.id)">Rimuovi</button></div>
            </template>

            <template v-else-if="item.id === 'timer'">
              <p class="field-note">Il timer mantiene la stessa esperienza di Istante: un momento da scegliere, con radio, silenzio o suono relax. La modale cambia disposizione su telefono e tablet senza cambiare stile.</p>
              <button class="primary-button" type="button" @click="openDashboardOverlay('timer')"><IstanteIcon name="clock" />Apri il timer</button>
            </template>

            <template v-else-if="item.id === 'chime'">
              <label class="toggle-row"><span>Un richiamo al presente<small>Una nota, allo scoccare dell'ora.</small></span><input disabled role="switch" type="checkbox" /></label>
              <p class="field-note">Il rintocco della 3.14.1 verrà riportato nella nuova base senza cambiare timbro e comportamento.</p>
            </template>

            <template v-else-if="item.id === 'goal'">
              <p class="field-note">Il prossimo capitolo resta visibile nella dashboard con conto alla rovescia e percorso dell'anno.</p>
              <div class="goal-preview"><span>Il prossimo capitolo</span><strong>Verso il {{ nextYear }}</strong></div>
            </template>

            <template v-else-if="item.id === 'calendar'">
              <p class="field-note">Fino a 8 calendari ICS. I calendari collegati vengono salvati come link e risincronizzati sul dispositivo ripristinato.</p>
              <div class="calendar-add">
                <label class="stacked-label">Nome calendario<input v-model="calName" /></label>
                <label class="stacked-label">Link ICS<input v-model="calUrl" type="password" placeholder="https://…/calendar.ics" /></label>
                <button class="primary-button" type="button" @click="addCalendar">Aggiungi</button>
              </div>
              <div v-for="source in calendar.sources" :key="source.id" class="source-row"><span><strong>{{ source.name }}</strong><small>{{ source.lastError || source.lastSyncAt || 'Mai sincronizzato' }}</small></span><button class="text-button" @click="calendar.removeSource(source.id)">Rimuovi</button></div>
            </template>

            <template v-else-if="item.id === 'screen'">
              <label class="toggle-row"><span>Modalità screensaver<small>Istante rimane una presenza discreta anche sui display grandi.</small></span><input checked disabled role="switch" type="checkbox" /></label>
              <button class="secondary-button" type="button" @click="fullscreen"><IstanteIcon name="expand" />Schermo intero</button>
              <button class="secondary-button" type="button" @click="persist">Richiedi memoria persistente</button>
              <p v-if="persistent !== undefined" class="field-note">Archiviazione persistente: {{ persistent ? 'attiva' : 'non concessa' }}.</p>
            </template>

            <template v-else-if="item.id === 'backup'">
              <p class="field-note">Esporta o ripristina il tuo Istante in un file JSON. I calendari collegati restano link, non copie dei file ICS.</p>
              <div class="backup-actions">
                <button class="secondary-button" type="button" @click="backup">Esporta JSON</button>
                <button class="secondary-button" type="button" @click="backupFile?.click()">Ripristina JSON</button>
                <input ref="backupFile" hidden type="file" accept=".json,application/json" @change="importBackup" />
              </div>
              <p class="local-note">Il file non viene caricato su un server.</p>
            </template>

            <template v-else>
              <div class="about-copy"><strong>Istante.</strong><p>Un momento, per te.</p><p class="field-note">Versione 4.0.0-alpha.2 · Vue 3 + TypeScript · storage schema 4 · PWA.</p></div>
            </template>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page{position:relative;min-height:100svh;background:var(--bg);color:var(--ink);display:grid;place-items:center;padding:28px;overflow:hidden}.settings-underlay{position:absolute;inset:0;pointer-events:none;filter:blur(5px);transform:scale(1.008)}.settings-shade{position:absolute;inset:0;background:rgba(6,10,7,.66);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}.settings-panel{position:relative;z-index:2;width:min(600px,calc(100vw - 40px));max-height:calc(100dvh - 44px);overflow:hidden;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow)}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding:28px 28px 22px;border-bottom:1px solid var(--line)}.panel-title{min-width:0}.section-label{margin:0 0 5px;color:var(--accent);font-size:9px;letter-spacing:.18em;text-transform:uppercase;font-weight:700}.panel-title h1{font-family:var(--serif);font-weight:400;font-size:34px;line-height:1.1;letter-spacing:-.035em;margin:0}.icon-button{width:42px;height:42px;border:0;border-radius:50%;background:transparent;color:var(--muted);display:grid;place-items:center;cursor:pointer}.icon-button:hover{background:var(--accent-soft);color:var(--ink)}.settings-content{overflow:auto;padding:4px 28px 24px}.settings-section{border-bottom:1px solid var(--line)}.settings-section>summary{list-style:none;display:grid;grid-template-columns:23px minmax(0,1fr) 18px;align-items:center;gap:16px;min-height:76px;padding:16px 2px;cursor:pointer;user-select:none}.settings-section>summary::-webkit-details-marker{display:none}.section-icon{color:var(--accent)}.section-heading{display:grid;gap:3px}.section-heading strong{font-size:15px;font-weight:500;letter-spacing:.01em}.section-heading small{font-size:12px;color:var(--muted);line-height:1.45}.section-chevron{color:var(--faint);transition:transform .18s ease}.settings-section[open] .section-chevron{transform:rotate(180deg)}.settings-section[open]>summary{color:var(--accent)}.settings-section>summary:hover .section-heading strong{color:var(--accent)}.settings-section-body{padding:2px 0 18px}.settings-section-body fieldset{border:0;margin:0;padding:0}.settings-section-body legend{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.12em;margin:2px 0 12px}.segmented{display:flex;gap:4px;padding:3px;border:1px solid var(--line);border-radius:10px;width:max-content;max-width:100%}.segmented label{cursor:pointer}.segmented input{position:absolute;opacity:0}.segmented label>span{min-height:38px;padding:7px 13px;border-radius:7px;display:flex;align-items:center;gap:7px;color:var(--muted);font-size:11px}.segmented input:checked+span{background:var(--surface-2);color:var(--ink)}.field-note,.local-note{color:var(--muted);font-size:10.5px;line-height:1.6;margin:11px 0}.local-note{color:var(--faint)}.toggle-row{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:13px 0;border-top:1px solid var(--line);font-size:12px}.toggle-row>span{display:grid;gap:3px}.toggle-row small{font-size:9.5px;line-height:1.45;color:var(--muted);font-weight:400}.toggle-row input[type=checkbox]{appearance:none;width:38px;height:22px;border-radius:999px;background:var(--surface-2);border:1px solid var(--line);position:relative;flex:none;cursor:pointer}.toggle-row input[type=checkbox]::after{content:'';position:absolute;width:16px;height:16px;left:2px;top:2px;border-radius:50%;background:var(--muted);transition:.18s ease}.toggle-row input[type=checkbox]:checked{background:var(--accent-soft);border-color:color-mix(in srgb,var(--accent) 45%,var(--line))}.toggle-row input[type=checkbox]:checked::after{transform:translateX(16px);background:var(--accent)}.stacked-label{display:grid;gap:7px;font-size:10px;color:var(--muted);margin:12px 0}.stacked-label select,.stacked-label input:not([type=range]){width:100%;min-height:42px;border:1px solid var(--line);border-radius:9px;background:var(--surface-2);color:var(--ink);padding:0 12px;font:inherit;font-size:12px;outline:none}.stacked-label input[type=range]{width:100%;accent-color:var(--accent)}.secondary-button,.primary-button,.text-button{border:0;min-height:42px;border-radius:8px;padding:10px 16px;font-size:11px;display:inline-flex;align-items:center;justify-content:center;gap:9px;cursor:pointer}.secondary-button{background:var(--accent-soft);color:var(--accent)}.primary-button{background:var(--accent);color:var(--bg)}.text-button{background:transparent;color:var(--muted);padding-inline:8px}.two-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}.schedule-form,.calendar-add{display:grid;gap:8px}.days{display:flex;gap:6px;flex-wrap:wrap;margin:5px 0 9px}.days label input{position:absolute;opacity:0}.days label span{width:34px;height:34px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;font-size:10px;color:var(--muted);cursor:pointer}.days label input:checked+span{background:var(--accent-soft);color:var(--accent);border-color:var(--accent)}.source-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 0;border-top:1px solid var(--line)}.source-row>span{display:grid;gap:3px;min-width:0}.source-row strong{font-size:11px;font-weight:600}.source-row small{font-size:9.5px;color:var(--muted);overflow:hidden;text-overflow:ellipsis}.backup-actions{display:flex;gap:8px;flex-wrap:wrap}.goal-preview{display:grid;gap:3px;padding:15px 0;border-top:1px solid var(--line)}.goal-preview span{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}.goal-preview strong{font-family:var(--serif);font-size:24px;font-weight:400}.about-copy>strong{font-family:var(--serif);font-size:26px;font-weight:400}.about-copy p{margin:5px 0}
@media(max-width:720px){.settings-page{padding:0}.settings-panel{width:100%;height:100dvh;max-height:none;border:0;border-radius:0}.panel-head{padding:18px 18px 16px}.panel-title h1{font-size:30px}.settings-content{padding:4px 18px 26px}.settings-section>summary{min-height:68px}.settings-section-body{padding-left:0}.section-heading strong{font-size:14px}.section-heading small{font-size:11px}.segmented{width:100%}.segmented label{flex:1}.segmented label>span{justify-content:center;padding-inline:8px}.two-fields{grid-template-columns:1fr}.source-row{align-items:flex-start}.backup-actions>*{flex:1}.toggle-row{align-items:flex-start}.toggle-row input[type=checkbox]{margin-top:1px}}
</style>
