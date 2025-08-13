<template>
  <div class="container page-gap">
    <div class="grid grid-cols-12 gap-6 lg:gap-8">
      <!-- 左侧：进行中的项目 -->
      <div class="col-span-12 lg:col-span-8">
        <OngoingProjects :projects="projects" @created="onProjectCreated" />
      </div>

      <!-- 右侧：我的待办（示例不变） -->
      <div class="col-span-12 lg:col-span-4">
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-main">我的待办</h2>
            <RouterLink to="/app/activity" class="btn-ghost text-sm">活动流</RouterLink>
          </div>

          <ul class="mt-4 space-y-3 text-sm">
            <li class="todo">
              <span>📝 完成 PR 评审</span>
              <span class="chip">今天</span>
            </li>
            <li class="todo">
              <span>📦 发布 0.2.0 版本</span>
              <span class="chip">明天</span>
            </li>
            <li class="todo">
              <span>📣 会后纪要整理</span>
              <span class="chip">本周</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import OngoingProjects from '@/components/OngoingProjects.vue'
import type { ProjectItem } from '@/types/project'
import { getMyProjects } from '@/api/projects'

const projects = ref<ProjectItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchMyOngoing() {
  loading.value = true
  error.value = null
  try {
    const { data } = await getMyProjects({
      status: 'ONGOING',
      page: 0,
      size: 8,
      sort: 'lastActivityAt,DESC'
    })
    // 后端如果返回的是 Spring Data Page
    projects.value = Array.isArray(data?.content) ? data.content : data
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.message || '加载项目失败'
  } finally {
    loading.value = false
  }
}

onMounted(fetchMyOngoing)

// 子组件新建成功：把新项目插在最前面（也可以选择调用 fetchMyOngoing() 刷新）
function onProjectCreated(p: ProjectItem) {
  projects.value = [p, ...projects.value]
}
</script>

<style scoped>
.todo {
  display: flex; align-items: center; justify-content: space-between; gap: .75rem;
  padding: .75rem .9rem; border-radius: .75rem; background: var(--surface-2);
  border: 1px solid var(--border);
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.todo:hover {
  background: color-mix(in oklab, var(--surface-2) 88%, var(--primary) 12%);
  border-color: color-mix(in oklab, var(--primary) 35%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);
}
.chip { padding: .2rem .5rem; border-radius: .5rem; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: .75rem; }
.btn-ghost { padding: .35rem .7rem; border-radius: .6rem; background: transparent; border: 1px solid var(--border); color: var(--text); }
.btn-ghost:hover { background: var(--surface-2); }
</style>
