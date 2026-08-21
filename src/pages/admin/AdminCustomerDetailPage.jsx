import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getCustomerByAccountNumber, suspendCustomer, reactivateCustomer } from '../../api/adminApi'
import { formatDate, formatNaira } from '../../utils/format'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

export default function AdminCustomerDetailPage() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')
  const [showSuspendForm, setShowSuspendForm] = useState(false)

  useEffect(() => {
    getCustomerByAccountNumber(id)
      .then((res) => setCustomer(res.data ?? res))
      .catch(() => toast.error('Failed to load customer'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSuspend() {
    if (!suspendReason.trim()) {
      toast.error('Please provide a reason for suspension')
      return
    }
    setActionLoading(true)
    try {
      await suspendCustomer(customer.id, suspendReason)
      toast.success('Account suspended')
      setCustomer((c) => ({ ...c, accountStatus: 'SUSPENDED' }))
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
      await reactivateCustomer(customer.id)
      toast.success('Account reactivated')
      setCustomer((c) => ({ ...c, accountStatus: 'ACTIVE' }))
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

  const isSuspended = customer.accountStatus === 'SUSPENDED'

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
          {isSuspended ? (
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
          {[
            ['Account Number', customer.accountNumber],
            ['Phone', customer.phoneNumber],
            ['Status', customer.accountStatus],
            ['Tier', customer.accountTier],
            ['Gender', customer.gender],
            ['Date of Birth', customer.dateOfBirth ? formatDate(customer.dateOfBirth) : null],
            ['Registered', customer.createdAt ? formatDate(customer.createdAt) : null],
            ['Address', customer.address],
          ].map(([label, value]) => value ? (
            <div key={label}>
              <p className="text-xs text-gray-400 dark:text-emerald-500 mb-0.5">{label}</p>
              <p className="text-gray-900 dark:text-white font-medium">{value}</p>
            </div>
          ) : null)}
        </div>
      </Card>

      {customer.transactions?.length > 0 && (
        <Card>
          <h3 className="text-xs font-bold text-gray-400 dark:text-emerald-500 uppercase tracking-widest mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {customer.transactions.slice(0, 10).map((tx) => (
              <div key={tx.transactionId} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{tx.description}</p>
                  <p className="text-xs text-gray-400 dark:text-emerald-500">{formatDate(tx.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{formatNaira(tx.amount)}</p>
                  <Badge status={tx.transactionStatus} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
