// All backend endpoints — matches Spring Boot controller mappings exactly
export const API_BASE = '/api'

export const ENDPOINTS = {
  // Auth — /api/auth
  login:                  `${API_BASE}/auth/login`,
  loginAdmin:             `${API_BASE}/auth/login-admin`,
  logout:                 `${API_BASE}/auth/logout`,
  refreshToken:           `${API_BASE}/auth/new-access-token`,
  createAdmin:            `${API_BASE}/auth/create-Admin`,
  verifyOtp:              `${API_BASE}/auth/verify-otp`,
  resendOtp:              `${API_BASE}/auth/resend-otp`,
  forgotPasswordCustomer: `${API_BASE}/auth/forget-password/customer`,
  forgotPasswordAdmin:    (adminId) => `${API_BASE}/auth/forget-password/admin/${adminId}`,

  // Account — /api/account
  createAccount: `${API_BASE}/account/create-personal-account`,
  userProfile:   `${API_BASE}/account/user-profile`,
  passwordReset: `${API_BASE}/account/password-reset`,

  // Business — /api/business
  createBusiness: `${API_BASE}/business/createaccount`,

  // Transactions — /api/transaction (CUSTOMER role required)
  transfer:           `${API_BASE}/transaction/transfer`,
  deposit:            `${API_BASE}/transaction/deposit`,
  requery:            (txId) => `${API_BASE}/transaction/requery/${txId}`,
  transactionHistory: `${API_BASE}/transaction/transaction-history`,

  // KYC — /api/kyc (CUSTOMER role required)
  submitKyc: `${API_BASE}/kyc/submit`,

  // Admin — /api/admin (ADMIN role required)
  adminProfile:        `${API_BASE}/admin/admin-profile`,
  adminKycPending:     `${API_BASE}/admin/fetch-pending-kyc`,
  adminKycPendingById: (accountNumber) => `${API_BASE}/admin/fetch-pending-kyc-by-account-number/{account-number}`,
  adminKycApprove:     (kycId) => `${API_BASE}/admin/approvekyc/${kycId}`,
  adminKycReject:      `${API_BASE}/admin/reject-kyc`,
  adminSuspend:        `${API_BASE}/admin/suspend-account`,
  adminReactivate:     (accountNumber) => `${API_BASE}/admin/reactivate-account/${accountNumber}`,
  adminCustomers:      `${API_BASE}/admin/customers`,
  adminCustomerById:          (id) => `${API_BASE}/admin/customer-profile/${id}`,
  adminCustomerTransactions:  (accountNumber) => `${API_BASE}/admin/customer-transactions/${accountNumber}`,
  adminTransactionById:       (txId) => `${API_BASE}/admin/transaction/${txId}`,
  adminStats:          `${API_BASE}/admin/stats`,
  adminAuditLogs:      `${API_BASE}/admin/get-all-audit-logs`,
  adminAllTransactions: `${API_BASE}/admin/get-all-transactions`,

  // Daily Transactions — /api/daily-transactions (ADMIN role required)
  dailyTransactions: `${API_BASE}/daily-transactions/daily`,
}
