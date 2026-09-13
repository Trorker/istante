import { reactive } from '../app/vue.js';
import { readJSON, writeJSON } from '../services/storage/storage.js';
const saved = readJSON('ui', {});
const state = reactive({ settingsSection: saved.settingsSection || 'display', libraryFilter: 'all', calendarSidebar: true });
export function useUiStore() {
    const persist = () => writeJSON('ui', state);
    return { state, persist };
}
