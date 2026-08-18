// All backend endpoints in one place — matches Spring Boot controller mappings
export const API_BASE = '/api'

export const ENDPOINTS = {
  // Auth
  login:          `${API_BASE}/auth/login`,
  logout:         `${API_BASE}/auth/logout`,
  refreshToken:   `${API_BASE}/auth/new-access-token`,
  forgotPassword: `${API_BASE}/auth/forgot-password`,
  resetPassword:  `${API_BASE}/auth/reset-password`,
  verifyOtp:      `${API_BASE}/auth/verify-otp`,
  resendOtp:      `${API_BASE}/auth/resend-otp`,

  // Account
  createAccount:      `${API_BASE}/account/create-personal-account`,
  createAdminAccount: `${API_BASE}/account/create-admin-account`,
  userProfile:        `${API_BASE}/account/user-profile`,
  accountBalance:     `${API_BASE}/account/balance`,

  // Business
  createBusiness: `${API_BASE}/business/createaccount`,

  // Transactions
  transfer:           `${API_BASE}/transaction/transfer`,
  deposit:            `${API_BASE}/transaction/deposit`,
  requery:            (txId) => `${API_BASE}/transaction/requery/${txId}`,
  transactionHistory: `${API_BASE}/transaction/transaction-history`,

  // KYC
  submitKyc: `${API_BASE}/kyc/submit`,
  kycStatus:  `${API_BASE}/kyc/status`,

  // Admin
  adminStatsOverview:  `${API_BASE}/admin/stats/overview`,
  adminCustomers:      `${API_BASE}/admin/customers`,
  adminCustomerById:   (id) => `${API_BASE}/admin/customers/${id}`,
  adminSuspend:        (id) => `${API_BASE}/admin/customers/${id}/suspend`,
  adminReactivate:     (id) => `${API_BASE}/admin/customers/${id}/reactivate`,
  adminKycPending:     `${API_BASE}/admin/kyc/pending`,
  adminKycApprove:     (id) => `${API_BASE}/admin/kyc/${id}/approve`,
  adminKycReject:      (id) => `${API_BASE}/admin/kyc/${id}/reject`,
  adminTransactions:   `${API_BASE}/admin/transactions`,
  adminAuditLogs:      `${API_BASE}/admin/audit-logs`,
}
