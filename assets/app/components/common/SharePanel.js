import { ref, reactive, onMounted, watch, nextTick } from '../../app/vue.js';
import AppModal from './AppModal.js';
import AppIcon from './AppIcon.js';
import { useAppStore } from '../../stores/app-store.js';
import { usePhraseStore } from '../../stores/phrase-store.js';
import { useSettingsStore } from '../../stores/settings-store.js';
import { useWeatherStore } from '../../stores/weather-store.js';
import { useAudioStore } from '../../stores/audio-store.js';
import { getGoal } from '../../services/phrase-core.js';
import { makeShareLink } from '../../services/share/share-link.js';
import { renderShareCard, canvasBlob, downloadShareCard } from '../../services/share/share-card-service.js';
export default { name: 'SharePanel', components: { AppModal, AppIcon }, emits: ['close'], setup() {
        const app = useAppStore(), phrases = usePhraseStore(), settings = useSettingsStore().state, weather = useWeatherStore(), audio = useAudioStore(), canvas = ref(null), options = reactive({ clock: true, weather: true, goal: true, radio: true }), busy = ref(false);
        const snapshot = () => { const now = new Date(), phrase = phrases.state.current?.text || 'Un momento per te', goal = getGoal(now, settings), w = weather.state.data, station = audio.selectedStation.value; return { phrase, link: makeShareLink(phrase), theme: document.documentElement.dataset.theme || 'dark', time: options.clock ? new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', hour12: settings.timeFormat === '12' }).format(now) : '', date: options.clock ? new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now) : '', weather: options.weather && settings.weather && w ? `${Math.round(w.temperature)}° · ${w.label}${settings.weatherLabel ? ` · ${settings.weatherLabel}` : ''}` : '', goal: options.goal && goal ? `${settings.goalMode === 'custom' ? (settings.goalTitle || 'Il mio traguardo') : 'Il percorso di quest’anno'} · ${Math.round(goal.progress)}%` : '', station: options.radio && audio.state.playing && audio.state.source === 'radio' && station ? station.name : '' }; };
        const render = async () => { await nextTick(); if (canvas.value)
            renderShareCard(canvas.value, snapshot()); };
        onMounted(() => { render(); weather.refresh().catch(() => { }); });
        watch(options, render, { deep: true });
        watch(() => phrases.state.current?.id, render);
        const copy = async () => { try {
            await navigator.clipboard.writeText(snapshot().link);
            app.toast('Link del pensiero copiato.');
        }
        catch {
            app.toast('Non riesco a copiare il link.');
        } };
        const download = async () => { if (!canvas.value)
            return; busy.value = true; try {
            await downloadShareCard(canvas.value);
            app.toast('Immagine pronta.');
        }
        catch (e) {
            app.toast(e.message);
        }
        finally {
            busy.value = false;
        } };
        const share = async () => { if (!canvas.value)
            return; busy.value = true; try {
            const data = snapshot(), blob = await canvasBlob(canvas.value), file = new File([blob], 'istante.png', { type: 'image/png' });
            if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] })))
                await navigator.share({ title: 'Istante', text: data.phrase, url: data.link, files: [file] });
            else if (navigator.share)
                await navigator.share({ title: 'Istante', text: data.phrase, url: data.link });
            else {
                await downloadShareCard(canvas.value);
                await copy();
            }
        }
        catch (e) {
            if (e?.name !== 'AbortError')
                app.toast('Condivisione non disponibile.');
        }
        finally {
            busy.value = false;
        } };
        return { phrases, settings, options, canvas, busy, share, copy, download };
    }, template: `<AppModal title="Condividi un istante." eyebrow="Share" size="share" @close="$emit('close')"><div class="share-layout"><div class="share-canvas-wrap"><canvas ref="canvas" class="share-canvas"></canvas></div><div class="share-options"><h4>Nella card</h4><div class="toggle-list"><label><span><strong>Orologio e data</strong></span><input v-model="options.clock" type="checkbox"></label><label><span><strong>Meteo</strong></span><input v-model="options.weather" type="checkbox"></label><label><span><strong>Traguardo</strong></span><input v-model="options.goal" type="checkbox"></label><label><span><strong>Radio</strong></span><input v-model="options.radio" type="checkbox"></label></div><p class="field-note">Il QR contiene un link portabile al pensiero. La card viene generata localmente.</p><div class="share-actions"><button class="primary-button" type="button" :disabled="busy" @click="share"><AppIcon name="share"/>Condividi</button><button class="secondary-button" type="button" :disabled="busy" @click="download"><AppIcon name="download"/>Scarica immagine</button><button class="text-button" type="button" @click="copy"><AppIcon name="copy"/>Copia link</button></div></div></div></AppModal>` };
