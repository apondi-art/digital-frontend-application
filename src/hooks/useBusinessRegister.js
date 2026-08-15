import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createBusinessAccount } from '../api/businessApi'
import { ROUTES } from '../constants/routes'

export function useBusinessRegister() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function register(formData) {
    setLoading(true)
    try {
      const res = await createBusinessAccount(formData)
      toast.success(res.message ?? 'Business account created!')
      navigate(ROUTES.login)
      return true
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }

  return { register, loading }
}
