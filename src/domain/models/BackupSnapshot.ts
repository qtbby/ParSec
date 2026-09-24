import type { Family } from './Family'
import type { FinanceTransaction } from './FinanceTransaction'
import type { Gkk } from './Gkk'
import type { InventoryItem } from './InventoryItem'
import type { Parish } from './Parish'
import type { ParishEvent } from './ParishEvent'
import type { Parishioner } from './Parishioner'
import type { SacramentalRecord } from './SacramentalRecord'
import type { User } from './User'
import type { Zone } from './Zone'
import type { CertificateRequest } from './CertificateRequest'

export interface BackupSnapshot {
  schemaVersion: 1
  applicationVersion: string
  createdAt: string
  parish: Parish
  users: User[]
  parishioners: Parishioner[]
  families: Family[]
  zones: Zone[]
  gkk: Gkk[]
  sacraments: SacramentalRecord[]
  certificateRequests: CertificateRequest[]
  events: ParishEvent[]
  inventory: InventoryItem[]
  finance: FinanceTransaction[]
}
