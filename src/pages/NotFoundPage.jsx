import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-emerald-950 px-6 text-center">
      <div className="text-emerald-400 font-black text-8xl mb-4 select-none">404</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
      <p className="text-gray-500 dark:text-emerald-300 text-sm mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to={ROUTES.home}
        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors"
      >
        ← Go Home
      </Link>
    </div>
  )
}
