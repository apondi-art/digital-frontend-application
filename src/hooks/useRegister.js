import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createPersonalAccount } from '../api/accountApi'
import { loginUser } from '../api/authApi'
import { getUserProfile } from '../api/accountApi'
import { setAccount, clearAccount } from './useAccount'
import { ROUTES } from '../constants/routes'

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function register(formData) {
    setLoading(true)
    try {
      await createPersonalAccount(formData)

      // Silently log in with the just-created credentials to obtain the customerId,
      // then immediately clear the session — the account is still unverified.
      try {
        const authRes = await loginUser({ email: formData.email, password: formData.password })
        const token = authRes.data?.accessToken
        if (token) {
          setAccount({ token })
          const profileRes = await getUserProfile()
          const customerId = profileRes.data?.id ?? null
          clearAccount()
          navigate(ROUTES.verifyOtp, {
            state: { customerId, email: formData.email },
            replace: true,
          })
          return true
        }
      } catch {
        // Silent login failed — fall back to manual login flow
      }

      // Fallback: send to login and let the login → OTP redirect do the work
      toast.success('Account created! Sign in to verify your account.')
      navigate(ROUTES.login, { replace: true })
      return true
    } catch {
      // Axios interceptor already showed the error toast
      return false
    } finally {
      setLoading(false)
    }
  }

  return { register, loading }
}
