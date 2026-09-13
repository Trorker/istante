import AppIcon from './AppIcon.js';
export default {
    name: 'AppModal', components: { AppIcon }, emits: ['close'], props: { title: String, eyebrow: String, size: { type: String, default: 'medium' }, scroll: { type: Boolean, default: true } },
    template: `<div class="modal-layer" @click.self="$emit('close')"><section class="modal-card" :class="['modal-'+size,{ 'modal-scroll':scroll }]" role="dialog" aria-modal="true"><header class="modal-head"><div><p v-if="eyebrow" class="section-label accent">{{eyebrow}}</p><h2>{{title}}</h2></div><button class="icon-button" type="button" aria-label="Chiudi" @click="$emit('close')"><AppIcon name="close"/></button></header><div class="modal-body"><slot/></div><footer v-if="$slots.footer" class="modal-footer"><slot name="footer"/></footer></section></div>`
};
