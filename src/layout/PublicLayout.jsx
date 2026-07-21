import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

// Shell for public pages (Landing, Register)
export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-emerald-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
