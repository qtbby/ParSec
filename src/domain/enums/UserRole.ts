export enum UserRole {
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
  PRIEST = 'PRIEST',
  TREASURER = 'TREASURER',
  STAFF = 'STAFF',
}

export const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.SECRETARY]: 'Secretary',
  [UserRole.PRIEST]: 'Priest',
  [UserRole.TREASURER]: 'Treasurer',
  [UserRole.STAFF]: 'Staff',
}
