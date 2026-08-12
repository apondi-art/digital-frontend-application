import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import ThemeToggle from '../components/common/ThemeToggle'

// Public navbar — shown on Landing and Register pages
export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-emerald-900 dark:border-emerald-700 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to={ROUTES.home} className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center text-white dark:text-emerald-900 font-bold text-sm">
            DB
          </div>
          <span className="text-gray-900 dark:text-white font-semibold text-lg tracking-tight">DigitalBank</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-3 text-sm">
          <Link
            to={ROUTES.home}
            className="text-gray-600 hover:text-gray-900 dark:text-emerald-300 dark:hover:text-white transition-colors px-3 py-2"
          >
            Home
          </Link>
          <ThemeToggle />
          <Link
            to={ROUTES.login}
            className="text-gray-600 hover:text-gray-900 dark:text-emerald-300 dark:hover:text-white transition-colors px-3 py-2 font-medium"
          >
            Sign In
          </Link>
          <Link
            to={ROUTES.register}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white px-4 py-2 font-medium transition-colors"
          >
            Open Account
          </Link>
        </div>
      </div>
    </nav>
  )
}
