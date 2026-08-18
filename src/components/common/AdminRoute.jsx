import { Navigate, Outlet } from 'react-router-dom'
import { useAccount } from '../../hooks/useAccount'
import { ROUTES } from '../../constants/routes'

// Guards /admin/* routes: requires both a valid token AND role === 'ADMIN'.
// Non-admins are redirected to their own dashboard, not the home page.
export default function AdminRoute() {
  const { token, role } = useAccount()
  if (!token) return <Navigate to="/" replace />
  if (role !== 'ADMIN') return <Navigate to={ROUTES.dashboard} replace />
  return <Outlet />
}
