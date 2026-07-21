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
      <Header accountNumber={accountNumber} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer deep />
    </div>
  )
}
