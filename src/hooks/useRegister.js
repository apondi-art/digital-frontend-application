import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createPersonalAccount } from '../api/accountApi'
import { ROUTES } from '../constants/routes'

// Handles POST /api/account/create-personal-account
// After success, redirects to /login (not /dashboard) because no JWT is issued at registration.
export function useRegister() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function register(formData) {
    setLoading(true)
    const payload = { ...formData }
    try {
      const res = await createPersonalAccount(payload)
      const accountNumber = res.data?.accountNumber
      if (!accountNumber) throw new Error('No account number returned by server')
      // Navigate to login with a success message — no JWT exists yet so we cannot access protected routes
      navigate(ROUTES.login, {
        state: { registrationSuccess: true, accountNumber },
        replace: true,
      })
      return true
    } catch {
      // Axios interceptor already showed the error toast; just signal failure
      return false
    } finally {
      setLoading(false)
    }
  }

  return { register, loading }
}
