import { http } from './http'

export function createProject(payload: {
  title: string
  status: 'ONGOING' | 'PAUSED' | 'ARCHIVED'
  description?: string
}) {
  return http.post('/api/v1/projects', payload)
}

export function getProjects(params?: {
  status?: string | string[]
  page?: number
  size?: number
  sort?: string
}) {
  return http.get('/api/v1/projects', { params })
}

export function getProject(id: string) {
  return http.get(`/api/v1/projects/${id}`)
}

export function archiveProject(id: string) {
  return http.post(`/api/v1/projects/${id}/archive`)
}

export function restoreProject(id: string) {
  return http.post(`/api/v1/projects/${id}/restore`)
}

export function getMyProjects(params?: {
  q?: string
  status?: string | string[] // 可多选: ?status=ONGOING&status=PAUSED
  page?: number
  size?: number
  sort?: string            // 例如 'lastActivityAt,DESC'
}) {
  return http.get('/api/v1/projects/my', { params })
}
