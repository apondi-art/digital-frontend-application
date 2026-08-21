import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useLogin } from '../hooks/useLogin'
import { ROUTES } from '../constants/routes'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ThemeToggle from '../components/common/ThemeToggle'

// Decorative panel shown beside the login form
function HeroPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-emerald-900 p-10 relative overflow-hidden">
      {/* Background photo — person doing mobile banking */}
      
      <img
        src="/images/login-panel.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-emerald-900/70 to-emerald-800/60" aria-hidden="true" />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-400 flex items-center justify-center text-emerald-900 font-black text-sm">DB</div>
          <span className="text-white font-bold text-lg tracking-wide">DigitalBank</span>
        </div>
      </div>

      {/* Central illustration — floating card mockup */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <svg viewBox="0 0 320 200" className="w-full max-w-xs drop-shadow-2xl" aria-hidden="true">
          {/* Back card */}
          <rect x="30" y="30" width="260" height="155" rx="12" fill="#047857" />
          {/* Front card */}
          <rect x="10" y="15" width="260" height="155" rx="12" fill="#065f46" />
          <rect x="10" y="15" width="260" height="155" rx="12" fill="url(#cardGrad)" />
          <defs>
            <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Chip */}
          <rect x="28" y="48" width="36" height="28" rx="4" fill="#34d399" opacity="0.7" />
          <line x1="28" y1="62" x2="64" y2="62" stroke="#065f46" strokeWidth="2" />
          <line x1="46" y1="48" x2="46" y2="76" stroke="#065f46" strokeWidth="2" />
          {/* Contactless */}
          <path d="M80 57 Q88 62 80 67" stroke="#6ee7b7" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M84 52 Q96 62 84 72" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Number */}
          <text x="28" y="118" fill="white" fontSize="13" fontFamily="monospace" letterSpacing="3" opacity="0.9">**** **** **** 4821</text>
          {/* Name & expiry */}
          <text x="28" y="146" fill="#6ee7b7" fontSize="10" fontFamily="monospace" letterSpacing="1">ADA OKONKWO</text>
          <text x="228" y="146" fill="#6ee7b7" fontSize="10" fontFamily="monospace">12/29</text>
          {/* Bank name */}
          <text x="28" y="32" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2">DIGITALBANK</text>
          {/* Circles decoration */}
          <circle cx="255" cy="100" r="42" stroke="#34d399" strokeWidth="0.8" opacity="0.25" fill="none" />
          <circle cx="255" cy="100" r="28" stroke="#34d399" strokeWidth="0.8" opacity="0.25" fill="none" />
        </svg>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {[
            { value: '2 min', label: 'Account open' },
            { value: 'Instant', label: 'Transfers' },
            { value: '100%', label: 'Online' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-emerald-400 font-bold text-lg">{value}</p>
              <p className="text-emerald-300 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative z-10 bg-emerald-800 border border-emerald-700 rounded-lg p-4">
        <p className="text-emerald-100 text-sm leading-relaxed italic">
          &ldquo;DigitalBank made it effortless to manage my savings and send money home. No branch visits, ever.&rdquo;
        </p>
        <p className="text-emerald-400 text-xs mt-2 font-medium">— Amara O., Lagos</p>
      </div>
    </div>
  )
}

// Maps to POST /api/auth/login
export default function LoginPage() {
  const { login, loading } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const location = useLocation()

  // Show success toast when redirected here after registration
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      toast.success('Account created! Please sign in to continue.')
      // Clear the state so the toast doesn't show again on refresh
      window.history.replaceState({}, document.title)
    }
    if (location.state?.passwordResetSuccess) {
      toast.success('Password reset successful. Please sign in.')
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <HeroPanel />

      {/* Right — form */}
      <div className="relative flex items-center justify-center px-6 py-16 bg-white dark:bg-emerald-950">
        {/* Top-right actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Link to={ROUTES.home} className="text-xs text-gray-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-white transition-colors px-2 py-1">
            ← Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          {/* Logo (shown on mobile only — desktop has it in the panel) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-emerald-400 flex items-center justify-center text-emerald-900 font-black text-sm">DB</div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">DigitalBank</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mb-8">Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit(login)} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="ada@example.com"
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
              Sign In
            </Button>
          </form>

          <div className="flex justify-end mt-2">
            <Link
              to={ROUTES.forgotPassword}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-6">
            No account?{' '}
            <Link to={ROUTES.register} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Create one free
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 dark:text-emerald-600 mt-3">
            <Link to={ROUTES.adminLogin} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Admin sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
