import { useState, useEffect, useCallback } from 'react'
import { getAllTransactions } from '../../api/adminApi'
import { formatDate, formatNaira } from '../../utils/format'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({ status: '', type: '' })

  const load = useCallback((p, f) => {
    setLoading(true)
    const params = {}
    if (f.status) params.status = f.status
    if (f.type)   params.type   = f.type
    getAllTransactions(p, 20, params)
      .then((res) => {
        const d = res.data ?? res
        setTransactions(d.content ?? d ?? [])
        setTotalPages(d.totalPages ?? 1)
      })
      .catch(() => setError('Failed to load transactions'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load(page, filters) }, [load, page, filters])

  function applyFilter(key, value) {
    setPage(0)
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const selectClass = 'px-3 py-2 text-sm border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-700 dark:text-emerald-200 focus:outline-none focus:border-emerald-500'

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">All Transactions</h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">Every transaction across all accounts.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select value={filters.status} onChange={(e) => applyFilter('status', e.target.value)} className={selectClass}>
          <option value="">All Statuses</option>
          <option value="SUCCESSFUL">Successful</option>
          <option value="PENDING">Pending</option>
          <option value="DECLINED">Declined</option>
        </select>
        <select value={filters.type} onChange={(e) => applyFilter('type', e.target.value)} className={selectClass}>
          <option value="">All Types</option>
          <option value="TRANSFER">Transfer</option>
          <option value="DEPOSIT">Deposit</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-emerald-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 dark:text-emerald-500 uppercase tracking-widest border-b border-gray-100 dark:border-emerald-800">
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">From</th>
                  <th className="pb-3 pr-4">To</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-emerald-900">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 dark:text-emerald-500 text-sm">
                      No transactions found.
                    </td>
                  </tr>
                ) : transactions.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-gray-50 dark:hover:bg-emerald-900/40 transition-colors">
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        tx.transactionType === 'DEPOSIT'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                      }`}>
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">{formatNaira(tx.amount)}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-500 dark:text-emerald-400">{tx.sourceAccount ?? '—'}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-500 dark:text-emerald-400">{tx.destinationAccount ?? '—'}</td>
                    <td className="py-3 pr-4"><Badge status={tx.transactionStatus} /></td>
                    <td className="py-3 text-xs text-gray-400 dark:text-emerald-500">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-200 dark:border-emerald-700 text-gray-600 dark:text-emerald-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-emerald-900 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-gray-500 dark:text-emerald-400">Page {page + 1} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 border border-gray-200 dark:border-emerald-700 text-gray-600 dark:text-emerald-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-emerald-900 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
