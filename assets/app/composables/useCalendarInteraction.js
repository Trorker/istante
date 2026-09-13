import { onMounted, onBeforeUnmount } from '../app/vue.js';
import { useSettingsStore } from '../stores/settings-store.js';
export function useCalendarInteraction({ root, navigate, goDashboard }) {
    const settings = useSettingsStore().state;
    let idleTimer = 0;
    let gesture = null;
    const armIdle = () => {
        clearTimeout(idleTimer);
        if (settings.calendarReturn > 0)
            idleTimer = setTimeout(goDashboard, settings.calendarReturn * 1000);
    };
    const activity = () => armIdle();
    const down = event => {
        if (event.pointerType === 'mouse' && !settings.mouseSwipe)
            return;
        if (event.target?.closest?.('button,a,input,select,textarea,.view-scroll'))
            return;
        gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, bottom: event.clientY > innerHeight - 72 };
    };
    const up = event => {
        if (!gesture || gesture.id !== event.pointerId)
            return;
        const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
        const bottom = gesture.bottom;
        gesture = null;
        if (bottom && dx > 100 && Math.abs(dx) > Math.abs(dy) * 1.25) {
            goDashboard();
            return;
        }
        if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.35)
            navigate(dx < 0 ? 1 : -1);
    };
    onMounted(() => {
        const el = root.value;
        if (!el)
            return;
        ['pointerdown', 'keydown', 'wheel'].forEach(type => el.addEventListener(type, activity, { passive: true }));
        el.addEventListener('pointerdown', down, { passive: true });
        el.addEventListener('pointerup', up, { passive: true });
        el.addEventListener('pointercancel', up, { passive: true });
        armIdle();
    });
    onBeforeUnmount(() => {
        const el = root.value;
        clearTimeout(idleTimer);
        if (!el)
            return;
        ['pointerdown', 'keydown', 'wheel'].forEach(type => el.removeEventListener(type, activity));
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
    });
    return { armIdle };
}
