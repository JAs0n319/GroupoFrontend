<template>
  <div class="container page-gap">
    <section class="mt-10 grid grid-cols-12 gap-6 lg:gap-8">
      <div class="col-span-12 lg:col-span-7 float-in">
        <div class="card p-8">
          <h1 class="text-4xl font-semibold text-main">
            Groupo ·
            <span :style="{ color: 'var(--primary)' }">项目管理工具</span>
          </h1>
          <p class="mt-4 leading-7 subtle">
            减少沟通成本 · 明确任务责任 · 量化贡献<br>
            让协作既高效又优雅
          </p>

          <div class="mt-6 flex items-center gap-3">
            <button @click="goStart" class="btn-primary">
              开始使用
            </button>
            <RouterLink v-if="!auth.isAuthed" to="/login" class="btn-ghost">
              登录
            </RouterLink>
            <RouterLink to="/preview" class="btn-ghost">
              快速预览
            </RouterLink>
          </div>

          <ul class="mt-8 grid grid-cols-3 gap-3 text-sm">
            <li class="p-4 rounded-2xl bg-surface2 border-theme">🗂️ 看板与任务流</li>
            <li class="p-4 rounded-2xl bg-surface2 border-theme">🧭 责任与截止提醒</li>
            <li class="p-4 rounded-2xl bg-surface2 border-theme">📊 贡献可视化</li>
          </ul>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-5 float-in">
        <div class="card p-6">
          <h2 class="text-lg font-medium text-main">为什么选择 Groupo？</h2>
          <p class="mt-2 subtle">
            专为小型团队的节奏设计：更轻的流程、更清晰的任务关系、更直观的进度反馈。
          </p>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="p-4 rounded-2xl bg-surface2 border-theme">
              <div class="text-sm font-medium text-main">快捷分配</div>
              <div class="text-xs subtle mt-1">指派、标签、优先级一步到位</div>
            </div>
            <div class="p-4 rounded-2xl bg-surface2 border-theme">
              <div class="text-sm font-medium text-main">实时协作</div>
              <div class="text-xs subtle mt-1">评论、@提醒、活动流</div>
            </div>
            <div class="p-4 rounded-2xl bg-surface2 border-theme">
              <div class="text-sm font-medium text-main">可视报表</div>
              <div class="text-xs subtle mt-1">冲刺进度、贡献占比</div>
            </div>
            <div class="p-4 rounded-2xl bg-surface2 border-theme">
              <div class="text-sm font-medium text-main">丝滑体验</div>
              <div class="text-xs subtle mt-1">我不管，反正我设计的就是好看</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const auth = useAuth()
const router = useRouter()

const goStart = () => {
  if (auth.isAuthed) router.push('/app')
  else router.push('/login')
}
</script>
