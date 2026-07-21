import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import { ROUTES } from '../constants/routes'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

// Maps to POST /api/create-personal-account (CustomerRegistrationRequest)
export default function RegisterPage() {
  const { register: hookRegister, loading } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={ROUTES.home} className="inline-block mb-4">
            <div className="w-12 h-12 bg-emerald-400 flex items-center justify-center text-emerald-900 font-bold text-lg mx-auto">
              DB
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
          <p className="text-gray-500 dark:text-emerald-300 mt-1 text-sm">Personal banking — Nigerian residents only</p>
        </div>

        <Card>
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
              hint="Nigerian format: 0[7|8|9]XXXXXXXXX"
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

            {/* Row 5: NIN + BVN (optional) */}
            <Input
              label="NIN (optional)"
              name="nin"
              placeholder="12345678901"
              hint="11-digit National ID Number"
              error={errors.nin?.message}
              {...register('nin', {
                pattern: { value: /^\d{11}$/, message: 'NIN must be 11 digits' },
              })}
            />
            <Input
              label="BVN (optional)"
              name="bvn"
              placeholder="12345678901"
              hint="11-digit Bank Verification Number"
              error={errors.bvn?.message}
              {...register('bvn', {
                pattern: { value: /^\d{11}$/, message: 'BVN must be 11 digits' },
              })}
            />

            {/* Submit */}
            <div className="col-span-2 pt-2">
              <Button type="submit" loading={loading} className="w-full py-3">
                Create Account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
