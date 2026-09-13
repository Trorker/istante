import { reactive, computed } from '../app/vue.js';
const state = reactive({
    view: 'dashboard',
    modal: null,
    toast: '',
    busy: false,
    receivedPhrase: '',
    online: navigator.onLine,
    update: { available: false, version: '', ready: false, firstSeenAt: 0, autoAt: 0, installing: false, error: '' }
});
let toastTimer = 0;
export function useAppStore() {
    const openView = view => { state.view = view; state.modal = null; };
    const openModal = modal => { state.modal = modal; };
    const closeModal = () => { state.modal = null; };
    const toast = (message, duration = 2800) => {
        state.toast = String(message || '');
        clearTimeout(toastTimer);
        if (state.toast)
            toastTimer = setTimeout(() => { state.toast = ''; }, duration);
    };
    return { state, isDashboard: computed(() => state.view === 'dashboard'), openView, openModal, closeModal, toast };
}
addEventListener('online', () => { state.online = true; });
addEventListener('offline', () => { state.online = false; });
