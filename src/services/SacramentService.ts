import type { Parishioner } from '../domain/models/Parishioner'
import type { SacramentalRecord } from '../domain/models/SacramentalRecord'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { DirectoryHandleService } from './DirectoryHandleService'

export interface SacramentData {
  records: SacramentalRecord[]
  parishioners: Parishioner[]
}

export class SacramentService {
  constructor(private readonly directories = new DirectoryHandleService()) {}

  async load(): Promise<SacramentData> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    const [records, parishioners] = await Promise.all([
      this.directories.readCollection<SacramentalRecord>(handle, ['sacraments'], 'records.json'),
      this.directories.readCollection<Parishioner>(handle, ['parishioners'], 'parishioners.json'),
    ])
    return { records, parishioners }
  }

  async save(_setup: SetupMetadata, data: SacramentData): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeCollection(handle, ['sacraments'], 'records.json', data.records)
  }
}
