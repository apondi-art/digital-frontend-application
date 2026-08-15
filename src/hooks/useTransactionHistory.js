import { useState, useEffect } from 'react'
import { getTransactionHistory } from '../api/transactionApi'

export function useTransactionHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getTransactionHistory()
      .then((res) => setHistory(res.data ?? []))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  return { history, loading, error }
}
