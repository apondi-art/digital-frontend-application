import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createAdmin } from '../api/adminApi'
import { ROUTES } from '../constants/routes'

export function useAdminRegister() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function registerAdmin(formData) {
    setLoading(true)
    try {
      const res = await createAdmin(formData)
      // Backend returns { data: { firstName, adminId } }
      const adminId = res.data?.adminId ?? null
      toast.success(`Account created! Your Admin ID is: ${adminId ?? 'check your email'}`)
      navigate(ROUTES.adminLogin, {
        state: { adminId, registrationSuccess: true },
        replace: true,
      })
      return true
    } catch {
      // Axios interceptor shows error toast
      return false
    } finally {
      setLoading(false)
    }
  }

  return { registerAdmin, loading }
}
