import { reactive, computed } from '../app/vue.js';
import { loadJSON } from '../services/data-loader.js';
import { parsePhrases, buildDeck, getSchedule, pickScheduled, splitPhrase } from '../services/phrase-core.js';
import { readJSON, writeJSON, readLegacyJSON } from '../services/storage/storage.js';
import { useSettingsStore } from './settings-store.js';
const state = reactive({
    ready: false,
    loading: false,
    collectionId: 'builtin',
    collectionName: 'Pensieri di Istante',
    phrases: [],
    deck: null,
    current: null,
    scheduleLabel: 'Un pensiero per te',
    favorites: new Set(),
    history: [],
    catalog: [],
    installed: {},
    error: '',
    manualSlot: ''
});
let scheduleTimer = 0;
function persist() {
    writeJSON('phrases', {
        collectionId: state.collectionId,
        collectionName: state.collectionName,
        favorites: [...state.favorites],
        history: state.history.slice(-250),
        installed: state.installed
    });
}
function normalizeCollection(payload, fallbackName = 'Raccolta') {
    const parsed = parsePhrases(payload);
    return { phrases: parsed, name: payload?.title || payload?.name || payload?.collection || fallbackName };
}
async function loadBuiltin() {
    const payload = await loadJSON('/data/phrases.json');
    const normalized = normalizeCollection(payload, 'Pensieri di Istante');
    return { ...normalized, id: 'builtin' };
}
function legacyCollection() {
    const raw = readLegacyJSON('collection', null);
    if (!raw)
        return null;
    try {
        const normalized = normalizeCollection(raw, 'La mia raccolta');
        return { ...normalized, id: 'legacy-personal' };
    }
    catch {
        return null;
    }
}
function resolveScheduled(now = new Date(), force = false) {
    if (!state.deck?.items?.length)
        return;
    const settings = useSettingsStore().state;
    const schedule = getSchedule(now, settings);
    state.scheduleLabel = schedule.label;
    const slot = schedule.key;
    if (!force && state.manualSlot === slot)
        return;
    if (state.manualSlot && state.manualSlot !== slot)
        state.manualSlot = '';
    const cached = readJSON('phrase-slot', {});
    if (!force && cached.slot === slot) {
        const found = state.phrases.find(p => p.id === cached.id);
        if (found) {
            state.current = found;
            return;
        }
    }
    let selected;
    if (schedule.ordinal == null)
        selected = state.deck.items[Math.floor(Math.random() * state.deck.items.length)];
    else
        selected = pickScheduled(state.deck.items, schedule.ordinal);
    state.current = selected;
    writeJSON('phrase-slot', { slot, id: selected.id });
    state.history.push(selected.id);
    if (state.history.length > 250)
        state.history.splice(0, state.history.length - 250);
    persist();
}
export function usePhraseStore() {
    const init = async () => {
        if (state.ready || state.loading)
            return;
        state.loading = true;
        try {
            const persisted = readJSON('phrases', {});
            const legacyFav = readLegacyJSON('favorites', []);
            state.favorites = new Set(Array.isArray(persisted.favorites) ? persisted.favorites : Array.isArray(legacyFav) ? legacyFav : []);
            state.history = Array.isArray(persisted.history) ? persisted.history : [];
            state.installed = persisted.installed && typeof persisted.installed === 'object' ? persisted.installed : {};
            state.catalog = await loadJSON('/data/collection-catalog.json').catch(() => []);
            let collection = null;
            if (persisted.collectionId && persisted.collectionId !== 'builtin' && state.installed[persisted.collectionId]) {
                try {
                    collection = { ...normalizeCollection(state.installed[persisted.collectionId], persisted.collectionName), id: persisted.collectionId };
                }
                catch { }
            }
            if (!collection && persisted.collectionId === 'legacy-personal')
                collection = legacyCollection();
            if (!collection)
                collection = await loadBuiltin();
            state.collectionId = collection.id;
            state.collectionName = collection.name;
            state.phrases = collection.phrases;
            state.deck = buildDeck(state.phrases);
            resolveScheduled(new Date(), true);
            state.ready = true;
            if (!scheduleTimer)
                scheduleTimer = setInterval(() => resolveScheduled(new Date()), 30000);
            persist();
        }
        catch (error) {
            state.error = error.message || String(error);
        }
        finally {
            state.loading = false;
        }
    };
    const next = () => {
        if (!state.deck?.items?.length)
            return;
        const currentIndex = state.current ? state.deck.items.findIndex(x => x.id === state.current.id) : -1;
        let index = (currentIndex + 1) % state.deck.items.length;
        if (state.deck.items.length > 2 && state.history.includes(state.deck.items[index].id)) {
            const candidate = state.deck.items.findIndex((x, i) => i !== currentIndex && !state.history.slice(-12).includes(x.id));
            if (candidate >= 0)
                index = candidate;
        }
        state.current = state.deck.items[index];
        state.manualSlot = getSchedule(new Date(), useSettingsStore().state).key;
        state.scheduleLabel = 'Scelto da te';
        state.history.push(state.current.id);
        persist();
    };
    const toggleFavorite = phrase => {
        const target = phrase || state.current;
        if (!target?.text)
            return;
        state.favorites.has(target.text) ? state.favorites.delete(target.text) : state.favorites.add(target.text);
        persist();
    };
    const saveReceived = text => {
        const phrase = parsePhrases([String(text || '').trim()])[0]?.text;
        if (!phrase)
            throw new Error('Il pensiero ricevuto non è valido.');
        const id = 'received';
        const current = state.installed[id] && Array.isArray(state.installed[id].phrases)
            ? state.installed[id]
            : { title: 'Pensieri ricevuti', phrases: [] };
        const phrases = [...current.phrases];
        if (!phrases.includes(phrase)) {
            if (phrases.length >= 1000)
                throw new Error('La raccolta Pensieri ricevuti ha raggiunto 1.000 frasi.');
            phrases.push(phrase);
        }
        state.installed[id] = { title: 'Pensieri ricevuti', phrases };
        state.favorites.add(phrase);
        persist();
        return !current.phrases.includes(phrase);
    };
    const activate = (payload, id = `personal-${Date.now()}`, name = '') => {
        const normalized = normalizeCollection(payload, name || 'La mia raccolta');
        state.installed[id] = { title: normalized.name, phrases: normalized.phrases.map(p => p.text) };
        state.collectionId = id;
        state.collectionName = normalized.name;
        state.phrases = normalized.phrases;
        state.deck = buildDeck(state.phrases);
        resolveScheduled(new Date(), true);
        persist();
    };
    const restoreBuiltin = async () => {
        const collection = await loadBuiltin();
        state.collectionId = collection.id;
        state.collectionName = collection.name;
        state.phrases = collection.phrases;
        state.deck = buildDeck(state.phrases);
        resolveScheduled(new Date(), true);
        persist();
    };
    const removeInstalled = async (id) => {
        if (!id || id === 'builtin')
            return;
        delete state.installed[id];
        if (state.collectionId === id)
            await restoreBuiltin();
        else
            persist();
    };
    const installedCollections = computed(() => Object.entries(state.installed).map(([id, payload]) => ({ id, title: payload.title || 'Raccolta', count: Array.isArray(payload.phrases) ? payload.phrases.length : 0, payload })));
    const currentSplit = computed(() => splitPhrase(state.current?.text || ''));
    return { state, init, next, toggleFavorite, saveReceived, activate, restoreBuiltin, removeInstalled, installedCollections, resolveScheduled, currentSplit };
}
