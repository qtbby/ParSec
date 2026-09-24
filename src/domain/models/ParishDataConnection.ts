export type ConnectionStatus = 'connected' | 'permission-required' | 'unavailable'

export interface ParishDataConnection {
  parishId: string
  connected: boolean
  status: ConnectionStatus
  lastChecked: string
  storageType: 'local'
  directoryName: string
  schemaVersion: number
}
