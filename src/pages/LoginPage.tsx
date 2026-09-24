import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthenticationService } from '../services/AuthenticationService'
import { SessionService, type SessionLength } from '../services/SessionService'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { AccountService } from '../services/AccountService'
import { PasswordService } from '../services/PasswordService'

export function LoginPage({ setup }: { setup: SetupMetadata }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState(setup.user.username)
  const [password, setPassword] = useState('')
  const [length, setLength] = useState<SessionLength>('session')
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const login = async () => {
    setWorking(true)
    setError('')
    const user = await new AuthenticationService().authenticate(username, password, setup)
    if (!user) {
      const legacyUser = (setup.users ?? [setup.user]).find((candidate) => candidate.username.toLowerCase() === username.trim().toLowerCase() && !candidate.passwordHash)
      if (!legacyUser || password.length < 8) { setError('The username or password is incorrect.'); setWorking(false); return }
      const updatedUser = { ...legacyUser, ...(await new PasswordService().hash(password)) }
      const updatedSetup = await new AccountService().save(setup, (setup.users ?? [setup.user]).map((candidate) => candidate.id === legacyUser.id ? updatedUser : candidate))
      void updatedSetup
      new SessionService().start(updatedUser, length)
      navigate('/dashboard')
      return
    }
    new SessionService().start(user, length)
    navigate('/dashboard')
  }
  return <main className="workspace-page"><header className="topbar"><Link className="brand" to="/">Parish <span>System</span></Link><span className="topbar-note">Local account</span></header><div className="center-shell"><section className="login-card"><p className="eyebrow">Welcome back</p><h1>Open your parish workspace.</h1><p className="step-detail">Credentials are verified locally. Passwords are never stored in plaintext.</p><div className="form-stack"><label>Username or email<input value={username} onChange={(event) => setUsername(event.target.value)} /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><label>Stay signed in<select value={length} onChange={(event) => setLength(event.target.value as SessionLength)}><option value="session">This session</option><option value="1-day">1 day</option><option value="7-days">7 days</option><option value="30-days">30 days</option></select></label></div>{error && <p className="error-message" role="alert">{error}</p>}<button className="button button-primary" onClick={() => void login()} disabled={working}>{working ? 'Checking...' : 'Open dashboard'} <span aria-hidden="true">→</span></button></section></div></main>
}
