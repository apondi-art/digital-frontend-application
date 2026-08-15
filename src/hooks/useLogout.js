import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../api/authApi'
import { clearAccount } from './useAccount'
import { ROUTES } from '../constants/routes'

export function useLogout() {
  const navigate = useNavigate()

  async function logout() {
    try {
      await logoutUser()
    } catch {
      // Fire-and-forget: always clear local state even if backend call fails
      // (e.g. token already expired)
    } finally {
      clearAccount()
      navigate(ROUTES.home)
    }
  }

  return { logout }
}
