import client from './client'
import { ENDPOINTS } from '../constants/api'

// POST /api/account/create-personal-account
// Returns: { data: { accountNumber }, message, statusCode }
export const createPersonalAccount = (payload) =>
  client.post(ENDPOINTS.createAccount, payload).then((r) => r.data)

// GET /api/account/user-profile  (requires JWT)
// Returns: { data: CustomerDto, message, statusCode }
export const getUserProfile = () =>
  client.get(ENDPOINTS.userProfile).then((r) => r.data)
