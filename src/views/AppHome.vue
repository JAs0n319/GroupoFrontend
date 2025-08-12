<template>
  <div class="container page-gap">
    <div class="grid grid-cols-12 gap-6 lg:gap-8">
      <!-- 左侧：进行中的看板 -->
      <div class="col-span-12 lg:col-span-8">
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-main">进行中的看板</h2>
            <RouterLink to="/app/boards" class="btn-ghost text-sm">全部看板</RouterLink>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <RouterLink to="/app/boards/1" class="tile">
              <div class="flex items-start justify-between">
                <div class="font-medium text-main">课程项目 · Sprint 3</div>
                <span class="badge badge-primary">进行中</span>
              </div>
              <div class="text-xs text-muted mt-2">12 张卡片 · 截止 周五</div>
            </RouterLink>

            <RouterLink to="/app/boards/2" class="tile">
              <div class="flex items-start justify-between">
                <div class="font-medium text-main">社团招新官网</div>
                <span class="badge badge-accent">评审中</span>
              </div>
              <div class="text-xs text-muted mt-2">8 张卡片 · 评审中</div>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- 右侧：我的待办 -->
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

<style scoped>
.tile {
  display: block;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  transition: box-shadow .18s ease, transform .18s ease, background .18s ease, border-color .18s ease;
}
.tile:hover {
  background: color-mix(in oklab, var(--surface-2) 85%, var(--primary) 15%);
  border-color: color-mix(in oklab, var(--primary) 40%, var(--border));
  box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary) 22%, transparent);
  transform: translateY(-2px);
}
.tile:active { transform: translateY(-1px); }

.badge {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  padding: .15rem .5rem;
  border-radius: .5rem;
  font-size: .75rem;
  border: 1px solid var(--border);
  color: var(--text);
  background: var(--surface-2);
}
.badge-primary {
  border-color: color-mix(in oklab, var(--primary) 55%, var(--border));
  background: color-mix(in oklab, var(--primary) 20%, var(--surface-2));
}
.badge-accent {
  border-color: color-mix(in oklab, var(--accent) 55%, var(--border));
  background: color-mix(in oklab, var(--accent) 18%, var(--surface-2));
}

.todo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  padding: .75rem .9rem;
  border-radius: .75rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.todo:hover {
  background: color-mix(in oklab, var(--surface-2) 88%, var(--primary) 12%);
  border-color: color-mix(in oklab, var(--primary) 35%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);
}

.chip {
  padding: .2rem .5rem;
  border-radius: .5rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: .75rem;
}
</style>
