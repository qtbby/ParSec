import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserRole, roleLabels } from '../domain/enums/UserRole'
import type { User } from '../domain/models/User'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { AccountService } from '../services/AccountService'
import { PasswordService } from '../services/PasswordService'

const accounts = new AccountService()

export function UsersPage({ setup, onSetupChange }: { setup: SetupMetadata; onSetupChange: (setup: SetupMetadata) => void }) {
  const [users, setUsers] = useState(() => accounts.list(setup))
  const [editingUser, setEditingUser] = useState<User>()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.STAFF)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const saveUsers = async (nextUsers: User[]) => {
    setError('')
    setMessage('')
    try {
      const updated = await accounts.save(setup, nextUsers)
      setUsers(nextUsers)
      onSetupChange(updated)
      setMessage('Account changes saved locally.')
      return true
    } catch (cause) {
      setError(cause instanceof Error && cause.message === 'LAST_ADMIN_REQUIRED' ? 'At least one active Admin account is required.' : 'The local parish folder is unavailable. Reconnect it before managing accounts.')
      return false
    }
  }

  const addUser = async () => {
    if (!fullName.trim() || !username.trim() || password.length < 8) { setError('Enter a name, username, and password of at least 8 characters.'); return }
    if (users.some((user) => user.username.toLowerCase() === username.trim().toLowerCase())) { setError('That username is already in use.'); return }
    const newUser: User = { id: crypto.randomUUID(), fullName: fullName.trim(), username: username.trim(), role, parishId: setup.parish.id, createdAt: new Date().toISOString(), active: true, ...(await new PasswordService().hash(password)) }
    if (await saveUsers([...users, newUser])) { setFullName(''); setUsername(''); setPassword(''); setRole(UserRole.STAFF) }
  }

  const startEdit = (user: User) => {
    setEditingUser(user)
    setFullName(user.fullName)
    setUsername(user.username)
    setRole(user.role)
    setPassword('')
    setError('')
    setMessage('')
  }

  const saveEdit = async () => {
    if (!editingUser || !fullName.trim() || !username.trim()) return
    if (users.some((user) => user.id !== editingUser.id && user.username.toLowerCase() === username.trim().toLowerCase())) { setError('That username is already in use.'); return }
    let updatedUser: User = { ...editingUser, fullName: fullName.trim(), username: username.trim(), role }
    if (password) {
      if (password.length < 8) { setError('Use at least 8 characters for the new password.'); return }
      updatedUser = { ...updatedUser, ...(await new PasswordService().hash(password)) }
    }
    if (await saveUsers(users.map((user) => user.id === editingUser.id ? updatedUser : user))) { setEditingUser(undefined); setPassword('') }
  }

  const toggleUser = async (user: User) => {
    await saveUsers(users.map((candidate) => candidate.id === user.id ? { ...candidate, active: candidate.active === false } : candidate))
  }

  const cancelEdit = () => { setEditingUser(undefined); setFullName(''); setUsername(''); setPassword(''); setRole(UserRole.STAFF); setError(''); setMessage('') }
  const formTitle = editingUser ? `Edit ${editingUser.fullName}` : 'Give a colleague access.'

  return <main className="workspace-page"><header className="topbar"><Link className="brand" to="/dashboard">Parish <span>System</span></Link><Link className="text-button" to="/dashboard">Back to dashboard</Link></header><div className="account-shell"><div className="dashboard-heading"><div><p className="eyebrow">Phase 2 · Access</p><h1>Local accounts.</h1><p className="step-detail">Manage the people who can open this parish workspace. Account data stays in your selected parish folder.</p></div></div><section className="account-grid"><div className="account-list"><div className="section-heading"><h2>People with access</h2><span>{users.length} account{users.length === 1 ? '' : 's'}</span></div>{users.map((user) => <div className="account-row" key={user.id}><div className="avatar">{user.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="account-identity"><strong>{user.fullName}</strong><span>{user.username} · {roleLabels[user.role]}</span></div><div className="account-actions"><span className={user.active === false ? 'account-status inactive' : 'account-status'}>{user.active === false ? 'Inactive' : 'Active'}</span><button className="text-button" onClick={() => startEdit(user)}>Edit</button>{user.id !== setup.user.id && <button className="text-button" onClick={() => void toggleUser(user)}>{user.active === false ? 'Enable' : 'Disable'}</button>}</div></div>)}</div><div className="account-form"><p className="eyebrow">{editingUser ? 'Edit account' : 'Add account'}</p><h2>{formTitle}</h2><div className="form-stack"><label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Ana Cruz" /></label><label>Username or email<input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="e.g. ana@parish.org" /></label><label>Role<select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>{Object.values(UserRole).map((value) => <option value={value} key={value}>{roleLabels[value]}</option>)}</select></label><label>{editingUser ? 'New password (optional)' : 'Password'}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={editingUser ? 'Leave blank to keep current' : 'At least 8 characters'} /></label></div><div className="button-row">{editingUser && <button className="button button-secondary" onClick={cancelEdit}>Cancel</button>}<button className="button button-primary" onClick={() => void (editingUser ? saveEdit() : addUser())} disabled={!fullName.trim() || !username.trim() || (!editingUser && password.length < 8)}>{editingUser ? 'Save account' : 'Add local account'} <span aria-hidden="true">→</span></button></div><p className="form-note">Only salted password hashes are stored. At least one active Admin must remain.</p></div></section>{error && <p className="error-message" role="alert">{error}</p>}{message && <p className="success-message">{message}</p>}</div></main>
}
