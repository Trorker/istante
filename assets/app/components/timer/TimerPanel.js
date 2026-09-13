import AppModal from '../common/AppModal.js';
import AppIcon from '../common/AppIcon.js';
import { computed } from '../../app/vue.js';
import { useTimerStore } from '../../stores/timer-store.js';
import { useSettingsStore } from '../../stores/settings-store.js';
export default {
    name: 'TimerPanel',
    components: { AppModal, AppIcon },
    emits: ['close'],
    setup() {
        const timer = useTimerStore();
        const settings = useSettingsStore().state;
        const nudge = delta => timer.setMinutes(settings.timerMinutes + delta);
        const stateLabel = computed(() => timer.state.status === 'running'
            ? 'Respira con il tempo'
            : timer.state.status === 'paused'
                ? 'In pausa'
                : timer.state.status === 'done'
                    ? 'Il tuo tempo è concluso'
                    : 'Scegli la durata');
        return { timer, settings, nudge, stateLabel };
    },
    template: `<AppModal title="Un momento per te." eyebrow="Timer" size="timer" :scroll="false" @close="$emit('close')"><div class="timer-content"><div class="timer-mode-row"><label>Durante<select v-model="settings.timerDuring"><option value="silent">Silenzio</option><option value="radio">Radio</option><option value="ambient">Ambiente</option></select></label><label>Alla fine<select v-model="settings.timerAction"><option value="sound">Suono</option><option value="radio">Radio</option><option value="silent">Silenzio</option></select></label></div><p class="timer-state-label">{{stateLabel}}</p><div class="timer-dial"><svg viewBox="0 0 220 220"><circle class="timer-track" cx="110" cy="110" r="94"/><circle class="timer-progress" cx="110" cy="110" r="94" :style="{'--progress':timer.progress.value}"/></svg><div class="timer-readout"><strong>{{timer.formatted.value}}</strong></div><span class="timer-orbit" :style="{transform:'rotate('+(timer.progress.value*360)+'deg)'}"><i></i></span></div><div class="timer-duration" v-if="timer.state.status==='idle'||timer.state.status==='done'"><button type="button" aria-label="Riduci di un minuto" @click="nudge(-1)"><AppIcon name="minus"/></button><strong>{{settings.timerMinutes}} min</strong><button type="button" aria-label="Aumenta di un minuto" @click="nudge(1)"><AppIcon name="plus"/></button></div><div class="timer-actions"><button v-if="timer.state.status==='idle'||timer.state.status==='paused'||timer.state.status==='done'" class="primary-button" type="button" @click="timer.start"><AppIcon name="play"/>{{timer.state.status==='paused'?'Riprendi':'Avvia'}}</button><button v-if="timer.state.status==='running'" class="primary-button" type="button" @click="timer.pause"><AppIcon name="pause"/>Pausa</button><button v-if="timer.state.status!=='idle'" class="text-button" type="button" @click="timer.reset">Azzera</button></div></div></AppModal>`
};
