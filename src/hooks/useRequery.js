import { useState } from 'react'
import toast from 'react-hot-toast'
import { requeryTransaction } from '../api/transactionApi'

// Handles PUT /api/transaction/requery/{id}
// Backend randomly resolves PENDING → SUCCESSFUL | DECLINED
// Returns { requery, loading, result, error }
export function useRequery() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function requery(transactionId) {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await requeryTransaction(transactionId)
      setResult(res.data)
      toast.success(res.message ?? `Transaction ${res.data?.status}`)
      return true
    } catch (err) {
      setError(err.response?.data?.message ?? 'Re-query failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { requery, loading, result, error }
}
