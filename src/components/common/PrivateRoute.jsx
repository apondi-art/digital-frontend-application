import { Navigate, Outlet } from 'react-router-dom'
import { useAccount } from '../../hooks/useAccount'

// Only a valid JWT token (not just an accountNumber) grants access to protected routes.
// An accountNumber without a token means the user registered but never logged in — no session exists.
export default function PrivateRoute() {
  const { token } = useAccount()
  return token ? <Outlet /> : <Navigate to="/" replace />
}
