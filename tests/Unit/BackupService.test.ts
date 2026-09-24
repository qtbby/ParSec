import { describe, expect, it } from 'vitest'
import { BackupService } from '../../src/services/BackupService'

describe('BackupService', () => {
  it('rejects unsafe backup filenames before accessing storage', async () => {
    await expect(new BackupService().restore({} as never, '../outside.json')).rejects.toThrow('INVALID_BACKUP_NAME')
    await expect(new BackupService().restore({} as never, 'backup-latest.json')).rejects.toThrow('INVALID_BACKUP_NAME')
  })
})
