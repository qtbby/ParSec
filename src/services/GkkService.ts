import type { Gkk } from '../domain/models/Gkk'
import type { Zone } from '../domain/models/Zone'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import type { Parishioner } from '../domain/models/Parishioner'
import { DirectoryHandleService } from './DirectoryHandleService'

export interface GkkData {
  zones: Zone[]
  groups: Gkk[]
  parishioners: Parishioner[]
}

export class GkkService {
  constructor(private readonly directories = new DirectoryHandleService()) {}

  async load(): Promise<GkkData> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    const [zones, groups, parishioners] = await Promise.all([
      this.directories.readCollection<Zone>(handle, ['zones'], 'zones.json'),
      this.directories.readCollection<Gkk>(handle, ['gkk'], 'gkk.json'),
      this.directories.readCollection<Parishioner>(handle, ['parishioners'], 'parishioners.json'),
    ])
    return { zones, groups, parishioners }
  }

  async save(_setup: SetupMetadata, data: GkkData): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeCollection(handle, ['zones'], 'zones.json', data.zones)
    await this.directories.writeCollection(handle, ['gkk'], 'gkk.json', data.groups)
  }
}
