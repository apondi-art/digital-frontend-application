import { Link } from 'react-router-dom'
import { useAccount } from '../hooks/useAccount'
import { ROUTES } from '../constants/routes'

// Shown to business users after login (role === 'BUSINESS').
// Currently mirrors the customer dashboard until business-specific
// API endpoints are implemented on the backend.
export default function BusinessDashboardPage() {
  const { accountNumber, firstName, lastName } = useAccount()
  const displayName = firstName ? `${firstName}${lastName ? ' ' + lastName : ''}` : null

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Welcome, {displayName ?? 'Business Account'}!
        </h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">Business Account Dashboard</p>
      </div>

      {/* Business account card */}
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-xl select-none">
        <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 px-7 py-6 min-h-[180px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">DigitalBank Business</span>
          </div>
          <div>
            <p className="text-amber-400 text-xs uppercase tracking-widest mb-1">Account Number</p>
            <p className="text-white font-mono text-2xl font-bold tracking-wider">
              {accountNumber ? accountNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3') : '— — —'}
            </p>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-amber-400 text-xs uppercase tracking-widest mb-0.5">Account Name</p>
              <p className="text-white text-sm font-semibold">{displayName?.toUpperCase() ?? 'BUSINESS ACCOUNT'}</p>
            </div>
            <div className="text-right">
              <p className="text-amber-400 text-xs uppercase tracking-widest mb-0.5">Type</p>
              <p className="text-amber-300 text-xs font-semibold">Business</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500 rounded-full opacity-10 translate-x-10 -translate-y-10" aria-hidden="true" />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-emerald-400 uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { to: ROUTES.transfer, label: 'Send Money', desc: 'Transfer to any account' },
            { to: ROUTES.deposit,  label: 'Fund Account', desc: 'Deposit via debit card' },
            { to: ROUTES.history,  label: 'History', desc: 'View transaction history' },
          ].map(({ to, label, desc }) => (
            <Link key={to} to={to}>
              <div className="bg-white dark:bg-emerald-900 border border-amber-100 dark:border-amber-800 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
                  <p className="text-gray-400 dark:text-emerald-400 text-xs mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
          <strong>Business features</strong> including dedicated analytics and multi-user access are coming soon.
        </p>
      </div>
    </div>
  )
}
