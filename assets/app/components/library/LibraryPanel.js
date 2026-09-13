import { ref, computed, onMounted } from '../../app/vue.js';
import AppModal from '../common/AppModal.js';
import AppIcon from '../common/AppIcon.js';
import { usePhraseStore } from '../../stores/phrase-store.js';
import { useAppStore } from '../../stores/app-store.js';
export default { name: 'LibraryPanel', components: { AppModal, AppIcon }, emits: ['close'], setup() {
        const store = usePhraseStore(), app = useAppStore(), search = ref(''), filter = ref('all'), collections = ref(false), editor = ref(false), editId = ref(''), editTitle = ref(''), editBody = ref('');
        onMounted(() => store.init());
        const historyRows = computed(() => store.state.history.slice().reverse().map(id => store.state.phrases.find(p => p.id === id)).filter(Boolean));
        const rows = computed(() => { const source = filter.value === 'history' ? historyRows.value : store.state.phrases; return source.filter(p => (filter.value === 'favorites' ? store.state.favorites.has(p.text) : true) && (!search.value || p.search.includes(search.value.toLocaleLowerCase('it')))).slice(0, 500); });
        const importFile = async (e) => { const file = e.target.files?.[0]; if (!file)
            return; try {
            const text = await file.text();
            let payload;
            if (file.name.toLowerCase().endsWith('.json'))
                payload = JSON.parse(text);
            else
                payload = { title: file.name.replace(/\.txt$/i, ''), phrases: text.split(/\r?\n/).map(x => x.trim()).filter(Boolean) };
            store.activate(payload);
            app.toast('Raccolta importata.');
        }
        catch (err) {
            app.toast(err.message);
        } e.target.value = ''; };
        const download = () => { const blob = new Blob([JSON.stringify({ title: store.state.collectionName, phrases: store.state.phrases.map(p => p.text) }, null, 2)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'istante-frasi.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
        const install = c => { if (c.payload)
            store.activate(c.payload, c.id, c.title);
        else
            store.activate(c, c.id, c.title); collections.value = false; app.toast('Raccolta attivata.'); };
        const beginCreate = () => { editId.value = ''; editTitle.value = 'La mia raccolta'; editBody.value = ''; editor.value = true; };
        const beginEdit = () => { if (store.state.collectionId === 'builtin')
            return beginCreate(); editId.value = store.state.collectionId; editTitle.value = store.state.collectionName; editBody.value = store.state.phrases.map(p => p.text).join('\n'); editor.value = true; };
        const saveEditor = () => { try {
            const phrases = editBody.value.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
            if (!phrases.length)
                throw new Error('Inserisci almeno un pensiero.');
            const id = editId.value || `personal-${Date.now().toString(36)}`;
            store.activate({ title: editTitle.value || 'La mia raccolta', phrases }, id, editTitle.value);
            editor.value = false;
            collections.value = false;
            app.toast('Raccolta salvata.');
        }
        catch (e) {
            app.toast(e.message);
        } };
        const removeCollection = async (id) => { await store.removeInstalled(id); app.toast('Raccolta rimossa.'); };
        return { store, search, filter, rows, historyRows, collections, editor, editId, editTitle, editBody, importFile, download, install, beginCreate, beginEdit, saveEditor, removeCollection };
    }, template: `<AppModal title="La tua biblioteca." eyebrow="Parole" size="library" @close="$emit('close')"><template v-if="editor"><div class="collection-editor"><label>Titolo<input v-model.trim="editTitle" maxlength="80"></label><label>Pensieri · uno per riga<textarea v-model="editBody" rows="13" placeholder="Scrivi qui…"></textarea></label><div class="form-actions"><button class="primary-button" type="button" @click="saveEditor">Salva raccolta</button><button class="text-button" type="button" @click="editor=false">Annulla</button></div></div></template><template v-else-if="!collections"><div class="library-current"><span><small>Raccolta attiva</small><strong>{{store.state.collectionName}}</strong></span><div class="library-inline-actions"><button v-if="store.state.collectionId!=='builtin'" class="text-button" @click="beginEdit"><AppIcon name="settings"/>Modifica</button><button class="text-button" @click="collections=true"><AppIcon name="collection"/>Vedi raccolte</button></div></div><label class="search-box"><AppIcon name="search"/><input v-model="search" type="search" placeholder="Cerca una parola, un pensiero…"></label><div class="filter-tabs"><button :class="{active:filter==='all'}" @click="filter='all'">Tutte · {{store.state.phrases.length}}</button><button :class="{active:filter==='favorites'}" @click="filter='favorites'">Preferite · {{store.state.favorites.size}}</button><button :class="{active:filter==='history'}" @click="filter='history'">Storico · {{historyRows.length}}</button></div><div class="phrase-list"><article v-for="phrase in rows" :key="phrase.id"><p>{{phrase.text}}</p><button class="icon-button small" :aria-pressed="store.state.favorites.has(phrase.text)" @click="store.toggleFavorite(phrase)"><AppIcon name="heart"/></button></article><p v-if="!rows.length" class="empty-state">Nessuna frase trovata.</p></div><div class="library-footer-actions"><button class="text-button" type="button" @click="beginCreate"><AppIcon name="plus"/>Crea raccolta</button><label class="text-button file-button">Importa JSON o TXT<input hidden type="file" accept=".json,.txt,application/json,text/plain" @change="importFile"></label><button class="text-button" @click="download"><AppIcon name="download"/>Esporta</button></div></template><template v-else><div class="collection-grid"><button class="collection-card" :class="{active:store.state.collectionId==='builtin'}" @click="store.restoreBuiltin();collections=false"><small>Originale</small><strong>Pensieri di Istante</strong><span>1.000 pensieri inclusi nel progetto.</span></button><article v-for="c in store.installedCollections.value" :key="c.id" class="collection-card personal"><button type="button" @click="install(c)"><small>Personale</small><strong>{{c.title}}</strong><span>{{c.count}} pensieri</span></button><button class="icon-button small" type="button" aria-label="Elimina raccolta" @click="removeCollection(c.id)"><AppIcon name="trash"/></button></article><button v-for="c in store.state.catalog" :key="c.id" class="collection-card" :class="{active:store.state.collectionId===c.id}" @click="install(c)"><small>{{c.category}}</small><strong>{{c.title}}</strong><span>{{c.description}}</span></button></div><div class="form-actions"><button class="text-button" @click="beginCreate"><AppIcon name="plus"/>Crea raccolta</button><button class="text-button collection-back" @click="collections=false"><AppIcon name="left"/>Torna alle frasi</button></div></template></AppModal>` };
