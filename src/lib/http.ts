import axios from 'axios'
import { useAuth } from '@/stores/auth'

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}`,
  withCredentials: false,
})

// 请求拦截器：带上 accessToken
http.interceptors.request.use((config) => {
  const auth = useAuth()
  if (auth.accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

// 响应拦截器：401 时尝试刷新（可按你后端改路径/字段）
let refreshing = false
let pending: Array<(token: string) => void> = []

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const auth = useAuth()
    const original = error.config

    if (error.response?.status === 401 && !original._retry && auth.refreshToken) {
      if (refreshing) {
        // 队列等待新的 token
        return new Promise((resolve) => {
          pending.push((token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(http(original))
          })
        })
      }
      original._retry = true
      refreshing = true
      try {
        // 如果你的刷新接口不同，请在这里改：
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/v1/auth/refresh`,
          { refreshToken: auth.refreshToken }
        )
        const newAccess = data?.accessToken
        const newRefresh = data?.refreshToken || auth.refreshToken
        await auth.applyTokens(newAccess, newRefresh)

        // 唤醒队列
        pending.forEach((cb) => cb(newAccess))
        pending = []
        return http(original)
      } catch (e) {
        pending = []
        await auth.logout()
        return Promise.reject(e)
      } finally {
        refreshing = false
      }
    }
    return Promise.reject(error)
  }
)
