import { defineStore } from 'pinia'
import { http } from '@/lib/http'

type Tokens = { accessToken: string | null; refreshToken: string | null }
type User = { uid?: string; name?: string; email?: string } | null

const STORAGE_KEY = 'groupo_auth'

function decodeJwtPayload(token: string | null): any | null {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch { return null }
}

export const useAuth = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    refreshToken: null as string | null,
    user: null as User,
  }),
  getters: {
    isAuthed: (s) => !!s.accessToken,
  },
  actions: {
    loadFromStorage() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      this.user = data.user
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        user: this.user,
      }))
    },
    async applyTokens(accessToken: string, refreshToken?: string) {
      this.accessToken = accessToken
      if (refreshToken) this.refreshToken = refreshToken
      // 从 accessToken 里取你后端塞的 name / email / uid
      const payload = decodeJwtPayload(this.accessToken)
      this.user = {
        uid: payload?.uid || payload?.sub,
        name: payload?.name,
        email: payload?.sub?.includes('@') ? payload.sub : undefined,
      }
      this.persist()
    },
    async register(name: string, email: string, password: string) {
      // POST {{baseUrl}}/api/v1/auth/register
      await http.post('/auth/register', { name, email, password })
      // 常见做法：注册成功后直接登录
      await this.login(email, password)
    },
    async login(email: string, password: string) {
      // POST {{baseUrl}}/api/v1/auth/login
      const { data } = await http.post('/auth/login', { email, password })
      // 你的返回结构示例里是 { accessToken, refreshToken }
      await this.applyTokens(data.accessToken, data.refreshToken)
    },
    async logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})
