import client from './client'
import { ENDPOINTS } from '../constants/api'

// POST /api/account/create-personal-account
export const createPersonalAccount = (payload) =>
  client.post(ENDPOINTS.createAccount, payload).then((r) => r.data)

// GET /api/account/user-profile (Bearer Token)
export const getUserProfile = () =>
  client.get(ENDPOINTS.userProfile).then((r) => r.data)
