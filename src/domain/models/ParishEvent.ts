import type { EventType } from '../enums/EventType'

export interface ParishEvent {
  id: string
  parishId: string
  title: string
  eventType: EventType
  startDate: string
  startTime?: string
  endDate?: string
  endTime?: string
  allDay: boolean
  location?: string
  description?: string
  createdAt: string
  updatedAt?: string
  active?: boolean
}
