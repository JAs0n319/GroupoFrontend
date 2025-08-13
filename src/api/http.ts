import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // ← 指向后端
})

http.interceptors.request.use((config) => {
  const t = localStorage.getItem('accessToken')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})
