import axios from 'axios'
import toast from 'react-hot-toast'
import { getToken, setAccount, clearAccount } from '../hooks/useAccount'

// Warn loudly if card/account data would be sent over HTTP in production
if (import.meta.env.PROD && window.location.protocol !== 'https:') {
  console.error(
    '[DigitalBank] Running over HTTP in production. ' +
    'Card and account data must only be transmitted over HTTPS.'
  )
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // refresh-token cookie sent automatically
})

// ── Request interceptor — attach access token ─────────────────────────────────
client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor — handle errors + 401 refresh-retry ─────────────────

// Queue of requests waiting while a token refresh is in flight
let isRefreshing = false
let queue = []

function processQueue(error, token = null) {
  queue.forEach((cb) => (error ? cb.reject(error) : cb.resolve(token)))
  queue = []
}

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    const status   = err.response?.status

    // 401 → try refreshing the access token once
    if (
      status === 401 &&
      !original._retry &&
      !original.url?.includes('new-access-token') // don't retry the refresh call itself
    ) {
      if (isRefreshing) {
        // Another refresh is already in flight — queue this request
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return client(original)
        })
      }

      original._retry = true
      isRefreshing    = true

      try {
        // The refresh token travels automatically via the HttpOnly cookie
        const res      = await client.post('/api/auth/new-access-token')
        const newToken = res.data?.data?.accessToken
        if (!newToken) throw new Error('No access token in refresh response')

        setAccount({ token: newToken })
        processQueue(null, newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return client(original)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        clearAccount()
        window.location.href = '/'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    // All other errors — show a descriptive toast
    const serverMsg = err.response?.data?.message
    let msg = serverMsg

    if (!msg) {
      if (!err.response) {
        msg = 'Cannot reach the server. Check your internet connection.'
      } else {
        switch (status) {
          case 400: msg = 'Invalid request. Please check your input and try again.'; break
          case 403: msg = 'You do not have permission to perform this action.'; break
          case 404: msg = 'The requested resource was not found.'; break
          case 409: msg = 'A conflict occurred — this record may already exist.'; break
          case 422: msg = 'Some fields are invalid. Please review your input.'; break
          case 500:
          case 502:
          case 503: msg = 'A server error occurred. Please try again in a moment.'; break
          default:  msg = 'Something went wrong. Please try again.'
        }
      }
    }

    toast.error(msg)
    return Promise.reject(err)
  }
)

export default client
