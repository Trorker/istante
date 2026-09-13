import { createApp } from './app/vue.js';
import App from './app/App.js';
const app = createApp(App);
app.config.errorHandler = (error, instance, info) => { console.error('[Istante]', info, error); };
app.mount('#app');
