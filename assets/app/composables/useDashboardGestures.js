import { onMounted, onBeforeUnmount } from '../app/vue.js';
import { useAudioStore } from '../stores/audio-store.js';
export function useDashboardGestures() { const audio = useAudioStore(); let last = 0; const tap = e => { if (e.pointerType === 'mouse' || e.target?.closest?.('button,a,input,select,textarea,[role="button"]'))
    return; const now = Date.now(); if (now - last < 360) {
    last = 0;
    audio.toggle();
}
else
    last = now; }; onMounted(() => document.addEventListener('pointerup', tap, { passive: true })); onBeforeUnmount(() => document.removeEventListener('pointerup', tap)); }
