export default function Pagination({ page, totalPages, onPage, totalItems, pageSize, loading = false }) {
  if (!totalPages) return null

  const isPrevDisabled = page === 0 || loading
  const isNextDisabled = page >= totalPages - 1 || loading

  const start = totalItems != null && pageSize != null ? page * pageSize + 1 : null
  const end   = totalItems != null && pageSize != null ? Math.min((page + 1) * pageSize, totalItems) : null

  const base = 'px-4 py-2 text-sm font-medium border transition-colors'
  const enabled = 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900 cursor-pointer'
  const disabled = 'border-gray-200 dark:border-emerald-800 text-gray-300 dark:text-emerald-700 cursor-not-allowed'

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={() => { if (!isPrevDisabled) onPage(page - 1) }}
        className={`${base} ${isPrevDisabled ? disabled : enabled}`}
      >
        ← Previous
      </button>

      <span className="text-xs text-gray-500 dark:text-emerald-400">
        {start != null && !loading
          ? `${start}–${end} of ${totalItems}`
          : `Page ${page + 1} of ${totalPages}`}
      </span>

      <button
        onClick={() => { if (!isNextDisabled) onPage(page + 1) }}
        className={`${base} ${isNextDisabled ? disabled : enabled}`}
      >
        Next →
      </button>
    </div>
  )
}
