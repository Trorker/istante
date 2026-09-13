import { reactive, watch } from '../app/vue.js';
import { DEFAULTS as LEGACY_DEFAULTS, cleanSettings } from '../services/phrase-core.js';
import { readJSON, writeJSON, readLegacyJSON } from '../services/storage/storage.js';
/**
 * One canonical settings schema for the whole application.
 * Names deliberately match the stable 3.x configuration so migration is lossless.
 */
export const DEFAULT_SETTINGS = Object.freeze({
    ...LEGACY_DEFAULTS,
    weatherLat: null,
    weatherLon: null,
    weatherLabel: '',
    radioFavorites: []
});
function finiteOrNull(value, min = -Infinity, max = Infinity) {
    const number = Number(value);
    return Number.isFinite(number) && number >= min && number <= max ? number : null;
}
function normalizeExtras(input = {}) {
    const lat = finiteOrNull(input.weatherLat, -90, 90);
    const lon = finiteOrNull(input.weatherLon, -180, 180);
    return {
        weatherLat: lat,
        weatherLon: lon,
        weatherLabel: typeof input.weatherLabel === 'string' ? input.weatherLabel.trim().slice(0, 60) : '',
        radioFavorites: Array.isArray(input.radioFavorites) ? [...new Set(input.radioFavorites.filter(x => typeof x === 'string'))].slice(0, 150) : []
    };
}
function aliases(input = {}) {
    // Compatibility with early v4 development snapshots. These aliases are read-only migration paths.
    const out = { ...input };
    if (out.mode == null && out.phraseMode != null)
        out.mode = out.phraseMode;
    if (out.interval == null && out.phraseInterval != null)
        out.interval = out.phraseInterval;
    if (out.calendarViewMode == null && out.calendarLastView != null)
        out.calendarViewMode = out.calendarLastView;
    return out;
}
export function normalizeSettings(input = {}) {
    const source = aliases(input);
    return { ...DEFAULT_SETTINGS, ...cleanSettings(source), ...normalizeExtras(source) };
}
const persisted = readJSON('settings', null);
const legacy = readLegacyJSON('settings', null);
const state = reactive(normalizeSettings(persisted || legacy || {}));
let attached = false;
export function useSettingsStore() {
    if (!attached) {
        attached = true;
        watch(state, value => writeJSON('settings', normalizeSettings(value)), { deep: true });
    }
    const patch = values => Object.assign(state, normalizeSettings({ ...state, ...(values || {}) }));
    const reset = () => Object.assign(state, DEFAULT_SETTINGS);
    return { state, patch, reset, normalize: normalizeSettings };
}
