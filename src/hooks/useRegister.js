import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createPersonalAccount } from '../api/accountApi'
import { setAccount } from './useAccount'
import { ROUTES } from '../constants/routes'

// Handles POST /api/create-personal-account
export function useRegister() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function register(formData) {
    setLoading(true)
    // Convert blank optional strings to null so the DB unique constraint
    // on bvn/nin doesn't collide when users leave those fields empty
    const payload = {
      ...formData,
      nin: formData.nin || null,
      bvn: formData.bvn || null,
    }
    try {
      const res = await createPersonalAccount(payload)
      const accountNumber = res.data?.accountNumber
      if (!accountNumber) throw new Error('No account number returned by server')
      setAccount({ accountNumber })
      toast.success(res.message ?? 'Account created!')
      navigate(ROUTES.dashboard)
      return true
    } catch {
      // Axios interceptor already showed the toast; just signal failure
      return false
    } finally {
      setLoading(false)
    }
  }

  return { register, loading }
}
