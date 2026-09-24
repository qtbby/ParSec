import type { Parish } from '../domain/models/Parish'
import { DirectoryHandleService } from './DirectoryHandleService'
import { LocalMetadataRepository, type SetupMetadata } from '../repositories/LocalMetadataRepository'

export class ParishService {
  constructor(
    private readonly directories = new DirectoryHandleService(),
    private readonly metadata = new LocalMetadataRepository(),
  ) {}

  async save(setup: SetupMetadata, parish: Parish): Promise<SetupMetadata> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeParish(handle, parish)
    const updated = { ...setup, parish }
    await this.metadata.saveSetup(updated)
    return updated
  }
}
