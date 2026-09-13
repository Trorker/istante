import { onMounted, onBeforeUnmount } from '../app/vue.js';
import { useSettingsStore } from '../stores/settings-store.js';
import { useAudioStore } from '../stores/audio-store.js';
import { useAppStore } from '../stores/app-store.js';
export function useVolumeGesture() { const s = useSettingsStore().state, audio = useAudioStore(), app = useAppStore(); let start = null, lastToast = 0; const down = e => { if (!s.audioVolumeGesture || e.pointerType === 'mouse' || e.clientX < innerWidth - 42)
    return; start = { id: e.pointerId, y: e.clientY, volume: s.audioSource === 'ambient' ? s.ambientVolume : s.audioSource === 'melody' ? s.melodyVolume : s.radioVolume }; }; const move = e => { if (!start || e.pointerId !== start.id)
    return; const delta = (start.y - e.clientY) / Math.max(240, innerHeight * .45) * 100, value = Math.max(0, Math.min(100, Math.round(start.volume + delta))); if (s.audioSource === 'ambient') {
    s.ambientVolume = value;
    audio.setAmbient(value);
}
else if (s.audioSource === 'melody') {
    s.melodyVolume = value;
    audio.setMelody(value);
}
else {
    s.radioVolume = value;
    audio.setRadioVolume(value);
} if (Date.now() - lastToast > 180) {
    lastToast = Date.now();
    app.toast(`Volume ${value}%`, 700);
} e.preventDefault(); }; const up = e => { if (start?.id === e.pointerId)
    start = null; }; onMounted(() => { document.addEventListener('pointerdown', down, { passive: true }); document.addEventListener('pointermove', move, { passive: false }); document.addEventListener('pointerup', up, { passive: true }); document.addEventListener('pointercancel', up, { passive: true }); }); onBeforeUnmount(() => { document.removeEventListener('pointerdown', down); document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); }); }
