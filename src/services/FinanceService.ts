import type { FinanceTransaction } from '../domain/models/FinanceTransaction'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { DirectoryHandleService } from './DirectoryHandleService'
import { AuditService } from './AuditService'

export class FinanceService {
  constructor(private readonly directories = new DirectoryHandleService()) {}

  async load(): Promise<FinanceTransaction[]> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    return this.directories.readCollection<FinanceTransaction>(handle, ['finance'], 'transactions.json')
  }

  async save(setup: SetupMetadata, transactions: FinanceTransaction[]): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeCollection(handle, ['finance'], 'transactions.json', transactions)
    await new AuditService(this.directories).record(setup, 'SAVE', 'finance', undefined, `${transactions.length} transaction(s)`)
  }
}
