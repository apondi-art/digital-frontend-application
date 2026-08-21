import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAdminLogin } from '../../hooks/useAdminLogin'
import { ROUTES } from '../../constants/routes'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ThemeToggle from '../../components/common/ThemeToggle'

// Maps to POST /api/auth/login-admin
// Requires: { email, password } body + X-ADMIN_ID header
export default function AdminLoginPage() {
  const { login, loading } = useAdminLogin()
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between h-full bg-emerald-900 p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-emerald-800/70" aria-hidden="true" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-400 flex items-center justify-center text-emerald-900 font-black text-sm">DB</div>
            <span className="text-white font-bold text-lg tracking-wide">DigitalBank</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-emerald-800 border-2 border-emerald-500 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-white font-bold text-xl">Admin Portal</h2>
            <p className="text-emerald-300 text-sm mt-1">Restricted access — authorised personnel only</p>
          </div>
        </div>

        <div className="relative z-10 bg-emerald-800/60 border border-emerald-700 rounded-lg p-4">
          <p className="text-emerald-200 text-xs">
            This portal is for DigitalBank administrators only. Unauthorised access attempts are logged and monitored.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center px-6 py-16 bg-white dark:bg-emerald-950">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Link to={ROUTES.home} className="text-xs text-gray-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-white transition-colors px-2 py-1">
            ← Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-emerald-400 flex items-center justify-center text-emerald-900 font-black text-sm">DB</div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">DigitalBank</span>
          </div>

          <div className="mb-4 px-3 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded">
            <p className="text-amber-800 dark:text-amber-300 text-xs font-semibold">
              Admin access only — not for customer accounts
            </p>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Admin Sign In</h1>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mb-8">
            Enter your Admin ID, email, and password to continue.
          </p>

          <form onSubmit={handleSubmit(login)} className="flex flex-col gap-5">
            <Input
              label="Admin ID"
              name="adminId"
              placeholder="e.g. ADM-00123"
              required
              autoComplete="username"
              error={errors.adminId?.message}
              {...register('adminId', { required: 'Admin ID is required' })}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@digitalbank.com"
              required
              autoComplete="email"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <Button type="submit" loading={loading} className="w-full py-3 mt-1">
              Sign In as Admin
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-6">
            Not an admin?{' '}
            <Link to={ROUTES.login} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Customer sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
