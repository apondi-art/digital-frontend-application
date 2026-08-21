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
      await createPersonalAccount(payload)
      // Registration response only returns accountNumber — no customerId is available.
      // Send user to login; if account is PENDING_VERIFICATION, useLogin redirects to /verify-otp.
      toast.success('Account created! Please log in to verify your account.')
      navigate(ROUTES.login, { replace: true })
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
