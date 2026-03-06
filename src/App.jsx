import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useStore from './store/useStore'
import Landing    from './components/Landing/Landing'
import AuthGate   from './components/Auth/AuthGate'
import AppShell   from './components/Layout/AppShell'
import Dashboard  from './components/Dashboard/Dashboard'
import Upload     from './components/Upload/Upload'
import Forecast   from './components/Forecast/Forecast'
import AIAdvisor  from './components/AIAdvisor/AIAdvisor'
import SmartCash  from './components/SmartCash/SmartCash'
import Invest     from './components/Invest/Invest'
import Profile    from './components/Profile/Profile'

function ProtectedRoute({ children }) {
  const user = useStore(s => s.user)
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"     element={<Landing />} />
        <Route path="/auth" element={<AuthGate />} />
        <Route path="/app"  element={
          <ProtectedRoute><AppShell /></ProtectedRoute>
        }>
          <Route index              element={<Dashboard />} />
          <Route path="upload"      element={<Upload />} />
          <Route path="dashboard"   element={<Dashboard />} />
          <Route path="forecast"    element={<Forecast />} />
          <Route path="advisor"     element={<AIAdvisor />} />
          <Route path="smartcash"   element={<SmartCash />} />
          <Route path="invest"      element={<Invest />} />
          <Route path="profile"     element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}