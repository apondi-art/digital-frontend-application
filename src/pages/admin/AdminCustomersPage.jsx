import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getCustomers } from '../../api/adminApi'
import { formatDate } from '../../utils/format'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/common/Card'

function TierBadge({ tier }) {
  const map = {
    TIER_1: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    TIER_2: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    TIER_3: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  }
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${map[tier] ?? 'bg-gray-100 text-gray-600'}`}>
      {tier ?? '—'}
    </span>
  )
}

function StatusBadge({ status }) {
  const active = status === 'ACTIVE'
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
      active
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    }`}>
      {status ?? '—'}
    </span>
  )
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const load = useCallback((p, q) => {
    setLoading(true)
    getCustomers(p, 20, q)
      .then((res) => {
        const d = res.data ?? res
        setCustomers(d.content ?? d ?? [])
        setTotalPages(d.totalPages ?? 1)
      })
      .catch(() => setError('Failed to load customers'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load(page, search)
  }, [load, page, search])

  function handleSearch(e) {
    e.preventDefault()
    setPage(0)
    setSearch(searchInput)
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Customers</h2>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">All registered customers.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 px-4 py-2 text-sm border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-emerald-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 dark:text-emerald-500 uppercase tracking-widest border-b border-gray-100 dark:border-emerald-800">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Tier</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-emerald-900">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 dark:text-emerald-500 text-sm">
                      No customers found.
                    </td>
                  </tr>
                ) : customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-emerald-900/40 transition-colors">
                    <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                      <Link
                        to={`${ROUTES.adminCustomers}/${c.id}`}
                        className="hover:text-emerald-600 dark:hover:text-emerald-300 hover:underline"
                      >
                        {c.firstName} {c.lastName}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-emerald-300">{c.email}</td>
                    <td className="py-3 pr-4"><TierBadge tier={c.accountTier} /></td>
                    <td className="py-3 pr-4"><StatusBadge status={c.accountStatus} /></td>
                    <td className="py-3 text-gray-400 dark:text-emerald-500">{formatDate(c.createdAt)}</td>
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
