import { Link } from 'react-router-dom'
import { useAccount } from '../hooks/useAccount'
import { ROUTES } from '../constants/routes'

function BankCard({ accountNumber, firstName, lastName }) {
  const name = [firstName, lastName].filter(Boolean).join(' ').toUpperCase() || 'YOUR NAME'
  const maskedNumber = accountNumber
    ? accountNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
    : '— — —'

  return (
    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-xl select-none">
      {/* Gradient background */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 px-7 py-6 min-h-[180px] flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="text-emerald-300 text-xs font-bold tracking-widest uppercase">DigitalBank</span>
          <svg viewBox="0 0 40 26" className="w-10" aria-hidden="true">
            <circle cx="14" cy="13" r="12" fill="#f59e0b" opacity="0.85" />
            <circle cx="26" cy="13" r="12" fill="#ef4444" opacity="0.7" />
          </svg>
        </div>

        {/* Chip + contactless */}
        <div className="flex items-center gap-3 mt-2">
          <svg viewBox="0 0 36 28" className="w-9" aria-hidden="true">
            <rect x="1" y="1" width="34" height="26" rx="4" fill="#d97706" opacity="0.8" />
            <line x1="1" y1="14" x2="35" y2="14" stroke="#92400e" strokeWidth="1.5" />
            <line x1="18" y1="1" x2="18" y2="27" stroke="#92400e" strokeWidth="1.5" />
          </svg>
          <svg viewBox="0 0 24 24" className="w-5" aria-hidden="true">
            <path d="M12 2 Q18 8 12 14" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M12 6 Q20 12 12 18" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M12 10 Q22 16 12 22" stroke="#6ee7b7" strokeWidth="1" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Account number */}
        <div>
          <p className="text-emerald-400 text-xs uppercase tracking-widest mb-1">Account Number</p>
          <p className="text-white font-mono text-2xl font-bold tracking-wider">{maskedNumber}</p>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between mt-2">
          <div>
            <p className="text-emerald-400 text-xs uppercase tracking-widest mb-0.5">Card Holder</p>
            <p className="text-white text-sm font-semibold tracking-wide">{name}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-400 text-xs uppercase tracking-widest mb-0.5">Type</p>
            <p className="text-emerald-300 text-xs font-semibold">Savings · Tier 1</p>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500 rounded-full opacity-10 translate-x-10 -translate-y-10" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-teal-400 rounded-full opacity-10 -translate-x-6 translate-y-6" aria-hidden="true" />
    </div>
  )
}

const actions = [
  {
    to: ROUTES.transfer,
    label: 'Send Money',
    desc: 'Transfer to any account',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#d1fae5" />
        <line x1="10" y1="20" x2="30" y2="20" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
        <polyline points="23,13 30,20 23,27" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    accent: 'border-emerald-200 dark:border-emerald-700',
  },
  {
    to: ROUTES.deposit,
    label: 'Fund Account',
    desc: 'Deposit via debit card',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#dbeafe" />
        <line x1="20" y1="10" x2="20" y2="30" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <polyline points="13,23 20,30 27,23" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    accent: 'border-blue-200 dark:border-blue-700',
  },
  {
    to: ROUTES.requery,
    label: 'Re-query',
    desc: 'Check pending transaction',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#fef3c7" />
        <path d="M26 14 A9 9 0 1 0 29 21" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <polyline points="26,10 26,15 30,15" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    accent: 'border-amber-200 dark:border-amber-700',
  },
  {
    to: ROUTES.kyc,
    label: 'Upgrade Tier',
    desc: 'Submit NIN or BVN',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#ede9fe" />
        <path d="M20 8 L30 13 L30 24 Q30 32 20 35 Q10 32 10 24 L10 13 Z" stroke="#7c3aed" strokeWidth="2" fill="#c4b5fd" opacity="0.4" />
        <text x="20" y="26" fill="#7c3aed" fontSize="13" textAnchor="middle" fontWeight="bold">✓</text>
      </svg>
    ),
    accent: 'border-purple-200 dark:border-purple-700',
  },
]

export default function DashboardPage() {
  const { accountNumber, firstName, lastName } = useAccount()
  const displayName = firstName ? `${firstName}${lastName ? ' ' + lastName : ''}` : null

  return (
    <div className="max-w-3xl space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Welcome back{displayName ? `, ${displayName}` : ''}! 👋
        </h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">Here&apos;s your account at a glance.</p>
      </div>

      {/* Bank card */}
      <BankCard accountNumber={accountNumber} firstName={firstName} lastName={lastName} />

      {/* Quick actions */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-emerald-400 uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {actions.map(({ to, label, desc, icon, accent }) => (
            <Link key={to} to={to}>
              <div className={`bg-white dark:bg-emerald-900 border ${accent} rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer h-full`}>
                {icon}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
                  <p className="text-gray-400 dark:text-emerald-400 text-xs mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-emerald-50 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4 flex items-start gap-3">
        <span className="text-emerald-600 text-lg shrink-0">💡</span>
        <p className="text-emerald-800 dark:text-emerald-200 text-sm leading-relaxed">
          <strong>Upgrade your account tier</strong> by submitting your NIN or BVN under &ldquo;Upgrade Tier&rdquo; to unlock higher transfer limits.
        </p>
      </div>
    </div>
  )
}
