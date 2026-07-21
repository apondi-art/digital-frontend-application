import { statusMeta } from '../../utils/format'

// Visual status pill for TransactionStatus (SUCCESSFUL | PENDING | DECLINED)
export default function Badge({ status }) {
  const { label, colour } = statusMeta(status)
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold ${colour}`}>
      {label}
    </span>
  )
}
