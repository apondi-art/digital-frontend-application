import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAdminRegister } from '../../hooks/useAdminRegister'
import { ROUTES } from '../../constants/routes'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ThemeToggle from '../../components/common/ThemeToggle'

// Accessible only via direct URL /register/admin — not publicly linked anywhere.
export default function AdminRegisterPage() {
  const { registerAdmin, loading } = useAdminRegister()
  const { register, handleSubmit, formState: { errors } } = useForm()

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
          <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
            Your Admin ID will be emailed to you after registration. You need it to sign in at <strong>/login/admin</strong>.
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
              pattern: { value: /^0[789][01]\d{8}$/, message: 'Enter a valid Nigerian phone number' },
            })}
          />

          {/* Gender — required by backend as enum MALE | FEMALE | OTHER */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-emerald-400 uppercase tracking-wide">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register('gender', { required: 'Gender is required' })}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-900 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
          </div>

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

          {/* Password — backend requires 10–15 chars, 1 uppercase, 1 number */}
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••••"
            required
            autoComplete="new-password"
            error={errors.password?.message}
            hint="10–15 characters, at least one uppercase letter and one number"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 10, message: 'At least 10 characters' },
              maxLength: { value: 15, message: 'Maximum 15 characters' },
              pattern: { value: /(?=.*[A-Z])(?=.*\d)/, message: 'Must include an uppercase letter and a number' },
            })}
          />

          <Button type="submit" loading={loading} className="w-full py-3 mt-1">
            Create Admin Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-emerald-300 mt-6">
          Already have an account?{' '}
          <Link to={ROUTES.adminLogin} className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Admin sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
