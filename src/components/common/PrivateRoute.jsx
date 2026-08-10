import { Navigate, Outlet } from 'react-router-dom'
import { useAccount } from '../../hooks/useAccount'

// Redirects unauthenticated users to the landing page.
// Accepts either a JWT token (login flow) or an accountNumber (register flow).
export default function PrivateRoute() {
  const { token, accountNumber } = useAccount()
  return (token || accountNumber) ? <Outlet /> : <Navigate to="/" replace />
}
