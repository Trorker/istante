import AppModal from './AppModal.js';
import AppIcon from './AppIcon.js';
import { useAppStore } from '../../stores/app-store.js';
import { usePhraseStore } from '../../stores/phrase-store.js';
export default {
    name: 'ReceivedPhrasePanel',
    components: { AppModal, AppIcon },
    emits: ['close'],
    setup(_, { emit }) {
        const app = useAppStore();
        const phrases = usePhraseStore();
        const close = () => {
            if (location.hash.startsWith('#p='))
                history.replaceState(null, '', location.pathname + location.search);
            app.state.receivedPhrase = '';
            emit('close');
        };
        const save = async () => {
            try {
                await phrases.init();
                const added = phrases.saveReceived(app.state.receivedPhrase);
                app.toast(added ? 'Pensiero conservato nella biblioteca e nei preferiti.' : 'Questo pensiero era già nella biblioteca.');
            }
            catch (error) {
                app.toast(error.message || 'Non riesco a conservare questo pensiero.');
            }
        };
        return { app, save, close };
    },
    template: `<AppModal title="Questo istante è per te." eyebrow="Un pensiero arrivato fino a te" size="received" @close="close"><blockquote class="received-quote">{{app.state.receivedPhrase}}</blockquote><p class="field-note">Una frase condivisa da un'altra persona. Non modifica la raccolta attiva finché non scegli di conservarla.</p><div class="form-actions"><button class="secondary-button" type="button" @click="save"><AppIcon name="heart"/>Conserva nella biblioteca</button><button class="text-button" type="button" @click="close">Entra in Istante</button></div></AppModal>`
};
