import { computed } from '../../app/vue.js';
import { iso, formatTime } from './date-utils.js';
export default { name: 'AgendaView', props: { events: Array }, emits: ['open-event'], setup(props) { const groups = computed(() => { const map = new Map(); for (const e of props.events || []) {
        const key = iso(new Date(e.start));
        if (!map.has(key))
            map.set(key, []);
        map.get(key).push(e);
    } return [...map.entries()].slice(0, 120); }); const dayLabel = k => new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(k + 'T12:00:00')); return { groups, dayLabel, formatTime }; }, template: `<div class="calendar-agenda view-scroll"><section v-for="[day,items] in groups" :key="day" class="agenda-group"><h3>{{dayLabel(day)}}</h3><button v-for="event in items" :key="event.id" class="agenda-event" type="button" @click="$emit('open-event',event)"><time>{{event.allDay?'Tutto il giorno':formatTime(event.start)}}</time><span><strong>{{event.title}}</strong><small v-if="event.location">{{event.location}}</small></span></button></section><div v-if="!groups.length" class="calendar-empty"><strong>Nessun evento in agenda.</strong><span>Aggiungi o aggiorna un calendario dalle impostazioni.</span></div></div>` };
