import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ROUTES } from './constants/routes'
import { ThemeProvider } from './context/ThemeContext'

// Layout
import AppLayout    from './layout/AppLayout'
import PublicLayout from './layout/PublicLayout'
import PrivateRoute from './components/common/PrivateRoute'

// Pages
import LandingPage            from './pages/LandingPage'
import LoginPage              from './pages/LoginPage'
import RegisterPage           from './pages/RegisterPage'
import BusinessRegisterPage   from './pages/BusinessRegisterPage'
import DashboardPage          from './pages/DashboardPage'
import TransferPage           from './pages/TransferPage'
import DepositPage            from './pages/DepositPage'
import RequeryPage            from './pages/RequeryPage'
import KycPage                from './pages/KycPage'
import TransactionHistoryPage from './pages/TransactionHistoryPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        <Routes>
          {/* Landing page — full navbar + footer */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.home} element={<LandingPage />} />
          </Route>

          {/* Auth pages — full-screen split layout, no navbar/footer */}
          <Route path={ROUTES.login}            element={<LoginPage />} />
          <Route path={ROUTES.register}         element={<RegisterPage />} />
          <Route path={ROUTES.businessRegister} element={<BusinessRegisterPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ROUTES.history}   element={<TransactionHistoryPage />} />
              <Route path={ROUTES.transfer}  element={<TransferPage />} />
              <Route path={ROUTES.deposit}   element={<DepositPage />} />
              <Route path={ROUTES.requery}   element={<RequeryPage />} />
              <Route path={ROUTES.kyc}       element={<KycPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
