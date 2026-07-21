import ThemeToggle from '../components/common/ThemeToggle'

// Top navigation bar — brand identity + account number display
export default function Header({ accountNumber }) {
  return (
    <header className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        {/* Brand mark */}
        <div className="w-8 h-8 bg-emerald-400 flex items-center justify-center font-bold text-emerald-900 text-sm">
          DB
        </div>
        <span className="font-semibold text-lg tracking-tight">DigitalBank</span>
      </div>

      <div className="flex items-center gap-3">
        {accountNumber && (
          <div className="text-right">
            <p className="text-emerald-300 text-xs">Account Number</p>
            <p className="font-mono font-semibold text-sm">{accountNumber}</p>
          </div>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
