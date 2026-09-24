export interface AuditLog {
  id: string
  parishId: string
  actorUserId?: string
  actorName?: string
  action: string
  resource: string
  resourceId?: string
  createdAt: string
  details?: string
}
