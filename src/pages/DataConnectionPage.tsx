import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import type { ParishDataConnection } from '../domain/models/ParishDataConnection'
import { DirectoryHandleService } from '../services/DirectoryHandleService'

export function DataConnectionPage({ setup, onSetupChange }: { setup: SetupMetadata; onSetupChange: (setup: SetupMetadata) => void }) {
  const [status, setStatus] = useState(setup.connection.status)
  const [message, setMessage] = useState('')
  const service = new DirectoryHandleService()
  const check = async () => {
    const handle = await service.getStoredDirectoryHandle()
    if (!handle) { setStatus('unavailable'); return }
    const permission = await service.verifyPermission(handle)
    const nextStatus = permission === 'granted' ? 'connected' : permission === 'prompt' ? 'permission-required' : 'unavailable'
    setStatus(nextStatus)
    const connection: ParishDataConnection = { ...setup.connection, status: nextStatus, connected: nextStatus === 'connected', lastChecked: new Date().toISOString() }
    onSetupChange({ ...setup, connection })
  }
  const reconnect = async () => {
    const handle = await service.getStoredDirectoryHandle()
    if (!handle) { setStatus('unavailable'); setMessage('Parish System can no longer access the selected folder. Please choose it again.'); return }
    const granted = await service.requestPermission(handle)
    if (granted) { await check(); setMessage('Folder access restored.') } else setMessage('Permission was not granted. Please try again when ready.')
  }
  const changeFolder = async () => {
    try {
      const handle = await service.selectDirectory()
      const connection = { ...setup.connection, directoryName: handle.name, status: 'connected' as const, connected: true, lastChecked: new Date().toISOString() }
      onSetupChange({ ...setup, connection })
      setStatus('connected')
      setMessage('A new parish data folder is now connected.')
    } catch {
      setMessage('The folder was not changed. Please try again or choose another folder.')
    }
  }
  return <main className="workspace-page"><header className="topbar"><Link className="brand" to="/dashboard">Parish <span>System</span></Link><Link className="text-button" to="/dashboard">Back to dashboard</Link></header><div className="center-shell"><section className="connection-card"><div className={`connection-hero ${status}`}><span className="large-status-dot" /><div><p className="eyebrow">Local data connection</p><h1>{status === 'connected' ? 'Connected' : status === 'permission-required' ? 'Permission required' : 'Unavailable'}</h1></div></div><div className="connection-details"><div><span>Parish</span><strong>{setup.parish.parishName}</strong></div><div><span>Folder</span><strong>{setup.connection.directoryName}</strong></div><div><span>Last checked</span><strong>{new Date(setup.connection.lastChecked).toLocaleString()}</strong></div><div><span>Storage type</span><strong>Local computer</strong></div></div>{status !== 'connected' && <p className="recovery-note">Parish System can no longer access the selected folder. Please reconnect the folder to continue.</p>}{message && <p className="success-message">{message}</p>}<div className="button-row"><button className="button button-secondary" onClick={check}>Check connection</button><button className="button button-secondary" onClick={changeFolder}>Change folder</button><button className="button button-primary" onClick={reconnect}>Reconnect folder <span aria-hidden="true">↗</span></button></div></section></div></main>
}
