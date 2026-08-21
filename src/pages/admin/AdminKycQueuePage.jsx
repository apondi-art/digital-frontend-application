import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getPendingKyc, approveKyc, rejectKyc, getPendingKycById } from '../../api/adminApi'
import { formatDate } from '../../utils/format'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Pagination from '../../components/common/Pagination'

function RejectDialog({ kycId, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState('')
  return (
    <div className="mt-3 p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
      <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Rejection reason (required)</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        placeholder="Explain why this submission is being rejected…"
        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-900 dark:text-white resize-none focus:outline-none focus:border-red-400"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onConfirm(kycId, reason)}
          disabled={loading || !reason.trim()}
          className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Rejecting…' : 'Confirm Reject'}
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-emerald-400 dark:hover:text-white">
          Cancel
        </button>
      </div>
    </div>
  )
}

const PAGE_SIZE = 10

export default function AdminKycQueuePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [actionId, setActionId] = useState(null)
  const [rejectingId, setRejectingId] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getPendingKyc(page, PAGE_SIZE)
      .then((res) => {
        const d = res.data ?? res
        setItems(d.content ?? d ?? [])
        setTotalPages(d.totalPages ?? 1)
        setTotalItems(d.totalElements ?? 0)
      })
      .catch(() => toast.error('Failed to load KYC queue'))
      .finally(() => setLoading(false))
  }, [page])

  async function handleApprove(id) {
    setActionLoading(true)
    setActionId(id)
    try {
      await approveKyc(id)
      toast.success('KYC approved — account tier upgraded')
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch {
      // Axios shows error
    } finally {
      setActionLoading(false)
      setActionId(null)
    }
  }

  async function handleViewDetail(accountId, itemId) {
    if (detailId === itemId) { setDetailId(null); setDetail(null); return }
    setDetailId(itemId)
    setDetail(null)
    setDetailLoading(true)
    try {
      const res = await getPendingKycById(accountId)
      setDetail(res.data ?? res)
    } catch {
      toast.error('Failed to load KYC details')
      setDetailId(null)
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleReject(id, reason) {
    if (!reason.trim()) { toast.error('Reason is required'); return }
    setActionLoading(true)
    setActionId(id)
    try {
      await rejectKyc(id, reason)
      toast.success('KYC rejected — customer notified')
      setItems((prev) => prev.filter((i) => i.id !== id))
      setRejectingId(null)
    } catch {
      // Axios shows error
    } finally {
      setActionLoading(false)
      setActionId(null)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">KYC Review Queue</h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">
          Pending KYC submissions awaiting manual review.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-emerald-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <p className="text-center text-gray-400 dark:text-emerald-500 py-8 text-sm">
            No pending KYC submissions.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded">
                      {item.documentType}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-emerald-500">{formatDate(item.submittedAt)}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.customerName ?? `Customer #${item.customerId}`}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-emerald-500 font-mono mt-0.5">
                    {item.submittedValue ? '•'.repeat(item.submittedValue.length) : '—'}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleViewDetail(item.accountId ?? item.customerId, item.id)}
                    className="px-3 py-1.5 border border-gray-200 dark:border-emerald-700 text-gray-600 dark:text-emerald-400 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-emerald-900 transition-colors"
                  >
                    {detailId === item.id ? 'Hide' : 'Details'}
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    disabled={actionLoading && actionId === item.id}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading && actionId === item.id ? '…' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setRejectingId(rejectingId === item.id ? null : item.id)}
                    className="px-3 py-1.5 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
              {detailId === item.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-emerald-800 text-sm">
                  {detailLoading ? (
                    <div className="h-16 bg-gray-100 dark:bg-emerald-800 rounded animate-pulse" />
                  ) : detail ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['Document Type', detail.documentType],
                        ['Status', detail.kycStatus ?? detail.status],
                        ['Submitted', detail.submittedAt ? formatDate(detail.submittedAt) : null],
                        ['Customer', detail.customerName ?? detail.fullName],
                        ['Account ID', detail.accountId ?? detail.customerId],
                      ].filter(([, v]) => v).map(([label, value]) => (
                        <div key={label}>
                          <p className="text-xs text-gray-400 dark:text-emerald-500 mb-0.5">{label}</p>
                          <p className="text-gray-900 dark:text-white font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
              {rejectingId === item.id && (
                <RejectDialog
                  kycId={item.id}
                  onConfirm={handleReject}
                  onCancel={() => setRejectingId(null)}
                  loading={actionLoading && actionId === item.id}
                />
              )}
            </Card>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        loading={loading}
        onPage={setPage}
      />
    </div>
  )
}
