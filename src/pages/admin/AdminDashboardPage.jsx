import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../../api/adminApi'
import Card from '../../components/common/Card'
import { ROUTES } from '../../constants/routes'

function StatCard({ label, value, loading, accent = '', to }) {
  const content = (
    <Card className={`${accent} ${to ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-150' : ''}`}>
      <p className="text-xs font-semibold text-gray-400 dark:text-emerald-500 uppercase tracking-widest mb-1">
        {label}
      </p>
      {loading ? (
        <div className="h-8 bg-gray-100 dark:bg-emerald-800 rounded animate-pulse mt-1" />
      ) : (
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
      )}
      {to && !loading && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">View details →</p>
      )}
    </Card>
  )

  return to ? <Link to={to} className="block">{content}</Link> : content
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getStats()
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

  const c = ROUTES.adminCustomers

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Overview</h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">Platform statistics at a glance.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Accounts"
          value={stats?.totalAccount}
          loading={loading}
          to={c}
        />
        <StatCard
          label="Active Accounts"
          value={stats?.totalActiveAccount}
          loading={loading}
          to={`${c}?status=ACTIVE`}
        />
        <StatCard
          label="Dormant Accounts"
          value={stats?.totalDormantAccount}
          loading={loading}
          to={`${c}?status=DORMANT`}
        />
        <StatCard
          label="Suspended Accounts"
          value={stats?.totalSuspendedAccount}
          loading={loading}
          accent="border-red-200 dark:border-red-900"
          to={`${c}?status=FROZEN`}
        />
        <StatCard
          label="Tier 1 Accounts"
          value={stats?.totalTier1Account}
          loading={loading}
          to={`${c}?tier=TIER_1`}
        />
        <StatCard
          label="Tier 2 Accounts"
          value={stats?.totalTier2Account}
          loading={loading}
          to={`${c}?tier=TIER_2`}
        />
      </div>
    </div>
  )
}
