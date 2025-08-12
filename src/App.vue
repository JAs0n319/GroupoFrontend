<template>
  <div>
    <!-- Header 自己会 Teleport 到 body 并处理 padding-top -->
    <AppHeader />

    <!-- 页面主内容，不再额外加 pt，避免与 body 的 padding-top 重叠 -->
    <main class="mx-auto max-w-7xl px-6">
      <router-view />
    </main>

    <footer class="site-footer">
      Morandi 色系 · 圆角卡片 · 轻毛玻璃 · 桌面端优先
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<style scoped>
.site-footer {
  margin-top: 2.5rem;        /* mt-10 */
  padding: 2rem 0;           /* py-8 */
  text-align: center;
  font-size: 0.75rem;        /* text-xs */
  color: var(--muted);       /* 统一走 theme.css */
  border-top: 1px solid var(--border);
  background: transparent;   /* 保持与页面背景一致 */
}
</style>
