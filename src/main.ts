import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import BootstrapVue3 from 'bootstrap-vue-3';

import './css/index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


const app = createApp(App)
app.use(BootstrapVue3);
app.use(router)
app.use(createPinia())
app.mount('#app')
