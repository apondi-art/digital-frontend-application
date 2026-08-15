import client from './client'
import { ENDPOINTS } from '../constants/api'

export const loginUser = (payload) =>
  client.post(ENDPOINTS.login, payload).then((r) => r.data)

export const logoutUser = () =>
  client.post(ENDPOINTS.logout).then((r) => r.data)

export const refreshAccessToken = () =>
  client.post(ENDPOINTS.refreshToken).then((r) => r.data)
