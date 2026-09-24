import type { InventoryItem } from '../domain/models/InventoryItem'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { DirectoryHandleService } from './DirectoryHandleService'

export class InventoryService {
  constructor(private readonly directories = new DirectoryHandleService()) {}

  async load(): Promise<InventoryItem[]> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    return this.directories.readCollection<InventoryItem>(handle, ['inventory'], 'items.json')
  }

  async save(_setup: SetupMetadata, items: InventoryItem[]): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeCollection(handle, ['inventory'], 'items.json', items)
  }
}
