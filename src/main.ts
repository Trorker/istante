import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/tokens.css'
import './styles/base.css'
import './styles/element.css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-drawer.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-switch.css'
import 'element-plus/theme-chalk/el-slider.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-tabs.css'
import { migrateLegacyOnce } from './services/legacyMigration'
import { registerPwa } from './services/pwa'

const app=createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
void migrateLegacyOnce()
void registerPwa()
