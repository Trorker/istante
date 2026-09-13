import { computed } from '../../app/vue.js';
import { useAppStore } from '../../stores/app-store.js';
import { updateNow } from '../../services/updates/update-service.js';
export default { name: 'UpdateBadge', setup() { const app = useAppStore(); const label = computed(() => app.state.update.installing ? 'Updating…' : 'Update now'); const click = async () => { try {
        await updateNow();
    }
    catch (e) {
        app.toast(e.message);
    } }; return { update: app.state.update, label, click }; }, template: `<button v-if="update.available" class="update-ribbon" type="button" :disabled="update.installing" @click="click" :title="'Aggiorna alla versione '+update.version">{{label}}</button>` };
