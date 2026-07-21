import { useForm } from 'react-hook-form'
import { useDeposit } from '../hooks/useDeposit'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'

// Maps to POST /api/transaction/deposit (CardDetailsRequest)
// Two test cards are available in the backend:
//   7893234572819472 / SOLOMON GRUNDY / 2029-01 / 324 → SUCCESSFUL
//   1234567893824913 / CHIOMA PRECIOUS / 2027-08 / 372 → PENDING
export default function DepositPage() {
  const { deposit, loading, result } = useDeposit()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  async function onSubmit(data) {
    const ok = await deposit({
      accountId: data.accountId,
      cardNumber: data.cardNumber,
      cardName: data.cardName,
      dateOfExpiry: data.dateOfExpiry,
      cvc: parseInt(data.cvc),
      depositAmount: parseFloat(data.depositAmount),
      description: data.description,
    })
    if (ok) reset()
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Deposit Funds</h2>
      <p className="text-gray-500 dark:text-emerald-400 text-sm mb-6">Fund your account using a debit card.</p>

      {/* Test card helper */}
      <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 dark:bg-emerald-900 dark:border-emerald-700 dark:text-emerald-300">
        <strong>Test Cards:</strong>
        <br />• 7893234572819472 — SOLOMON GRUNDY — 2029-01 — CVC 324 → Immediate
        <br />• 1234567893824913 — CHIOMA PRECIOUS — 2027-08 — CVC 372 → Pending
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Your Account ID (UUID)"
            name="accountId"
            placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
            required
            error={errors.accountId?.message}
            {...register('accountId', { required: 'Account ID is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                label="Card Number"
                name="cardNumber"
                placeholder="7893234572819472"
                maxLength={16}
                required
                error={errors.cardNumber?.message}
                {...register('cardNumber', {
                  required: 'Card number is required',
                  pattern: { value: /^\d{16}$/, message: 'Must be 16 digits' },
                })}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Name on Card"
                name="cardName"
                placeholder="SOLOMON GRUNDY"
                required
                error={errors.cardName?.message}
                {...register('cardName', { required: 'Card name is required' })}
              />
            </div>
            <Input
              label="Expiry (YYYY-MM)"
              name="dateOfExpiry"
              placeholder="2029-01"
              required
              error={errors.dateOfExpiry?.message}
              {...register('dateOfExpiry', {
                required: 'Expiry is required',
                pattern: { value: /^\d{4}-(0[1-9]|1[0-2])$/, message: 'Use YYYY-MM format' },
              })}
            />
            <Input
              label="CVC"
              name="cvc"
              type="password"
              placeholder="•••"
              maxLength={3}
              required
              error={errors.cvc?.message}
              {...register('cvc', {
                required: 'CVC is required',
                pattern: { value: /^\d{3}$/, message: 'Must be 3 digits' },
              })}
            />
          </div>

          <Input
            label="Amount to Deposit (₦)"
            name="depositAmount"
            type="number"
            step="0.01"
            min="100"
            placeholder="5000.00"
            required
            hint="Minimum deposit: ₦100"
            error={errors.depositAmount?.message}
            {...register('depositAmount', {
              required: 'Amount is required',
              min: { value: 100, message: 'Minimum deposit is ₦100' },
            })}
          />
          <Input
            label="Description"
            name="description"
            placeholder="Wallet top-up"
            required
            error={errors.description?.message}
            {...register('description', { required: 'Description is required' })}
          />

          <Button type="submit" loading={loading} className="mt-2">
            Deposit Funds
          </Button>
        </form>
      </Card>

      {result && (
        <Card className="mt-4">
          <p className="text-sm text-gray-500 dark:text-emerald-400 mb-2">Deposit Result</p>
          <div className="flex items-center gap-3">
            <Badge status={result.status} />
            {result.status === 'PENDING' && (
              <span className="text-gray-600 dark:text-emerald-200 text-sm">
                Use <strong>Re-query</strong> in the sidebar to check the final status.
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
