import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginUser } from '../api/authApi'
import { getUserProfile } from '../api/accountApi'
import { setAccount } from './useAccount'
import { ROUTES } from '../constants/routes'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function login(formData) {
    setLoading(true)
    try {
      const authRes = await loginUser(formData)
      const token = authRes.data?.accessToken
      if (!token) throw new Error('No access token returned by server')

      setAccount({ token, role: authRes.data?.role ?? null })

      const profileRes = await getUserProfile()
      const profile = profileRes.data
      if (profile) {
        setAccount({
          firstName:   profile.firstName,
          lastName:    profile.lastName,
          email:       profile.email,
          phoneNumber: profile.phoneNumber,
          gender:      profile.gender,
          dateOfBirth: profile.dateOfBirth,
          address:     profile.address,
          nin:         profile.nin,
          bvn:         profile.bvn,
        })
      }

      toast.success(authRes.message ?? 'Login successful!')
      navigate(ROUTES.dashboard)
      return true
    } catch {
      // Axios interceptor already showed the error toast
      return false
    } finally {
      setLoading(false)
    }
  }

  return { login, loading }
}
