<template>
  <div class="min-h-screen grid grid-cols-12">
    <!-- Sidebar -->
    <aside
      class="col-span-12 md:col-span-3 lg:col-span-2 p-4 border-r"
      :style="{ borderColor: 'var(--border)' }"
    >
      <div class="card p-4">
        <div class="text-lg font-semibold text-main">Groupo</div>
        <nav class="mt-4 space-y-1 text-sm">
          <RouterLink
            to="/app"
            :class="[
              'block px-3 py-2 rounded-xl transition',
              isActive('/app') ? 'bg-surface2' : 'hover:bg-surface2'
            ]"
          >🏠 仪表盘</RouterLink>

          <RouterLink
            to="/app/boards"
            :class="[
              'block px-3 py-2 rounded-xl transition',
              isActive('/app/boards') ? 'bg-surface2' : 'hover:bg-surface2'
            ]"
          >🗂️ 看板</RouterLink>

          <RouterLink
            to="/app/reports"
            :class="[
              'block px-3 py-2 rounded-xl transition',
              isActive('/app/reports') ? 'bg-surface2' : 'hover:bg-surface2'
            ]"
          >📊 报表</RouterLink>

          <RouterLink
            to="/app/activity"
            :class="[
              'block px-3 py-2 rounded-xl transition',
              isActive('/app/activity') ? 'bg-surface2' : 'hover:bg-surface2'
            ]"
          >📰 活动流</RouterLink>
        </nav>
      </div>
    </aside>

    <!-- Main -->
    <div class="col-span-12 md:col-span-9 lg:col-span-10">
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

// 当前路由高亮（支持子路由）
const route = useRoute()
const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')
</script>
