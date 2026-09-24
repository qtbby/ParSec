import type { User } from '../domain/models/User'
import { DirectoryHandleService } from './DirectoryHandleService'
import { LocalMetadataRepository, type SetupMetadata } from '../repositories/LocalMetadataRepository'
import { UserRole } from '../domain/enums/UserRole'
import { PasswordService } from './PasswordService'
import { AuditService } from './AuditService'

export class AccountService {
  constructor(
    private readonly directories = new DirectoryHandleService(),
    private readonly metadata = new LocalMetadataRepository(),
  ) {}

  list(setup: SetupMetadata): User[] {
    return setup.users?.length ? setup.users : [setup.user]
  }

  async save(setup: SetupMetadata, users: User[]): Promise<SetupMetadata> {
    const activeAdmins = users.filter((user) => user.active !== false && user.role === UserRole.ADMIN)
    if (activeAdmins.length === 0) throw new Error('LAST_ADMIN_REQUIRED')
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeUsers(handle, users)
    const updated = { ...setup, users }
    await this.metadata.saveSetup(updated)
    await new AuditService(this.directories).record(setup, 'SAVE', 'accounts', undefined, `${users.length} account(s)`)
    return updated
  }

  async resetPassword(setup: SetupMetadata, userId: string, password: string): Promise<SetupMetadata> {
    const users = this.list(setup)
    const user = users.find((candidate) => candidate.id === userId)
    if (!user) throw new Error('USER_NOT_FOUND')
    const credential = await new PasswordService().hash(password)
    return this.save(setup, users.map((candidate) => candidate.id === userId ? { ...candidate, ...credential } : candidate))
  }
}
