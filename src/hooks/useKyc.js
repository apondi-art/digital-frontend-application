import { useState } from 'react'
import toast from 'react-hot-toast'
import { submitKycDocument } from '../api/kycApi'

export function useKyc() {
  const [loading, setLoading] = useState(false)

  async function submitKyc(formData) {
    setLoading(true)
    try {
      const res = await submitKycDocument(formData)
      toast.success(res.message ?? 'KYC document submitted successfully!')
      return true
    } catch {
      // Axios interceptor already showed the error toast
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submitKyc, loading }
}
