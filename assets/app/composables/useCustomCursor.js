import { onMounted, onBeforeUnmount, watch } from '../app/vue.js';
import { useSettingsStore } from '../stores/settings-store.js';
export function useCustomCursor() { const s = useSettingsStore().state; let dot, ring; const fine = () => matchMedia('(hover:hover) and (pointer:fine)').matches; const mount = () => { if (dot)
    return; dot = document.createElement('i'); ring = document.createElement('i'); dot.className = 'custom-cursor-dot'; ring.className = 'custom-cursor-ring'; dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true'); document.body.append(dot, ring); }; const clear = () => { dot?.remove(); ring?.remove(); dot = ring = null; document.documentElement.classList.remove('custom-cursor-on'); }; const apply = () => { if (s.customCursor && fine()) {
    mount();
    document.documentElement.classList.add('custom-cursor-on');
}
else
    clear(); }; const move = e => { if (!dot || !ring)
    return; const transform = `translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`; dot.style.transform = transform; ring.style.transform = transform; ring.classList.toggle('is-action', !!e.target?.closest?.('button,a,[role="button"],input,select,textarea')); }; let stop; onMounted(() => { apply(); document.addEventListener('pointermove', move, { passive: true }); stop = watch(() => s.customCursor, apply); }); onBeforeUnmount(() => { stop?.(); document.removeEventListener('pointermove', move); clear(); }); }
