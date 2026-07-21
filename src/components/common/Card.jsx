// Surface container — used on every page
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-emerald-900 shadow-sm border border-gray-100 dark:border-emerald-800 p-6 ${className}`}>
      {children}
    </div>
  )
}
