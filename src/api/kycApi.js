import client from './client'
import { ENDPOINTS } from '../constants/api'

// POST /api/kyc/submit  (requires JWT, CUSTOMER role)
// Body: { documentType: 'NIN' | 'BVN', submittedValue: string }
// Returns: { data: { message }, message, statusCode }
export const submitKycDocument = (payload) =>
  client.post(ENDPOINTS.submitKyc, payload).then((r) => r.data)
