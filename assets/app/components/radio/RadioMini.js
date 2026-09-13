import { onMounted, computed } from '../../app/vue.js';
import AppIcon from '../common/AppIcon.js';
import { useAudioStore } from '../../stores/audio-store.js';
import { useSettingsStore } from '../../stores/settings-store.js';
import { AMBIENT_NAMES, MELODY_NAMES } from '../../services/audio/sound-generators.js';
export default {
    name: 'RadioMini',
    components: { AppIcon },
    emits: ['open'],
    setup() {
        const audio = useAudioStore();
        const settings = useSettingsStore().state;
        onMounted(() => audio.init());
        const station = computed(() => audio.selectedStation.value);
        const title = computed(() => {
            if (settings.audioSource === 'ambient')
                return AMBIENT_NAMES[settings.ambientType] || 'Ambiente';
            if (settings.audioSource === 'melody')
                return MELODY_NAMES[settings.melodyType] || 'Melodia';
            return station.value?.name || 'Scegli una stazione';
        });
        const subtitle = computed(() => audio.state.playing ? audio.state.status : settings.audioSource === 'radio' ? audio.state.status : 'Pronto');
        return { audio, title, subtitle };
    },
    template: `<div class="radio-mini"><button class="radio-main" type="button" @click="audio.toggle"><span class="radio-play"><AppIcon :name="audio.state.playing?'pause':'play'"/></span><span class="radio-copy"><small>Colonna sonora</small><strong>{{title}}</strong><em>{{subtitle}}</em></span></button><button class="icon-button small" type="button" aria-label="Apri colonna sonora" @click="$emit('open')"><AppIcon name="headphones"/></button></div>`
};
