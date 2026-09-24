export interface Template {
  id: string
  parishId: string
  name: string
  category: string
  fileType: string
  fileName: string
  description?: string
  version?: string
  createdAt: string
  updatedAt?: string
  active: boolean
}
