import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { BackupSnapshot } from '../domain/models/BackupSnapshot'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { BackupService } from '../services/BackupService'

const backupService = new BackupService()

export function BackupPage({ setup, onSetupChange }: { setup: SetupMetadata; onSetupChange: (setup: SetupMetadata) => void }) {
  const [name, setName] = useState('')
  const [lastBackup, setLastBackup] = useState<{ name: string; snapshot: BackupSnapshot }>()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const create = async () => { setWorking(true); setError(''); setMessage(''); try { const result = await backupService.create(setup); setLastBackup(result); setName(result.name); setMessage(`Backup ${result.name} was created in the local backups folder.`) } catch { setError('The backup could not be created. Check the folder connection and try again.') } finally { setWorking(false) } }
  const download = () => { if (!lastBackup) return; const blob = new Blob([JSON.stringify(lastBackup.snapshot, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = lastBackup.name; anchor.click(); URL.revokeObjectURL(url) }
  const restore = async () => { if (!name.trim()) { setError('Enter the exact backup filename to restore.'); return }; if (!window.confirm('Restore this backup? Current local records will be replaced.')) return; setWorking(true); setError(''); setMessage(''); try { const updated = await backupService.restore(setup, name.trim()); onSetupChange(updated); setMessage('Backup restored. Reload the workspace before continuing.') } catch { setError('That backup could not be restored. Check the filename and backup schema.') } finally { setWorking(false) } }
  return <main className="workspace-page"><header className="topbar"><Link className="brand" to="/dashboard">Parish <span>System</span></Link><Link className="text-button" to="/dashboard">Back to dashboard</Link></header><div className="center-shell"><section className="connection-card backup-card"><p className="eyebrow">Phase 12 · Resilience</p><h1>Backup and restore.</h1><p className="step-detail">Create explicit snapshots of Parish System data, download them for migration, or restore a named snapshot.</p><div className="backup-actions"><button className="button button-primary" onClick={() => void create()} disabled={working}>{working ? 'Working...' : 'Create backup'} <span aria-hidden="true">→</span></button><button className="button button-secondary" onClick={download} disabled={!lastBackup}>Download latest</button></div>{lastBackup && <p className="success-message">Latest snapshot: {lastBackup.name}</p>}<div className="form-stack"><label>Backup filename to restore<input value={name} onChange={(event) => setName(event.target.value)} placeholder="backup-20260924T120000Z.json" /></label></div><button className="button button-secondary" onClick={() => void restore()} disabled={working}>Restore named backup</button><p className="form-note">Restore replaces the application records in the selected parish folder. It does not change the browser permission or scan other folders.</p>{error && <p className="error-message" role="alert">{error}</p>}{message && <p className="success-message">{message}</p>}</section></div></main>
}
