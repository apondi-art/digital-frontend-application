import client from './client'
import { ENDPOINTS } from '../constants/api'

// POST /api/auth/create-Admin
export const createAdmin = (payload) =>
  client.post(ENDPOINTS.createAdmin, payload).then((r) => r.data)

// GET /api/admin/admin-profile
export const getAdminProfile = () =>
  client.get(ENDPOINTS.adminProfile).then((r) => r.data)

// GET /api/admin/fetch-pending-kyc?page=&size=
export const getPendingKyc = (page = 0, size = 20) =>
  client.get(ENDPOINTS.adminKycPending, { params: { page, size } }).then((r) => r.data)

// GET /api/admin/fetch-pending-kyc-by-id/{accountId}
export const getPendingKycById = (accountId) =>
  client.get(ENDPOINTS.adminKycPendingById(accountId)).then((r) => r.data)

// PATCH /api/admin/approvekyc/{kycId}
export const approveKyc = (kycId) =>
  client.patch(ENDPOINTS.adminKycApprove(kycId)).then((r) => r.data)

// PATCH /api/admin/reject-kyc — {kycId, reason}
export const rejectKyc = (kycId, reason) =>
  client.patch(ENDPOINTS.adminKycReject, { kycId, reason }).then((r) => r.data)

// PATCH /api/admin/suspend-account — {accountId, suspensionReason}
export const suspendCustomer = (accountId, suspensionReason) =>
  client.patch(ENDPOINTS.adminSuspend, { accountId, suspensionReason }).then((r) => r.data)

// PATCH /api/admin/reactivate-account/{accountId}
export const reactivateCustomer = (accountId) =>
  client.patch(ENDPOINTS.adminReactivate(accountId)).then((r) => r.data)

// GET /api/admin/customers?page=&size=
// search param is disabled until the backend supports it
export const getCustomers = (page = 0, size = 20, /* search = '' */) =>
  client.get(ENDPOINTS.adminCustomers, { params: { page, size /* , search */ } }).then((r) => r.data)

// GET /api/admin/customer-profile/{accountNumber} — pass account number string, not UUID
export const getCustomerByAccountNumber = (accountNumber) =>
  client.get(ENDPOINTS.adminCustomerById(accountNumber)).then((r) => r.data)

// GET /api/admin/customer-transactions/{accountNumber}
export const getCustomerTransactions = (accountNumber) =>
  client.get(ENDPOINTS.adminCustomerTransactions(accountNumber)).then((r) => r.data)

// GET /api/admin/transaction/{txId}
export const getTransactionById = (txId) =>
  client.get(ENDPOINTS.adminTransactionById(txId)).then((r) => r.data)

// GET /api/admin/stats — {totalAccount, totalActiveAccount, totalDormantAccount, totalSuspendedAccount, totalTier1/2/3Account}
export const getStats = () =>
  client.get(ENDPOINTS.adminStats).then((r) => r.data)

// GET /api/admin/get-all-audit-logs — Page<AuditLog> (pageNumber is 1-indexed)
export const getAuditLogs = (pageNumber = 1, pageSize = 20) =>
  client.get(ENDPOINTS.adminAuditLogs, { params: { pageNumber, pageSize } }).then((r) => r.data)

// GET /api/daily-transactions/daily — {totalCredit, totalDebit, date}
export const getDailyTransactions = () =>
  client.get(ENDPOINTS.dailyTransactions).then((r) => r.data)
