import { forwardRef } from 'react'

// Styled select — id derived from props.name so <label htmlFor> always links correctly
const Select = forwardRef(function Select({ label, error, options, className = '', ...props }, ref) {
  const id = props.id ?? props.name

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-emerald-300">
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`
          w-full px-4 py-2.5 border text-sm
          bg-white text-gray-900 border-gray-300
          dark:bg-emerald-800 dark:text-emerald-50 dark:border-emerald-700
          outline-none transition-colors cursor-pointer
          focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900
          ${error ? 'border-red-400 dark:border-red-400' : ''}
          ${className}
        `}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p id={`${id}-error`} role="alert" className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
})

export default Select
