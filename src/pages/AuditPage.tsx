import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AuditLog } from '../domain/models/AuditLog'
import { AuditService } from '../services/AuditService'

const auditService = new AuditService()

export function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { auditService.load().then((items) => setLogs(items.reverse())).catch(() => setError('The audit log is unavailable.')) }, [])
  const visible = logs.filter((log) => `${log.actorName ?? ''} ${log.action} ${log.resource} ${log.details ?? ''}`.toLowerCase().includes(query.toLowerCase()))
  return <main className="workspace-page"><header className="topbar"><Link className="brand" to="/dashboard">Parish <span>System</span></Link><Link className="text-button" to="/dashboard">Back to dashboard</Link></header><div className="people-shell"><div className="dashboard-heading"><div><p className="eyebrow">Phase 11 · Security</p><h1>Audit log.</h1><p className="step-detail">A local record of sensitive actions in this parish workspace.</p></div></div><div className="people-toolbar"><input className="people-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search audit entries..." /></div><div className="people-list">{error && <p className="error-message">{error}</p>}{visible.length === 0 && !error && <div className="empty-state"><strong>No audit entries yet.</strong><span>Sensitive actions will appear here.</span></div>}{visible.map((log) => <div className="person-row" key={log.id}><div className="avatar">AU</div><div className="person-identity"><strong>{log.action} · {log.resource}</strong><span>{log.actorName ?? 'System'} · {new Date(log.createdAt).toLocaleString()}{log.details ? ` · ${log.details}` : ''}</span></div></div>)}</div></div></main>
}
