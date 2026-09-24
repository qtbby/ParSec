import { Link } from 'react-router-dom'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { roleLabels } from '../domain/enums/UserRole'

export function CompletePage({ setup }: { setup: SetupMetadata }) {
  return <main className="workspace-page"><header className="topbar"><Link className="brand" to="/">Parish <span>System</span></Link><span className="step-count">Setup complete</span></header><div className="center-shell"><section className="complete-card"><div className="check-mark">✓</div><p className="eyebrow">The foundation is ready</p><h1>Setup complete.</h1><p className="step-detail">Your parish workspace has been initialized on your chosen computer.</p><div className="completion-list"><div><span>Parish</span><strong>{setup.parish.parishName}</strong></div><div><span>User</span><strong>{setup.user.fullName}</strong></div><div><span>Role</span><strong>{roleLabels[setup.user.role]}</strong></div><div><span>Data location</span><strong>{setup.connection.directoryName}</strong></div></div><Link className="button button-primary" to="/dashboard">Open dashboard <span aria-hidden="true">→</span></Link></section></div></main>
}
