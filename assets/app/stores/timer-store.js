import { reactive, computed, watch } from '../app/vue.js';
import { useSettingsStore } from './settings-store.js';
import { useAudioStore } from './audio-store.js';
const state = reactive({
    status: 'idle',
    durationMs: 25 * 60000,
    remainingMs: 25 * 60000,
    startedAt: 0,
    endsAt: 0,
    interval: 0
});
let watchersAttached = false;
let timerOwnsAudio = false;
function clampMinutes(value) {
    return Math.max(1, Math.min(1440, Math.round(Number(value) || 1)));
}
export function useTimerStore() {
    const settings = useSettingsStore().state;
    const audio = useAudioStore();
    if (state.status === 'idle' && state.durationMs === 25 * 60000 && settings.timerMinutes !== 25) {
        state.durationMs = state.remainingMs = clampMinutes(settings.timerMinutes) * 60000;
    }
    const stopTicker = () => {
        if (state.interval)
            clearInterval(state.interval);
        state.interval = 0;
    };
    const stopTimerAudio = async () => {
        if (!timerOwnsAudio)
            return;
        timerOwnsAudio = false;
        await audio.stop();
    };
    const applyDuringSource = async () => {
        if (state.status !== 'running')
            return;
        timerOwnsAudio = true;
        if (settings.timerDuring === 'radio')
            await audio.playRadio();
        else if (settings.timerDuring === 'ambient')
            await audio.playAmbient();
        else
            await audio.stop();
    };
    const finish = async () => {
        if (state.status === 'done')
            return;
        stopTicker();
        state.status = 'done';
        state.remainingMs = 0;
        await stopTimerAudio();
        if (settings.timerAction === 'radio') {
            timerOwnsAudio = true;
            await audio.playRadio();
        }
        else if (settings.timerAction === 'sound') {
            audio.playEndSound();
        }
    };
    const tick = () => {
        if (state.status !== 'running')
            return;
        state.remainingMs = Math.max(0, state.endsAt - Date.now());
        if (state.remainingMs <= 0)
            void finish();
    };
    const start = async () => {
        if (state.status === 'running')
            return;
        if (state.status === 'idle' || state.status === 'done') {
            state.durationMs = clampMinutes(settings.timerMinutes) * 60000;
            state.remainingMs = state.durationMs;
        }
        state.status = 'running';
        state.startedAt = Date.now();
        state.endsAt = Date.now() + state.remainingMs;
        await applyDuringSource();
        stopTicker();
        state.interval = setInterval(tick, 250);
        tick();
    };
    const pause = async () => {
        if (state.status !== 'running')
            return;
        tick();
        state.status = 'paused';
        stopTicker();
        await stopTimerAudio();
    };
    const reset = async () => {
        stopTicker();
        await stopTimerAudio();
        state.status = 'idle';
        state.durationMs = clampMinutes(settings.timerMinutes) * 60000;
        state.remainingMs = state.durationMs;
        state.startedAt = 0;
        state.endsAt = 0;
    };
    const setMinutes = minutes => {
        if (state.status !== 'idle' && state.status !== 'done')
            return;
        const value = clampMinutes(minutes);
        settings.timerMinutes = value;
        state.status = 'idle';
        state.durationMs = state.remainingMs = value * 60000;
    };
    if (!watchersAttached) {
        watchersAttached = true;
        watch(() => settings.timerDuring, () => {
            if (state.status === 'running')
                void applyDuringSource();
        });
        watch(() => settings.timerMinutes, value => {
            if (state.status !== 'idle')
                return;
            const minutes = clampMinutes(value);
            if (minutes !== value)
                settings.timerMinutes = minutes;
            state.durationMs = state.remainingMs = minutes * 60000;
        });
    }
    const progress = computed(() => state.durationMs ? 1 - state.remainingMs / state.durationMs : 0);
    const formatted = computed(() => {
        const total = Math.ceil(state.remainingMs / 1000);
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        const seconds = total % 60;
        return hours
            ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });
    return { state, start, pause, reset, setMinutes, progress, formatted };
}
