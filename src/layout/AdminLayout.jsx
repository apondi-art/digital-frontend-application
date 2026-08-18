import { Outlet } from 'react-router-dom'
import Header from './Header'
import AdminSidebar from './AdminSidebar'
import Footer from './Footer'
import { useAccount } from '../hooks/useAccount'

export default function AdminLayout() {
  const { accountNumber } = useAccount()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-emerald-950">
      <Header accountNumber={accountNumber} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main id="main-content" className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer deep />
    </div>
  )
}
