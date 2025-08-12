<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/stores/auth'

interface ApiErrorData {
  detail?: string
  errors?: Record<string, string>
}
interface ApiError {
  response?: { data?: ApiErrorData }
  message?: string
}

const router = useRouter()
const route = useRoute()
const auth = useAuth()

const tab = ref<'login' | 'register'>('login')
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const onSubmit = async () => {
  if (tab.value === 'register' && name.value.trim().length === 0) {
    error.value = '请填写名字'
    return
  }
  if (password.value.trim().length < 8) {
    error.value = '密码至少 8 位'
    return
  }

  error.value = null
  loading.value = true
  try {
    if (tab.value === 'login') {
      await auth.login(email.value.trim(), password.value.trim())
    } else {
      await auth.register(name.value.trim(), email.value.trim(), password.value.trim())
    }
    const q = route.query?.redirect
    const redirect = typeof q === 'string' && q ? q : '/app'
    router.replace(redirect)
  } catch (err: unknown) {
    const e = err as ApiError
    const d = e.response?.data
    console.log('[AUTH ERROR]', d)
    if (d?.detail) {
      error.value = d.detail
    } else {
      error.value = e.message || '操作失败'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 统一容器与上间距 -->
  <div class="container page-gap">
    <section class="mt-10 grid grid-cols-12 gap-6 lg:gap-8">
      <!-- 左侧：表单 -->
      <div class="col-span-12 md:col-span-6">
        <div class="card p-8">
          <!-- Tab 切换 -->
          <div class="flex gap-2 text-sm">
            <button
              class="tab-btn"
              :class="{ 'tab-btn--active': tab==='login' }"
              @click="tab='login'">登录</button>
            <button
              class="tab-btn"
              :class="{ 'tab-btn--active': tab==='register' }"
              @click="tab='register'">注册</button>
          </div>

          <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
            <div v-if="tab==='register'">
              <label class="label" for="name">名字</label>
              <input id="name" v-model="name" class="input" placeholder="WeakUser" />
            </div>

            <div>
              <label class="label" for="email">邮箱</label>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                class="input"
                placeholder="weak@example.com"
              />
            </div>

            <div>
              <label class="label" for="password">密码</label>
              <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                minlength="8"
                class="input"
                placeholder="至少 8 位"
              />
            </div>

            <button :disabled="loading" class="btn-primary w-full disabled:opacity-60">
              {{ loading ? (tab==='login' ? '登录中…' : '注册中…') : (tab==='login' ? '登录' : '注册并登录') }}
            </button>

            <p v-if="error" class="error-message">{{ error }}</p>
          </form>
        </div>
      </div>

      <!-- 右侧：介绍卡片 -->
      <div class="col-span-12 md:col-span-6">
        <div class="card p-8">
          <h2 class="text-lg font-medium text-main">为什么选择 Groupo？</h2>
          <p class="mt-2 subtle">专为学生团队的节奏设计：更轻的流程、更清晰的任务关系、更直观的进度反馈。</p>
          <ul class="mt-4 grid grid-cols-2 gap-3 text-sm">
            <li class="p-4 rounded-2xl bg-surface2 border-theme">指派、标签、优先级一步到位</li>
            <li class="p-4 rounded-2xl bg-surface2 border-theme">评论、@提醒、活动流</li>
            <li class="p-4 rounded-2xl bg-surface2 border-theme">冲刺进度、贡献占比</li>
            <li class="p-4 rounded-2xl bg-surface2 border-theme">桌面端优先的交互与快捷键</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.label {
  font-size: 0.875rem;
  color: var(--muted);
}
.input {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  outline: none;
  transition: box-shadow .15s ease, border-color .15s ease;
}
.input::placeholder { color: color-mix(in oklab, var(--muted) 70%, transparent); }
.input:focus {
  border-color: color-mix(in oklab, var(--primary) 55%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);
}
.tab-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  transition: background .15s ease, color .15s ease, border-color .15s ease;
}
.tab-btn:hover { background: var(--surface-2); }
.tab-btn--active {
  background: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}
.error-message {
  margin-top: .5rem;
  font-size: .875rem;
  color: var(--danger);
  background: var(--danger-bg);
  border: 1px solid var(--danger);
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
}
.subtle { color: var(--muted); }
</style>
