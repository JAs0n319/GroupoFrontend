import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './index.css'

import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || ''
axios.interceptors.request.use((config) => {
  const t = localStorage.getItem('accessToken')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

createApp(App).use(createPinia()).use(router).mount('#app')
