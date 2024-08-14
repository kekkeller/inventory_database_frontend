import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import  BootstrapVue3  from 'bootstrap-vue-3';
import { BootstrapIconsPlugin } from "bootstrap-icons-vue";
import VueApexCharts from "vue3-apexcharts";

import './css/index.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import '/tailwind.css'


const app = createApp(App)

app.config.globalProperties.backendLink = 'https://f-itplfo6nya-uc.a.run.app'
app.use(BootstrapVue3)
app.use(BootstrapIconsPlugin);
app.use(router)
app.use(VueApexCharts)
app.use(createPinia())
app.mount('#app')
