
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { ROUTES } from '../constants/routes'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

// Maps to POST /api/auth/login
export default function LoginPage() {
  const { login, loading } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={ROUTES.home} className="inline-block mb-4">
            <div className="w-12 h-12 bg-emerald-400 flex items-center justify-center text-emerald-900 font-bold text-lg mx-auto">
              DB
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 dark:text-emerald-300 mt-1 text-sm">Sign in to your DigitalBank account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(login)} className="flex flex-col gap-4">
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

            <Button type="submit" loading={loading} className="w-full py-3 mt-2">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Don&apos;t have an account?{' '}
            <Link to={ROUTES.register} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
