import { useState, useEffect, useCallback } from 'react'
import { getAccountBalance } from '../api/accountApi'

// Fetches account balance on mount and whenever refetch() is called.
// Returns { balance, loading, error, refetch }
export function useBalance() {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBalance = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAccountBalance()
      setBalance(res.data?.balance ?? res.data ?? null)
    } catch {
      setError('Unable to load balance')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return { balance, loading, error, refetch: fetchBalance }
}
