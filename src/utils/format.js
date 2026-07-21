// Format a number as Nigerian Naira currency
export const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount ?? 0)

// Format ISO date string to readable form — guards against null / invalid dates
export const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(d)
}

// Map backend TransactionStatus to a display label + colour class (light + dark)
export const statusMeta = (status) => {
  const map = {
    SUCCESSFUL: {
      label: 'Successful',
      colour: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    },
    PENDING: {
      label: 'Pending',
      colour: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    DECLINED: {
      label: 'Declined',
      colour: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    },
  }
  return map[status] ?? {
    label: status,
    colour: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  }
}
