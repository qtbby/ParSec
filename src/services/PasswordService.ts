const ITERATIONS = 120_000

function encode(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}

function decode(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

export interface PasswordCredential {
  passwordHash: string
  passwordSalt: string
}

export class PasswordService {
  async hash(password: string): Promise<PasswordCredential> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    return { passwordSalt: encode(salt), passwordHash: await this.derive(password, salt) }
  }

  async verify(password: string, credential: PasswordCredential): Promise<boolean> {
    return (await this.derive(password, decode(credential.passwordSalt))) === credential.passwordHash
  }

  private async derive(password: string, salt: Uint8Array): Promise<string> {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
    const saltBuffer = new ArrayBuffer(salt.byteLength)
    new Uint8Array(saltBuffer).set(salt)
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBuffer, iterations: ITERATIONS, hash: 'SHA-256' }, key, 256)
    return encode(new Uint8Array(bits))
  }
}
