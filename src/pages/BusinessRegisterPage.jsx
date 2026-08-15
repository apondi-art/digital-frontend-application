import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useBusinessRegister } from '../hooks/useBusinessRegister'
import { ROUTES } from '../constants/routes'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ThemeToggle from '../components/common/ThemeToggle'

// Decorative left panel — business-focused variant
function HeroPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-emerald-900 p-10 relative overflow-hidden">
      {/* Background photo */}
      <img
        src="/images/transfers.jpg"
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
      <div className="relative z-10 flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white leading-snug">
            Banking for<br />Nigerian businesses.
          </h2>
          <p className="text-emerald-300 mt-3 text-sm leading-relaxed">
            Open a business account in minutes. No paperwork, no branch visits — just your CAC number and you're ready.
          </p>
        </div>

        {/* Feature checklist */}
        <ul className="flex flex-col gap-3">
          {[
            'Dedicated business account number',
            'Send and receive payments instantly',
            'Track all transactions in one place',
            'CAC-verified for credibility',
          ].map((text) => (
            <li key={text} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-900 text-xs font-bold shrink-0 mt-0.5">✓</span>
              <span className="text-emerald-100 text-sm">{text}</span>
            </li>
          ))}
        </ul>

        {/* Accepted CAC formats */}
        <div className="bg-emerald-800/60 border border-emerald-700 rounded-lg p-4">
          <p className="text-emerald-300 text-xs font-semibold mb-2 uppercase tracking-wide">Accepted CAC formats</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { code: 'RC', desc: 'Registered Company' },
              { code: 'BN', desc: 'Business Name' },
              { code: 'IT', desc: 'Incorporated Trustee' },
              { code: 'LP', desc: 'Limited Partnership' },
            ].map(({ code, desc }) => (
              <div key={code} className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-sm w-6">{code}</span>
                <span className="text-emerald-200 text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative z-10 bg-emerald-800 border border-emerald-700 rounded-lg p-4">
        <p className="text-emerald-100 text-sm leading-relaxed italic">
          &ldquo;DigitalBank helped my small business collect payments and pay suppliers without stepping into a bank. It just works.&rdquo;
        </p>
        <p className="text-emerald-400 text-xs mt-2 font-medium">— Emeka T., Onitsha</p>
      </div>
    </div>
  )
}

// Maps to POST /api/business/createaccount (BusinessRegistrationRequest)
// CAC number format: RC 123456 / BN 123456 / IT 123456 / LP 123456
export default function BusinessRegisterPage() {
  const { register: hookRegister, loading } = useBusinessRegister()
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <HeroPanel />

      {/* Right — form */}
      <div className="relative flex items-center justify-center px-6 py-12 bg-white dark:bg-emerald-950 overflow-y-auto">
        {/* Top-right actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Link to={ROUTES.home} className="text-xs text-gray-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-white transition-colors px-2 py-1">
            ← Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          {/* Logo — mobile only */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-emerald-400 flex items-center justify-center text-emerald-900 font-black text-sm">DB</div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">DigitalBank</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Open a Business Account</h1>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mb-8">Register your business and start transacting.</p>

          <form onSubmit={handleSubmit(hookRegister)} className="flex flex-col gap-4">
            <Input
              label="Business Name"
              name="businessName"
              placeholder="Acme Trading Ltd"
              required
              error={errors.businessName?.message}
              {...register('businessName', { required: 'Business name is required' })}
            />

            <Input
              label="Business Address"
              name="businessAddress"
              placeholder="10 Broad Street, Lagos Island"
              required
              error={errors.businessAddress?.message}
              {...register('businessAddress', { required: 'Business address is required' })}
            />

            <Input
              label="CAC Number"
              name="cacNumber"
              placeholder="RC 123456"
              required
              hint="Format: RC / BN / IT / LP followed by a space and 6 digits"
              error={errors.cacNumber?.message}
              {...register('cacNumber', {
                required: 'CAC number is required',
                pattern: {
                  value: /^(RC|BN|IT|LP) \d{6}$/,
                  message: 'Invalid format. Example: RC 123456',
                },
              })}
            />

            <Input
              label="Business Email"
              name="businessEmail"
              type="email"
              placeholder="info@acmetrading.com"
              required
              autoComplete="email"
              error={errors.businessEmail?.message}
              {...register('businessEmail', {
                required: 'Business email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
              })}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              hint="Minimum 8 characters"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
            />

            <Button type="submit" loading={loading} className="w-full py-3 mt-2">
              Create Business Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-5">
            Opening a personal account?{' '}
            <Link to={ROUTES.register} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-2">
            Already have an account?{' '}
            <Link to={ROUTES.login} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
