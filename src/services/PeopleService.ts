import type { Family } from '../domain/models/Family'
import type { Parishioner } from '../domain/models/Parishioner'
import { DirectoryHandleService } from './DirectoryHandleService'
import { LocalMetadataRepository, type SetupMetadata } from '../repositories/LocalMetadataRepository'

export interface PeopleData {
  families: Family[]
  parishioners: Parishioner[]
}

export class PeopleService {
  constructor(
    private readonly directories = new DirectoryHandleService(),
    private readonly metadata = new LocalMetadataRepository(),
  ) {}

  async load(): Promise<PeopleData> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    const [families, parishioners] = await Promise.all([
      this.directories.readCollection<Family>(handle, ['families'], 'families.json'),
      this.directories.readCollection<Parishioner>(handle, ['parishioners'], 'parishioners.json'),
    ])
    return { families, parishioners }
  }

  async save(setup: SetupMetadata, data: PeopleData): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeCollection(handle, ['families'], 'families.json', data.families)
    await this.directories.writeCollection(handle, ['parishioners'], 'parishioners.json', data.parishioners)
    await this.metadata.saveSetup(setup)
  }
}
