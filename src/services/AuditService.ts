import type { AuditLog } from '../domain/models/AuditLog'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { DirectoryHandleService } from './DirectoryHandleService'
import { SessionService } from './SessionService'

export class AuditService {
  constructor(private readonly directories = new DirectoryHandleService()) {}

  async load(): Promise<AuditLog[]> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    return this.directories.readCollection<AuditLog>(handle, ['system'], 'audit.json')
  }

  async record(setup: SetupMetadata, action: string, resource: string, resourceId?: string, details?: string): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) return
    const actor = new SessionService().get()
    const logs = await this.load()
    logs.push({ id: crypto.randomUUID(), parishId: setup.parish.id, actorUserId: actor?.id, actorName: actor?.fullName, action, resource, resourceId, createdAt: new Date().toISOString(), details })
    await this.directories.writeCollection(handle, ['system'], 'audit.json', logs)
  }
}
