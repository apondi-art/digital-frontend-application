# Backend Gap Analysis & Security Checklist

**Source:** `final/digital-backend-application` (the canonical, complete backend)
**Target:** `digital-frontend-application`

This document lists every backend feature that is not yet fully implemented in the frontend, plus security issues that need to be fixed. Each section includes exactly what to build and where.

---

## Part 1 — Missing Endpoint Implementations

### 1.1  Transaction History

**Status:** NOT IMPLEMENTED

**Backend endpoint:**
```
GET /api/transaction/transaction-history
Authorization: Bearer <access-token>
Role required: CUSTOMER
```

**Response shape** (wrapped in `ResponseWrapper`):
```json
{
  "data": [
    {
      "transactionId":     "uuid",
      "transactionType":   "TRANSFER | DEPOSIT",
      "transactionStatus": "SUCCESSFUL | PENDING | FAILED",
      "sourceAccount":     "2026847291",
      "amount":            5000.00,
      "description":       "School fees payment",
      "createdAt":         "2026-08-15T10:30:00"
    }
  ],
  "message": "...",
  "statusCode": "200 OK"
}
```

**What to build — 4 files:**

#### A. `src/constants/api.js` — add one line
```js
transactionHistory: `${API_BASE}/transaction/transaction-history`,
```

#### B. `src/api/transactionApi.js` — add one export
```js
// GET /api/transaction/transaction-history
export const getTransactionHistory = () =>
  client.get(ENDPOINTS.transactionHistory).then((r) => r.data)
```

#### C. `src/hooks/useTransactionHistory.js` — new file
```js
import { useState, useEffect } from 'react'
import { getTransactionHistory } from '../api/transactionApi'

export function useTransactionHistory() {
  const [history, setHistory]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    getTransactionHistory()
      .then((res) => setHistory(res.data ?? []))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  return { history, loading, error }
}
```

#### D. `src/pages/TransactionHistoryPage.jsx` — new file
```jsx
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'

export default function TransactionHistoryPage() {
  const { history, loading, error } = useTransactionHistory()

  if (loading) return <p className="text-gray-500 dark:text-emerald-400">Loading history...</p>
  if (error)   return <p className="text-red-500">{error}</p>
  if (!history.length) return <p className="text-gray-500 dark:text-emerald-400">No transactions yet.</p>

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Transaction History</h2>
      <div className="flex flex-col gap-3">
        {history.map((tx) => (
          <Card key={tx.transactionId}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-gray-800 dark:text-emerald-100">{tx.description}</span>
                <span className="text-xs text-gray-400 dark:text-emerald-500">
                  {tx.transactionType} · {new Date(tx.createdAt).toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 dark:text-emerald-500">
                  From: {tx.sourceAccount}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-base font-semibold text-gray-900 dark:text-emerald-100">
                  ₦{Number(tx.amount).toLocaleString()}
                </span>
                <Badge status={tx.transactionStatus} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

#### E. Wire into router — `src/App.jsx`
Add inside the protected routes:
```jsx
import TransactionHistoryPage from './pages/TransactionHistoryPage'

// Inside <Route element={<PrivateRoute />}>:
<Route path={ROUTES.history} element={<TransactionHistoryPage />} />
```

#### F. Add route constant — `src/constants/routes.js`
```js
history: '/history',
```

#### G. Add sidebar link — `src/layout/Sidebar.jsx`
```js
{ to: ROUTES.history, label: 'History', icon: '☰' },
```

---

### 1.2  Logout (Call Backend)

**Status:** INCOMPLETE — `clearAccount()` clears client state but never calls `POST /api/auth/logout`, leaving the server-side `LoginSession` and `RefreshSession` alive. Anyone who intercepts the JWT can continue using it until it expires.

**Backend endpoint:**
```
POST /api/auth/logout
Authorization: Bearer <access-token>
Request body: none
```

**Response shape:**
```json
{
  "data": { "message": "Logout successful" },
  "message": "Logout successful",
  "statusCode": "200 OK"
}
```

**What to build — 3 changes:**

#### A. `src/constants/api.js` — add one line
```js
logout: `${API_BASE}/auth/logout`,
```

#### B. `src/api/authApi.js` — add one export
```js
export const logoutUser = () =>
  client.post(ENDPOINTS.logout).then((r) => r.data)
```

#### C. `src/hooks/useLogout.js` — new file
```js
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../api/authApi'
import { clearAccount } from './useAccount'
import { ROUTES } from '../constants/routes'

export function useLogout() {
  const navigate = useNavigate()

  async function logout() {
    try {
      await logoutUser()
    } catch {
      // Fire-and-forget: always clear local state even if the backend call fails
    } finally {
      clearAccount()
      navigate(ROUTES.home)
    }
  }

  return { logout }
}
```

#### D. Add Logout button to sidebar — `src/layout/Sidebar.jsx`
Replace the current sidebar (which has no logout) with a version that includes a button at the bottom:
```jsx
import { useLogout } from '../hooks/useLogout'

// Inside Sidebar():
const { logout } = useLogout()

// At the bottom of the <aside>, after the nav links:
<button
  onClick={logout}
  className="mt-auto flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-emerald-900 transition-colors"
>
  <span className="text-base">⏻</span>
  Logout
</button>
```

---

### 1.3  Business Account Registration

**Status:** NOT IMPLEMENTED

**Backend endpoint:**
```
POST /api/business/createaccount
Authorization: not required (public endpoint per SecurityConfig)
```

**Request body** (`BusinessRegistrationRequest`):
```json
{
  "businessName":    "Acme Ltd",
  "businessAddress": "10 Broad Street, Lagos",
  "cacNumber":       "RC 123456",
  "password":        "secret123",
  "businessEmail":   "acme@example.com"
}
```

**Validation rules:**
- `cacNumber` must match regex: `[RC|BN|IT|LP] [0-9]{6}` (e.g. `RC 123456`)
- `businessEmail` must be valid email format
- All fields are required

**Response shape:**
```json
{
  "data": {
    "accountNumber": "2026847292",
    "businessName":  "Acme Ltd"
  },
  "message": "Business Account Created",
  "statusCode": "201 CREATED"
}
```

**What to build — 5 files:**

#### A. `src/constants/api.js` — add one line
```js
createBusiness: `${API_BASE}/business/createaccount`,
```

#### B. `src/api/businessApi.js` — new file
```js
import client from './client'
import { ENDPOINTS } from '../constants/api'

export const createBusinessAccount = (payload) =>
  client.post(ENDPOINTS.createBusiness, payload).then((r) => r.data)
```

#### C. `src/hooks/useBusinessRegister.js` — new file
```js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createBusinessAccount } from '../api/businessApi'
import { ROUTES } from '../constants/routes'

export function useBusinessRegister() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function register(payload) {
    setLoading(true)
    try {
      const res = await createBusinessAccount(payload)
      toast.success(res.message ?? 'Business account created')
      navigate(ROUTES.login)
      return true
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }

  return { register, loading }
}
```

#### D. `src/pages/BusinessRegisterPage.jsx` — new file
```jsx
import { useForm } from 'react-hook-form'
import { useBusinessRegister } from '../hooks/useBusinessRegister'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function BusinessRegisterPage() {
  const { register: hookRegister, loading } = useBusinessRegister()
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-emerald-950">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Open Business Account</h1>

        <form onSubmit={handleSubmit(hookRegister)} className="flex flex-col gap-4">
          <Input
            label="Business Name"
            {...register('businessName', { required: 'Business name is required' })}
            error={errors.businessName?.message}
          />
          <Input
            label="Business Address"
            {...register('businessAddress', { required: 'Address is required' })}
            error={errors.businessAddress?.message}
          />
          <Input
            label="CAC Number"
            placeholder="RC 123456"
            hint="Format: RC/BN/IT/LP followed by 6 digits (e.g. RC 123456)"
            {...register('cacNumber', {
              required: 'CAC number is required',
              pattern: {
                value: /^(RC|BN|IT|LP) \d{6}$/,
                message: 'Invalid CAC format. Use: RC 123456',
              },
            })}
            error={errors.cacNumber?.message}
          />
          <Input
            label="Business Email"
            type="email"
            {...register('businessEmail', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            })}
            error={errors.businessEmail?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
            error={errors.password?.message}
          />

          <Button type="submit" loading={loading}>Create Business Account</Button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500 dark:text-emerald-400">
          Personal account? <Link to={ROUTES.register} className="text-emerald-600 hover:underline">Register here</Link>
        </p>
      </Card>
    </div>
  )
}
```

#### E. Wire into router & routes
`src/constants/routes.js` — add:
```js
businessRegister: '/register/business',
```

`src/App.jsx` — add under PublicLayout:
```jsx
import BusinessRegisterPage from './pages/BusinessRegisterPage'
<Route path={ROUTES.businessRegister} element={<BusinessRegisterPage />} />
```

`src/pages/RegisterPage.jsx` — add a link at the bottom:
```jsx
<p className="mt-4 text-sm text-center text-gray-500 dark:text-emerald-400">
  Opening for a business?{' '}
  <Link to={ROUTES.businessRegister} className="text-emerald-600 hover:underline">
    Create business account
  </Link>
</p>
```

---

## Part 2 — Security Issues

### 2.1  Token Refresh Not Wired (401 Retry Missing)

**Status:** BROKEN — `authApi.refreshAccessToken()` exists but is never called automatically. When the access token expires, users get a toast error and are stuck. The function in `client.js` that should trigger refresh on 401 is completely absent.

**What to add to `src/api/client.js`:**
```js
import { refreshAccessToken } from './authApi'
import { setAccount, clearAccount, getToken } from '../hooks/useAccount'

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

    // Only retry once; skip if it's the refresh call itself
    if (err.response?.status === 401 && !original._retry && !original.url?.includes('new-access-token')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return client(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const res = await refreshAccessToken()
        const newToken = res.data?.accessToken
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

    const msg = err.response?.data?.message ?? 'Something went wrong'
    toast.error(msg)
    return Promise.reject(err)
  }
)
```

---

### 2.2  Account ID Entered Manually by User (Information Leakage + Poor UX)

**Status:** INSECURE — Both `TransferPage` and `DepositPage` ask users to type their own UUID `accountId` into a form field. The account ID is already stored in session state (`useAccount().accountId`) after login. Exposing raw UUIDs to users is unnecessary and makes phishing easier.

**Fix for `TransferPage` and `DepositPage`:**

Remove the `accountId` input field entirely. Read it from the session inside the hook:

```js
// In useTransfer.js and useDeposit.js, import useAccount
import { useAccount } from './useAccount'   // NOT the exported helpers — the hook
// OR use the module-level getter:
import { getToken } from './useAccount'
```

Actually the account state has `accountId` set after login. Destructure it:

```js
// Inside the hook function:
const { accountId } = useAccount()  // already stored after getUserProfile()
```

Then remove `accountId` from the form payload the user fills and inject it from state:
```js
// In useTransfer.js transfer():
const payload = { ...formData, accountId: accountId }

// In useDeposit.js deposit():
const payload = { ...formData, accountId: accountId }
```

Ensure `accountApi.getUserProfile` stores `accountId` via `setAccount({ accountId: res.data.id })` after login. Check `useLogin.js` — if it doesn't already store `accountId`, add it.

---

### 2.3  KYC Page Does Not Use a Select for Document Type

**Status:** The `KycSubmissionRequest` accepts either `NIN` or `BVN` as `documentType`. The backend enum is exactly those two values. The KYC page should use a `<Select>` component (which already exists in `src/components/common/Select.jsx`) instead of a free-text input.

**Fix in `src/pages/KycPage.jsx`:**
```jsx
import Select from '../components/common/Select'

// Replace whatever document type field exists with:
<Select
  label="Document Type"
  {...register('documentType', { required: 'Document type is required' })}
  error={errors.documentType?.message}
>
  <option value="">Select type</option>
  <option value="NIN">NIN (National Identification Number)</option>
  <option value="BVN">BVN (Bank Verification Number)</option>
</Select>
```

---

### 2.4  Missing Endpoint Constants

**Status:** `ENDPOINTS.logout` and `ENDPOINTS.transactionHistory` and `ENDPOINTS.createBusiness` are not defined in `src/constants/api.js`. This means future developers may call the backend directly with strings, introducing typos and making refactoring brittle.

**Fix — complete `ENDPOINTS` object in `src/constants/api.js`:**
```js
export const ENDPOINTS = {
  // Auth
  login:              `${API_BASE}/auth/login`,
  logout:             `${API_BASE}/auth/logout`,           // ADD THIS
  refreshToken:       `${API_BASE}/auth/new-access-token`,

  // Account
  createAccount:      `${API_BASE}/account/create-personal-account`,
  createAdminAccount: `${API_BASE}/account/create-admin-account`,
  userProfile:        `${API_BASE}/account/user-profile`,

  // Business
  createBusiness:     `${API_BASE}/business/createaccount`, // ADD THIS

  // Transactions
  transfer:           `${API_BASE}/transaction/transfer`,
  deposit:            `${API_BASE}/transaction/deposit`,
  requery:            (txId) => `${API_BASE}/transaction/requery/${txId}`,
  transactionHistory: `${API_BASE}/transaction/transaction-history`, // ADD THIS

  // KYC
  submitKyc:          `${API_BASE}/kyc/submit`,
}
```

---

### 2.5  Dead Route — `/profile` Has No Page

**Status:** `ROUTES.profile = '/profile'` is defined in `src/constants/routes.js` but there is no `ProfilePage`, no route registered in `App.jsx`, and no navigation link to it. Delete the constant until the feature is built or implement the page.

**Option A — Delete the dead route (quick fix):**
Remove `profile: '/profile'` from `src/constants/routes.js`.

**Option B — Implement ProfilePage (recommended):**
Build a read-only profile page that displays the data already stored in session state (`useAccount()`): name, email, phone, gender, DOB, address, account tier, KYC status.

---

### 2.6  Login Form Has No Submission Rate Limiting

**Status:** The `LoginPage` has no client-side protection against rapid repeated submissions. While the backend may have its own protections, a basic front-end debounce or attempt counter is good practice and prevents button spamming.

**Fix in `src/pages/LoginPage.jsx` (minimal):**
```js
const MAX_ATTEMPTS = 5
const LOCKOUT_MS   = 30_000   // 30 seconds

const [attempts, setAttempts] = useState(0)
const [lockedUntil, setLockedUntil] = useState(null)

function isLocked() {
  return lockedUntil && Date.now() < lockedUntil
}

async function onSubmit(data) {
  if (isLocked()) return
  if (attempts >= MAX_ATTEMPTS) {
    setLockedUntil(Date.now() + LOCKOUT_MS)
    setAttempts(0)
    toast.error('Too many attempts. Wait 30 seconds.')
    return
  }
  const ok = await login(data)
  if (!ok) setAttempts((n) => n + 1)
}
```

---

### 2.7  Registration Form Sends `nin` / `bvn` That Backend Doesn't Accept

**Status:** The `RegisterPage` sends `nin` and `bvn` in the registration payload, but `CustomerRegistrationRequest` (the backend DTO) does **not** include those fields. They are submitted separately via KYC (`POST /api/kyc/submit`). These extra fields are silently ignored by the backend but are confusing and could be mistaken for working functionality.

**Fix:** Remove the `nin` and `bvn` input fields from `RegisterPage.jsx`. Keep a note on the page directing users to the KYC page after registration to submit those documents.

---

## Part 3 — Good Practices Checklist

| # | Practice | Status | Notes |
|---|---|---|---|
| 1 | All API calls go through `client.js` (one Axios instance) | ✅ Done | |
| 2 | Bearer token auto-attached via request interceptor | ✅ Done | |
| 3 | Error toasts shown automatically via response interceptor | ✅ Done | |
| 4 | Token stored in `sessionStorage` (not `localStorage`) | ✅ Done | Cleared when tab closes |
| 5 | CVC field uses `type="password"` | ✅ Done | |
| 6 | HTTPS check in production (console.error) | ✅ Done | Consider blocking the app instead |
| 7 | Routes protected via `PrivateRoute` guard | ✅ Done | |
| 8 | `react-hook-form` for validation | ✅ Done | |
| 9 | Dark mode via `ThemeContext` | ✅ Done | |
| 10 | Backend logout called on sign-out | ❌ Missing | See section 1.2 |
| 11 | Automatic 401 → token refresh → retry | ❌ Missing | See section 2.1 |
| 12 | Account ID from session (not user input) | ❌ Missing | See section 2.2 |
| 13 | KYC document type from `<Select>` | ❌ Missing | See section 2.3 |
| 14 | All endpoint strings in `ENDPOINTS` constant | ❌ Missing | See section 2.4 |
| 15 | No dead route constants | ❌ Missing | See section 2.5 |
| 16 | Login submission rate limiting | ❌ Missing | See section 2.6 |
| 17 | Registration form matches backend DTO exactly | ❌ Missing | See section 2.7 |
| 18 | Transaction history page exists | ❌ Missing | See section 1.1 |
| 19 | Business account registration page exists | ❌ Missing | See section 1.3 |

---

## Implementation Priority Order

1. **Security-critical (do first):**
   - 2.1 — Wire 401 token refresh in `client.js`
   - 1.2 — Logout calls backend (`POST /api/auth/logout`)
   - 2.2 — Remove account ID from user-facing forms

2. **Feature parity (do second):**
   - 1.1 — Transaction history page + API + hook + sidebar link
   - 1.3 — Business account registration page + API + hook

3. **Quality / correctness (do third):**
   - 2.3 — KYC `<Select>` for document type
   - 2.4 — Add missing `ENDPOINTS` constants
   - 2.7 — Remove `nin`/`bvn` from registration form
   - 2.5 — Fix dead `/profile` route
   - 2.6 — Login rate limiting
