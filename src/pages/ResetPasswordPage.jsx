import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { resetPassword } from '../api/authApi'
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
        {/* Shield illustration */}
        <svg viewBox="0 0 160 160" className="w-32" aria-hidden="true">
          <path d="M80 15 L130 35 L130 85 Q130 130 80 150 Q30 130 30 85 L30 35 Z" fill="#065f46" stroke="#34d399" strokeWidth="3" />
          <path d="M80 20 L125 38 L125 85 Q125 127 80 145 Q35 127 35 85 L35 38 Z" fill="url(#shieldGrad)" />
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points="58,82 74,98 102,65" stroke="#34d399" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div>
          <h2 className="text-2xl font-extrabold text-white leading-snug">
            Set a strong<br />new password.
          </h2>
          <p className="text-emerald-300 mt-3 text-sm leading-relaxed">
            Choose a password you haven&apos;t used before. A good password is long, random, and unique to DigitalBank.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {[
            'At least 8 characters',
            'Include an uppercase letter and a number',
            'All your sessions will be signed out after reset',
          ].map((text) => (
            <li key={text} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-900 text-xs font-bold shrink-0 mt-0.5">✓</span>
              <span className="text-emerald-100 text-sm">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 bg-emerald-800 border border-emerald-700 rounded-lg p-4">
        <p className="text-emerald-100 text-sm leading-relaxed italic">
          &ldquo;Your account security is our top priority. Use a password manager to keep your credentials safe.&rdquo;
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const newPassword = watch('newPassword')

  async function onSubmit({ newPassword: pwd }) {
    if (!token) return
    setLoading(true)
    try {
      await resetPassword(token, pwd)
      navigate(ROUTES.login, { state: { passwordResetSuccess: true }, replace: true })
    } catch {
      // Axios interceptor shows the error toast
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen grid lg:grid-cols-2">
        <HeroPanel />
        <div className="flex items-center justify-center px-6 py-16 bg-white dark:bg-emerald-950">
          <div className="w-full max-w-sm text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid reset link</h1>
            <p className="text-sm text-gray-500 dark:text-emerald-300 mb-6">
              This link is missing a reset token. Please request a new one.
            </p>
            <Link to={ROUTES.forgotPassword} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline text-sm">
              Request new link
            </Link>
          </div>
        </div>
      </div>
    )
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

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">New password</h1>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mb-8">
            Choose a strong password — at least 8 characters, one uppercase letter, and one number.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Must be at least 8 characters' },
                pattern: {
                  value: /(?=.*[A-Z])(?=.*\d)/,
                  message: 'Must contain at least one uppercase letter and one number',
                },
              })}
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === newPassword || 'Passwords do not match',
              })}
            />

            <Button type="submit" loading={loading} className="w-full py-3 mt-1">
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
