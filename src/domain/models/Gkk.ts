export interface Gkk {
  id: string
  parishId: string
  zoneId?: string
  name: string
  meetingDay?: string
  meetingLocation?: string
  leaderIds: string[]
  memberIds: string[]
  notes?: string
  createdAt: string
  updatedAt?: string
  active?: boolean
}
