import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import { ROUTES } from '../constants/routes'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Button from '../components/common/Button'
import ThemeToggle from '../components/common/ThemeToggle'

// Decorative left panel — mirrors the LoginPage panel style
function HeroPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-emerald-900 p-10 relative overflow-hidden">
      {/* Background photo */}
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
      <div className="relative z-10 flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white leading-snug">
            Banking built<br />for Nigerians.
          </h2>
          <p className="text-emerald-300 mt-3 text-sm leading-relaxed">
            Open a free account in under 2 minutes. No branch visit, no paperwork — just your details and you're in.
          </p>
        </div>

        {/* Feature checklist */}
        <ul className="flex flex-col gap-3">
          {[
            'Instant transfers to any DigitalBank account',
            'Fund your wallet with any debit card',
            'Upgrade your tier with NIN or BVN',
            'Full transaction history, always accessible',
          ].map((text) => (
            <li key={text} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-900 text-xs font-bold shrink-0 mt-0.5">✓</span>
              <span className="text-emerald-100 text-sm">{text}</span>
            </li>
          ))}
        </ul>

        {/* Tier summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { tier: 'Tier 1', label: 'Starter', limit: '₦50k/day' },
            { tier: 'Tier 2', label: 'NIN verified', limit: '₦200k/day' },
            { tier: 'Tier 3', label: 'BVN verified', limit: '₦1M/day' },
          ].map(({ tier, label, limit }) => (
            <div key={tier} className="bg-emerald-800/60 border border-emerald-700 rounded-lg p-3 text-center">
              <p className="text-emerald-400 font-bold text-xs">{tier}</p>
              <p className="text-emerald-200 text-xs mt-0.5">{label}</p>
              <p className="text-white text-xs font-semibold mt-1">{limit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative z-10 bg-emerald-800 border border-emerald-700 rounded-lg p-4">
        <p className="text-emerald-100 text-sm leading-relaxed italic">
          &ldquo;I opened my DigitalBank account in minutes. Transfers are instant and the interface is clean — best banking experience I've had.&rdquo;
        </p>
        <p className="text-emerald-400 text-xs mt-2 font-medium">— Chinwe A., Enugu</p>
      </div>
    </div>
  )
}

// Maps to POST /api/create-personal-account (CustomerRegistrationRequest)
export default function RegisterPage() {
  const { register: hookRegister, loading } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <HeroPanel />

      {/* Right — scrollable form */}
      <div className="relative flex items-start justify-center px-6 py-12 bg-white dark:bg-emerald-950 overflow-y-auto">
        {/* Top-right actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Link to={ROUTES.home} className="text-xs text-gray-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-white transition-colors px-2 py-1">
            ← Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-lg">
          {/* Logo — mobile only */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-emerald-400 flex items-center justify-center text-emerald-900 font-black text-sm">DB</div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">DigitalBank</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create your account</h1>
          <p className="text-gray-500 dark:text-emerald-300 text-sm mb-8">Personal banking — Nigerian residents only.</p>

          <form onSubmit={handleSubmit(hookRegister)} className="grid grid-cols-2 gap-4">
            {/* Row 1: Name */}
            <Input
              label="First Name"
              name="firstName"
              placeholder="Ada"
              required
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName', { required: 'First name is required' })}
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Okonkwo"
              required
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Last name is required' })}
            />

            {/* Row 2: Email + Phone */}
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
              label="Phone Number"
              name="phoneNumber"
              placeholder="08012345678"
              required
              autoComplete="tel"
              hint="Format: 0[7|8|9]XXXXXXXXX"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^0[789]\d{9}$/,
                  message: 'Invalid Nigerian phone number',
                },
              })}
            />

            {/* Row 3: Password + Gender */}
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Min 8 characters' },
                validate: (v) => {
                  if (!/[A-Z]/.test(v)) return 'Must contain an uppercase letter'
                  if (!/[0-9]/.test(v)) return 'Must contain a number'
                  return true
                },
              })}
            />
            <Select
              label="Gender"
              name="gender"
              required
              error={errors.gender?.message}
              options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }]}
              {...register('gender', { required: 'Gender is required' })}
            />

            {/* Row 4: DOB + Address */}
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              required
              hint="Must be 18+ years old"
              error={errors.dateOfBirth?.message}
              {...register('dateOfBirth', {
                required: 'Date of birth is required',
                validate: (v) => {
                  const age = (Date.now() - new Date(v)) / (365.25 * 24 * 3600 * 1000)
                  return age >= 18 || 'You must be at least 18 years old'
                },
              })}
            />
            <Input
              label="Home Address"
              name="address"
              placeholder="123 Allen Avenue, Lagos"
              required
              autoComplete="street-address"
              error={errors.address?.message}
              {...register('address', { required: 'Address is required' })}
            />

            {/* Submit */}
            <div className="col-span-2 pt-2">
              <Button type="submit" loading={loading} className="w-full py-3">
                Create Account
              </Button>
              <p className="text-center text-xs text-gray-500 dark:text-emerald-400 mt-3">
                After registration, go to <strong>Upgrade Tier</strong> in your dashboard to submit NIN or BVN for higher transfer limits.
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-3">
                Already have an account?{' '}
                <Link to={ROUTES.login} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-2">
                Registering a business?{' '}
                <Link to={ROUTES.businessRegister} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Open a business account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
