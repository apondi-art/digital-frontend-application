import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDeposit } from '../hooks/useDeposit'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

// Maps to POST /api/transaction/deposit (CardDetailsRequest)
// Two test cards are available in the backend:
//   7893234572819472 / SOLOMON GRUNDY / 2029-01 / 324 → SUCCESSFUL
//   1234567893824913 / CHIOMA PRECIOUS / 2027-08 / 372 → PENDING
export default function DepositPage() {
  const { deposit, loading, result } = useDeposit()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [submitted, setSubmitted] = useState(null)

  async function onSubmit(data) {
    setSubmitted(data)
    const ok = await deposit({
      cardNumber: data.cardNumber,
      cardName: data.cardName,
      dateOfExpiry: data.dateOfExpiry,
      cvc: parseInt(data.cvc),
      depositAmount: parseFloat(data.depositAmount),
      description: data.description,
    })
    if (ok && result?.status !== 'PENDING') reset()
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

      {result && submitted && (
        <Card className="mt-4">
          {result.status === 'SUCCESSFUL' ? (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-300 text-lg shrink-0">✓</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Deposit successful</p>
                <p className="text-gray-500 dark:text-emerald-300 text-sm mt-0.5">
                  ₦{Number(submitted.depositAmount).toLocaleString()} has been added to your account.
                </p>
                <p className="text-gray-400 dark:text-emerald-500 text-xs mt-1">"{submitted.description}"</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 text-lg shrink-0">⏳</div>
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-400 text-sm">Deposit is being processed</p>
                <p className="text-gray-500 dark:text-emerald-300 text-sm mt-0.5">
                  Your deposit of <strong>₦{Number(submitted.depositAmount).toLocaleString()}</strong> is pending. Go to <strong>History</strong> to find your Transaction ID, then use <strong>Re-query</strong> to settle it.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
