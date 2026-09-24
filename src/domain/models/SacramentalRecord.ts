import type { SacramentType } from '../enums/SacramentType'

export interface SacramentalRecord {
  id: string
  parishId: string
  sacramentType: SacramentType
  parishionerIds: string[]
  date?: string
  ministerName?: string
  place?: string
  registerNumber?: string
  notes?: string
  createdAt: string
  updatedAt?: string
  active?: boolean
}
