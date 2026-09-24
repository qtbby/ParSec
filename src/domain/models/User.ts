import type { UserRole } from '../enums/UserRole'

export interface User {
  id: string
  fullName: string
  username: string
  role: UserRole
  parishId: string
  createdAt: string
  active?: boolean
  passwordHash?: string
  passwordSalt?: string
}
