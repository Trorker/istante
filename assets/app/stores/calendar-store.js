import { reactive, computed, watch } from '../app/vue.js';
import { readJSON, writeJSON, readLegacyJSON } from '../services/storage/storage.js';
import { refreshSources, expandRange, validateSources } from '../services/calendar/calendar-service.js';
import { useSettingsStore } from './settings-store.js';
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function isoDate(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function migrateLegacySources() {
    const old = readLegacyJSON('calendars.v1', null);
    if (!Array.isArray(old))
        return [];
    return old.filter(Boolean).map((item, i) => ({
        id: item.id || `cal-import-${i}`,
        name: item.name || `Calendario ${i + 1}`,
        url: item.url || '',
        ics: item.ics || '',
        enabled: item.enabled !== false,
        color: Number.isInteger(item.color) ? item.color : i % 8,
        updatedAt: item.updatedAt || 0,
        error: ''
    }));
}
const saved = readJSON('calendar', {});
const state = reactive({
    sources: Array.isArray(saved.sources) ? saved.sources : migrateLegacySources(),
    events: [],
    activeDate: saved.activeDate ? new Date(saved.activeDate) : new Date(),
    view: saved.view || 'month',
    warnings: [],
    loading: false,
    lastRefresh: saved.lastRefresh || 0,
    selectedEvent: null
});
let attached = false;
function persist() {
    writeJSON('calendar', { sources: state.sources, activeDate: state.activeDate.toISOString(), view: state.view, lastRefresh: state.lastRefresh });
}
function rangeFor(date = state.activeDate, view = state.view) {
    const d = new Date(date);
    if (view === 'year')
        return [new Date(d.getFullYear(), 0, 1), new Date(d.getFullYear() + 1, 0, 1)];
    if (view === 'month')
        return [new Date(d.getFullYear(), d.getMonth() - 1, 20), new Date(d.getFullYear(), d.getMonth() + 2, 10)];
    if (view === 'week') {
        const monday = addDays(startOfDay(d), -((d.getDay() + 6) % 7));
        return [addDays(monday, -7), addDays(monday, 14)];
    }
    if (view === 'day')
        return [addDays(startOfDay(d), -1), addDays(startOfDay(d), 2)];
    return [startOfDay(d), addDays(startOfDay(d), 180)];
}
export function useCalendarStore() {
    if (!attached) {
        attached = true;
        watch(() => [state.view, state.activeDate.getTime(), state.sources, useSettingsStore().state.calendarHolidays], () => { persist(); rebuild(); }, { deep: true });
    }
    const rebuild = () => {
        const [from, to] = rangeFor();
        try {
            const result = expandRange(state.sources, +from, +to, useSettingsStore().state.calendarHolidays);
            state.events = result.events;
            state.warnings = result.warnings;
        }
        catch (error) {
            state.events = [];
            state.warnings = [error.message];
        }
    };
    const refresh = async () => {
        state.loading = true;
        try {
            const result = await refreshSources(state.sources);
            state.sources = result.sources;
            state.lastRefresh = Date.now();
            state.warnings = result.warnings;
            rebuild();
            persist();
        }
        finally {
            state.loading = false;
        }
    };
    const addSource = source => {
        const id = source.id || `cal-${Date.now().toString(36)}`;
        const next = [...state.sources, { id, name: source.name || 'Calendario', url: source.url || '', ics: source.ics || '', enabled: true, color: state.sources.length % 8, updatedAt: Date.now(), error: '' }];
        state.sources = validateSources(next);
        persist();
        rebuild();
    };
    const removeSource = id => { state.sources = state.sources.filter(x => x.id !== id); persist(); rebuild(); };
    const toggleSource = id => { const item = state.sources.find(x => x.id === id); if (item) {
        item.enabled = !item.enabled;
        persist();
        rebuild();
    } };
    const setView = view => { if (['year', 'month', 'week', 'day', 'agenda'].includes(view))
        state.view = view; useSettingsStore().state.calendarViewMode = state.view; };
    const goToday = () => { state.activeDate = new Date(); };
    const navigate = amount => {
        const d = new Date(state.activeDate);
        if (state.view === 'year')
            d.setFullYear(d.getFullYear() + amount);
        else if (state.view === 'month')
            d.setMonth(d.getMonth() + amount);
        else if (state.view === 'week')
            d.setDate(d.getDate() + amount * 7);
        else
            d.setDate(d.getDate() + amount);
        state.activeDate = d;
    };
    const eventsByDate = computed(() => {
        const map = new Map();
        for (const event of state.events) {
            const first = startOfDay(new Date(event.start));
            const final = startOfDay(new Date(Math.max(event.start, event.end - 1)));
            for (let cursor = first; cursor <= final; cursor = addDays(cursor, 1)) {
                const key = isoDate(cursor);
                if (!map.has(key))
                    map.set(key, []);
                map.get(key).push(event);
            }
        }
        return map;
    });
    rebuild();
    return { state, refresh, rebuild, addSource, removeSource, toggleSource, setView, goToday, navigate, eventsByDate, isoDate, startOfDay, addDays };
}
