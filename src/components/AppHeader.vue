<template>
  <!-- 普通流式组件：不 fixed、不 sticky -->
  <header class="z-10">
    <div class="mx-auto max-w-7xl px-6 pt-6 mb-6">
      <div
        class="flex items-center justify-between px-5 py-3 rounded-2xl backdrop-blur shadow-soft border-theme"
        :style="{ background: 'color-mix(in oklab, var(--surface) 82%, transparent)' }"
      >
        <!-- 左：Logo -->
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl" :style="{ background: 'var(--primary)' }"></div>
          <div class="leading-tight">
            <div class="font-semibold text-main">Groupo</div>
            <div class="text-xs text-muted">Project Management</div>
          </div>
        </div>

        <!-- 右：主题切换 + 登录/退出 -->
        <div class="flex items-center gap-2">
          <button @click="toggleDark" class="btn-ghost flex items-center gap-1 text-sm">
            <span v-if="isDark">☀️</span><span v-else>🌙</span>
            <span>{{ isDark ? '浅色' : '深色' }}</span>
          </button>

          <RouterLink to="/" class="btn-ghost">进入首页</RouterLink>
          <RouterLink v-if="!auth.isAuthed" to="/login" class="btn-ghost">登录</RouterLink>
          <template v-else>
            <RouterLink to="/app" class="btn-chip text-sm" title="进入应用">
              {{ auth.user?.name || '用户' }}
            </RouterLink>
            <button @click="onLogout" class="btn-ghost text-sm">退出</button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const auth = useAuth()
const router = useRouter()
const isDark = ref(false)

onMounted(() => {
  // 恢复主题
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
  // 清理我们之前可能设置过的全局内边距/变量
  document.body.style.paddingTop = ''
  document.documentElement.style.removeProperty('--nav-h')
})

const toggleDark = () => {
  const html = document.documentElement
  isDark.value = !isDark.value
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const onLogout = () => {
  auth.logout()
  router.replace('/login')
}
</script>
