import type { ProtectedResource } from '../domain/interfaces/Permissions'
import { hasPermission } from '../domain/interfaces/Permissions'
import type { User } from '../domain/models/User'

export class AuthorizationService {
  canAccess(user: User, resource: ProtectedResource): boolean {
    return hasPermission(user.role, resource)
  }
}