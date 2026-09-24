import type { InventoryCategory } from '../enums/InventoryCategory'

export interface InventoryItem {
  id: string
  parishId: string
  name: string
  category: InventoryCategory
  quantity: number
  unit: string
  reorderThreshold: number
  location?: string
  supplier?: string
  notes?: string
  createdAt: string
  updatedAt?: string
  active?: boolean
}
