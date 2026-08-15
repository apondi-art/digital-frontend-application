import { useState } from 'react'
import toast from 'react-hot-toast'
import { transferFunds } from '../api/transactionApi'
import { getAccountId } from './useAccount'

// Handles POST /api/transaction/transfer
// Returns { transfer, loading, result, error }
// transfer() returns true on success, false on failure — callers use this
// to decide whether to reset the form.
export function useTransfer() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function transfer(payload) {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await transferFunds({ ...payload, accountId: getAccountId() })
      setResult(res.data)
      toast.success(res.message ?? 'Transfer successful')
      return true
    } catch (err) {
      // Axios interceptor already called toast.error(); just capture for inline display
      setError(err.response?.data?.message ?? 'Transfer failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { transfer, loading, result, error }
}
