import { describe, expect, it } from 'vitest'
import { PasswordService } from '../../src/services/PasswordService'

describe('PasswordService', () => {
  it('verifies the original password and rejects a different one', async () => {
    const service = new PasswordService()
    const credential = await service.hash('correct horse battery staple')

    await expect(service.verify('correct horse battery staple', credential)).resolves.toBe(true)
    await expect(service.verify('wrong password', credential)).resolves.toBe(false)
    expect(credential.passwordHash).not.toBe('correct horse battery staple')
    expect(credential.passwordSalt).toBeTruthy()
  })
})
