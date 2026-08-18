import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAdminRegister } from '../../hooks/useAdminRegister'
import { ROUTES } from '../../constants/routes'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ThemeToggle from '../../components/common/ThemeToggle'

// Accessible only via direct URL /register/admin — not publicly linked anywhere.
// Once the backend secures create-admin-account to require ADMIN role,
// wrap this route with AdminRoute.
export default function AdminRegisterPage() {
  const { registerAdmin, loading } = useAdminRegister()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  const MIN_DOB = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 100)
    return d.toISOString().split('T')[0]
  })()
  const MAX_DOB = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 18)
    return d.toISOString().split('T')[0]
  })()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-emerald-950 px-6 py-16">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Link to={ROUTES.home} className="text-xs text-gray-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-white transition-colors px-2 py-1">
          ← Home
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-emerald-400 flex items-center justify-center text-emerald-900 font-black text-sm">DB</div>
          <span className="text-gray-900 dark:text-white font-bold text-lg">DigitalBank</span>
        </div>

        <div className="mb-3 px-3 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">
          <p className="text-amber-800 dark:text-amber-300 text-xs font-semibold">
            Admin Account Creation — Restricted Access
          </p>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Admin Account</h1>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mb-8">
          This page is for creating new admin accounts. It is not publicly linked.
        </p>

        <form onSubmit={handleSubmit(registerAdmin)} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="Ada"
              required
              error={errors.firstName?.message}
              {...register('firstName', { required: 'Required' })}
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Okonkwo"
              required
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Required' })}
            />
          </div>
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="admin@digitalbank.com"
            required
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="08012345678"
            required
            error={errors.phoneNumber?.message}
            {...register('phoneNumber', {
              required: 'Phone number is required',
              pattern: { value: /^(\+234|0)[789]\d{9}$/, message: 'Enter a valid Nigerian phone number' },
            })}
          />
          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            required
            min={MIN_DOB}
            max={MAX_DOB}
            error={errors.dateOfBirth?.message}
            hint="Admin must be 18 or older"
            {...register('dateOfBirth', {
              required: 'Date of birth is required',
              validate: (v) => {
                const age = (Date.now() - new Date(v).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
                return age >= 18 || 'Must be at least 18 years old'
              },
            })}
          />
          <Input
            label="Address"
            name="address"
            placeholder="123 Victoria Island, Lagos"
            required
            error={errors.address?.message}
            {...register('address', { required: 'Address is required' })}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
            error={errors.password?.message}
            hint="Minimum 8 characters, one uppercase letter, one number"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
              pattern: { value: /(?=.*[A-Z])(?=.*\d)/, message: 'Must include an uppercase letter and a number' },
            })}
          />

          <Button type="submit" loading={loading} className="w-full py-3 mt-1">
            Create Admin Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-6">
          <Link to={ROUTES.login} className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
