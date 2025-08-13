export type ProjectStatus = 'ONGOING' | 'PAUSED' | 'ARCHIVED'
export type ProjectRole   = 'OWNER' | 'MANAGER' | 'COLLABORATOR' | 'VIEWER'

export interface ProjectItem {
  id: string
  title: string
  status: ProjectStatus
  description?: string
  slug: string
  createdAt: string
  lastActivityAt: string
  createdById: string
  currentUserRole?: ProjectRole
}
