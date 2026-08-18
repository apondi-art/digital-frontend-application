import { NavLink } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useLogout } from '../hooks/useLogout'

const links = [
  { to: ROUTES.adminDashboard,    label: 'Overview',       icon: '▦' },
  { to: ROUTES.adminCustomers,    label: 'Customers',      icon: '👥' },
  { to: ROUTES.adminKycQueue,     label: 'KYC Queue',      icon: '🪪' },
  { to: ROUTES.adminTransactions, label: 'Transactions',   icon: '⇄' },
  { to: ROUTES.adminAuditLogs,    label: 'Audit Logs',     icon: '📋' },
]

export default function AdminSidebar() {
  const { logout } = useLogout()

  return (
    <aside className="w-56 bg-white border-r border-gray-100 dark:bg-emerald-950 dark:border-emerald-800 flex flex-col py-6 px-3 min-h-full">
      <div className="px-4 pb-4 mb-2 border-b border-gray-100 dark:border-emerald-800">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Admin Panel</span>
      </div>
      <nav aria-label="Admin navigation" className="flex flex-col gap-1 flex-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
               ${isActive
                 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300'
                 : 'text-gray-600 hover:bg-gray-50 dark:text-emerald-400 dark:hover:bg-emerald-900'
               }`
            }
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-4 flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-emerald-900 transition-colors w-full"
      >
        <span className="text-base w-5 text-center">⏻</span>
        Logout
      </button>
    </aside>
  )
}
