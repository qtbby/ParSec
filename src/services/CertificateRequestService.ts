import type { CertificateRequest } from '../domain/models/CertificateRequest'
import type { Parishioner } from '../domain/models/Parishioner'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { DirectoryHandleService } from './DirectoryHandleService'

export interface CertificateRequestData {
  requests: CertificateRequest[]
  parishioners: Parishioner[]
}

export class CertificateRequestService {
  constructor(private readonly directories = new DirectoryHandleService()) {}

  async load(): Promise<CertificateRequestData> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    const [requests, parishioners] = await Promise.all([
      this.directories.readCollection<CertificateRequest>(handle, ['requests'], 'certificates.json'),
      this.directories.readCollection<Parishioner>(handle, ['parishioners'], 'parishioners.json'),
    ])
    return { requests, parishioners }
  }

  async save(_setup: SetupMetadata, data: CertificateRequestData): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeCollection(handle, ['requests'], 'certificates.json', data.requests)
  }
}
