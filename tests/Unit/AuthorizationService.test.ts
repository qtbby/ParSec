import { describe, expect, it } from 'vitest'
import { UserRole } from '../../src/domain/enums/UserRole'
import { AuthorizationService } from '../../src/services/AuthorizationService'

const user = (role: UserRole) => ({ id: role, fullName: role, username: role, role, parishId: 'parish', createdAt: new Date().toISOString() })

describe('AuthorizationService', () => {
  const service = new AuthorizationService()

  it('restricts finance and audit to the intended roles', () => {
    expect(service.canAccess(user(UserRole.ADMIN), 'finance')).toBe(true)
    expect(service.canAccess(user(UserRole.TREASURER), 'finance')).toBe(true)
    expect(service.canAccess(user(UserRole.SECRETARY), 'finance')).toBe(false)
    expect(service.canAccess(user(UserRole.ADMIN), 'audit')).toBe(true)
    expect(service.canAccess(user(UserRole.TREASURER), 'audit')).toBe(false)
  })

  it('allows parish work for secretary and priest roles', () => {
    expect(service.canAccess(user(UserRole.SECRETARY), 'parishioners')).toBe(true)
    expect(service.canAccess(user(UserRole.PRIEST), 'sacraments')).toBe(true)
    expect(service.canAccess(user(UserRole.STAFF), 'sacraments')).toBe(false)
  })
})
