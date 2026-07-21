// Reusable button — variant="primary" | "outline" | "ghost"
// Defaults to type="button" to prevent accidental form submission.
// Use type="submit" explicitly on form submit buttons.
const variants = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-400',
  outline: 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900',
  ghost:   'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900',
}

export default function Button({ children, variant = 'primary', loading, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`
        inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  )
}
