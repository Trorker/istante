import { reactive, computed } from '../app/vue.js';
import { loadStations } from '../services/audio/radio-service.js';
import { readJSON, writeJSON, readLegacyJSON } from '../services/storage/storage.js';
import { useSettingsStore } from './settings-store.js';
const state = reactive({ builtins: [], custom: [], hidden: [], order: [], ready: false });
function httpsUrl(raw) {
    try {
        const u = new URL(String(raw || '').trim());
        return u.protocol === 'https:' && !u.username && !u.password ? u.href : '';
    }
    catch {
        return '';
    }
}
function persist() { writeJSON('radio-library', { custom: state.custom, hidden: state.hidden, order: state.order }); }
function cleanCustom(rows, builtinIds) { const ids = new Set(builtinIds); const out = []; for (const r of Array.isArray(rows) ? rows.slice(0, 100) : []) {
    const stream = httpsUrl(r?.url);
    if (!r || !/^custom-[a-z0-9-]{1,70}$/i.test(r.id) || ids.has(r.id) || !String(r.name || '').trim() || !stream)
        continue;
    ids.add(r.id);
    out.push({ id: r.id, name: String(r.name).trim().slice(0, 90), url: stream, page: httpsUrl(r.page) });
} return out; }
export function useStationStore() {
    const settings = useSettingsStore().state;
    const init = async () => { if (state.ready)
        return; state.builtins = await loadStations(); const legacy = readLegacyJSON('radioLibrary', null); const saved = readJSON('radio-library', legacy || {}); const builtinIds = state.builtins.map(x => x.id); state.custom = cleanCustom(saved?.custom, builtinIds); const allIds = new Set([...builtinIds, ...state.custom.map(x => x.id)]); state.hidden = [...new Set((saved?.hidden || []).filter(id => builtinIds.includes(id)))]; state.order = [...new Set((saved?.order || []).filter(id => allIds.has(id)))]; for (const id of allIds)
        if (!state.order.includes(id))
            state.order.push(id); if (Array.isArray(legacy?.favorites) && !settings.radioFavorites.length)
        settings.radioFavorites = [...new Set(legacy.favorites.filter(id => allIds.has(id)))]; state.ready = true; persist(); };
    const list = computed(() => { const custom = state.custom.map((s, i) => ({ number: String(state.builtins.length + i + 1).padStart(2, '0'), id: s.id, name: s.name, label: s.name, provider: 'La tua radio', page: s.page || s.url, custom: true, streams: [{ url: s.url, label: 'Stream personalizzato', mime: '' }] })); const all = [...state.builtins.filter(s => !state.hidden.includes(s.id)), ...custom], rank = new Map(state.order.map((id, i) => [id, i])); return all.sort((a, b) => (rank.get(a.id) ?? 1e9) - (rank.get(b.id) ?? 1e9)).map((s, i) => ({ ...s, number: String(i + 1).padStart(2, '0') })); });
    const add = (name, stream, page = '') => { name = String(name || '').trim(); const url = httpsUrl(stream), site = page ? httpsUrl(page) : ''; if (!name || name.length > 90)
        throw new Error('Scrivi un nome da 1 a 90 caratteri.'); if (!url)
        throw new Error('Inserisci un URL HTTPS pubblico per lo stream.'); if (page && !site)
        throw new Error('Il sito della stazione deve essere un URL HTTPS valido.'); if (state.custom.length >= 100)
        throw new Error('Puoi salvare al massimo 100 stazioni personali.'); if (state.custom.some(s => s.url === url))
        throw new Error('Questo stream è già presente.'); const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; state.custom.push({ id, name, url, page: site }); state.order.push(id); persist(); return id; };
    const remove = id => { if (state.custom.some(s => s.id === id)) {
        state.custom = state.custom.filter(s => s.id !== id);
        state.order = state.order.filter(x => x !== id);
    }
    else if (state.builtins.some(s => s.id === id) && !state.hidden.includes(id))
        state.hidden.push(id); settings.radioFavorites = (settings.radioFavorites || []).filter(x => x !== id); persist(); };
    const move = (id, direction) => { const visible = list.value.map(x => x.id), at = visible.indexOf(id), to = at + (direction < 0 ? -1 : 1); if (at < 0 || to < 0 || to >= visible.length)
        return; const other = visible[to], a = state.order.indexOf(id), b = state.order.indexOf(other); [state.order[a], state.order[b]] = [state.order[b], state.order[a]]; persist(); };
    const restore = () => { state.hidden = []; persist(); };
    const toggleFavorite = id => { const set = new Set(settings.radioFavorites || []); set.has(id) ? set.delete(id) : set.add(id); settings.radioFavorites = [...set]; };
    return { state, init, list, add, remove, move, restore, toggleFavorite, httpsUrl };
}
