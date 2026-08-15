import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTransfer } from '../hooks/useTransfer'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

// Maps to POST /api/transaction/transfer (TransferFundsRequest)
export default function TransferPage() {
  const { transfer, loading, result } = useTransfer()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Keep a copy of the last submitted values so the result card can reference them
  const [submitted, setSubmitted] = useState(null)

  async function onSubmit(data) {
    setSubmitted(data)
    const ok = await transfer({
      amount:             parseFloat(data.amount),
      destinationAccount: data.destinationAccount,
      description:        data.description,
    })
    if (ok) reset()
  }

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Transfer Funds</h2>
        <p className="text-gray-500 dark:text-emerald-400 text-sm mt-1">
          Send money instantly to any DigitalBank account.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Destination Account Number"
            name="destinationAccount"
            placeholder="e.g. 2026847291"
            required
            error={errors.destinationAccount?.message}
            {...register('destinationAccount', { required: 'Enter the recipient account number' })}
          />
          <Input
            label="Amount (₦)"
            name="amount"
            type="number"
            step="0.01"
            min="1"
            placeholder="5000.00"
            required
            error={errors.amount?.message}
            {...register('amount', {
              required: 'Enter the amount to send',
              min: { value: 1, message: 'Minimum transfer is ₦1' },
            })}
          />
          <Input
            label="Description / Narration"
            name="description"
            placeholder="School fees payment"
            required
            error={errors.description?.message}
            {...register('description', { required: 'Add a short description for this transfer' })}
          />

          <Button type="submit" loading={loading} className="mt-2">
            Send Transfer
          </Button>
        </form>
      </Card>

      {result && submitted && (
        <Card>
          {result.status === 'SUCCESSFUL' ? (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-300 text-lg shrink-0">✓</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Transfer successful</p>
                <p className="text-gray-500 dark:text-emerald-300 text-sm mt-0.5">
                  ₦{Number(submitted.amount).toLocaleString()} was sent to account <strong>{submitted.destinationAccount}</strong>.
                </p>
                <p className="text-gray-400 dark:text-emerald-500 text-xs mt-1">"{submitted.description}"</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 text-lg shrink-0">✕</div>
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400 text-sm">Transfer could not be completed</p>
                <p className="text-gray-500 dark:text-emerald-300 text-sm mt-0.5">
                  Please check that your account has sufficient balance and the destination account number is correct, then try again.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
