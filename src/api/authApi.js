import client from './client'
import { ENDPOINTS } from '../constants/api'

export const loginUser = (payload) =>
  client.post(ENDPOINTS.login, payload).then((r) => r.data)

export const logoutUser = () =>
  client.post(ENDPOINTS.logout).then((r) => r.data)

export const refreshAccessToken = () =>
  client.post(ENDPOINTS.refreshToken).then((r) => r.data)

export const forgotPassword = (email) =>
  client.post(ENDPOINTS.forgotPassword, { email }).then((r) => r.data)

export const resetPassword = (token, newPassword) =>
  client.post(ENDPOINTS.resetPassword, { token, newPassword }).then((r) => r.data)

export const verifyOtp = (otp, email) =>
  client.post(ENDPOINTS.verifyOtp, { otp, email }).then((r) => r.data)

export const resendOtp = (email) =>
  client.post(ENDPOINTS.resendOtp, { email }).then((r) => r.data)
