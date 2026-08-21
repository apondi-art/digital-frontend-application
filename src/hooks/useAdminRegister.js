import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAdmin } from '../api/adminApi'
import { ROUTES } from '../constants/routes'

export function useAdminRegister() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function registerAdmin(formData) {
    setLoading(true)
    try {
      await createAdmin(formData)
      navigate(ROUTES.login, {
        state: { registrationSuccess: true },
        replace: true,
      })
      return true
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }

  return { registerAdmin, loading }
}
