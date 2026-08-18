import { useState, useEffect } from 'react'
import { getStatsOverview } from '../../api/adminApi'
import { formatNaira } from '../../utils/format'
import Card from '../../components/common/Card'

function StatCard({ label, value, loading, accent = '' }) {
  return (
    <Card className={`${accent}`}>
      <p className="text-xs font-semibold text-gray-400 dark:text-emerald-500 uppercase tracking-widest mb-1">{label}</p>
      {loading ? (
        <div className="h-8 bg-gray-100 dark:bg-emerald-800 rounded animate-pulse mt-1" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
      )}
    </Card>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getStatsOverview()
      .then((res) => setStats(res.data ?? res))
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  if (error) {
    return (
      <div className="max-w-4xl">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Admin Overview</h2>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Overview</h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">Platform statistics at a glance.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Total Customers"         value={stats?.totalCustomers}                      loading={loading} />
        <StatCard label="Active Accounts"          value={stats?.activeAccounts}                      loading={loading} />
        <StatCard label="Transaction Volume Today" value={stats?.transactionVolumeToday != null ? formatNaira(stats.transactionVolumeToday) : null} loading={loading} />
        <StatCard label="KYC Pending Review"       value={stats?.kycPending}                          loading={loading} accent="border-amber-200 dark:border-amber-800" />
        <StatCard label="Suspended Accounts"       value={stats?.suspendedAccounts}                   loading={loading} accent="border-red-200 dark:border-red-900" />
        <StatCard label="Transaction Count Today"  value={stats?.transactionCountToday}               loading={loading} />
      </div>
    </div>
  )
}
