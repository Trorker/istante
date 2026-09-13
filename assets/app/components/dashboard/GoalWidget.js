import { computed, ref, onMounted, onBeforeUnmount } from '../../app/vue.js';
import AppIcon from '../common/AppIcon.js';
import { getGoal } from '../../services/phrase-core.js';
import { useSettingsStore } from '../../stores/settings-store.js';
export default { name: 'GoalWidget', components: { AppIcon }, emits: ['open'], setup() { const s = useSettingsStore().state, now = ref(new Date()); let t; onMounted(() => t = setInterval(() => now.value = new Date(), 1000)); onBeforeUnmount(() => clearInterval(t)); const goal = computed(() => getGoal(now.value, s)); return { goal }; }, template: `<button v-if="goal" class="summary-card goal-card" type="button" @click="$emit('open')"><span class="summary-icon"><AppIcon name="trophy"/></span><span class="summary-copy"><small>Il percorso di quest’anno</small><strong>{{goal.title}}</strong><span class="progress-track"><i :style="{width:goal.progress+'%'}"></i></span><em>{{Math.round(goal.progress)}}%</em></span></button>` };
