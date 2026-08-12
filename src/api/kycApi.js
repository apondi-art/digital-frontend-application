import client from './client'
import { ENDPOINTS } from '../constants/api'

export const submitKycDocument = (payload) =>
  client.post(ENDPOINTS.submitKyc, payload).then((r) => r.data)
