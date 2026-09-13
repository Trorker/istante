import { iconPath } from '../../data/icons.js';
export default {
    name: 'AppIcon',
    props: { name: { type: String, default: 'clock' }, label: { type: String, default: '' } },
    computed: { path() { return iconPath(this.name); } },
    template: `<svg class="app-icon" viewBox="0 0 24 24" focusable="false" :aria-hidden="label?'false':'true'" :aria-label="label||null"><path :d="path"/></svg>`
};
