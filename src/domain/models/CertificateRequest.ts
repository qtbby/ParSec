import type { SacramentType } from '../enums/SacramentType'
import type { CertificateRequestStatus } from '../enums/CertificateRequestStatus'

export interface CertificateRequest {
  id: string
  parishId: string
  parishionerId: string
  certificateType: SacramentType
  requesterName: string
  requesterContact?: string
  purpose?: string
  copies: number
  status: CertificateRequestStatus
  requestedAt: string
  processedAt?: string
  notes?: string
}
