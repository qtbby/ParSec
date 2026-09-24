import { FileSystemAdapter, type LocalDirectoryHandle, type LocalFileHandle } from '../infrastructure/filesystem/FileSystemAdapter'
import { LocalMetadataRepository } from '../repositories/LocalMetadataRepository'

export class DirectoryHandleService {
  constructor(
    private readonly adapter = new FileSystemAdapter(),
    private readonly metadata = new LocalMetadataRepository(),
  ) {}

  isSupported(): boolean {
    return this.adapter.isSupported()
  }

  async selectDirectory(): Promise<LocalDirectoryHandle> {
    const handle = await this.adapter.pickDirectory()
    await this.adapter.ensureStructure(handle)
    await this.metadata.saveDirectoryHandle(handle)
    return handle
  }

  async getStoredDirectoryHandle(): Promise<LocalDirectoryHandle | undefined> {
    return this.metadata.getDirectoryHandle()
  }

  async verifyPermission(handle: LocalDirectoryHandle): Promise<PermissionState> {
    return this.adapter.verifyPermission(handle)
  }

  async requestPermission(handle: LocalDirectoryHandle): Promise<boolean> {
    return this.adapter.requestPermission(handle)
  }

  async initialize(handle: LocalDirectoryHandle, parish: unknown, user: unknown, connection: unknown): Promise<void> {
    await this.adapter.ensureStructure(handle)
    await this.adapter.writeJson(handle, ['account'], 'user.json', user)
    await this.adapter.writeJson(handle, ['parish'], 'parish.json', parish)
    await this.adapter.writeJson(handle, ['system'], 'metadata.json', connection)
  }

  writeUsers(handle: LocalDirectoryHandle, users: unknown[]): Promise<void> {
    return this.adapter.writeJson(handle, ['account'], 'users.json', users)
  }

  writeParish(handle: LocalDirectoryHandle, parish: unknown): Promise<void> {
    return this.adapter.writeJson(handle, ['parish'], 'parish.json', parish)
  }

  writeCollection(handle: LocalDirectoryHandle, path: string[], fileName: string, records: unknown[]): Promise<void> {
    return this.adapter.writeJson(handle, path, fileName, records)
  }

  async readCollection<T>(handle: LocalDirectoryHandle, path: string[], fileName: string): Promise<T[]> {
    try {
      return await this.adapter.readJson<T[]>(handle, path, fileName)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotFoundError') return []
      throw error
    }
  }

  readJson<T>(handle: LocalDirectoryHandle, path: string[], fileName: string): Promise<T> {
    return this.adapter.readJson<T>(handle, path, fileName)
  }

  async getFileHandle(handle: LocalDirectoryHandle, path: string[], fileName: string): Promise<LocalFileHandle> {
    let directory = handle
    for (const segment of path) directory = await directory.getDirectoryHandle(segment, { create: true })
    return directory.getFileHandle(fileName, { create: true })
  }

  async removeFile(handle: LocalDirectoryHandle, path: string[], fileName: string): Promise<void> {
    let directory = handle
    for (const segment of path) directory = await directory.getDirectoryHandle(segment)
    const removable = directory as LocalDirectoryHandle & { removeEntry?: (name: string) => Promise<void> }
    if (!removable.removeEntry) throw new Error('FILE_DELETE_UNSUPPORTED')
    await removable.removeEntry(fileName)
  }
}
