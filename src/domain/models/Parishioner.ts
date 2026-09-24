export interface Parishioner {
  id: string
  parishId: string
  familyId?: string
  firstName: string
  lastName: string
  middleName?: string
  birthDate?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  createdAt: string
  updatedAt?: string
  active?: boolean
}
