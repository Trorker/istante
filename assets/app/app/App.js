import { watch, onMounted, onBeforeUnmount, computed } from './vue.js';
import { useViewport } from '../composables/useViewport.js';
import DashboardView from '../views/DashboardView.js';
import CalendarView from '../views/CalendarView.js';
import ToastHost from '../components/common/ToastHost.js';
import OnboardingWizard from '../components/common/OnboardingWizard.js';
import TimerPanel from '../components/timer/TimerPanel.js';
import RadioPanel from '../components/radio/RadioPanel.js';
import LibraryPanel from '../components/library/LibraryPanel.js';
import SettingsPanel from '../components/settings/SettingsPanel.js';
import CalendarManager from '../components/settings/CalendarManager.js';
import WeatherPanel from '../components/weather/WeatherPanel.js';
import GoalPanel from '../components/dashboard/GoalPanel.js';
import EventPanel from '../components/calendar/EventPanel.js';
import SharePanel from '../components/common/SharePanel.js';
import ReceivedPhrasePanel from '../components/common/ReceivedPhrasePanel.js';
import { useAppStore } from '../stores/app-store.js';
import { useSettingsStore } from '../stores/settings-store.js';
import { usePhraseStore } from '../stores/phrase-store.js';
import { useAudioStore } from '../stores/audio-store.js';
import { useWeatherStore } from '../stores/weather-store.js';
import { isNight } from '../services/appearance/celestial-service.js';
import { initUpdates } from '../services/updates/update-service.js';
import { useCustomCursor } from '../composables/useCustomCursor.js';
import { useIdleChrome } from '../composables/useIdleChrome.js';
import { useVolumeGesture } from '../composables/useVolumeGesture.js';
import { installTouchFeedback } from '../services/audio/touch-feedback.js';
import { installHourlyChime } from '../services/audio/chime-service.js';
import { parseShareLink } from '../services/share/share-link.js';
export default {
    name: 'App', components: { DashboardView, CalendarView, ToastHost, OnboardingWizard, TimerPanel, RadioPanel, LibraryPanel, SettingsPanel, CalendarManager, WeatherPanel, GoalPanel, EventPanel, SharePanel, ReceivedPhrasePanel },
    setup() {
        const app = useAppStore(), settings = useSettingsStore(), viewport = useViewport(), phrases = usePhraseStore(), audio = useAudioStore(), weather = useWeatherStore();
        let wakeLock = null, removeTouch = () => { }, removeChime = () => { };
        useCustomCursor();
        useIdleChrome();
        useVolumeGesture();
        const resolveTheme = () => { let theme = settings.state.theme; if (theme === 'auto')
            theme = matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark'; if (theme === 'solar')
            theme = isNight(new Date(), weather.state.data) ? 'dark' : 'light'; document.documentElement.dataset.theme = theme; document.body.dataset.background = settings.state.background; document.body.dataset.font = settings.state.fontStyle; document.body.dataset.fontSize = settings.state.fontSize; document.body.classList.toggle('no-motion', !settings.state.motion); };
        const syncWake = async () => { try {
            if (settings.state.wakeLock && 'wakeLock' in navigator && !wakeLock)
                wakeLock = await navigator.wakeLock.request('screen');
            else if (!settings.state.wakeLock && wakeLock) {
                await wakeLock.release();
                wakeLock = null;
            }
        }
        catch { } };
        watch(settings.state, () => { resolveTheme(); syncWake(); }, { deep: true });
        watch(() => weather.state.data?.fetchedAt, resolveTheme);
        onMounted(async () => { if (settings.state.weather || settings.state.theme === 'solar' || settings.state.solarTimes)
            await weather.refresh().catch(() => { }); resolveTheme(); await phrases.init(); audio.init(); initUpdates(); syncWake(); removeTouch = installTouchFeedback(() => settings.state); removeChime = installHourlyChime(() => settings.state); document.addEventListener('visibilitychange', syncWake); if (location.hash.startsWith('#p=')) {
            try {
                const received = parseShareLink(location.hash);
                if (received) {
                    app.state.receivedPhrase = received;
                    app.openModal('received');
                }
            }
            catch (error) {
                app.toast(error.message || 'Link condiviso non valido.');
                history.replaceState(null, '', location.pathname + location.search);
            }
        } });
        onBeforeUnmount(() => { document.removeEventListener('visibilitychange', syncWake); removeTouch(); removeChime(); });
        const modal = computed(() => app.state.modal);
        const close = () => app.closeModal();
        const openSettingsFromWeather = () => app.openModal('settings');
        const openSettingsFromGoal = () => app.openModal('settings');
        return { app, settings, viewport, modal, close, openSettingsFromWeather, openSettingsFromGoal };
    },
    template: `<div id="app-root" class="app-root"><DashboardView v-if="app.state.view==='dashboard'"/><CalendarView v-else-if="app.state.view==='calendar'"/><transition name="modal"><TimerPanel v-if="modal==='timer'" @close="close"/></transition><transition name="modal"><RadioPanel v-if="modal==='radio'" @close="close"/></transition><transition name="modal"><LibraryPanel v-if="modal==='library'" @close="close"/></transition><transition name="modal"><SettingsPanel v-if="modal==='settings'" @close="close" @calendars="app.openModal('calendars')"/></transition><transition name="modal"><CalendarManager v-if="modal==='calendars'" @close="close"/></transition><transition name="modal"><WeatherPanel v-if="modal==='weather'" @close="close" @settings="openSettingsFromWeather"/></transition><transition name="modal"><GoalPanel v-if="modal==='goal'" @close="close" @settings="openSettingsFromGoal"/></transition><transition name="modal"><EventPanel v-if="modal==='event'" @close="close"/></transition><transition name="modal"><SharePanel v-if="modal==='share'" @close="close"/></transition><transition name="modal"><ReceivedPhrasePanel v-if="modal==='received'" @close="close"/></transition><OnboardingWizard/><ToastHost :message="app.state.toast"/></div>`
};
