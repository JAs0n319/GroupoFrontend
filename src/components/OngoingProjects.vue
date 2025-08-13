<template>
  <div class="card p-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-main">进行中的项目</h2>
      <div class="flex items-center gap-2">
        <RouterLink to="/app/projects" class="btn-ghost text-sm">全部项目</RouterLink>
        <button class="btn-primary text-sm" @click="openCreate">＋ 新建</button>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <RouterLink
        v-for="p in projects"
        :key="p.id"
        class="tile"
        :to="`/app/projects/${p.id}`">
        <div class="flex items-start justify-between">
          <div class="font-medium text-main">{{ p.title }}</div>
          <span class="badge" :class="statusClass(p.status)">{{ statusText(p.status) }}</span>
        </div>
        <div class="text-xs text-muted mt-2">
          {{ p.description || '暂无描述' }}
        </div>
      </RouterLink>
    </div>
  </div>

  <!-- 新建项目 Modal -->
  <transition name="fade">
    <div
      v-if="showCreate"
      class="modal-backdrop"
      @click.self="closeCreate"
      @keydown.esc="closeCreate"
      tabindex="-1"
    >
      <div class="modal">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-main">新建项目</h3>
          <button class="icon-btn" @click="closeCreate" aria-label="关闭">✕</button>
        </div>

        <form @submit.prevent="submitCreate" class="space-y-4">
          <div>
            <label class="label">项目名称</label>
            <input v-model.trim="form.title" class="input" placeholder="例如：课程项目 · Sprint 4" autofocus />
            <p v-if="errors.title" class="err">{{ errors.title }}</p>
          </div>

          <div>
            <label class="label">状态</label>
            <select v-model="form.status" class="input">
              <option value="ONGOING">进行中</option>
              <option value="PAUSED">已暂停</option>
              <option value="ARCHIVED">已归档</option>
            </select>
          </div>

          <div>
            <label class="label">描述（可选）</label>
            <textarea v-model.trim="form.desc" class="input" rows="3" placeholder="一句话描述项目目标…"></textarea>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-xs text-muted">创建后可在项目内继续添加列和卡片</div>
            <div class="flex gap-2">
              <button type="button" class="btn-ghost" @click="closeCreate">取消</button>
              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? '创建中…' : '创建' }}
              </button>
            </div>
          </div>

          <p v-if="serverError" class="err mt-1">{{ serverError }}</p>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { createProject } from '@/api/projects'

/** 与后端保持一致的枚举 */
type ProjectStatus = 'ONGOING' | 'PAUSED' | 'ARCHIVED'

/** 最小项目项结构（可根据你现有的 types 替换） */
interface ProjectItem {
  id: string
  title: string
  status: ProjectStatus
  description?: string
}

const props = defineProps<{ projects: ProjectItem[] }>()
const emit = defineEmits<{ (e: 'created', project: ProjectItem): void }>()

// 弹窗与表单
const showCreate = ref(false)
const loading = ref(false)
const serverError = ref('')

const form = reactive<{ title: string; status: ProjectStatus; desc: string }>({
  title: '',
  status: 'ONGOING',
  desc: '',
})
const errors = reactive<{ title: string }>({ title: '' })

function openCreate() {
  serverError.value = ''
  errors.title = ''
  form.title = ''
  form.status = 'ONGOING'
  form.desc = ''
  showCreate.value = true
}
function closeCreate() { showCreate.value = false }

function validate() {
  errors.title = ''
  if (!form.title) errors.title = '请输入项目名称'
  return !errors.title
}

function statusClass(status: ProjectStatus) {
  switch ((status || '').toUpperCase()) {
    case 'ONGOING': return 'badge-primary'
    case 'PAUSED': return ''
    case 'ARCHIVED': return 'badge-accent'
    default: return ''
  }
}
function statusText(status: ProjectStatus) {
  switch ((status || '').toUpperCase()) {
    case 'ONGOING': return '进行中'
    case 'PAUSED': return '已暂停'
    case 'ARCHIVED': return '已归档'
    default: return status
  }
}

async function submitCreate() {
  serverError.value = ''
  if (!validate()) return
  loading.value = true
  try {
    const res = await createProject({
      title: form.title,
      status: form.status,          // 直接传枚举值
      description: form.desc || undefined
    })
    emit('created', res.data as ProjectItem) // 交给父组件更新列表
    closeCreate()
  } catch (e: any) {
    // 兼容你的 ProblemDetail 错误结构
    serverError.value =
      e?.response?.data?.detail ||
      e?.response?.data?.message ||
      e?.message ||
      '创建失败，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ====== 卡片 tile / 状态 badge ====== */
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

/* ====== 按钮 ====== */
.btn-primary {
  padding: .35rem .7rem;
  border-radius: .6rem;
  background: var(--primary);
  color: white;
  border: 1px solid color-mix(in oklab, var(--primary) 70%, var(--border));
  transition: filter .18s, transform .12s;
}
.btn-primary:hover { filter: brightness(0.97); }
.btn-primary:active { transform: translateY(1px); }

.btn-ghost {
  padding: .35rem .7rem;
  border-radius: .6rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}
.btn-ghost:hover { background: var(--surface-2); }

/* ====== 输入控件 ====== */
.label { display:block; font-size:.85rem; color:var(--text); margin-bottom:.35rem; }
.input {
  width: 100%;
  padding: .6rem .75rem;
  border-radius: .6rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  outline: none;
}
.input:focus {
  border-color: color-mix(in oklab, var(--primary) 35%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);
}
.err { color: var(--danger); font-size: .8rem; }

/* ====== 弹窗 ====== */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 50;
  background: color-mix(in oklab, black 28%, transparent);
  display: grid; place-items: center; padding: 1rem;
}
.modal {
  width: 100%; max-width: 560px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 40px rgba(0,0,0,.25);
}

/* 过渡动画（可选） */
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
