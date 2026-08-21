import { useState } from 'react'
import { getTransactionById } from '../../api/adminApi'
import { formatDate, formatNaira } from '../../utils/format'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'

export default function AdminTransactionsPage() {
  const [txId, setTxId] = useState('')
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!txId.trim()) return
    setLoading(true)
    setError(null)
    setTransaction(null)
    try {
      const res = await getTransactionById(txId.trim())
      setTransaction(res.data ?? res)
    } catch {
      setError('Transaction not found.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Transaction Lookup</h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">
          Look up any transaction by its ID.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="Transaction ID (UUID)…"
          className="flex-1 px-4 py-2 text-sm font-mono border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
        />
        <Button type="submit" loading={loading} className="text-sm py-2 px-4">
          Look Up
        </Button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

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
  )
}
