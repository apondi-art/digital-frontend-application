import client from './client'
import { ENDPOINTS } from '../constants/api'

// POST /api/auth/login
// Body: { email, password }
// Returns: { data: { accessToken, refreshToken, role }, message, statusCode }
export const loginUser = (payload) =>
  client.post(ENDPOINTS.login, payload).then((r) => r.data)

// POST /api/auth/new-access-token
// Uses the refresh-token cookie set at login automatically (withCredentials: true)
// Returns: { data: { accessToken, refreshToken, role }, message, statusCode }
export const refreshAccessToken = () =>
  client.post(ENDPOINTS.refreshToken).then((r) => r.data)
