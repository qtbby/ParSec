import type { User } from '../domain/models/User'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { PasswordService } from './PasswordService'

export class AuthenticationService {
  async authenticate(username: string, password: string, setup: SetupMetadata): Promise<User | undefined> {
    const user = (setup.users ?? [setup.user]).find((candidate) => candidate.active !== false && candidate.username.toLowerCase() === username.trim().toLowerCase())
    if (!user || !user.passwordHash || !user.passwordSalt) return undefined
    return await new PasswordService().verify(password, { passwordHash: user.passwordHash, passwordSalt: user.passwordSalt }) ? user : undefined
  }
}
