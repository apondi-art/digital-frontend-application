import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createAdmin } from '../../api/adminApi'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

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

export default function AdminCreateAdminPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  async function onSubmit(data) {
    setLoading(true)
    try {
      await createAdmin(data)
      toast.success('Admin account created successfully')
      reset()
    } catch {
      // Axios interceptor shows error toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create Admin</h2>
        <p className="text-gray-500 dark:text-emerald-300 text-sm mt-1">
          Add a new admin user to the platform.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
            hint="Admin must be 18 or older"
            error={errors.dateOfBirth?.message}
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
            hint="Minimum 8 characters, one uppercase letter, one number"
            error={errors.password?.message}
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
      </Card>
    </div>
  )
}
