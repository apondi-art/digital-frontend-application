import { forwardRef } from 'react'

// Controlled input — forwarded ref for react-hook-form compatibility
// id is derived from props.name so <label htmlFor> always links correctly
const Input = forwardRef(function Input({ label, error, hint, className = '', ...props }, ref) {
  const id = props.id ?? props.name

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-emerald-300">
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`
          w-full px-4 py-2.5 border text-sm
          bg-white text-gray-900 placeholder-gray-400 border-gray-300
          dark:bg-emerald-800 dark:text-emerald-50 dark:placeholder-emerald-600 dark:border-emerald-700
          outline-none transition-colors
          focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900
          ${error ? 'border-red-400 dark:border-red-400' : ''}
          ${className}
        `}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {error && <p id={`${id}-error`} role="alert" className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-gray-400 dark:text-emerald-600">{hint}</p>}
    </div>
  )
})

export default Input
