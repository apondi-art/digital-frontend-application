import { useForm } from 'react-hook-form'
import { useTransfer } from '../hooks/useTransfer'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'

// Maps to POST /api/transaction/transfer (TransferFundsRequest)
export default function TransferPage() {
  const { transfer, loading, result } = useTransfer()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  async function onSubmit(data) {
    const ok = await transfer({
      accountId: data.accountId,
      amount: parseFloat(data.amount),
      destinationAccount: data.destinationAccount,
      description: data.description,
    })
    if (ok) reset()
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Transfer Funds</h2>
      <p className="text-gray-500 dark:text-emerald-400 text-sm mb-6">Send money instantly to any DigitalBank account.</p>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Your Account ID (UUID)"
            name="accountId"
            placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
            required
            hint="The UUID of your account, returned after creation"
            error={errors.accountId?.message}
            {...register('accountId', { required: 'Account ID is required' })}
          />
          <Input
            label="Destination Account Number"
            name="destinationAccount"
            placeholder="e.g. 2026847291"
            required
            error={errors.destinationAccount?.message}
            {...register('destinationAccount', { required: 'Destination account is required' })}
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
            {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Minimum ₦1' } })}
          />
          <Input
            label="Description / Narration"
            name="description"
            placeholder="School fees payment"
            required
            error={errors.description?.message}
            {...register('description', { required: 'Description is required' })}
          />

          <Button type="submit" loading={loading} className="mt-2">
            Send Transfer
          </Button>
        </form>
      </Card>

      {result && (
        <Card className="mt-4">
          <p className="text-sm text-gray-500 dark:text-emerald-400 mb-2">Transaction Result</p>
          <div className="flex items-center gap-3">
            <Badge status={result.status} />
            <span className="text-gray-700 dark:text-emerald-200 text-sm">
              {result.status === 'SUCCESSFUL' ? 'Transfer completed.' : 'Transfer could not be processed.'}
            </span>
          </div>
        </Card>
      )}
    </div>
  )
}
