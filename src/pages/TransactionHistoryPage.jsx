import { useTransactionHistory } from '../hooks/useTransactionHistory'
import Badge from '../components/common/Badge'
import Card from '../components/common/Card'

function formatDate(isoString) {
  return new Date(isoString).toLocaleString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatAmount(amount) {
  return Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

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

// Maps to GET /api/transaction/transaction-history
export default function TransactionHistoryPage() {
  const { history, loading, error } = useTransactionHistory()

  if (loading) {
    return (
      <div className="max-w-2xl space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 dark:bg-emerald-900 rounded-xl animate-pulse" />
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
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Transaction History</h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">
          {history.length} transaction{history.length !== 1 ? 's' : ''} on your account
        </p>
      </div>

      {history.length === 0 ? (
        <Card>
          <p className="text-center text-gray-400 dark:text-emerald-400 py-8 text-sm">
            No transactions yet. Make a transfer or deposit to get started.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((tx) => (
            <Card key={tx.transactionId} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <TypePill type={tx.transactionType} />
                    <Badge status={tx.transactionStatus} />
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-emerald-100 truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-emerald-500">
                    From: {tx.sourceAccount} · {formatDate(tx.createdAt)}
                  </p>
                </div>

                {/* Right */}
                <div className="shrink-0 text-right">
                  <p className={`text-lg font-bold ${
                    tx.transactionType === 'DEPOSIT'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {tx.transactionType === 'DEPOSIT' ? '+' : '-'}₦{formatAmount(tx.amount)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
