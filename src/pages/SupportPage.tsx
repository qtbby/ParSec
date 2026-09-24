import { useState } from 'react'
import { Link } from 'react-router-dom'
import { developerConfig } from '../config/developer.config'

const problemTypes = ['Bug', 'File System Problem', 'Template Problem', 'Login Problem', 'Display Problem', 'Performance Problem', 'Other']

export function SupportPage() {
  const [type, setType] = useState(problemTypes[0])
  const [module, setModule] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState('')
  const browser = navigator.userAgent
  const report = () => { const body = [`Problem Type: ${type}`, `Module: ${module}`, '', 'Description:', description, '', 'Steps to Reproduce:', steps, '', 'Safe technical information:', `Application Version: 0.1.0`, `Browser: ${browser}`, `Timestamp: ${new Date().toISOString()}`].join('\n'); window.location.href = `mailto:${developerConfig.email}?subject=${encodeURIComponent(`Parish System problem: ${type}`)}&body=${encodeURIComponent(body)}` }
  return <main className="workspace-page"><header className="topbar"><Link className="brand" to="/dashboard">Parish <span>System</span></Link><Link className="text-button" to="/dashboard">Back to dashboard</Link></header><div className="center-shell"><section className="connection-card support-card"><p className="eyebrow">Help and contact</p><h1>Developer support.</h1><p className="step-detail">Describe a problem or contact the developer. Parish records, templates, passwords, and local files are never included automatically.</p><div className="support-actions"><a className="button button-secondary" href={`mailto:${developerConfig.email}`}>Contact developer</a><a className="button button-secondary" href={developerConfig.githubUrl} target="_blank" rel="noreferrer">GitHub · @{developerConfig.githubUsername}</a></div><div className="form-section"><p className="eyebrow">Report a problem</p><div className="form-grid"><label>Problem type<select value={type} onChange={(event) => setType(event.target.value)}>{problemTypes.map((item) => <option value={item} key={item}>{item}</option>)}</select></label><label>Module<input value={module} onChange={(event) => setModule(event.target.value)} placeholder="e.g. Templates" /></label><label className="wide-field">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label><label className="wide-field">Steps to reproduce<textarea value={steps} onChange={(event) => setSteps(event.target.value)} /></label></div><button className="button button-primary" onClick={report} disabled={!description.trim()}>Prepare email report <span aria-hidden="true">→</span></button></div><p className="form-note">The report opens your email application for review. Parish data is not collected or sent by this application.</p></section></div></main>
}
