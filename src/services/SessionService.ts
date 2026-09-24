import type { User } from '../domain/models/User'

export type SessionLength = 'session' | '1-day' | '7-days' | '30-days'

interface Session {
  user: User
  expiresAt?: number
}

const SESSION_KEY = 'parish-system-session'

export class SessionService {
  start(user: User, length: SessionLength): void {
    const expiresAt = length === 'session' ? undefined : Date.now() + Number(length.split('-')[0]) * 24 * 60 * 60 * 1000
    const storage = length === 'session' ? sessionStorage : localStorage
    storage.setItem(SESSION_KEY, JSON.stringify({ user, expiresAt } satisfies Session))
  }

  get(): User | undefined {
    const raw = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY)
    if (!raw) return undefined
    const session = JSON.parse(raw) as Session
    if (session.expiresAt && session.expiresAt < Date.now()) {
      this.logout()
      return undefined
    }
    return session.user
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(SESSION_KEY)
  }
}
