import { Navigate, Outlet } from 'react-router-dom'
import { useAccount } from '../../hooks/useAccount'

export default function PrivateRoute() {
  const { token, accountNumber } = useAccount()
  return (token || accountNumber) ? <Outlet /> : <Navigate to="/" replace />
}
