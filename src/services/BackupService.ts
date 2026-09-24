import type { BackupSnapshot } from '../domain/models/BackupSnapshot'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { DirectoryHandleService } from './DirectoryHandleService'

const BACKUP_NAME = /^backup-\d{8}T\d{6}Z\.json$/

export class BackupService {
  constructor(private readonly directories = new DirectoryHandleService()) {}

  async create(setup: SetupMetadata): Promise<{ name: string; snapshot: BackupSnapshot }> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    const snapshot: BackupSnapshot = {
      schemaVersion: 1,
      applicationVersion: '0.1.0',
      createdAt: new Date().toISOString(),
      parish: setup.parish,
      users: await this.directories.readCollection(handle, ['account'], 'users.json'),
      parishioners: await this.directories.readCollection(handle, ['parishioners'], 'parishioners.json'),
      families: await this.directories.readCollection(handle, ['families'], 'families.json'),
      zones: await this.directories.readCollection(handle, ['zones'], 'zones.json'),
      gkk: await this.directories.readCollection(handle, ['gkk'], 'gkk.json'),
      sacraments: await this.directories.readCollection(handle, ['sacraments'], 'records.json'),
      certificateRequests: await this.directories.readCollection(handle, ['requests'], 'certificates.json'),
      events: await this.directories.readCollection(handle, ['events'], 'events.json'),
      inventory: await this.directories.readCollection(handle, ['inventory'], 'items.json'),
      finance: await this.directories.readCollection(handle, ['finance'], 'transactions.json'),
    }
    const name = `backup-${snapshot.createdAt.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}.json`
    await this.directories.writeCollection(handle, ['backups'], name, [snapshot])
    return { name, snapshot }
  }

  async restore(setup: SetupMetadata, name: string): Promise<SetupMetadata> {
    if (!BACKUP_NAME.test(name)) throw new Error('INVALID_BACKUP_NAME')
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    const snapshots = await this.directories.readCollection<BackupSnapshot>(handle, ['backups'], name)
    const snapshot = snapshots[0]
    if (!snapshot || snapshot.schemaVersion !== 1 || !snapshot.parish?.id) throw new Error('INVALID_BACKUP')
    await this.directories.writeParish(handle, snapshot.parish)
    await this.directories.writeUsers(handle, snapshot.users)
    const collections: Array<[string[], string, unknown[]]> = [
      [['parishioners'], 'parishioners.json', snapshot.parishioners], [['families'], 'families.json', snapshot.families], [['zones'], 'zones.json', snapshot.zones], [['gkk'], 'gkk.json', snapshot.gkk], [['sacraments'], 'records.json', snapshot.sacraments], [['requests'], 'certificates.json', snapshot.certificateRequests], [['events'], 'events.json', snapshot.events], [['inventory'], 'items.json', snapshot.inventory], [['finance'], 'transactions.json', snapshot.finance],
    ]
    for (const [path, file, records] of collections) await this.directories.writeCollection(handle, path, file, records)
    const user = snapshot.users.find((candidate) => candidate.id === setup.user.id) ?? snapshot.users[0] ?? setup.user
    const updated = { ...setup, parish: snapshot.parish, user, users: snapshot.users }
    return updated
  }
}
