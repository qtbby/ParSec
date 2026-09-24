import { UserRole } from '../domain/enums/UserRole'
import type { Parish } from '../domain/models/Parish'
import type { User } from '../domain/models/User'
import type { ParishDataConnection } from '../domain/models/ParishDataConnection'
import { DirectoryHandleService } from './DirectoryHandleService'
import { LocalMetadataRepository } from '../repositories/LocalMetadataRepository'
import type { LocalDirectoryHandle } from '../infrastructure/filesystem/FileSystemAdapter'
import { PasswordService } from './PasswordService'

export interface SetupInput {
  fullName: string
  username: string
  role: UserRole
  parishName: string
  directory: LocalDirectoryHandle
  password: string
}

export class SetupService {
  constructor(
    private readonly directories = new DirectoryHandleService(),
    private readonly metadata = new LocalMetadataRepository(),
    private readonly passwords = new PasswordService(),
  ) {}

  async complete(input: SetupInput): Promise<{ parish: Parish; user: User; connection: ParishDataConnection }> {
    const now = new Date().toISOString()
    const parish = { id: crypto.randomUUID(), parishName: input.parishName, createdAt: now }
    const credential = await this.passwords.hash(input.password)
    const user: User = { id: crypto.randomUUID(), fullName: input.fullName, username: input.username, role: input.role, parishId: parish.id, createdAt: now, active: true, ...credential }
    const connection: ParishDataConnection = { parishId: parish.id, connected: true, status: 'connected', lastChecked: now, storageType: 'local', directoryName: input.directory.name, schemaVersion: 1 }
    await this.directories.initialize(input.directory, parish, user, connection)
    await this.directories.writeUsers(input.directory, [user])
    await this.metadata.saveSetup({ parish, user, users: [user], connection, setupComplete: true })
    return { parish, user, connection }
  }
}
