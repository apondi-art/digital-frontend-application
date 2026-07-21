import { Navigate, Outlet } from 'react-router-dom'
import { useAccount } from '../../hooks/useAccount'

// Redirects unauthenticated users to the landing page.
// "Authenticated" here means the user has completed registration and has an accountNumber
// in memory — matches the backend's current no-session design.
export default function PrivateRoute() {
  const { accountNumber } = useAccount()
  return accountNumber ? <Outlet /> : <Navigate to="/" replace />
}
