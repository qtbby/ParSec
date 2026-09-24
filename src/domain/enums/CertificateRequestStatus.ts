export enum CertificateRequestStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const certificateStatusLabels: Record<CertificateRequestStatus, string> = {
  [CertificateRequestStatus.PENDING]: 'Pending',
  [CertificateRequestStatus.PROCESSING]: 'Processing',
  [CertificateRequestStatus.READY]: 'Ready',
  [CertificateRequestStatus.COMPLETED]: 'Completed',
  [CertificateRequestStatus.CANCELLED]: 'Cancelled',
}
