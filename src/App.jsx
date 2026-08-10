import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ROUTES } from './constants/routes'
import { ThemeProvider } from './context/ThemeContext'

// Layout
import AppLayout from './layout/AppLayout'
import PublicLayout from './layout/PublicLayout'
import PrivateRoute from './components/common/PrivateRoute'

// Pages
import LandingPage   from './pages/LandingPage'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TransferPage  from './pages/TransferPage'
import DepositPage   from './pages/DepositPage'
import RequeryPage   from './pages/RequeryPage'
import KycPage       from './pages/KycPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Global toast notifications (success, error, info) */}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        <Routes>
          {/* Public routes — wrapped in Navbar + Footer */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.home}     element={<LandingPage />} />
            <Route path={ROUTES.login}    element={<LoginPage />} />
            <Route path={ROUTES.register} element={<RegisterPage />} />
          </Route>

          {/* Protected routes — redirect to / if not authenticated */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
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
