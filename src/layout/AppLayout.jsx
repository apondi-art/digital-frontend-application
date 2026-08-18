import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useAccount } from '../hooks/useAccount'

// Shell that wraps all authenticated pages
export default function AppLayout() {
  const { accountNumber } = useAccount()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-emerald-950">
      {/* Skip-to-main-content link for keyboard / screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>
      <Header accountNumber={accountNumber} />
      <div className="flex flex-1">
        <Sidebar />
        <main id="main-content" className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer deep />
    </div>
  )
}
