import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { UserRole, roleLabels } from '../domain/enums/UserRole'
import { DirectoryHandleService } from '../services/DirectoryHandleService'
import { SetupService } from '../services/SetupService'
import type { LocalDirectoryHandle } from '../infrastructure/filesystem/FileSystemAdapter'

const directoryService = new DirectoryHandleService()
const setupService = new SetupService()

export function SetupPage() {
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN)
  const [parishName, setParishName] = useState('')
  const [directory, setDirectory] = useState<LocalDirectoryHandle>()
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)

  const next = () => { setError(''); setStep((current) => current + 1) }
  const chooseDirectory = async () => {
    setError('')
    try {
      setDirectory(await directoryService.selectDirectory())
      setStep(5)
    } catch (cause) {
      setError(cause instanceof Error && cause.message === 'FILESYSTEM_UNSUPPORTED' ? 'Your current browser does not support local Parish Data storage. Use a recent Chromium-based browser over HTTPS or localhost.' : 'The folder was not selected. Please try again or choose another folder.')
    }
  }
  const finish = async () => {
    if (!directory) return
    setWorking(true)
    setError('')
    try {
      await setupService.complete({ fullName, username, role, parishName, directory, password })
      window.location.assign('/complete')
    } catch {
      setError('Parish System could not prepare that folder. Check the permission and try again.')
      setWorking(false)
    }
  }

  return <main className="workspace-page">
    <header className="topbar"><Link className="brand" to="/">Parish <span>System</span></Link><span className="step-count">Setup · {Math.min(step, 5)} of 5</span></header>
    <div className="setup-shell">
      <div className="progress-row">{['Welcome', 'Account', 'Parish', 'Data location', 'Initialize'].map((label, index) => <span className={index + 1 <= step ? 'active' : ''} key={label}><b>{String(index + 1).padStart(2, '0')}</b>{label}</span>)}</div>
      {step === 1 && <Step title="Welcome to Parish System" detail="A private foundation for the work your parish already does every day." onNext={next}><p className="step-intro">This system allows your parish to manage its information while keeping parish data on your own computer.</p></Step>}
      {step === 2 && <Step title="Start with your office" detail="Create the local account that will open this parish workspace." onNext={next} disabled={!fullName || !username || password.length < 8 || password !== passwordConfirmation}><label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Maria Santos" /></label><label>Username or email<input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="e.g. maria@parish.org" /></label><label>Role<select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>{Object.values(UserRole).map((value) => <option value={value} key={value}>{roleLabels[value]}</option>)}</select></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /></label><label>Confirm password<input type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} /></label></Step>}
      {step === 3 && <Step title="Name your parish" detail="This identity will appear throughout your local workspace." onNext={next} disabled={!parishName}><label>Parish name<input value={parishName} onChange={(event) => setParishName(event.target.value)} placeholder="e.g. Saint Joseph Parish" autoFocus /></label></Step>}
      {step === 4 && <Step title="Choose your data folder" detail="Select the local folder where your parish data will be stored. Parish System will not scan anywhere else on your computer."><div className="folder-prompt"><span className="folder-icon">⌂</span><div><strong>One explicit choice</strong><p>The folder can be anywhere you have permission to use. We will create only the Phase 1 foundation inside it.</p></div></div><button className="button button-primary" onClick={chooseDirectory}>Choose Parish Data Folder <span aria-hidden="true">↗</span></button></Step>}
      {step === 5 && <Step title="Ready to prepare your workspace" detail="Review the folder, then initialize the four foundation directories." onNext={finish} nextLabel={working ? 'Preparing…' : 'Initialize Parish System'} disabled={working || !directory}><div className="selected-folder"><span className="status-dot" /> <div><strong>Parish data folder selected</strong><p>{directory?.name}</p></div></div><div className="folder-tree"><span>ParishSystem/</span><span>↳ account/</span><span>↳ parish/</span><span>↳ system/</span><span>↳ backups/</span></div></Step>}
      {error && <p className="error-message" role="alert">{error}</p>}
    </div>
  </main>
}

function Step({ title, detail, children, onNext, nextLabel = 'Continue', disabled = false }: { title: string; detail: string; children: ReactNode; onNext?: () => void; nextLabel?: string; disabled?: boolean }) {
  return <section className="setup-card"><p className="eyebrow">Parish System setup</p><h1>{title}</h1><p className="step-detail">{detail}</p><div className="form-stack">{children}</div>{onNext && <button className="button button-primary" onClick={onNext} disabled={disabled}>{nextLabel} <span aria-hidden="true">→</span></button>}</section>
}
