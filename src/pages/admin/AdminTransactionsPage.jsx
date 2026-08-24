import { useState, useEffect } from 'react'
import { getTransactionById, getAllTransactions } from '../../api/adminApi'
import { formatDate, formatNaira } from '../../utils/format'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'

const PAGE_SIZE = 20

export default function AdminTransactionsPage() {
  // Lookup by ID — same behavior as before, loading/error just renamed
  // so they don't collide with the list's own loading/error state.
  const [txId, setTxId] = useState('')
  const [transaction, setTransaction] = useState(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!txId.trim()) return
    setLookupLoading(true)
    setLookupError(null)
    setTransaction(null)
    try {
      const res = await getTransactionById(txId.trim())
      setTransaction(res.data ?? res)
    } catch {
      setLookupError('Transaction not found.')
    } finally {
      setLookupLoading(false)
    }
  }

  // Paginated transaction list
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(null)
  const [totalElements, setTotalElements] = useState(null)
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadTransactions() {
      setListLoading(true)
      setListError(null)
      try {
        const res = await getAllTransactions(page, PAGE_SIZE)
        const data = res?.data ?? res
        // Assumes a Spring-style Page payload: { content, totalPages, totalElements }.
        // If your API returns a different shape, adjust these three lines.
        const content = Array.isArray(data) ? data : data?.content ?? []
        if (cancelled) return
        setTransactions(content)
        setTotalPages(data?.totalPages ?? null)
        setTotalElements(data?.totalElements ?? null)
      } catch {
        if (!cancelled) {
          setListError('Could not load transactions.')
          setTransactions([])
        }
      } finally {
        if (!cancelled) setListLoading(false)
      }
    }

    loadTransactions()
    return () => {
      cancelled = true
    }
  }, [page])

  const canPrev = page > 0
  const canNext = totalPages != null ? page + 1 < totalPages : transactions.length === PAGE_SIZE
  const thClass = 'px-4 py-3 text-xs font-bold text-gray-400 dark:text-emerald-500 uppercase tracking-widest'

  return (
    <div className="max-w-5xl space-y-10">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Transactions</h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">
          Browse all transactions, or look up a specific one by ID.
        </p>
      </div>

      {/* Lookup */}
      <div className="max-w-3xl space-y-4">
        <h3 className="text-xs font-bold text-gray-400 dark:text-emerald-500 uppercase tracking-widest">
          Look Up a Transaction
        </h3>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={txId}
            onChange={(e) => setTxId(e.target.value)}
            placeholder="Transaction ID (UUID)…"
            className="flex-1 px-4 py-2 text-sm font-mono border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <Button type="submit" loading={lookupLoading} className="text-sm py-2 px-4">
            Look Up
          </Button>
        </form>

        {lookupError && <p className="text-red-500 text-sm">{lookupError}</p>}

        {transaction && (
          <Card>
            <h3 className="text-xs font-bold text-gray-400 dark:text-emerald-500 uppercase tracking-widest mb-4">
              Transaction Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Transaction ID', transaction.transactionId],
                ['Type',           transaction.transactionType],
                ['Amount',         transaction.amount != null ? formatNaira(transaction.amount) : null],
                ['Status',         null],
                ['Source Account', transaction.sourceAccount],
                ['Destination',    transaction.destinationAccount],
                ['Description',    transaction.description],
                ['Date',           transaction.createdAt ? formatDate(transaction.createdAt) : null],
              ].map(([label, value]) => value !== null && value !== undefined ? (
                <div key={label}>
                  <p className="text-xs text-gray-400 dark:text-emerald-500 mb-0.5">{label}</p>
                  <p className="text-gray-900 dark:text-white font-medium break-all">{value}</p>
                </div>
              ) : null)}
              <div>
                <p className="text-xs text-gray-400 dark:text-emerald-500 mb-0.5">Status</p>
                <Badge status={transaction.transactionStatus} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Paginated list */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 dark:text-emerald-500 uppercase tracking-widest">
          All Transactions{totalElements != null ? ` (${totalElements})` : ''}
        </h3>

        {listError && <p className="text-red-500 text-sm">{listError}</p>}

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-emerald-800 text-left">
                  <th className={thClass}>ID</th>
                  <th className={thClass}>Type</th>
                  <th className={thClass}>Amount</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Date</th>
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400 dark:text-emerald-500">
                      Loading…
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400 dark:text-emerald-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.transactionId} className="border-b border-gray-50 dark:border-emerald-900 last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-white break-all">{tx.transactionId}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{tx.transactionType}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                        {tx.amount != null ? formatNaira(tx.amount) : '—'}
                      </td>
                      <td className="px-4 py-3"><Badge status={tx.transactionStatus} /></td>
                      <td className="px-4 py-3 text-gray-500 dark:text-emerald-300">
                        {tx.createdAt ? formatDate(tx.createdAt) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500 dark:text-emerald-300">
            {totalPages != null ? `Page ${page + 1} of ${totalPages}` : `Page ${page + 1}`}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={!canPrev || listLoading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="text-sm py-2 px-4"
            >
              Previous
            </Button>
            <Button
              type="button"
              disabled={!canNext || listLoading}
              onClick={() => setPage((p) => p + 1)}
              className="text-sm py-2 px-4"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}