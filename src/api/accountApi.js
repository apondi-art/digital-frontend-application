import client from './client'
import { ENDPOINTS } from '../constants/api'

export const createPersonalAccount = (payload) =>
  client.post(ENDPOINTS.createAccount, payload).then((r) => r.data)

export const createAdminAccount = (payload) =>
  client.post(ENDPOINTS.createAdminAccount, payload).then((r) => r.data)

export const getUserProfile = () =>
  client.get(ENDPOINTS.userProfile).then((r) => r.data)

export const getAccountBalance = () =>
  client.get(ENDPOINTS.accountBalance).then((r) => r.data)
