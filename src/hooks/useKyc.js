import { useState } from 'react'
import toast from 'react-hot-toast'
import { submitKycDocument } from '../api/kycApi'

export function useKyc() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function submitKyc(formData) {
    setLoading(true)
    setResult(null)
    try {
      const res = await submitKycDocument(formData)
      setResult({ documentType: formData.documentType })
      toast.success(res.message ?? 'Document submitted — pending admin approval.')
      return true
    } catch {
      // Axios interceptor already showed the error toast
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submitKyc, loading, result }
}
