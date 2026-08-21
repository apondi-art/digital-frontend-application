import { useState, useEffect } from 'react'
import { getAuditLogs } from '../../api/adminApi'
import { formatDate } from '../../utils/format'
import Card from '../../components/common/Card'
import Pagination from '../../components/common/Pagination'

const PAGE_SIZE = 10

export default function AdminAuditLogPage() {
  const [logs, setLogs]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [page, setPage]               = useState(0)
  const [totalPages, setTotalPages]   = useState(0)
  const [totalItems, setTotalItems]   = useState(0)
  const [emailFilter, setEmailFilter] = useState('')
  const [emailInput, setEmailInput]   = useState('')

  useEffect(() => {
    setLoading(true)
    setError(null)
    getAuditLogs(page + 1, PAGE_SIZE)
      .then((res) => {
        const d = res.data ?? res
        const content = d.content ?? (Array.isArray(d) ? d : [])
        const totalEl = d.totalElements ?? d.totalElement ?? 0
        setLogs(content)
        setTotalItems(totalEl)
        // Derive totalPages from server value → totalElements fallback → content-length heuristic
        // The heuristic (page + 2) enables Next whenever a full page is returned, even when
        // the backend omits pagination metadata. The last page will come back empty and Next
        // will then be disabled (page + 1 = current page, which is the final page).
        const pages =
          d.totalPages ??
          (totalEl > 0 ? Math.ceil(totalEl / PAGE_SIZE) : null) ??
          (content.length >= PAGE_SIZE ? page + 2 : page + 1)
        setTotalPages(pages)
      })
      .catch(() => setError('Failed to load audit logs'))
      .finally(() => setLoading(false))
  }, [page])

  const filtered = emailFilter
    ? logs.filter((l) => (l.userEmail ?? '').toLowerCase().includes(emailFilter.toLowerCase()))
    : logs

  function handleSearch(e) {
    e.preventDefault()
    setPage(0)
    setEmailFilter(emailInput)
  }

  function handleClear() {
    setEmailInput('')
    setEmailFilter('')
    setPage(0)
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Audit Logs</h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">
          Immutable record of every sensitive action on the platform.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Filter by user email…"
          className="flex-1 px-4 py-2 text-sm border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          Filter
        </button>
        {emailFilter && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-200 dark:border-emerald-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-emerald-900 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Card className="overflow-x-auto">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 dark:bg-emerald-900 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 dark:text-emerald-500 uppercase tracking-widest border-b border-gray-100 dark:border-emerald-800">
                <th className="pb-3 pr-4">Timestamp</th>
                <th className="pb-3 pr-4">Action</th>
                <th className="pb-3 pr-4">User</th>
                <th className="pb-3">Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-emerald-900">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 dark:text-emerald-500 text-sm">
                    No audit logs found.
                  </td>
                </tr>
              ) : filtered.map((log, i) => (
                <tr key={log.id ?? i} className="hover:bg-gray-50 dark:hover:bg-emerald-900/30 transition-colors">
                  <td className="py-2.5 pr-4 text-xs text-gray-400 dark:text-emerald-500 whitespace-nowrap">
                    {formatDate(log.timeOfCreation ?? log.createdAt)}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="text-xs font-mono font-semibold text-gray-700 dark:text-emerald-300 bg-gray-100 dark:bg-emerald-900 px-2 py-0.5 rounded">
                      {log.actionType ?? log.action}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-600 dark:text-emerald-300 text-xs">
                    {log.userEmail ?? log.userId ?? '—'}
                  </td>
                  <td className="py-2.5 text-gray-500 dark:text-emerald-400 text-xs">
                    {log.entityType ?? '—'}
                  </td>
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
