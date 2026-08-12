import { Link } from 'react-router-dom'
import { useAccount } from '../hooks/useAccount'
import { ROUTES } from '../constants/routes'
import Card from '../components/common/Card'

// Quick-action dashboard shown after login or registration
export default function DashboardPage() {
  const { accountNumber, firstName, lastName } = useAccount()

  const displayName = firstName ? `${firstName} ${lastName ?? ''}`.trim() : null

  const actions = [
    { to: ROUTES.transfer, label: 'Send Money',     desc: 'Transfer to another account', icon: '⇄', colour: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300' },
    { to: ROUTES.deposit,  label: 'Fund Account',   desc: 'Deposit via debit card',       icon: '↓', colour: 'bg-blue-50 text-blue-700 dark:bg-emerald-800 dark:text-emerald-300' },
    { to: ROUTES.requery,  label: 'Re-query',       desc: 'Check a pending transaction',  icon: '↻', colour: 'bg-amber-50 text-amber-700 dark:bg-emerald-800 dark:text-emerald-300' },
    { to: ROUTES.kyc,      label: 'Upgrade Tier',   desc: 'Submit NIN or BVN to unlock higher limits', icon: '↑', colour: 'bg-purple-50 text-purple-700 dark:bg-emerald-800 dark:text-emerald-300' },
  ]

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        Welcome back{displayName ? `, ${displayName}` : ''}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Here&apos;s your account at a glance.</p>

      {/* Account card */}
      <div className="mb-6 bg-emerald-700 dark:bg-emerald-800 border border-emerald-600 dark:border-emerald-700 shadow-sm p-6">
        <p className="text-emerald-200 text-xs font-medium uppercase tracking-widest mb-1">Account Number</p>
        <p className="text-white font-mono text-2xl font-bold tracking-widest">
          {accountNumber ?? '—'}
        </p>
        <p className="text-emerald-300 text-xs mt-2">Savings · Active</p>
      </div>

      {/* Quick actions */}
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {actions.map(({ to, label, desc, icon, colour }) => (
          <Link key={to} to={to}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className={`w-10 h-10 flex items-center justify-center text-xl mb-3 ${colour}`}>
                {icon}
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{label}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
