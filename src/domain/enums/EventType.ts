export enum EventType {
  LITURGY = 'LITURGY',
  MEETING = 'MEETING',
  GKK = 'GKK',
  OFFICE = 'OFFICE',
  OTHER = 'OTHER',
}

export const eventTypeLabels: Record<EventType, string> = {
  [EventType.LITURGY]: 'Liturgy',
  [EventType.MEETING]: 'Meeting',
  [EventType.GKK]: 'GKK',
  [EventType.OFFICE]: 'Parish office',
  [EventType.OTHER]: 'Other',
}
