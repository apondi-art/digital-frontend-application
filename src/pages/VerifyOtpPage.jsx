import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { verifyOtp, resendOtp } from '../api/authApi'
import { ROUTES } from '../constants/routes'
import Button from '../components/common/Button'
import ThemeToggle from '../components/common/ThemeToggle'

const RESEND_COOLDOWN = 60
const OTP_EXPIRY_SECONDS = 10 * 60 // 10 minutes

function HeroPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-emerald-900 p-10 relative overflow-hidden">
      <img
        src="/images/hero.jpg"
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
        {/* Phone illustration */}
        <svg viewBox="0 0 120 180" className="w-24" aria-hidden="true">
          <rect x="10" y="5" width="100" height="170" rx="14" fill="#065f46" stroke="#34d399" strokeWidth="2.5" />
          <rect x="20" y="20" width="80" height="120" rx="4" fill="#047857" opacity="0.6" />
          {/* Message bubbles */}
          <rect x="25" y="30" width="55" height="18" rx="6" fill="#34d399" opacity="0.8" />
          <rect x="25" y="54" width="40" height="18" rx="6" fill="#6ee7b7" opacity="0.5" />
          {/* OTP digits illustration */}
          <rect x="22" y="82" width="14" height="18" rx="3" fill="#34d399" />
          <rect x="40" y="82" width="14" height="18" rx="3" fill="#34d399" />
          <rect x="58" y="82" width="14" height="18" rx="3" fill="#34d399" />
          <rect x="76" y="82" width="14" height="18" rx="3" fill="#6ee7b7" opacity="0.4" />
          <circle cx="60" cy="165" r="6" fill="#34d399" opacity="0.4" />
        </svg>

        <div>
          <h2 className="text-2xl font-extrabold text-white leading-snug">
            Verify your<br />phone number.
          </h2>
          <p className="text-emerald-300 mt-3 text-sm leading-relaxed">
            We sent a 6-digit code to confirm your phone number belongs to you. This keeps your account secure.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {[
            'Code valid for 10 minutes',
            'Request a new code after 60 seconds',
            'Your account activates after verification',
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
          &ldquo;Never share your OTP with anyone — DigitalBank staff will never ask for it.&rdquo;
        </p>
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN)
  const [expiresIn, setExpiresIn] = useState(OTP_EXPIRY_SECONDS)
  const [verified, setVerified] = useState(false)
  const inputRefs = useRef([])

  const location = useLocation()
  const navigate = useNavigate()
  const customerId = location.state?.customerId ?? null
  const email = location.state?.email ?? null

  useEffect(() => {
    if (countdown <= 0) return
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown])

  useEffect(() => {
    if (expiresIn <= 0) return
    const id = setTimeout(() => setExpiresIn((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [expiresIn])

  const otpExpired = expiresIn <= 0

  function formatExpiry(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!customerId) {
      toast.error('Session expired. Please register again.')
      navigate(ROUTES.register, { replace: true })
      return
    }
    const code = otp.join('')
    if (code.length !== 6) {
      toast.error('Please enter all 6 digits')
      return
    }
    setLoading(true)
    try {
      await verifyOtp(customerId, code)
      setVerified(true)
    } catch {
      // Axios interceptor shows error toast
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!customerId) {
      // Already registered but no session — sending them to login triggers the
      // 403 "not verified" redirect which brings them back here with customerId
      toast('Try logging in — we\'ll bring you right back here.', { icon: 'ℹ️' })
      navigate(ROUTES.login, { replace: true })
      return
    }
    setResendLoading(true)
    try {
      await resendOtp(customerId)
      toast.success('A new OTP has been sent.')
      setCountdown(RESEND_COOLDOWN)
      setExpiresIn(OTP_EXPIRY_SECONDS)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch {
      // Axios interceptor shows error toast
    } finally {
      setResendLoading(false)
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen grid lg:grid-cols-2">
        <HeroPanel />
        <div className="flex items-center justify-center px-6 py-16 bg-white dark:bg-emerald-950">
          <div className="w-full max-w-sm text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Account Verified!</h1>
              <p className="text-gray-500 dark:text-emerald-300 text-sm mt-2">
                Your account is now active. Sign in to start banking.
              </p>
            </div>
            <button
              onClick={() => navigate(ROUTES.login, { replace: true })}
              className="w-full py-3 bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors"
            >
              Sign In to Your Account
            </button>
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

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Verify your account</h1>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mb-2">
            We sent a 6-digit code to your registered phone number.
          </p>
          {!otpExpired && (
            <p className="text-xs text-gray-400 dark:text-emerald-500 mb-1">
              Code expires in{' '}
              <span className={`font-semibold ${expiresIn <= 60 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-300'}`}>
                {formatExpiry(expiresIn)}
              </span>
            </p>
          )}
          {otpExpired && (
            <p className="text-xs font-semibold text-red-500 mb-1">
              Your code has expired. Request a new one below.
            </p>
          )}
          {email ? (
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300 mb-8">{email}</p>
          ) : (
            <div className="mb-8" />
          )}

          {!customerId ? (
            /* No session — user is already registered but landed here without state */
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-4 text-sm text-amber-800 dark:text-amber-300">
                <p className="font-semibold mb-1">Session not found</p>
                <p>
                  If you already registered, try logging in — your account is unverified so
                  we&apos;ll send you straight back here to enter your code.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => navigate(ROUTES.login, { replace: true })}
                className="w-full py-3"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* OTP digit inputs */}
                <div className="flex gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      aria-label={`OTP digit ${i + 1}`}
                      className="w-full h-14 text-center text-xl font-bold border-2 border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                <Button type="submit" loading={loading} disabled={otpExpired} className="w-full py-3">
                  Verify Code
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={(countdown > 0 && !otpExpired) || resendLoading}
                  className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading
                    ? 'Sending…'
                    : countdown > 0 && !otpExpired
                      ? `Resend OTP (${countdown}s)`
                      : 'Resend OTP'}
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-4">
            <Link to={ROUTES.login} className="text-emerald-600 dark:text-emerald-400 hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
