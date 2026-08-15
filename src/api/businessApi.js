import client from './client'
import { ENDPOINTS } from '../constants/api'

// POST /api/business/createaccount
export const createBusinessAccount = (payload) =>
  client.post(ENDPOINTS.createBusiness, payload).then((r) => r.data)
