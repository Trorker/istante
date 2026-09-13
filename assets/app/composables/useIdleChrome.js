import { onMounted, onBeforeUnmount } from '../app/vue.js';
import { useSettingsStore } from '../stores/settings-store.js';
import { useAppStore } from '../stores/app-store.js';
export function useIdleChrome() { const s = useSettingsStore().state, app = useAppStore(); let pre = 0, idle = 0, last = 0; const clear = () => { clearTimeout(pre); clearTimeout(idle); document.body.classList.remove('is-idle-pre', 'is-idle'); }; const activity = () => { if (Date.now() - last < 180)
    return; last = Date.now(); clear(); if (!s.hideControls || app.state.modal)
    return; pre = setTimeout(() => { if (!app.state.modal && s.hideControls)
    document.body.classList.add('is-idle-pre'); }, 8200); idle = setTimeout(() => { if (!app.state.modal && s.hideControls)
    document.body.classList.add('is-idle'); }, 10000); }; const events = ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'wheel']; onMounted(() => { events.forEach(e => document.addEventListener(e, activity, { passive: true })); activity(); }); onBeforeUnmount(() => { events.forEach(e => document.removeEventListener(e, activity)); clear(); }); return { activity }; }
