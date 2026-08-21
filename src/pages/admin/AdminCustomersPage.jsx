import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCustomers } from '../../api/adminApi'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/common/Card'
import Pagination from '../../components/common/Pagination'

function TierBadge({ tier }) {
  const map = {
    TIER_1: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    TIER_2: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    TIER_3: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  }
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${map[tier] ?? 'bg-gray-100 text-gray-600'}`}>
      {tier ? tier.replace('_', ' ') : '—'}
    </span>
  )
}

const STATUS_STYLES = {
  ACTIVE:  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  FROZEN:  'bg-red-100     text-red-700     dark:bg-red-900/40     dark:text-red-300',
  DORMANT: 'bg-yellow-100  text-yellow-800  dark:bg-yellow-900/40  dark:text-yellow-300',
}

function StatusBadge({ status }) {
  const colour = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${colour}`}>
      {status ?? '—'}
    </span>
  )
}

const FILTER_LABELS = {
  status: { ACTIVE: 'Active accounts', DORMANT: 'Dormant accounts', FROZEN: 'Suspended accounts' },
  tier:   { TIER_1: 'Tier 1 accounts', TIER_2: 'Tier 2 accounts', TIER_3: 'Tier 3 accounts' },
}

export default function AdminCustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? ''
  const tierFilter   = searchParams.get('tier')   ?? ''

  const PAGE_SIZE = 10

  const [allCustomers, setAllCustomers] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [page, setPage]                 = useState(0)
  const [totalPages, setTotalPages]     = useState(0)
  const [totalItems, setTotalItems]     = useState(0)
  const [searchInput, setSearchInput]   = useState('')
  const [searchTerm, setSearchTerm]     = useState('')

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCustomers(page, PAGE_SIZE)
      .then((res) => {
        const d = res.data ?? res
        const content = d.content ?? (Array.isArray(d) ? d : [])
        const totalEl = d.totalElements ?? 0
        setAllCustomers(content)
        setTotalItems(totalEl)
        setTotalPages(d.totalPages ?? (totalEl > 0 ? Math.ceil(totalEl / PAGE_SIZE) : 0))
      })
      .catch(() => setError('Failed to load customers'))
      .finally(() => setLoading(false))
  }, [page])

  // Client-side filter: status, tier, and name/email search
  const customers = allCustomers.filter((c) => {
    const acct = c.accountDto ?? {}
    if (statusFilter && acct.accountStatus !== statusFilter) return false
    if (tierFilter   && acct.accountTier   !== tierFilter)   return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const name = `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase()
      if (!name.includes(q) && !(c.email ?? '').toLowerCase().includes(q)) return false
    }
    return true
  })

  function handleSearch(e) {
    e.preventDefault()
    setPage(0)
    setSearchTerm(searchInput)
  }

  function clearFilter() {
    setSearchParams({})
    setPage(0)
  }

  const activeFilterLabel =
    (statusFilter && FILTER_LABELS.status[statusFilter]) ||
    (tierFilter   && FILTER_LABELS.tier[tierFilter])     ||
    null

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Customers</h2>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">
            {activeFilterLabel ? `Showing: ${activeFilterLabel}` : 'All registered customers.'}
          </p>
        </div>
        {activeFilterLabel && (
          <button
            onClick={clearFilter}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
          >
            {activeFilterLabel} ✕
          </button>
        )}
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

      <Card className="overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 dark:bg-emerald-900 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 dark:text-emerald-500 uppercase tracking-widest border-b border-gray-100 dark:border-emerald-800">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Tier</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Account No.</th>
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
                      to={`${ROUTES.adminCustomers}/${c.accountDto?.accountNumber}`}
                      className="hover:text-emerald-600 dark:hover:text-emerald-300 hover:underline"
                    >
                      {c.firstName} {c.lastName}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-emerald-300">{c.email}</td>
                  <td className="py-3 pr-4"><TierBadge tier={c.accountDto?.accountTier} /></td>
                  <td className="py-3 pr-4"><StatusBadge status={c.accountDto?.accountStatus} /></td>
                  <td className="py-3 text-gray-400 dark:text-emerald-500">{c.accountDto?.accountNumber ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

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
