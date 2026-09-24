import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LandingPage } from '../pages/LandingPage'
import { SetupPage } from '../pages/SetupPage'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DataConnectionPage } from '../pages/DataConnectionPage'
import { CompletePage } from '../pages/CompletePage'
import { UsersPage } from '../pages/UsersPage'
import { ParishPage } from '../pages/ParishPage'
import { PeoplePage } from '../pages/PeoplePage'
import { GkkPage } from '../pages/GkkPage'
import { SacramentsPage } from '../pages/SacramentsPage'
import { CertificatesPage } from '../pages/CertificatesPage'
import { CalendarPage } from '../pages/CalendarPage'
import { InventoryPage } from '../pages/InventoryPage'
import { FinancePage } from '../pages/FinancePage'
import { AuditPage } from '../pages/AuditPage'
import { BackupPage } from '../pages/BackupPage'
import { TemplatesPage } from '../pages/TemplatesPage'
import { SupportPage } from '../pages/SupportPage'
import { LocalMetadataRepository, type SetupMetadata } from '../repositories/LocalMetadataRepository'
import { SessionService } from '../services/SessionService'
import { DirectoryHandleService } from '../services/DirectoryHandleService'
import { AuthorizationService } from '../services/AuthorizationService'

const metadata = new LocalMetadataRepository()

export default function App() {
  const [setup, setSetup] = useState<SetupMetadata>()
  const [loaded, setLoaded] = useState(false)
  const [connectionReady, setConnectionReady] = useState(false)
  useEffect(() => {
    let active = true
    const loadWorkspace = async () => {
      try {
        const value = await metadata.getSetup()
        if (!active) return
        setSetup(value)
        if (!value) { setLoaded(true); return }
        const handle = await new DirectoryHandleService().getStoredDirectoryHandle()
        const permission = handle ? await new DirectoryHandleService().verifyPermission(handle) : 'denied'
        if (active) { setConnectionReady(permission === 'granted'); setLoaded(true) }
      } catch {
        if (active) { setConnectionReady(false); setLoaded(true) }
      }
    }
    void loadWorkspace()
    return () => { active = false }
  }, [])
  if (!loaded) return <div className="loading-screen">Loading local workspace...</div>
  return (
    <Routes>
      <Route path="/" element={<Navigate to={!setup ? '/welcome' : connectionReady ? '/login' : '/connection'} replace />} />
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/setup" element={setup ? <Navigate to="/login" replace /> : <SetupPage />} />
      <Route path="/complete" element={setup ? <CompletePage setup={setup} /> : <Navigate to="/welcome" replace />} />
      <Route path="/login" element={setup && connectionReady ? <LoginPage setup={setup} /> : <Navigate to={setup ? '/connection' : '/welcome'} replace />} />
      <Route path="/dashboard" element={setup ? <RequireSession><DashboardPage setup={setup} /></RequireSession> : <Navigate to="/welcome" replace />} />
      <Route path="/connection" element={setup ? <DataConnectionPage setup={setup} onSetupChange={(value) => { setSetup(value); setConnectionReady(value.connection.status === 'connected'); void metadata.saveSetup(value) }} /> : <Navigate to="/welcome" replace />} />
      <Route path="/users" element={setup ? <RequireAuthorization resource="users"><UsersPage setup={setup} onSetupChange={(value) => { setSetup(value); void metadata.saveSetup(value) }} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/parish" element={setup ? <RequireAuthorization resource="parish"><ParishPage setup={setup} onSetupChange={(value) => { setSetup(value); void metadata.saveSetup(value) }} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/people" element={setup ? <RequireAuthorization resource="parishioners"><PeoplePage setup={setup} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/gkk" element={setup ? <RequireAuthorization resource="gkk"><GkkPage setup={setup} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/sacraments" element={setup ? <RequireAuthorization resource="sacraments"><SacramentsPage setup={setup} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/certificates" element={setup ? <RequireAuthorization resource="certificates"><CertificatesPage setup={setup} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/calendar" element={setup ? <RequireAuthorization resource="events"><CalendarPage setup={setup} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/inventory" element={setup ? <RequireAuthorization resource="inventory"><InventoryPage setup={setup} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/finance" element={setup ? <RequireAuthorization resource="finance"><FinancePage setup={setup} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/audit" element={setup ? <RequireAuthorization resource="audit"><AuditPage /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/backup" element={setup ? <RequireAuthorization resource="backup"><BackupPage setup={setup} onSetupChange={(value) => { setSetup(value); void metadata.saveSetup(value) }} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/templates" element={setup ? <RequireAuthorization resource="templates"><TemplatesPage setup={setup} /></RequireAuthorization> : <Navigate to="/welcome" replace />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function RequireAuthorization({ resource, children }: { resource: 'users' | 'parish' | 'parishioners' | 'gkk' | 'sacraments' | 'certificates' | 'events' | 'inventory' | 'finance' | 'audit' | 'backup' | 'templates'; children: ReactNode }) {
  const navigate = useNavigate()
  const user = new SessionService().get()
  useEffect(() => { if (!user || !new AuthorizationService().canAccess(user, resource)) navigate('/dashboard', { replace: true }) }, [navigate, resource, user])
  return <>{children}</>
}

function RequireSession({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => { if (!new SessionService().get()) navigate('/login', { replace: true, state: { from: location.pathname } }) }, [location.pathname, navigate])
  return <>{children}</>
}
