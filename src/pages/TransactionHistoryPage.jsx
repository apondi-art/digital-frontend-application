import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import { useAccount } from '../hooks/useAccount'
import Badge from '../components/common/Badge'
import Card from '../components/common/Card'
import { formatDate, formatNaira } from '../utils/format'
import { ROUTES } from '../constants/routes'

function TypePill({ type }) {
  const styles = {
    TRANSFER: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    DEPOSIT:  'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  }
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${styles[type] ?? 'bg-gray-100 text-gray-600'}`}>
      {type}
    </span>
  )
}

function DirectionIcon({ isSent }) {
  return isSent ? (
    <svg viewBox="0 0 20 20" className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Transaction ID copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed — select and copy the ID manually')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy transaction ID"
      className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors p-1"
      title="Copy transaction ID"
    >
      {copied ? (
        <svg viewBox="0 0 20 20" className="w-4 h-4 text-emerald-500" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
      )}
    </button>
  )
}

const PAGE_SIZE = 10

// Maps to GET /api/transaction/transaction-history
export default function TransactionHistoryPage() {
  const { history, loading, error } = useTransactionHistory()
  const { accountNumber } = useAccount()
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)

  const filtered = history.filter((tx) => !statusFilter || tx.transactionStatus === statusFilter)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleFilterChange(value) {
    setStatusFilter(value)
    setPage(0)
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-emerald-900 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Transaction History</h2>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            {statusFilter ? ` with status: ${statusFilter}` : ' on your account'}
          </p>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-700 dark:text-emerald-200 focus:outline-none focus:border-emerald-500"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="SUCCESSFUL">Successful</option>
          <option value="PENDING">Pending</option>
          <option value="DECLINED">Declined</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-center text-gray-400 dark:text-emerald-400 py-8 text-sm">
            {statusFilter ? `No ${statusFilter.toLowerCase()} transactions.` : 'No transactions yet. Make a transfer or deposit to get started.'}
          </p>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {paginated.map((tx) => {
              const isSent = tx.sourceAccount === accountNumber
              const counterpart = isSent ? tx.destinationAccount : tx.sourceAccount

              return (
                <Card key={tx.transactionId} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left */}
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <DirectionIcon isSent={isSent} />
                        <TypePill type={tx.transactionType} />
                        <Badge status={tx.transactionStatus} />
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-emerald-100 truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-emerald-500">
                        {isSent ? 'To' : 'From'}: {counterpart ?? '—'} · {formatDate(tx.createdAt)}
                      </p>
                      {/* Transaction ID row with copy + requery */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-gray-300 dark:text-emerald-700 font-mono truncate max-w-[180px]">
                          {tx.transactionId}
                        </span>
                        <CopyButton text={tx.transactionId} />
                        {tx.transactionStatus === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => navigate(ROUTES.requery, { state: { transactionId: tx.transactionId } })}
                            className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline ml-1"
                          >
                            Requery →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right — amount */}
                    <div className="shrink-0 text-right">
                      <p className={`text-lg font-bold ${
                        isSent
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {isSent ? '-' : '+'}{formatNaira(tx.amount)}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm mt-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-200 dark:border-emerald-700 text-gray-600 dark:text-emerald-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-emerald-900 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-gray-500 dark:text-emerald-400">
                Page {page + 1} of {totalPages}
              </span>
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
