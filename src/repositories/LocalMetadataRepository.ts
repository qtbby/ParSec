import { IndexedDbAdapter } from '../infrastructure/indexeddb/IndexedDbAdapter'
import type { Parish } from '../domain/models/Parish'
import type { User } from '../domain/models/User'
import type { ParishDataConnection } from '../domain/models/ParishDataConnection'
import type { LocalDirectoryHandle } from '../infrastructure/filesystem/FileSystemAdapter'

export interface SetupMetadata {
  parish: Parish
  user: User
  users?: User[]
  connection: ParishDataConnection
  setupComplete: boolean
}

export class LocalMetadataRepository {
  private readonly storage = new IndexedDbAdapter()

  getSetup(): Promise<SetupMetadata | undefined> {
    return this.storage.get<SetupMetadata>('setup')
  }

  saveSetup(metadata: SetupMetadata): Promise<void> {
    return this.storage.set('setup', metadata)
  }

  getDirectoryHandle(): Promise<LocalDirectoryHandle | undefined> {
    return this.storage.get<LocalDirectoryHandle>('directory-handle')
  }

  saveDirectoryHandle(handle: LocalDirectoryHandle): Promise<void> {
    return this.storage.set('directory-handle', handle)
  }
}
