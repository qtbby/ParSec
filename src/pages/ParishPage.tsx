import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Parish } from '../domain/models/Parish'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { ParishService } from '../services/ParishService'

const parishService = new ParishService()

export function ParishPage({ setup, onSetupChange }: { setup: SetupMetadata; onSetupChange: (setup: SetupMetadata) => void }) {
  const [parish, setParish] = useState<Parish>(setup.parish)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const update = (field: keyof Parish, value: string) => setParish((current) => ({ ...current, [field]: value }))
  const save = async () => {
    if (!parish.parishName.trim()) { setError('Parish name is required.'); return }
    setError('')
    setMessage('')
    try {
      const updated = await parishService.save(setup, { ...parish, parishName: parish.parishName.trim(), updatedAt: new Date().toISOString() })
      setParish(updated.parish)
      onSetupChange(updated)
      setMessage('Parish information saved locally.')
    } catch {
      setError('The local parish folder is unavailable. Reconnect it before saving parish information.')
    }
  }
  return <main className="workspace-page"><header className="topbar"><Link className="brand" to="/dashboard">Parish <span>System</span></Link><Link className="text-button" to="/dashboard">Back to dashboard</Link></header><div className="parish-shell"><div className="dashboard-heading"><div><p className="eyebrow">Phase 3 · Parish information</p><h1>{parish.parishName || 'Parish profile.'}</h1><p className="step-detail">Keep the identity and public-facing details of your parish in one local profile.</p></div></div><section className="parish-form-card"><div className="form-section"><p className="eyebrow">Identity</p><div className="form-grid"><label>Parish name<input value={parish.parishName} onChange={(event) => update('parishName', event.target.value)} /></label><label>Pastor or parish administrator<input value={parish.pastorName ?? ''} onChange={(event) => update('pastorName', event.target.value)} placeholder="Optional" /></label></div></div><div className="form-section"><p className="eyebrow">Location</p><div className="form-grid"><label className="wide-field">Street address<input value={parish.address ?? ''} onChange={(event) => update('address', event.target.value)} placeholder="Optional" /></label><label>City or municipality<input value={parish.city ?? ''} onChange={(event) => update('city', event.target.value)} placeholder="Optional" /></label><label>Region or state<input value={parish.region ?? ''} onChange={(event) => update('region', event.target.value)} placeholder="Optional" /></label><label>Postal code<input value={parish.postalCode ?? ''} onChange={(event) => update('postalCode', event.target.value)} placeholder="Optional" /></label><label>Country<input value={parish.country ?? ''} onChange={(event) => update('country', event.target.value)} placeholder="Optional" /></label></div></div><div className="form-section"><p className="eyebrow">Contact</p><div className="form-grid"><label>Phone<input value={parish.phone ?? ''} onChange={(event) => update('phone', event.target.value)} placeholder="Optional" /></label><label>Email<input type="email" value={parish.email ?? ''} onChange={(event) => update('email', event.target.value)} placeholder="Optional" /></label><label>Website<input type="url" value={parish.website ?? ''} onChange={(event) => update('website', event.target.value)} placeholder="Optional" /></label><label>Office hours<input value={parish.officeHours ?? ''} onChange={(event) => update('officeHours', event.target.value)} placeholder="e.g. Mon-Fri, 9:00-16:00" /></label></div></div><div className="parish-form-actions"><button className="button button-primary" onClick={() => void save()}>Save parish information <span aria-hidden="true">→</span></button>{error && <p className="error-message" role="alert">{error}</p>}{message && <p className="success-message">{message}</p>}</div></section></div></main>
}
