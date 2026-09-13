import { ref } from '../../app/vue.js';
import AppModal from '../common/AppModal.js';
import AppIcon from '../common/AppIcon.js';
import { useCalendarStore } from '../../stores/calendar-store.js';
import { useAppStore } from '../../stores/app-store.js';
export default { name: 'CalendarManager', components: { AppModal, AppIcon }, emits: ['close'], setup() { const cal = useCalendarStore(), app = useAppStore(), name = ref(''), url = ref(''), error = ref(''); const addUrl = () => { error.value = ''; try {
        if (!/^https:\/\//i.test(url.value.trim()))
            throw new Error('Inserisci un link HTTPS al calendario ICS.');
        cal.addSource({ name: name.value.trim() || 'Calendario', url: url.value.trim() });
        name.value = '';
        url.value = '';
        cal.refresh();
    }
    catch (e) {
        error.value = e.message;
    } }; const importFile = async (e) => { const file = e.target.files?.[0]; if (!file)
        return; try {
        const ics = await file.text();
        cal.addSource({ name: file.name.replace(/\.ics$/i, ''), ics });
        app.toast('Calendario importato.');
    }
    catch (err) {
        app.toast(err.message);
    } e.target.value = ''; }; return { cal, name, url, error, addUrl, importFile }; }, template: `<AppModal title="I tuoi calendari." eyebrow="Calendario" size="wide" @close="$emit('close')"><div class="calendar-source-list"><article v-for="source in cal.state.sources" :key="source.id" class="calendar-source-row"><button class="source-toggle" type="button" :aria-pressed="source.enabled" @click="cal.toggleSource(source.id)"><i :style="{background:'var(--calendar-'+source.color+')'}"></i><span><strong>{{source.name}}</strong><small>{{source.url?'Link sincronizzato':'File locale'}}<em v-if="source.error"> · {{source.error}}</em></small></span></button><button class="icon-button small" type="button" aria-label="Elimina" @click="cal.removeSource(source.id)"><AppIcon name="trash"/></button></article><p v-if="!cal.state.sources.length" class="empty-state">Nessun calendario configurato.</p></div><div class="calendar-add"><p class="section-label">Aggiungi calendario</p><label class="stacked-label">Nome<input v-model="name" maxlength="80" placeholder="Lavoro"></label><label class="stacked-label">Link ICS<input v-model="url" type="url" placeholder="https://…/calendar.ics"></label><p v-if="error" class="form-error">{{error}}</p><div class="form-actions"><button class="primary-button" type="button" @click="addUrl"><AppIcon name="link"/>Aggiungi link</button><label class="text-button file-button"><AppIcon name="upload"/>Importa file ICS<input hidden type="file" accept=".ics,text/calendar" @change="importFile"></label></div></div><template #footer><button class="text-button" type="button" @click="cal.refresh"><AppIcon name="refresh"/>Aggiorna adesso</button><button class="primary-button" type="button" @click="$emit('close')">Fatto</button></template></AppModal>` };
