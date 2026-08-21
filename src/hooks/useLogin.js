import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginUser } from '../api/authApi'
import { getUserProfile } from '../api/accountApi'
import { setAccount, clearAccount } from './useAccount'
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

      // Store token temporarily so getUserProfile() can fire authenticated
      setAccount({ token, role: authRes.data?.role ?? null })

      const profileRes = await getUserProfile()
      const profile = profileRes.data

      // Status lives at profile.accountDto.accountStatus (AccountStatus enum)
      const accountStatus = profile?.accountDto?.accountStatus ?? ''
      if (accountStatus === 'PENDING_VERIFICATION') {
        // Clear the token — this user must verify first
        clearAccount()
        toast.error('Your account is not verified yet. Please enter your OTP.')
        navigate(ROUTES.verifyOtp, {
          state: { customerId: profile?.id ?? null, email: formData.email },
          replace: true,
        })
        return false
      }

      if (profile) {
        setAccount({
          accountId:     profile.id,
          firstName:     profile.firstName,
          lastName:      profile.lastName,
          email:         profile.email,
          phoneNumber:   profile.phoneNumber,
          gender:        profile.gender,
          dateOfBirth:   profile.dateOfBirth,
          address:       profile.address,
          nin:           profile.nin,
          bvn:           profile.bvn,
          accountNumber: profile.accountDto?.accountNumber ?? null,
          accountTier:   profile.accountDto?.accountTier   ?? null,
        })
      }

      toast.success(authRes.message ?? 'Login successful!')
      // Route based on role — backend Role enum: ADMIN | EMPLOYEE | CUSTOMER
      const role = authRes.data?.role
      if (role === 'ADMIN') {
        navigate(ROUTES.adminDashboard)
      } else {
        navigate(ROUTES.dashboard)
      }
      return true
    } catch (err) {
      // If the backend says the account isn't verified yet, send them to OTP page
      const errData = err?.response?.data
      const errMsg = (errData?.message ?? errData?.error ?? '').toLowerCase()
      const isUnverified =
        errMsg.includes('pending_verification') ||
        errMsg.includes('verif') ||
        errMsg.includes('otp') ||
        errMsg.includes('not activated') ||
        errMsg.includes('not active') ||
        err?.response?.status === 403

      if (isUnverified) {
        const customerId = errData?.customerId ?? errData?.id ?? null
        const email = formData.email ?? null
        toast.error('Please verify your account first.')
        navigate(ROUTES.verifyOtp, { state: { customerId, email }, replace: true })
        return false
      }

      // Axios interceptor already showed the error toast for other errors
      return false
    } finally {
      setLoading(false)
    }
  }

  return { login, loading }
}
