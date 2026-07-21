import { useState } from 'react'
import toast from 'react-hot-toast'
import { depositFunds } from '../api/transactionApi'

// Handles POST /api/transaction/deposit
// Backend may return 201 (SUCCESSFUL) or 202 (PENDING)
// Returns { deposit, loading, result, error }
export function useDeposit() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function deposit(payload) {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await depositFunds(payload)
      setResult(res.data)
      if (res.data?.status === 'PENDING') {
        toast('Deposit pending — use Re-query to check status', { icon: '⏳' })
      } else {
        toast.success(res.message ?? 'Deposit successful')
      }
      return true
    } catch (err) {
      setError(err.response?.data?.message ?? 'Deposit failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deposit, loading, result, error }
}
