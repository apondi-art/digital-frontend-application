# Frontend Implementation Notes

## What Was Added

This document covers the features added to wire the frontend up to the full backend API surface.

---

## 1. Bug Fix — Account Registration URL

**File:** `src/constants/api.js`

The `createAccount` endpoint was mapped to `/api/create-personal-account` but the backend serves it at `/api/account/create-personal-account`. The `/account/` prefix was missing, causing all registration requests to 404.

---

## 2. Authentication (Login + Token Refresh)

### Backend endpoints
| Method | Path |
|--------|------|
| POST | `/api/auth/login` |
| POST | `/api/auth/new-access-token` |

### Files added / changed

**`src/api/authApi.js`** — two thin API functions:
- `loginUser(payload)` — sends `{ email, password }`, returns `{ accessToken, refreshToken, role }`
- `refreshAccessToken()` — uses the refresh-token cookie (set automatically by the backend at login)

**`src/hooks/useLogin.js`** — login flow hook:
1. Calls `loginUser()` to get the JWT
2. Immediately persists the token so the next request is authenticated
3. Calls `getUserProfile()` to load the user's name and details
4. Stores everything via `setAccount()` and navigates to `/dashboard`

**`src/pages/LoginPage.jsx`** — form at `/login` with email + password fields. Linked from the Navbar ("Sign In") and from the Register page.

**`src/layout/Navbar.jsx`** — added "Sign In" link between "Home" and "Open Account".

### Token lifecycle

The JWT access token is stored in `sessionStorage` (via `useAccount`). The refresh token is an HTTP-only cookie set by the backend — it travels automatically on every request because `client.js` sets `withCredentials: true`.

When the access token expires, call `refreshAccessToken()` to get a new one and update the store with `setAccount({ token: newToken })`.

---

## 3. JWT Injection on All Requests

**File:** `src/api/client.js`

A request interceptor reads the current token via `getToken()` (a plain function exported from `useAccount.js`) and attaches `Authorization: Bearer <token>` to every outgoing request.

```
client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

`withCredentials: true` was also added to the axios instance so the refresh-token cookie is sent on cross-origin requests.

---

## 4. Auth State — Extended Account Store

**File:** `src/hooks/useAccount.js`

The session store was extended from `{ accountNumber, accountId }` to include:

| Field | Set by | Used in |
|-------|--------|---------|
| `token` | login | client.js interceptor, PrivateRoute |
| `role` | login | (future: role-based UI) |
| `firstName` | login (profile fetch) | DashboardPage greeting |
| `lastName` | login (profile fetch) | DashboardPage greeting |
| `email` | login (profile fetch) | — |
| `phoneNumber` | login (profile fetch) | — |
| `gender` | login (profile fetch) | — |
| `dateOfBirth` | login (profile fetch) | — |
| `address` | login (profile fetch) | — |
| `nin` | login (profile fetch) | — |
| `bvn` | login (profile fetch) | — |

A new `getToken()` export was added — a plain (non-hook) function that reads the module-level state. This is needed by the axios interceptor which runs outside of React.

---

## 5. Protected Route Guard Update

**File:** `src/components/common/PrivateRoute.jsx`

Previously only checked `accountNumber` (register flow only). Now also accepts a `token` (login flow):

```jsx
const { token, accountNumber } = useAccount()
return (token || accountNumber) ? <Outlet /> : <Navigate to="/" replace />
```

This keeps backward compatibility — users who register without logging in still work as before.

---

## 6. User Profile

**Backend endpoint:** `GET /api/account/user-profile` (requires JWT)

**`src/api/accountApi.js`** — added `getUserProfile()`.

The profile is fetched automatically after login inside `useLogin.js` and stored via `setAccount()`. There is no standalone profile page yet — the data is used in the dashboard greeting and is available via `useAccount()` anywhere in the app.

> **Note:** `CustomerDto` from the backend does not include `accountNumber`. The account number is only available from the registration response (`AccountCreatedResponse`). Users who register and log in in the same session will see their account number; users who only log in will see `—` until a dedicated `/api/account/balance` or similar endpoint is added to the backend.

---

## 7. KYC Tier Upgrade

### Backend endpoint
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/kyc/submit` | JWT (CUSTOMER role) |

### Request body
```json
{ "documentType": "NIN" | "BVN", "submittedValue": "12345678901" }
```

### Tier rules (enforced server-side)
| Document | Upgrade |
|----------|---------|
| NIN (11 digits) | Tier 1 → Tier 2 (₦200k/day limit) |
| BVN (11 digits) | Tier 2 → Tier 3 (₦1M/day limit) |

### Files added

**`src/api/kycApi.js`** — `submitKycDocument(payload)`.

**`src/hooks/useKyc.js`** — calls the API, shows a success toast on approval.

**`src/pages/KycPage.jsx`** — form at `/kyc` (protected). Shows a tier comparison table so users understand what they're unlocking, then a document type selector and 11-digit value field.

---

## 8. Dashboard Updates

**File:** `src/pages/DashboardPage.jsx`

- Greeting now reads `firstName`/`lastName` from `useAccount()` and shows `Welcome back, Ada Okonkwo` when the profile is loaded
- Added a fourth quick-action card: **Upgrade Tier** → `/kyc`
- Removed the hardcoded "Tier 1" label from the account card (tier is managed by the backend)

---

## Route Map (complete)

| Path | Access | Component |
|------|--------|-----------|
| `/` | Public | LandingPage |
| `/login` | Public | LoginPage |
| `/register` | Public | RegisterPage |
| `/dashboard` | Protected | DashboardPage |
| `/transfer` | Protected | TransferPage |
| `/deposit` | Protected | DepositPage |
| `/requery` | Protected | RequeryPage |
| `/kyc` | Protected | KycPage |

---

## File Structure — New Files

```
src/
├── api/
│   ├── authApi.js       ← NEW: login, refreshToken
│   └── kycApi.js        ← NEW: submitKyc
├── hooks/
│   ├── useLogin.js      ← NEW: login flow + profile fetch
│   └── useKyc.js        ← NEW: KYC submission
└── pages/
    ├── LoginPage.jsx    ← NEW: /login
    └── KycPage.jsx      ← NEW: /kyc
```
