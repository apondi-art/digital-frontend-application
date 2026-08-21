import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getCustomerByAccountNumber, suspendCustomer, reactivateCustomer, getCustomerTransactions } from '../../api/adminApi'
import { formatDate, formatNaira } from '../../utils/format'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 dark:text-emerald-500 mb-0.5">{label}</p>
      <p className="text-gray-900 dark:text-white font-medium">{value ?? '—'}</p>
    </div>
  )
}

const ACCOUNT_STATUS_STYLES = {
  ACTIVE:  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  FROZEN:  'bg-red-100     text-red-700     dark:bg-red-900/40     dark:text-red-300',
  DORMANT: 'bg-yellow-100  text-yellow-800  dark:bg-yellow-900/40  dark:text-yellow-300',
}

function AccountStatusBadge({ status }) {
  const colour = ACCOUNT_STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${colour}`}>
      {status ?? '—'}
    </span>
  )
}

const TIER_STYLES = {
  TIER_1: 'bg-amber-100   text-amber-800   dark:bg-amber-900/40   dark:text-amber-300',
  TIER_2: 'bg-blue-100    text-blue-800    dark:bg-blue-900/40    dark:text-blue-300',
  TIER_3: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
}

function TierBadge({ tier }) {
  const colour = TIER_STYLES[tier] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  const label = tier ? tier.replace('_', ' ') : '—'
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${colour}`}>
      {label}
    </span>
  )
}

export default function AdminCustomerDetailPage() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')
  const [showSuspendForm, setShowSuspendForm] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [txLoading, setTxLoading] = useState(true)

  useEffect(() => {
    getCustomerByAccountNumber(id)
      .then((res) => setCustomer(res.data ?? res))
      .catch(() => toast.error('Failed to load customer'))
      .finally(() => setLoading(false))

    getCustomerTransactions(id)
      .then((res) => setTransactions(res.data ?? res ?? []))
      .catch(() => {})
      .finally(() => setTxLoading(false))
  }, [id])

  async function handleSuspend() {
    if (!suspendReason.trim()) {
      toast.error('Please provide a reason for suspension')
      return
    }
    setActionLoading(true)
    try {
      await suspendCustomer(customer.accountDto?.id, suspendReason)
      toast.success('Account suspended')
      setCustomer((c) => ({ ...c, accountDto: { ...c.accountDto, accountStatus: 'FROZEN' } }))
      setShowSuspendForm(false)
      setSuspendReason('')
    } catch {
      // Axios interceptor shows error
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReactivate() {
    setActionLoading(true)
    try {
      await reactivateCustomer(customer.accountDto?.id)
      toast.success('Account reactivated')
      setCustomer((c) => ({ ...c, accountDto: { ...c.accountDto, accountStatus: 'ACTIVE' } }))
    } catch {
      // Axios interceptor shows error
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-emerald-900 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="max-w-3xl">
        <p className="text-red-500 text-sm">Customer not found.</p>
        <Link to={ROUTES.adminCustomers} className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline mt-2 inline-block">
          ← Back to Customers
        </Link>
      </div>
    )
  }

  const accountStatus = customer.accountDto?.accountStatus
  const isFrozen = accountStatus === 'FROZEN'

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to={ROUTES.adminCustomers} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
            ← Customers
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {customer.firstName} {customer.lastName}
          </h2>
          <p className="text-gray-500 dark:text-emerald-300 text-sm">{customer.email}</p>
        </div>
        <div className="flex gap-2">
          {isFrozen ? (
            <Button onClick={handleReactivate} loading={actionLoading} className="text-sm py-2 px-4">
              Reactivate
            </Button>
          ) : (
            <button
              onClick={() => setShowSuspendForm((s) => !s)}
              className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Suspend
            </button>
          )}
        </div>
      </div>

      {showSuspendForm && (
        <Card className="border border-red-200 dark:border-red-800">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">Suspension Reason (required)</p>
          <textarea
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            rows={3}
            placeholder="Explain why this account is being suspended…"
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-900 dark:text-white resize-none focus:outline-none focus:border-red-400"
          />
          <div className="flex gap-2 mt-3">
            <Button onClick={handleSuspend} loading={actionLoading} className="text-sm py-2 px-4 bg-red-600 hover:bg-red-700">
              Confirm Suspension
            </Button>
            <button
              onClick={() => { setShowSuspendForm(false); setSuspendReason('') }}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-emerald-400 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-xs font-bold text-gray-400 dark:text-emerald-500 uppercase tracking-widest mb-4">Profile</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Account Number" value={customer.accountDto?.accountNumber} />
          <Field label="Phone" value={customer.phoneNumber} />
          <div>
            <p className="text-xs text-gray-400 dark:text-emerald-500 mb-1">Status</p>
            <AccountStatusBadge status={accountStatus} />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-emerald-500 mb-1">Tier</p>
            <TierBadge tier={customer.accountDto?.accountTier} />
          </div>
          <Field label="Gender" value={customer.gender} />
          <Field label="Date of Birth" value={customer.dateOfBirth ? formatDate(customer.dateOfBirth) : null} />
          <Field label="Address" value={customer.address} />
        </div>
      </Card>

      <Card>
        <h3 className="text-xs font-bold text-gray-400 dark:text-emerald-500 uppercase tracking-widest mb-4">
          Transactions
          {!txLoading && (
            <span className="ml-2 normal-case font-normal text-gray-400 dark:text-emerald-600">
              ({transactions.length})
            </span>
          )}
        </h3>

        {txLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-emerald-900 rounded animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-emerald-600 py-4 text-center">No transactions found for this account.</p>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-emerald-900">
            {transactions.map((tx) => {
              const isDebit = tx.sourceAccount === customer.accountDto?.accountNumber
              return (
                <div key={tx.transactionId} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-gray-900 dark:text-white font-medium truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-semibold ${isDebit ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isDebit ? 'Debit' : 'Credit'}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-emerald-600">{formatDate(tx.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold ${isDebit ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {isDebit ? '− ' : '+ '}{formatNaira(tx.amount)}
                    </p>
                    <Badge status={tx.transactionStatus} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
