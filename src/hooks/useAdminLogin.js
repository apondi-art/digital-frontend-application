import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginAdmin } from '../api/authApi'
import { setAccount } from './useAccount'
import { ROUTES } from '../constants/routes'

export function useAdminLogin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // formData: { email, password, adminId }
  async function login({ adminId, ...credentials }) {
    setLoading(true)
    try {
      const res = await loginAdmin(credentials, adminId)
      const token = res.data?.accessToken
      if (!token) throw new Error('No access token returned by server')

      setAccount({ token, role: res.data?.role ?? 'ADMIN' })

      toast.success(res.message ?? 'Admin login successful!')
      navigate(ROUTES.adminDashboard, { replace: true })
      return true
    } catch {
      // Axios interceptor already shows the error toast
      return false
    } finally {
      setLoading(false)
    }
  }

  return { login, loading }
}
