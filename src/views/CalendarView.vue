<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCalendarStore, type CalendarView as CV } from '../stores/calendar.store'
import { useDeviceProfile } from '../composables/useDeviceProfile'
import BrandLockup from '../components/BrandLockup.vue'
import IstanteIcon from '../components/IstanteIcon.vue'
import MonthView from '../components/calendar/MonthView.vue'
import AgendaView from '../components/calendar/AgendaView.vue'
import YearView from '../components/calendar/YearView.vue'
import DayView from '../components/calendar/DayView.vue'
import WeekView from '../components/calendar/WeekView.vue'

const calendar = useCalendarStore()
const router = useRouter()
const { profile } = useDeviceProfile()

const allowed = computed<CV[]>(() => profile.value.family === 'phone'
  ? ['year', 'month', 'day', 'agenda']
  : ['year', 'month', 'week', 'day', 'agenda'])

const component = computed(() => calendar.view === 'year' ? YearView : calendar.view === 'agenda' ? AgendaView : calendar.view === 'day' ? DayView : calendar.view === 'week' ? WeekView : MonthView)
const period = computed(() => {
  if (calendar.view === 'year') return String(calendar.cursor.getFullYear())
  if (calendar.view === 'day') return calendar.cursor.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  if (calendar.view === 'agenda') return 'I prossimi giorni.'
  if (calendar.view === 'week') {
    const from = new Date(calendar.cursor)
    const dow = (from.getDay() + 6) % 7
    from.setDate(from.getDate() - dow)
    const to = new Date(from)
    to.setDate(to.getDate() + 6)
    const a = from.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
    const b = to.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${a} — ${b}`
  }
  return calendar.cursor.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
})
const subtitle = computed(() => calendar.view === 'agenda' ? 'I prossimi 60 giorni, un impegno alla volta.' : 'Un po’ di ordine. Senza fretta.')
const labels: Record<CV, string> = { year: 'Anno', month: 'Mese', week: 'Settimana', day: 'Giorno', agenda: 'Agenda' }

onMounted(() => {
  if (profile.value.family === 'phone' && calendar.view === 'week') calendar.view = 'month'
})
</script>

<template>
  <div class="calendar-page">
    <div class="calendar-shell">
      <header class="calendar-heading">
        <div class="calendar-brand"><BrandLockup compact /></div>
        <div class="calendar-title-copy">
          <p class="section-label">Il tempo che scegli</p>
          <button class="period-button" type="button" aria-label="Scegli una data">
            <span>{{ period }}</span><IstanteIcon name="calendar" :size="17" />
          </button>
          <p class="calendar-subtitle">{{ subtitle }}</p>
        </div>
        <nav class="calendar-toolbar" aria-label="Navigazione e visualizzazione calendario">
          <div class="calendar-navigation">
            <button class="icon-button prev" aria-label="Periodo precedente" @click="calendar.move(-1)"><IstanteIcon name="chevron" /></button>
            <button class="secondary-button" @click="calendar.goToday">Oggi</button>
            <button class="icon-button next" aria-label="Periodo successivo" @click="calendar.move(1)"><IstanteIcon name="chevron" /></button>
          </div>
          <div class="calendar-views" role="group" aria-label="Visualizzazione">
            <button v-for="view in allowed" :key="view" :class="{ active: calendar.view === view }" :aria-pressed="calendar.view === view" @click="calendar.view = view">{{ labels[view] }}</button>
          </div>
        </nav>
        <div class="calendar-actions">
          <button class="icon-button" aria-label="Le tue giornate" @click="router.push('/settings?section=calendar')"><IstanteIcon name="calendar" /></button>
          <button class="icon-button" :disabled="calendar.syncing" aria-label="Aggiorna calendari condivisi" @click="calendar.syncAll"><IstanteIcon name="arrow" /></button>
        </div>
      </header>


      <main class="calendar-main">
        <component :is="component" class="calendar-body" />
        <div v-if="!calendar.sources.length" class="calendar-empty">
          <b>Nessun calendario collegato</b>
          <span>Puoi aggiungere un link ICS da Spazio per i tuoi giorni.</span>
          <button class="secondary-button" @click="router.push('/settings?section=calendar')">Gestisci calendari</button>
        </div>
      </main>

      <footer class="calendar-footer">
        <span>Ogni giorno, un nuovo istante.</span>
        <a href="/project" target="_blank" rel="noopener noreferrer">Il progetto</a>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.calendar-page{min-height:100svh;background:var(--bg);color:var(--ink);padding:24px 30px}.calendar-shell{width:min(1540px,100%);min-height:calc(100svh - 48px);margin:0 auto;display:flex;flex-direction:column}.calendar-heading{display:grid;grid-template-columns:auto minmax(210px,1fr) auto auto;align-items:center;gap:28px;padding:8px 2px 21px;border-bottom:1px solid var(--line)}.calendar-brand{padding-right:24px;border-right:1px solid var(--line)}.calendar-title-copy{min-width:0}.section-label{margin:0 0 5px;color:var(--accent);font-size:8.5px;font-weight:700;letter-spacing:.17em;text-transform:uppercase}.period-button{border:0;background:transparent;color:var(--ink);padding:0;display:flex;align-items:center;gap:8px;font-family:var(--serif);font-size:25px;line-height:1.1;cursor:pointer;text-transform:none}.period-button svg{color:var(--accent)}.calendar-subtitle{margin:5px 0 0;color:var(--muted);font-size:10px}.calendar-toolbar{display:flex;align-items:center;gap:18px}.calendar-navigation,.calendar-views,.calendar-actions{display:flex;align-items:center;gap:3px}.icon-button{width:39px;height:39px;border:0;border-radius:50%;background:transparent;color:var(--muted);display:grid;place-items:center;cursor:pointer}.icon-button:hover{background:var(--accent-soft);color:var(--ink)}.calendar-navigation .prev svg{transform:rotate(180deg)}.secondary-button{border:0;min-height:38px;border-radius:8px;padding:8px 14px;background:var(--accent-soft);color:var(--accent);font-size:10px;cursor:pointer}.calendar-views{border-left:1px solid var(--line);padding-left:14px;gap:1px}.calendar-views button{border:0;background:transparent;color:var(--muted);min-height:37px;padding:8px 10px;border-radius:7px;font-size:10px;cursor:pointer}.calendar-views button.active{background:var(--surface-2);color:var(--ink)}.calendar-actions{padding-left:5px}.period-mobile{display:none;font-family:var(--serif);text-transform:capitalize;color:var(--muted);font-size:15px;padding:12px 2px 0}.calendar-main{flex:1;padding:19px 0 24px;min-height:0}.calendar-body{width:100%}.calendar-empty{display:grid;justify-items:center;gap:7px;text-align:center;margin:44px auto;padding:28px;max-width:560px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.calendar-empty b{font-family:var(--serif);font-size:22px;font-weight:400}.calendar-empty span{color:var(--muted);font-size:10px}.calendar-footer{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px 2px 2px;border-top:1px solid var(--line);color:var(--faint);font-size:9.5px}.calendar-footer a{color:var(--muted);text-decoration:none}.calendar-footer a:hover{color:var(--accent)}
@media(max-width:1100px){.calendar-heading{grid-template-columns:auto 1fr auto;gap:18px}.calendar-toolbar{grid-column:1/4;justify-content:space-between;padding-top:12px;border-top:1px solid var(--line)}.calendar-actions{position:absolute;right:32px;top:31px}}
@media(max-width:700px){.calendar-page{padding:0}.calendar-shell{width:100%;min-height:100dvh}.calendar-heading{grid-template-columns:1fr auto;padding:16px 16px 11px;gap:10px;border-bottom:1px solid var(--line);position:relative}.calendar-brand{padding:0;border:0}.calendar-title-copy{grid-row:2;grid-column:1/3;padding-top:7px}.section-label{font-size:7.5px}.period-button{font-size:21px}.calendar-subtitle{font-size:9px}.calendar-actions{position:static;grid-column:2;grid-row:1;align-self:center}.calendar-actions .icon-button:last-child{display:none}.calendar-toolbar{grid-column:1/3;grid-row:3;display:grid;gap:9px;padding-top:10px;border-top:1px solid var(--line);min-width:0}.calendar-navigation{justify-content:center}.calendar-views{padding:2px 0 0;border:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));width:100%;gap:2px}.calendar-views button{min-width:0;padding-inline:5px;font-size:9px}.period-mobile{display:block;padding-inline:16px}.calendar-main{padding:10px 12px 18px;overflow:hidden}.calendar-footer{padding:12px 16px calc(12px + env(safe-area-inset-bottom));font-size:8.5px}}
</style>
