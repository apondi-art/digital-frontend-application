import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createPersonalAccount } from '../api/accountApi'
import { ROUTES } from '../constants/routes'

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function register(formData) {
    setLoading(true)
    try {
      const res = await createPersonalAccount(formData)
      const data = res?.data ?? res
      // Confirm this matches your API — check the console.log below once,
      // then remove it. Adjust the path if it's nested, e.g. data.account.accountNumber.
      console.log('createPersonalAccount response:', data)
      const accountNumber = data?.accountNumber ?? null

      if (!accountNumber) {
        toast.error('Account created, but we could not start verification automatically.')
        navigate(ROUTES.login, { replace: true })
        return true
      }

      navigate(ROUTES.verifyOtp, {
        state: { accountNumber, email: formData.email },
        replace: true,
      })
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