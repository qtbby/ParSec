import { UserRole } from '../enums/UserRole'

export type ProtectedResource = 'dashboard' | 'connection' | 'users' | 'parish' | 'parishioners' | 'gkk' | 'sacraments' | 'certificates' | 'events' | 'inventory' | 'finance' | 'audit' | 'backup' | 'templates'

const permissions: Record<UserRole, ProtectedResource[]> = {
  [UserRole.ADMIN]: ['dashboard', 'connection', 'users', 'parish', 'parishioners', 'gkk', 'sacraments', 'certificates', 'events', 'inventory', 'finance', 'audit', 'backup', 'templates'],
  [UserRole.SECRETARY]: ['dashboard', 'connection', 'parishioners', 'gkk', 'sacraments', 'certificates', 'events', 'inventory', 'templates'],
  [UserRole.PRIEST]: ['dashboard', 'connection', 'parishioners', 'gkk', 'sacraments', 'certificates', 'events', 'templates'],
  [UserRole.TREASURER]: ['dashboard', 'connection', 'finance'],
  [UserRole.STAFF]: ['dashboard', 'connection', 'inventory'],
}

export function hasPermission(role: UserRole, resource: ProtectedResource): boolean {
  return permissions[role].includes(resource)
}
