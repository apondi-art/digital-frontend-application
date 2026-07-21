import client from './client'
import { ENDPOINTS } from '../constants/api'

// POST /api/transaction/transfer
export const transferFunds = (payload) =>
  client.post(ENDPOINTS.transfer, payload).then((r) => r.data)

// POST /api/transaction/deposit
export const depositFunds = (payload) =>
  client.post(ENDPOINTS.deposit, payload).then((r) => r.data)

// PUT /api/transaction/requery/{id}
export const requeryTransaction = (txId) =>
  client.put(ENDPOINTS.requery(txId)).then((r) => r.data)
