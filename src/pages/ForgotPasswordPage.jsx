import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { forgotPassword } from '../api/authApi'
import { ROUTES } from '../constants/routes'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ThemeToggle from '../components/common/ThemeToggle'

function HeroPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-emerald-900 p-10 relative overflow-hidden">
      <img
        src="/images/login-panel.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/75 to-emerald-800/65" aria-hidden="true" />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-400 flex items-center justify-center text-emerald-900 font-black text-sm">DB</div>
          <span className="text-white font-bold text-lg tracking-wide">DigitalBank</span>
        </div>
      </div>

      {/* Central content */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Lock illustration */}
        <svg viewBox="0 0 160 160" className="w-32" aria-hidden="true">
          <rect x="30" y="70" width="100" height="75" rx="10" fill="#065f46" />
          <rect x="30" y="70" width="100" height="75" rx="10" fill="url(#lockGrad)" />
          <defs>
            <linearGradient id="lockGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M55 70 V50 A25 25 0 0 1 105 50 V70" stroke="#34d399" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="80" cy="105" r="12" fill="#34d399" opacity="0.9" />
          <rect x="76" y="105" width="8" height="14" rx="3" fill="#065f46" />
        </svg>

        <div>
          <h2 className="text-2xl font-extrabold text-white leading-snug">
            Forgot your<br />password?
          </h2>
          <p className="text-emerald-300 mt-3 text-sm leading-relaxed">
            No worries. Enter your registered email and we&apos;ll send you a secure link to reset it in seconds.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {[
            'Secure reset link sent to your inbox',
            'Link expires after 15 minutes',
            'All existing sessions invalidated on reset',
          ].map((text) => (
            <li key={text} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-900 text-xs font-bold shrink-0 mt-0.5">✓</span>
              <span className="text-emerald-100 text-sm">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom note */}
      <div className="relative z-10 bg-emerald-800 border border-emerald-700 rounded-lg p-4">
        <p className="text-emerald-100 text-sm leading-relaxed italic">
          &ldquo;If you did not request a reset, you can safely ignore the email — your password will not change.&rdquo;
        </p>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  async function onSubmit({ email }) {
    setLoading(true)
    try {
      await forgotPassword(email)
    } catch {
      // Silently ignore errors — never confirm or deny that an email is registered
    } finally {
      setLoading(false)
      setSubmitted(true)
      toast.success('If that email is registered, a reset link has been sent.')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <HeroPanel />

      {/* Right — form */}
      <div className="relative flex items-center justify-center px-6 py-16 bg-white dark:bg-emerald-950">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Link to={ROUTES.home} className="text-xs text-gray-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-white transition-colors px-2 py-1">
            ← Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          {/* Logo — mobile only */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-emerald-400 flex items-center justify-center text-emerald-900 font-black text-sm">DB</div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">DigitalBank</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Reset password</h1>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mb-8">
            Enter your email address and we&apos;ll send you a reset link.
          </p>

          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700 rounded-xl p-5">
              <p className="text-emerald-800 dark:text-emerald-200 text-sm leading-relaxed">
                If an account with that email exists, a password reset link has been sent. Check your inbox and spam folder.
              </p>
              <Link
                to={ROUTES.login}
                className="inline-block mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                <Button type="submit" loading={loading} className="w-full py-3 mt-1">
                  Send Reset Link
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-6">
                Remember your password?{' '}
                <Link to={ROUTES.login} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
