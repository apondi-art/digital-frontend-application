import client from './client'
import { ENDPOINTS } from '../constants/api'

export const getStatsOverview = () =>
  client.get(ENDPOINTS.adminStatsOverview).then((r) => r.data)

export const getCustomers = (page = 0, size = 20, search = '') =>
  client.get(ENDPOINTS.adminCustomers, { params: { page, size, search } }).then((r) => r.data)

export const getCustomerById = (id) =>
  client.get(ENDPOINTS.adminCustomerById(id)).then((r) => r.data)

export const suspendCustomer = (id, reason) =>
  client.post(ENDPOINTS.adminSuspend(id), { reason }).then((r) => r.data)

export const reactivateCustomer = (id) =>
  client.post(ENDPOINTS.adminReactivate(id)).then((r) => r.data)

export const getPendingKyc = (page = 0, size = 20) =>
  client.get(ENDPOINTS.adminKycPending, { params: { page, size } }).then((r) => r.data)

export const approveKyc = (kycId) =>
  client.post(ENDPOINTS.adminKycApprove(kycId)).then((r) => r.data)

export const rejectKyc = (kycId, reason) =>
  client.post(ENDPOINTS.adminKycReject(kycId), { reason }).then((r) => r.data)

export const getAllTransactions = (page = 0, size = 20, filters = {}) =>
  client.get(ENDPOINTS.adminTransactions, { params: { page, size, ...filters } }).then((r) => r.data)

export const getAuditLogs = (page = 0, size = 20, filters = {}) =>
  client.get(ENDPOINTS.adminAuditLogs, { params: { page, size, ...filters } }).then((r) => r.data)
