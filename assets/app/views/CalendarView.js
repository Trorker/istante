import { computed, onMounted, ref } from '../app/vue.js';
import { useViewport } from '../composables/useViewport.js';
import { useCalendarInteraction } from '../composables/useCalendarInteraction.js';
import { useCalendarStore } from '../stores/calendar-store.js';
import { useSettingsStore } from '../stores/settings-store.js';
import { useAppStore } from '../stores/app-store.js';
import CalendarHeader from '../components/calendar/CalendarHeader.js';
import YearView from '../components/calendar/YearView.js';
import MonthView from '../components/calendar/MonthView.js';
import WeekView from '../components/calendar/WeekView.js';
import DayView from '../components/calendar/DayView.js';
import AgendaView from '../components/calendar/AgendaView.js';
export default { name: 'CalendarView', components: { CalendarHeader, YearView, MonthView, WeekView, DayView, AgendaView }, setup() {
        const cal = useCalendarStore(), app = useAppStore(), viewport = useViewport(), settings = useSettingsStore().state, root = ref(null);
        const goDashboard = () => app.openView('dashboard');
        useCalendarInteraction({ root, navigate: cal.navigate, goDashboard });
        onMounted(() => { if (settings.calendarViewMode !== 'last')
            cal.setView(settings.calendarViewMode); cal.rebuild(); if (Date.now() - cal.state.lastRefresh > 10 * 60 * 1000)
            cal.refresh().catch(() => { }); });
        const component = computed(() => ({ year: YearView, month: MonthView, week: WeekView, day: DayView, agenda: AgendaView })[cal.state.view] || MonthView);
        const selectDay = day => { cal.state.activeDate = new Date(day); cal.setView('day'); };
        const openEvent = e => { cal.state.selectedEvent = e; app.openModal('event'); };
        return { cal, app, viewport, settings, root, component, selectDay, openEvent, goDashboard };
    }, template: `<main ref="root" class="calendar-screen" :class="{'calendar-handwritten':settings.calendarExcalifont}"><CalendarHeader :date="cal.state.activeDate" :view="cal.state.view" :device="viewport.device" :loading="cal.state.loading" @back="goDashboard" @today="cal.goToday" @navigate="cal.navigate" @view="cal.setView" @manage="app.openModal('calendars')" @refresh="cal.refresh"/><div v-if="cal.state.warnings.length" class="calendar-warning" :title="cal.state.warnings.join(' · ')">{{cal.state.warnings[0]}}</div><section class="calendar-viewport" :data-view="cal.state.view"><component :is="component" :date="cal.state.activeDate" :events="cal.state.events" :events-by-date="cal.eventsByDate.value" @select-day="selectDay" @open-event="openEvent"/></section></main>` };
