import { defineStore } from 'pinia'
import { http } from '@/api/http'

type User = { id: string; email: string; name?: string } | null

export const useAuth = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    refreshToken: null as string | null,
    user: null as User,
  }),

  getters: {
    // 兼容你的守卫：auth.token / auth.isAuthed
    token: (s) => s.accessToken,
    isAuthed: (s) => !!s.accessToken,
  },

  actions: {
    /** 从本地恢复登录态并刷新 http 头 */
    loadFromStorage() {
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
      const u = localStorage.getItem('user')
      this.user = u ? JSON.parse(u) : null
      if (this.accessToken) {
        http.defaults.headers.Authorization = `Bearer ${this.accessToken}`
      }
    },

    setTokens(access: string, refresh?: string) {
      this.accessToken = access
      localStorage.setItem('accessToken', access)
      http.defaults.headers.Authorization = `Bearer ${access}`
      if (refresh) {
        this.refreshToken = refresh
        localStorage.setItem('refreshToken', refresh)
      }
    },

    setUser(u: NonNullable<User>) {
      this.user = u
      localStorage.setItem('user', JSON.stringify(u))
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      delete http.defaults.headers.Authorization
    },

    /** 登录：保存 token（必要时可再请求 /api/debug/me 拿用户信息） */
    async login(email: string, password: string) {
      const { data } = await http.post('/api/v1/auth/login', { email, password })
      // 你的后端返回 { accessToken, refreshToken }
      this.setTokens(data.accessToken, data.refreshToken)
      // 可选：如果你需要用户信息，可以在这里请求 /api/debug/me 并 setUser(...)
      // const me = await http.get('/api/debug/me'); this.setUser({...})
    },

    /** 注册并自动登录 */
    async register(name: string, email: string, password: string) {
      await http.post('/api/v1/auth/register', { name, email, password })
      // 注册成功后直接复用登录
      await this.login(email, password)
    },

    /** 用 refreshToken 换新 accessToken（可在拦截器里用） */
    async refresh() {
      if (!this.refreshToken) throw new Error('No refresh token')
      const { data } = await http.post('/api/v1/auth/refresh', {
        refreshToken: this.refreshToken,
      })
      this.setTokens(data.accessToken, data.refreshToken) // 你的后端返回的是 {accessToken, refreshToken}
    },
  },
})
