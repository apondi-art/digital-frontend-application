import { NavLink } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

const links = [
  { to: ROUTES.dashboard, label: 'Dashboard',  icon: '▦' },
  { to: ROUTES.transfer,  label: 'Transfer',   icon: '⇄' },
  { to: ROUTES.deposit,   label: 'Deposit',    icon: '↓' },
  { to: ROUTES.requery,   label: 'Re-query',   icon: '↻' },
]

// Left sidebar navigation — active link gets an emerald highlight
export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 dark:bg-emerald-950 dark:border-emerald-800 flex flex-col py-6 px-3 gap-1 min-h-full">
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors
             ${isActive
               ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-800 dark:text-emerald-300 dark:border-emerald-700'
               : 'text-gray-600 hover:bg-gray-50 dark:text-emerald-400 dark:hover:bg-emerald-900'
             }`
          }
        >
          <span className="text-base">{icon}</span>
          {label}
        </NavLink>
      ))}
    </aside>
  )
}
