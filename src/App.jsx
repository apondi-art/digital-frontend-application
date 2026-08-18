import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ROUTES } from './constants/routes'
import { ThemeProvider } from './context/ThemeContext'

// Layout
import AppLayout    from './layout/AppLayout'
import AdminLayout  from './layout/AdminLayout'
import PublicLayout from './layout/PublicLayout'
import PrivateRoute from './components/common/PrivateRoute'
import AdminRoute   from './components/common/AdminRoute'

// Route-level code splitting — each page is a separate JS chunk
const LandingPage            = lazy(() => import('./pages/LandingPage'))
const LoginPage              = lazy(() => import('./pages/LoginPage'))
const RegisterPage           = lazy(() => import('./pages/RegisterPage'))
const BusinessRegisterPage   = lazy(() => import('./pages/BusinessRegisterPage'))
const ForgotPasswordPage     = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage      = lazy(() => import('./pages/ResetPasswordPage'))
const VerifyOtpPage          = lazy(() => import('./pages/VerifyOtpPage'))
const NotFoundPage           = lazy(() => import('./pages/NotFoundPage'))

// Customer pages
const DashboardPage          = lazy(() => import('./pages/DashboardPage'))
const ProfilePage            = lazy(() => import('./pages/ProfilePage'))
const TransferPage           = lazy(() => import('./pages/TransferPage'))
const DepositPage            = lazy(() => import('./pages/DepositPage'))
const RequeryPage            = lazy(() => import('./pages/RequeryPage'))
const KycPage                = lazy(() => import('./pages/KycPage'))
const TransactionHistoryPage = lazy(() => import('./pages/TransactionHistoryPage'))
const BusinessDashboardPage  = lazy(() => import('./pages/BusinessDashboardPage'))

// Admin pages
const AdminRegisterPage       = lazy(() => import('./pages/admin/AdminRegisterPage'))
const AdminDashboardPage      = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminCustomersPage      = lazy(() => import('./pages/admin/AdminCustomersPage'))
const AdminCustomerDetailPage = lazy(() => import('./pages/admin/AdminCustomerDetailPage'))
const AdminKycQueuePage       = lazy(() => import('./pages/admin/AdminKycQueuePage'))
const AdminTransactionsPage   = lazy(() => import('./pages/admin/AdminTransactionsPage'))
const AdminAuditLogPage       = lazy(() => import('./pages/admin/AdminAuditLogPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-emerald-950">
      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Landing page — full navbar + footer */}
            <Route element={<PublicLayout />}>
              <Route path={ROUTES.home} element={<LandingPage />} />
            </Route>

            {/* Auth pages — full-screen split layout, no navbar/footer */}
            <Route path={ROUTES.login}            element={<LoginPage />} />
            <Route path={ROUTES.register}         element={<RegisterPage />} />
            <Route path={ROUTES.businessRegister} element={<BusinessRegisterPage />} />
            <Route path={ROUTES.adminRegister}    element={<AdminRegisterPage />} />
            <Route path={ROUTES.forgotPassword}   element={<ForgotPasswordPage />} />
            <Route path={ROUTES.resetPassword}    element={<ResetPasswordPage />} />
            <Route path={ROUTES.verifyOtp}        element={<VerifyOtpPage />} />

            {/* Protected customer routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
                <Route path={ROUTES.dashboard}        element={<DashboardPage />} />
                <Route path={ROUTES.profile}          element={<ProfilePage />} />
                <Route path={ROUTES.history}          element={<TransactionHistoryPage />} />
                <Route path={ROUTES.transfer}         element={<TransferPage />} />
                <Route path={ROUTES.deposit}          element={<DepositPage />} />
                <Route path={ROUTES.requery}          element={<RequeryPage />} />
                <Route path={ROUTES.kyc}              element={<KycPage />} />
                <Route path={ROUTES.businessDashboard} element={<BusinessDashboardPage />} />
              </Route>
            </Route>

            {/* Protected admin routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.adminDashboard}    element={<AdminDashboardPage />} />
                <Route path={ROUTES.adminCustomers}    element={<AdminCustomersPage />} />
                <Route path={`${ROUTES.adminCustomers}/:id`} element={<AdminCustomerDetailPage />} />
                <Route path={ROUTES.adminKycQueue}     element={<AdminKycQueuePage />} />
                <Route path={ROUTES.adminTransactions} element={<AdminTransactionsPage />} />
                <Route path={ROUTES.adminAuditLogs}    element={<AdminAuditLogPage />} />
              </Route>
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}
