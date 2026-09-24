import type { ParishEvent } from '../domain/models/ParishEvent'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { DirectoryHandleService } from './DirectoryHandleService'

export class EventService {
  constructor(private readonly directories = new DirectoryHandleService()) {}

  async load(): Promise<ParishEvent[]> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    return this.directories.readCollection<ParishEvent>(handle, ['events'], 'events.json')
  }

  async save(_setup: SetupMetadata, events: ParishEvent[]): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeCollection(handle, ['events'], 'events.json', events)
  }
}
