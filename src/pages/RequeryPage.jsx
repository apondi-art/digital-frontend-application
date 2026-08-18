import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { useRequery } from '../hooks/useRequery'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

// Maps to PUT /api/transaction/requery/{transaction-id}
// Resolves PENDING transactions to SUCCESSFUL or DECLINED (random on backend)
export default function RequeryPage() {
  const { requery, loading, result } = useRequery()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const location = useLocation()

  // Pre-fill transaction ID if navigated here from TransactionHistoryPage
  useEffect(() => {
    if (location.state?.transactionId) {
      setValue('transactionId', location.state.transactionId)
    }
  }, [location.state, setValue])

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
          {result.status === 'SUCCESSFUL' ? (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-300 text-lg shrink-0">✓</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Deposit settled successfully</p>
                <p className="text-gray-500 dark:text-emerald-300 text-sm mt-0.5">
                  The funds have been credited to your account. You can confirm the updated balance on your Dashboard.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 text-lg shrink-0">✕</div>
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400 text-sm">Deposit declined</p>
                <p className="text-gray-500 dark:text-emerald-300 text-sm mt-0.5">
                  This transaction could not be completed. No funds were added to your account. If your card was charged, please contact your bank or reach out to support.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
