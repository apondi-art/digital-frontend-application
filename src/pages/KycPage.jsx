import { useForm } from 'react-hook-form'
import { useKyc } from '../hooks/useKyc'
import Select from '../components/common/Select'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

// Maps to POST /api/kyc/submit
// NIN → upgrades account from Tier 1 to Tier 2
// BVN → upgrades account from Tier 2 to Tier 3
export default function KycPage() {
  const { submitKyc, loading } = useKyc()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const docType = watch('documentType')

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">KYC Verification</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
        Submit your NIN to upgrade to Tier 2, or your BVN to reach Tier 3 and unlock higher transfer limits.
      </p>

      {/* Tier info */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { tier: 'Tier 1', limit: '₦50,000 / day', doc: 'Default', colour: 'border-gray-200 dark:border-gray-700' },
          { tier: 'Tier 2', limit: '₦200,000 / day', doc: 'NIN required', colour: 'border-emerald-400' },
          { tier: 'Tier 3', limit: '₦1,000,000 / day', doc: 'BVN required', colour: 'border-blue-400' },
        ].map(({ tier, limit, doc, colour }) => (
          <div key={tier} className={`border ${colour} p-3 text-center`}>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{tier}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{limit}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{doc}</p>
          </div>
        ))}
      </div>

      <Card>
        <form onSubmit={handleSubmit(submitKyc)} className="flex flex-col gap-4">
          <Select
            label="Document Type"
            name="documentType"
            required
            error={errors.documentType?.message}
            options={[
              { value: 'NIN', label: 'NIN — National Identity Number (Tier 1 → 2)' },
              { value: 'BVN', label: 'BVN — Bank Verification Number (Tier 2 → 3)' },
            ]}
            {...register('documentType', { required: 'Please select a document type' })}
          />

          <Input
            label={docType === 'BVN' ? 'Bank Verification Number (BVN)' : 'National Identity Number (NIN)'}
            name="submittedValue"
            placeholder="12345678901"
            required
            hint="11-digit number"
            error={errors.submittedValue?.message}
            {...register('submittedValue', {
              required: 'Document number is required',
              pattern: { value: /^\d{11}$/, message: 'Must be exactly 11 digits' },
            })}
          />

          <Button type="submit" loading={loading} className="w-full py-3 mt-2">
            Submit for Verification
          </Button>
        </form>
      </Card>
    </div>
  )
}
