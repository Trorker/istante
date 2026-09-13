import { computed, ref, watch, onMounted, onBeforeUnmount } from '../../app/vue.js';
import AppIcon from '../common/AppIcon.js';
import { usePhraseStore } from '../../stores/phrase-store.js';
import { useSettingsStore } from '../../stores/settings-store.js';
import { useAppStore } from '../../stores/app-store.js';
import { typingPlan, erasePlan } from '../../services/typing/typing-service.js';
export default {
    name: 'PhraseWidget',
    components: { AppIcon },
    emits: ['library'],
    setup() {
        const store = usePhraseStore();
        const settings = useSettingsStore().state;
        const app = useAppStore();
        const display = ref('');
        const target = computed(() => store.state.current?.text || '');
        let runToken = 0;
        let stepTimer = 0;
        let repeatTimer = 0;
        const clearTimers = () => {
            runToken++;
            clearTimeout(stepTimer);
            clearTimeout(repeatTimer);
            stepTimer = repeatTimer = 0;
        };
        const scheduleRepeat = token => {
            clearTimeout(repeatTimer);
            const seconds = Number(settings.typingRepeat) || 0;
            if (!settings.typing || seconds <= 0 || app.state.modal)
                return;
            repeatTimer = setTimeout(() => {
                if (token === runToken)
                    animate(true);
            }, seconds * 1000);
        };
        const animate = (eraseFirst = false) => {
            clearTimers();
            const token = runToken;
            if (!settings.typing || !target.value) {
                display.value = target.value;
                return;
            }
            if (app.state.modal || document.hidden) {
                display.value = target.value;
                scheduleRepeat(token);
                return;
            }
            const steps = [];
            if (eraseFirst && settings.typingErase && display.value) {
                steps.push(...erasePlan(display.value, settings.typingSpeed));
                steps.push({ kind: 'pause', wait: 450 });
            }
            else {
                display.value = '';
            }
            steps.push(...typingPlan(target.value, settings));
            let position = 0;
            const advance = () => {
                if (token !== runToken)
                    return;
                const step = steps[position++];
                if (!step) {
                    display.value = target.value;
                    scheduleRepeat(token);
                    return;
                }
                if (step.kind === 'type' || step.kind === 'mistake')
                    display.value += step.glyph;
                else if (step.kind === 'erase')
                    display.value = [...display.value].slice(0, -1).join('');
                stepTimer = setTimeout(advance, Math.max(0, Number(step.wait) || 0));
            };
            advance();
        };
        watch(target, (value, oldValue) => animate(Boolean(oldValue && oldValue !== value)));
        watch(() => [settings.typing, settings.typingSpeed, settings.typingRhythm, settings.typingMistakes, settings.typingErase, settings.typingRepeat], () => animate(false));
        watch(() => app.state.modal, open => { if (open) {
            clearTimers();
            display.value = target.value;
        }
        else
            scheduleRepeat(runToken); });
        onMounted(async () => { await store.init(); animate(false); });
        onBeforeUnmount(clearTimers);
        const favorite = computed(() => Boolean(store.state.current && store.state.favorites.has(store.state.current.text)));
        return { store, settings, display, favorite, next: store.next, toggle: () => store.toggleFavorite() };
    },
    template: `<section class="thought-block"><div class="thought-eyebrow"><span class="tiny-line"></span><h1>{{store.state.scheduleLabel}}</h1><span class="tiny-line"></span></div><div class="quote-wrap"><blockquote>{{display}}<span v-if="settings.typing&&display!==(store.state.current?.text||'')" class="typing-caret"></span></blockquote></div><div class="phrase-actions"><button class="icon-button subtle" type="button" :aria-pressed="favorite" aria-label="Preferita" @click="toggle"><AppIcon name="heart"/></button><button class="text-action" type="button" @click="next"><AppIcon name="shuffle"/>Un altro pensiero</button><button class="icon-button subtle" type="button" aria-label="Biblioteca" @click="$emit('library')"><AppIcon name="collection"/></button></div></section>`
};
