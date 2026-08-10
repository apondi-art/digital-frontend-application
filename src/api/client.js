import axios from 'axios'
import toast from 'react-hot-toast'
import { getToken } from '../hooks/useAccount'

// Warn loudly if card/account data would be sent over HTTP in production
if (import.meta.env.PROD && window.location.protocol !== 'https:') {
  console.error(
    '[DigitalBank] Running over HTTP in production. ' +
    'Card and account data must only be transmitted over HTTPS.'
  )
}

// Axios instance — one place to set headers, base URL, timeouts
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // needed so the refresh-token cookie is sent automatically
})

// Request interceptor: attach JWT if the user is logged in
client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: unwrap the backend's ResponseWrapper<T>
// Backend always sends { data, message, statusCode }
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message ?? 'Something went wrong'
    toast.error(msg)
    return Promise.reject(err)
  }
)

export default client
