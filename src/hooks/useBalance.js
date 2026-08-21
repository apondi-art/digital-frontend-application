import { useState, useEffect, useCallback } from 'react'
import { getUserProfile } from '../api/accountApi'

// Balance is not a standalone endpoint — extract from user profile's accountDto.
// Returns { balance, loading, error, refetch }
export function useBalance() {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBalance = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getUserProfile()
      const profile = res.data ?? res
      setBalance(profile.accountDto?.balance ?? null)
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
