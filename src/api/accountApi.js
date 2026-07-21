import client from './client'
import { ENDPOINTS } from '../constants/api'

// POST /api/create-personal-account
// Returns: { data: { accountNumber }, message, statusCode }
export const createPersonalAccount = (payload) =>
  client.post(ENDPOINTS.createAccount, payload).then((r) => r.data)
