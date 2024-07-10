import './assets/main.css'
import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

axios.defaults.baseURL = import.meta.env.VITE_JIBBER_BASE_URL
axios.defaults.headers["Access-Control-Allow-Origin"] = "*"
axios.defaults.headers["Access-Control-Allow-Methods"] = "*"
axios.defaults.withCredentials = true

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
