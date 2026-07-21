// All backend endpoints in one place — matches Spring Boot controller mappings
export const API_BASE = '/api'

export const ENDPOINTS = {
  createAccount: `${API_BASE}/create-personal-account`,
  transfer:      `${API_BASE}/transaction/transfer`,
  deposit:       `${API_BASE}/transaction/deposit`,
  requery:       (txId) => `${API_BASE}/transaction/requery/${txId}`,
}
