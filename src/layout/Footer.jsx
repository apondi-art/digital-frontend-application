// Footer — shared across public (deep=false) and authenticated (deep=true) layouts.
// The `deep` prop switches the dark background from emerald-900 to emerald-950
// so it matches the authenticated shell's deeper dark background.
export default function Footer({ deep = false }) {
  const year = new Date().getFullYear()

  return (
    <footer className={`bg-white border-t border-gray-200 ${deep ? 'dark:bg-emerald-950' : 'dark:bg-emerald-900'} dark:border-emerald-800`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center text-white dark:text-emerald-900 font-bold text-xs">
              DB
            </div>
            <span className="text-gray-900 dark:text-white font-semibold text-sm">DigitalBank</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-sm">
            {['Privacy', 'Terms', 'Support'].map(l => (
              <button
                key={l}
                type="button"
                className="text-gray-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-white transition-colors"
              >
                {l}
              </button>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-emerald-400">
            &copy; {year} DigitalBank. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
