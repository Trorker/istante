import { ref, computed } from '../../app/vue.js';
import AppIcon from './AppIcon.js';
import { readJSON, writeJSON } from '../../services/storage/storage.js';
const STEPS = [
    ['Benvenuto in Istante', 'Uno spazio che non chiede attenzione: te la restituisce.'],
    ['Il tempo', 'L’orologio resta il centro quando vuoi. Puoi nasconderlo o cambiare formato.'],
    ['Un pensiero', 'Le frasi arrivano con il ritmo che scegli e restano tutte nella tua biblioteca.'],
    ['La biblioteca', 'Raccolte, preferiti e importazione restano sul dispositivo.'],
    ['Il cielo', 'Sole, luna e atmosfera accompagnano il momento della giornata.'],
    ['Il meteo', 'Se vuoi, Istante usa la tua posizione per mostrare il tempo senza trasformarsi in una dashboard affollata.'],
    ['Il traguardo', 'Il percorso dell’anno o una data scelta da te, sempre con discrezione.'],
    ['Il calendario', 'Anno, mese, settimana, giorno e agenda sono viste separate e pensate per il tuo schermo.'],
    ['I tuoi calendari', 'Puoi usare link ICS Google, Outlook o altri calendari compatibili, anche tramite il proxy Istante.'],
    ['La colonna sonora', 'Radio, ambienti e melodie condividono lo stesso player.'],
    ['Il timer', 'Un cerchio, un respiro, una durata. Puoi cambiare il suono anche durante la sessione.'],
    ['Condividi', 'Una frase o il link del progetto, senza portare fuori le tue impostazioni personali.'],
    ['È tutto', 'Istante è pronto. Da qui in poi deve restare semplice.']
];
export default { name: 'OnboardingWizard', components: { AppIcon }, emits: ['done'], setup() { const visible = ref(!location.hash.startsWith('#p=') && !readJSON('welcome.v4', false)), index = ref(0); const step = computed(() => STEPS[index.value]); const done = () => { writeJSON('welcome.v4', true); visible.value = false; }; const next = () => { if (index.value >= STEPS.length - 1)
        done();
    else
        index.value++; }; const prev = () => { if (index.value > 0)
        index.value--; }; return { visible, index, step, next, prev, done, total: STEPS.length }; }, template: `<div v-if="visible" class="tour-layer"><section class="tour-card"><div class="tour-top"><span class="tour-count">{{index+1}}/{{total}}</span><button class="icon-button small" @click="done"><AppIcon name="close"/></button></div><div class="tour-visual"><span class="tour-logo">Istante<span>·</span></span><i></i></div><p class="section-label accent">Un momento per te</p><h2>{{step[0]}}</h2><p>{{step[1]}}</p><div class="tour-progress"><i :style="{width:((index+1)/total*100)+'%'}"></i></div><footer><button class="text-button" :disabled="index===0" @click="prev">Indietro</button><button class="primary-button" @click="next">{{index===total-1?'Inizia':'Avanti'}}<AppIcon name="right"/></button></footer></section></div>` };
