import client from './client'
import { ENDPOINTS } from '../constants/api'

// POST /api/auth/login — {email, password} → {accessToken, refreshToken, role}
export const loginUser = (payload) =>
  client.post(ENDPOINTS.login, payload).then((r) => r.data)

// POST /api/auth/login-admin — {email, password} + X-ADMIN_ID header → {accessToken, refreshToken, role}
export const loginAdmin = (payload, adminId) =>
  client.post(ENDPOINTS.loginAdmin, payload, { headers: { 'X-ADMIN_ID': adminId } }).then((r) => r.data)

// POST /api/auth/logout
export const logoutUser = () =>
  client.post(ENDPOINTS.logout).then((r) => r.data)

// POST /api/auth/new-access-token
export const refreshAccessToken = () =>
  client.post(ENDPOINTS.refreshToken).then((r) => r.data)

// PATCH /api/auth/forget-password/customer — {email, newPassword, confirmPassword}
export const forgotPasswordCustomer = (payload) =>
  client.patch(ENDPOINTS.forgotPasswordCustomer, payload).then((r) => r.data)

// PATCH /api/auth/forget-password/admin/{adminId} — {email, newPassword, confirmPassword}
export const forgotPasswordAdmin = (adminId, payload) =>
  client.patch(ENDPOINTS.forgotPasswordAdmin(adminId), payload).then((r) => r.data)

// POST /api/auth/verify-otp — {customerId, otp}
export const verifyOtp = (accountNumber, otp) =>
  client.post(ENDPOINTS.verifyOtp, { accountNumber, otp }).then((r) => r.data)

export const resendOtp = (accountNumber) =>
  client.post(ENDPOINTS.resendOtp, { accountNumber }).then((r) => r.data)


// PATCH /api/account/password-reset — {newPassword, confirmPassword} (authenticated)
export const resetPassword = (newPassword, confirmPassword) =>
  client.patch(ENDPOINTS.passwordReset, { newPassword, confirmPassword }).then((r) => r.data)
