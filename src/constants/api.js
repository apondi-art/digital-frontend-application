// All backend endpoints in one place — matches Spring Boot controller mappings
export const API_BASE = '/api'

export const ENDPOINTS = {
  // Auth
  login:        `${API_BASE}/auth/login`,
  refreshToken: `${API_BASE}/auth/new-access-token`,

  // Account
  createAccount:      `${API_BASE}/account/create-personal-account`,
  createAdminAccount: `${API_BASE}/account/create-admin-account`,
  userProfile:        `${API_BASE}/account/user-profile`,

  // Transactions
  transfer: `${API_BASE}/transaction/transfer`,
  deposit:  `${API_BASE}/transaction/deposit`,
  requery:  (txId) => `${API_BASE}/transaction/requery/${txId}`,

  // KYC
  submitKyc: `${API_BASE}/kyc/submit`,
}
