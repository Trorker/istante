import { reactive, computed, watch } from '../app/vue.js';
import { useSettingsStore } from './settings-store.js';
import { useStationStore } from './station-store.js';
import { resolveStation } from '../services/audio/radio-service.js';
import { playAmbient as startAmbient, stopAmbient, setAmbientVolume, playMelody as startMelody, stopMelody, setMelodyVolume } from '../services/audio/ambient-service.js';
import { activeSchedule, scheduleSummary } from '../services/audio/schedule-service.js';
const audio = new Audio();
audio.preload = 'none';
audio.crossOrigin = 'anonymous';
const state = reactive({ stations: [], loading: false, playing: false, source: 'none', stationId: '', status: 'Pronto', error: '', scheduleStatus: '' });
let wired = false;
let sourceWatcherWired = false;
let scheduleTimer = 0;
let scheduledSlot = '';
audio.addEventListener('playing', () => { state.playing = true; state.status = 'In riproduzione'; });
audio.addEventListener('pause', () => { if (state.source === 'radio') {
    state.playing = false;
    state.status = 'In pausa';
} });
audio.addEventListener('error', () => { if (state.source === 'radio') {
    state.error = 'La stazione non risponde.';
    state.status = 'Non disponibile';
    state.playing = false;
} });
async function stopEngines() { audio.pause(); stopAmbient(); stopMelody(); state.playing = false; }
function audioContext() { const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext; return Ctx ? new Ctx() : null; }
function endTone(kind = 'chime', volume = 65) { const c = audioContext(); if (!c)
    return; const now = c.currentTime, g = c.createGain(); g.connect(c.destination); g.gain.setValueAtTime(.0001, now); g.gain.linearRampToValueAtTime(Math.max(.01, volume / 100 * .22), now + .025); g.gain.exponentialRampToValueAtTime(.0001, now + 1); const map = { chime: [523.25, 659.25], bell: [784, 1046.5], pulse: [440, 440] }; for (const [i, f] of (map[kind] || map.chime).entries()) {
    const o = c.createOscillator();
    o.type = kind === 'bell' ? 'sine' : 'triangle';
    o.frequency.value = f;
    const og = c.createGain();
    og.gain.value = i ? 0.55 : 1;
    o.connect(og).connect(g);
    o.start(now + i * .2);
    o.stop(now + .9);
} }
export function useAudioStore() {
    const settings = useSettingsStore().state;
    const library = useStationStore();
    const availableSources = () => [['radio', settings.radioEnabled], ['ambient', settings.ambientEnabled], ['melody', settings.melodyEnabled]].filter(([, enabled]) => enabled).map(([name]) => name);
    const ensureSource = async () => { const available = availableSources(); if (!available.length) {
        settings.audioSource = 'radio';
        await stop();
        return;
    } if (!available.includes(settings.audioSource)) {
        settings.audioSource = available[0];
        if (state.playing)
            await playSelected();
    } };
    const init = async () => {
        if (!library.state.ready) {
            state.loading = true;
            try {
                await library.init();
            }
            finally {
                state.loading = false;
            }
        }
        if (!wired) {
            wired = true;
            watch(library.list, rows => { state.stations = rows; }, { immediate: true });
        }
        if (!sourceWatcherWired) {
            sourceWatcherWired = true;
            watch(() => [settings.radioEnabled, settings.ambientEnabled, settings.melodyEnabled], () => { ensureSource().catch(() => { }); });
        }
        audio.volume = settings.radioVolume / 100;
        state.stationId = settings.radioStation;
        await ensureSource();
        if (!scheduleTimer) {
            scheduleTimer = setInterval(runSchedule, 30000);
            runSchedule();
        }
    };
    const selectedStation = computed(() => state.stations.find(x => x.id === settings.radioStation) || state.stations[0] || null);
    const playRadio = async (id = null) => { await init(); if (id)
        settings.radioStation = id; const station = state.stations.find(x => x.id === settings.radioStation) || state.stations[0]; if (!station)
        return; settings.audioSource = 'radio'; state.status = 'Connessione…'; state.error = ''; try {
        const stream = await resolveStation(station);
        await stopEngines();
        state.source = 'radio';
        state.stationId = station.id;
        audio.src = stream.url;
        audio.volume = settings.radioVolume / 100;
        await audio.play();
    }
    catch (e) {
        state.error = e?.message || 'Riproduzione non disponibile.';
        state.status = 'Premi play per autorizzare';
        state.playing = false;
    } };
    const playAmbient = async () => { settings.audioSource = 'ambient'; await stopEngines(); state.source = 'ambient'; state.status = 'Ambiente'; await startAmbient(settings.ambientType, settings.ambientVolume); state.playing = true; };
    const playMelody = async () => { settings.audioSource = 'melody'; await stopEngines(); state.source = 'melody'; state.status = 'Melodia'; await startMelody(settings.melodyType, settings.melodyVolume); state.playing = true; };
    const playSelected = () => settings.audioSource === 'ambient' ? playAmbient() : settings.audioSource === 'melody' ? playMelody() : playRadio();
    const toggle = async () => { if (state.playing)
        await stop();
    else
        await playSelected(); };
    const stop = async () => { await stopEngines(); state.status = 'In pausa'; };
    const setRadioVolume = v => { settings.radioVolume = Math.max(0, Math.min(100, +v || 0)); audio.volume = settings.radioVolume / 100; };
    const setAmbient = v => { settings.ambientVolume = Math.max(0, Math.min(100, +v || 0)); if (state.source === 'ambient')
        setAmbientVolume(settings.ambientVolume); };
    const setMelody = v => { settings.melodyVolume = Math.max(0, Math.min(100, +v || 0)); if (state.source === 'melody')
        setMelodyVolume(settings.melodyVolume); };
    const toggleFavorite = id => library.toggleFavorite(id);
    const random = async () => { await init(); const pool = (settings.radioFavorites || []).length ? state.stations.filter(s => (settings.radioFavorites || []).includes(s.id)) : state.stations; if (!pool.length)
        return; const station = pool[Math.floor(Math.random() * pool.length)]; await playRadio(station.id); };
    const runSchedule = () => { state.scheduleStatus = settings.radioScheduleEnabled ? scheduleSummary(settings.radioSchedules, new Date()) : ''; if (!settings.radioEnabled || !settings.radioScheduleEnabled)
        return; const active = activeSchedule(settings.radioSchedules, new Date()); const id = active?.id || ''; if (id === scheduledSlot)
        return; scheduledSlot = id; if (active)
        playRadio().catch(() => { });
    else if (state.source === 'radio' && state.playing)
        stop().catch(() => { }); };
    const playEndSound = () => endTone(settings.timerSound, settings.timerVolume);
    return { state, init, library, selectedStation, playRadio, playAmbient, playMelody, playSelected, toggle, stop, setRadioVolume, setAmbient, setMelody, toggleFavorite, random, runSchedule, playEndSound };
}
