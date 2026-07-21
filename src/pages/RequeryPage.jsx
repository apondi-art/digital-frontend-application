import { useForm } from 'react-hook-form'
import { useRequery } from '../hooks/useRequery'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'

// Maps to PUT /api/transaction/requery/{transaction-id}
// Resolves PENDING transactions to SUCCESSFUL or DECLINED (random on backend)
export default function RequeryPage() {
  const { requery, loading, result } = useRequery()
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Re-query Transaction</h2>
      <p className="text-gray-500 dark:text-emerald-400 text-sm mb-6">
        Check and resolve a pending transaction. The backend will settle or decline it.
      </p>

      <Card>
        <form onSubmit={handleSubmit((d) => requery(d.transactionId))} className="flex flex-col gap-4">
          <Input
            label="Transaction ID (UUID)"
            name="transactionId"
            placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
            required
            hint="The UUID returned when the deposit showed PENDING status"
            error={errors.transactionId?.message}
            {...register('transactionId', { required: 'Transaction ID is required' })}
          />
          <Button type="submit" loading={loading}>
            Re-query Transaction
          </Button>
        </form>
      </Card>

      {result && (
        <Card className="mt-4">
          <p className="text-sm text-gray-500 dark:text-emerald-400 mb-2">Requery Result</p>
          <div className="flex items-center gap-3">
            <Badge status={result.status} />
            <span className="text-gray-700 dark:text-emerald-200 text-sm">
              {result.status === 'SUCCESSFUL'
                ? 'Funds have been credited to your account.'
                : 'Transaction was declined. No funds were credited.'}
            </span>
          </div>
        </Card>
      )}
    </div>
  )
}
