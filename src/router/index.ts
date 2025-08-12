import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import AppHome from '@/views/AppHome.vue'
import { createPinia } from 'pinia'
import { useAuth } from '@/stores/auth'

// 如果 main.ts 里已 createPinia，就不需要这里；仅供某些项目结构参考
export const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    {
      path: '/app',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'app.home', component: AppHome },
        // 这里继续加 /app/boards、/app/tasks 等子路由
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach((to) => {
  // 由于守卫里无法自动获取 store 实例，确保已初始化
  const auth = useAuth()
  if (!auth.token) auth.loadFromStorage()

  if (to.meta.requiresAuth && !auth.isAuthed) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthed) {
    return { name: 'app.home' }
  }
})

export default router
