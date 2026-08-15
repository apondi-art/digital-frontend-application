import { NavLink } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useLogout } from '../hooks/useLogout'

const links = [
  { to: ROUTES.dashboard, label: 'Dashboard',   icon: '▦' },
  { to: ROUTES.history,   label: 'History',     icon: '☰' },
  { to: ROUTES.transfer,  label: 'Transfer',    icon: '⇄' },
  { to: ROUTES.deposit,   label: 'Deposit',     icon: '↓' },
  { to: ROUTES.requery,   label: 'Re-query',    icon: '↻' },
  { to: ROUTES.kyc,       label: 'Upgrade Tier', icon: '↑' },
]

export default function Sidebar() {
  const { logout } = useLogout()

  return (
    <aside className="w-56 bg-white border-r border-gray-100 dark:bg-emerald-950 dark:border-emerald-800 flex flex-col py-6 px-3 min-h-full">
      <nav className="flex flex-col gap-1 flex-1">
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

      {/* Logout — calls POST /api/auth/logout before clearing local session */}
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
