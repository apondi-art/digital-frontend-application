# Frontend API Coverage Report

> **Generated:** 2026-08-19
> **Branch:** `feat/frontend-admin`
> **Backend spec:** `digital-backend-application/docs/API_ENDPOINTS.md`
> **Base URL (dev):** `http://localhost:8080` via `VITE_API_BASE_URL`

This document maps every backend endpoint against the frontend implementation, explains what is fully wired, what has path/method mismatches, what is missing, and how each piece can be tested.

---

## How the Frontend Calls the Backend

| Concern | Location | Detail |
|---|---|---|
| Axios instance | `src/api/client.js` | Base URL from `VITE_API_BASE_URL`; attaches `Authorization: Bearer <token>` from sessionStorage |
| Endpoint constants | `src/constants/api.js` | Single source of truth for all URL strings |
| Auth state | `src/hooks/useAccount.js` | Stored in sessionStorage under key `db-account` |
| Auto token refresh | `src/api/client.js:46-82` | 401 interceptor calls `POST /api/auth/new-access-token` and retries original request |

---

## Status Key

| Status | Meaning |
|---|---|
| **CONFIGURED** | Endpoint path matches backend spec, fully wired to a UI form with request + response handling |
| **PARTIAL** | Endpoint exists in the frontend but the path or HTTP method does not match the backend spec |
| **MISSING** | No frontend code calls this backend endpoint at all |

---

## Coverage Table — All 19 Backend Endpoints

| # | Method | Backend Path | Frontend Status | Frontend Path (actual) |
|---|---|---|---|---|
| 1 | POST | `/api/auth/login` | **CONFIGURED** | `/api/auth/login` |
| 2 | POST | `/api/auth/logout` | **CONFIGURED** | `/api/auth/logout` |
| 3 | POST | `/api/auth/new-access-token` | **CONFIGURED** | `/api/auth/new-access-token` |
| 4 | POST | `/api/account/create-personal-account` | **CONFIGURED** | `/api/account/create-personal-account` |
| 5 | POST | `/api/account/create-admin-account` | **CONFIGURED** | `/api/account/create-admin-account` |
| 6 | GET | `/api/account/user-profile` | **CONFIGURED** | `/api/account/user-profile` |
| 7 | PATCH | `/api/account/password-reset` | **PARTIAL** | `POST /api/auth/reset-password` |
| 8 | POST | `/api/admin/create-Admin` | **MISSING** | — |
| 9 | GET | `/api/admin/fetch-pending-kyc` | **PARTIAL** | `GET /api/admin/kyc/pending` |
| 10 | GET | `/api/admin/fetch-pending-kyc-by-id/{account-id}` | **MISSING** | — |
| 11 | PATCH | `/api/admin/approvekyc/{kyc-id}` | **PARTIAL** | `POST /api/admin/kyc/{id}/approve` |
| 12 | PATCH | `/api/admin/reject-kyc` | **PARTIAL** | `POST /api/admin/kyc/{id}/reject` |
| 13 | PATCH | `/api/admin/suspend-account` | **PARTIAL** | `POST /api/admin/customers/{id}/suspend` |
| 14 | POST | `/api/kyc/submit` | **CONFIGURED** | `/api/kyc/submit` |
| 15 | POST | `/api/transaction/transfer` | **CONFIGURED** | `/api/transaction/transfer` |
| 16 | POST | `/api/transaction/deposit` | **CONFIGURED** | `/api/transaction/deposit` |
| 17 | PUT | `/api/transaction/requery/{transaction-id}` | **CONFIGURED** | `/api/transaction/requery/{txId}` |
| 18 | GET | `/api/transaction/transaction-history` | **CONFIGURED** | `/api/transaction/transaction-history` |
| 19 | POST | `/api/business/createaccount` | **CONFIGURED** | `/api/business/createaccount` |

**Summary: 12 CONFIGURED · 5 PARTIAL · 2 MISSING**

---

## Fully Configured Endpoints (12)

Each of these has a matching path, correct HTTP method, a UI form/page, and response handling.

---

### 1. POST `/api/auth/login`

- **API function:** `loginUser()` — `src/api/authApi.js:4`
- **Hook:** `useLogin()` — `src/hooks/useLogin.js`
- **Page:** `src/pages/LoginPage.jsx`
- **What it does:** Submits email + password. On success, stores `accessToken` and `role` in sessionStorage, fetches the user profile, then navigates to `/admin/dashboard` (ADMIN) or `/dashboard` (CUSTOMER/BUSINESS).
- **How to test:**
  1. Start the dev server (`npm run dev`) and navigate to `/login`.
  2. Enter valid credentials. Confirm redirect to the correct dashboard.
  3. Open DevTools → Application → Session Storage. Confirm `db-account` contains `accessToken` and `role`.
  4. Try invalid credentials and confirm an error message renders.

---

### 2. POST `/api/auth/logout`

- **API function:** `logoutUser()` — `src/api/authApi.js:7`
- **Hook:** `useLogout()` — `src/hooks/useLogout.js`
- **What it does:** Fires logout to the backend (fire-and-forget), then clears sessionStorage and navigates to `/login` regardless of response.
- **How to test:**
  1. Log in, then click the Logout button in the nav/sidebar.
  2. Confirm redirect to `/login` and that sessionStorage is cleared.
  3. Try navigating to a protected route — confirm redirect back to `/login`.

---

### 3. POST `/api/auth/new-access-token`

- **Location:** `src/api/client.js:66` (axios response interceptor)
- **What it does:** Called automatically on any 401 response. Sends the refresh token (via HttpOnly cookie), receives a new `accessToken`, updates sessionStorage, and retries the original request. If the refresh also fails, `clearAccount()` is called and the user is redirected to `/login`.
- **How to test:**
  1. Log in. Open DevTools → Network.
  2. Manually expire or delete the `accessToken` in sessionStorage.
  3. Perform any action that calls a protected endpoint (e.g., load the dashboard).
  4. Confirm the interceptor fires a request to `/api/auth/new-access-token` and the original request succeeds after.

---

### 4. POST `/api/account/create-personal-account`

- **API function:** `createPersonalAccount()` — `src/api/accountApi.js:4`
- **Hook:** `useRegister()` — `src/hooks/useRegister.js`
- **Page:** `src/pages/RegisterPage.jsx`
- **What it does:** Submits full registration form (first name, last name, email, password, phone, gender, date of birth, address). On success, redirects to `/login`.
- **How to test:**
  1. Navigate to `/register`.
  2. Fill all fields with valid data. `phoneNumber` must match `0[7-9][0-1][0-9]{8}` (e.g. `08012345678`). `gender` must be `MALE`, `FEMALE`, or `OTHER`. `dateOfBirth` format `YYYY-MM-DD`.
  3. Submit. Confirm redirect to `/login` and a success message.
  4. Try submitting with a duplicate email — confirm error renders.

---

### 5. POST `/api/account/create-admin-account`

- **API function:** `createAdminAccount()` — `src/api/accountApi.js:7`
- **Hook:** `useAdminRegister()` — `src/hooks/useAdminRegister.js`
- **Page:** `src/pages/admin/AdminRegisterPage.jsx`
- **What it does:** Same fields as personal account. Registers the user with `ADMIN` role. Not publicly linked from the nav — accessible at its direct route.
- **How to test:**
  1. Navigate directly to the admin registration route (check `src/router/` for the path).
  2. Submit valid data. Confirm redirect to `/login`.

---

### 6. GET `/api/account/user-profile`

- **API function:** `getUserProfile()` — `src/api/accountApi.js:10`
- **Called from:** `useLogin()` (after login) and `src/pages/ProfilePage.jsx`
- **What it does:** Returns full profile including KYC fields (`nin`, `bvn`) and nested `accountDto` (balance, tier, status). Data is stored in session state and displayed on the Profile page.
- **How to test:**
  1. Log in as a customer. Navigate to the Profile page.
  2. Confirm name, email, phone, address, account number, balance, and tier display correctly.
  3. If KYC has not been submitted, `nin` and `bvn` should show as empty/null.

---

### 14. POST `/api/kyc/submit`

- **API function:** `submitKycDocument()` — `src/api/kycApi.js:4`
- **Hook:** `useKyc()` — `src/hooks/useKyc.js`
- **Page:** `src/pages/KycPage.jsx`
- **What it does:** Submits `documentType` (NIN or BVN) and an 11-digit `submittedValue`. The tier upgrade rules are:
  - TIER_1 → submit NIN → TIER_2
  - TIER_2 → submit BVN → TIER_3
- **How to test:**
  1. Log in as a TIER_1 customer. Navigate to the KYC page.
  2. Select `NIN` and enter any 11-digit number (e.g. `12345678901`). Submit.
  3. Confirm success message "KYC submitted successfully / PENDING".
  4. Attempt to submit again — confirm the `406 Already pending` error is displayed.

---

### 15. POST `/api/transaction/transfer`

- **API function:** `transferFunds()` — `src/api/transactionApi.js:5`
- **Hook:** `useTransfer()` — `src/hooks/useTransfer.js`
- **Page:** `src/pages/TransferPage.jsx`
- **What it does:** Transfers funds to a destination account number. Sends `amount`, `destinationAccount`, and `description`.
- **How to test:**
  1. Log in as a customer. Navigate to the Transfer page.
  2. Enter a valid destination account number, a positive amount, and a description. Submit.
  3. Confirm success status (`SUCCESSFUL`). Check Transaction History to verify the record appears.
  4. Try transferring to a non-existent account — confirm error displays.

---

### 16. POST `/api/transaction/deposit`

- **API function:** `depositFunds()` — `src/api/transactionApi.js:9`
- **Hook:** `useDeposit()` — `src/hooks/useDeposit.js`
- **Page:** `src/pages/DepositPage.jsx`
- **What it does:** Deposits funds via card details. `depositAmount` minimum is 100. `cvc` must be exactly 3 digits. `dateOfExpiry` format `YYYY-MM`.
- **Response states:**
  - `SUCCESSFUL` — balance credited immediately
  - `PENDING` — card pending verification; user is prompted to requery
- **How to test:**
  1. Navigate to the Deposit page. The page displays test card examples — use those.
  2. Submit with a valid card. Confirm SUCCESSFUL or PENDING status.
  3. If PENDING, follow the requery prompt (see endpoint #17).

---

### 17. PUT `/api/transaction/requery/{transaction-id}`

- **API function:** `requeryTransaction(txId)` — `src/api/transactionApi.js:13`
- **Hook:** `useRequery()` — `src/hooks/useRequery.js`
- **Page:** `src/pages/RequeryPage.jsx`
- **What it does:** Re-checks a PENDING deposit. The backend randomly resolves it to SUCCESSFUL (balance credited) or FAILED (voided). Only works on PENDING transactions.
- **How to test:**
  1. Create a PENDING deposit (endpoint #16).
  2. Go to Transaction History, find the pending transaction, copy its `transactionId` (UUID).
  3. Navigate to the Requery page and submit that ID.
  4. Confirm status changes to SUCCESSFUL or FAILED.
  5. Try requerying an already-resolved transaction — confirm error.

---

### 18. GET `/api/transaction/transaction-history`

- **API function:** `getTransactionHistory()` — `src/api/transactionApi.js:17`
- **Hook:** `useTransactionHistory()` — `src/hooks/useTransactionHistory.js`
- **Page:** `src/pages/TransactionHistoryPage.jsx`
- **What it does:** Returns all transactions for the logged-in user sorted newest-first. The page paginates (10 per page) and supports filtering by status (SUCCESSFUL / PENDING / FAILED).
- **How to test:**
  1. Log in as a customer who has transactions. Navigate to Transaction History.
  2. Confirm transfers and deposits appear with correct type, amount, and status.
  3. Use the status filter and confirm the list narrows correctly.
  4. Click the requery shortcut on a PENDING row and confirm it opens the Requery page pre-filled.

---

### 19. POST `/api/business/createaccount`

- **API function:** `createBusinessAccount()` — `src/api/businessApi.js:5`
- **Hook:** `useBusinessRegister()` — `src/hooks/useBusinessRegister.js`
- **Page:** `src/pages/BusinessRegisterPage.jsx`
- **What it does:** Registers a business. `cacNumber` format: valid prefix (`RC`, `BN`, `IT`, `LP`) + space + 6 digits — e.g. `RC 123456`.
- **How to test:**
  1. Navigate to the business registration route.
  2. Fill all fields with valid data. Submit.
  3. Confirm success and redirect to `/login`.
  4. Try a duplicate `cacNumber` or invalid format — confirm error displays.

---

## Partial Endpoints (5)

These endpoints have frontend UI and logic, but the URL or HTTP method the frontend sends does **not match** what the backend spec documents. They will return 404 or 405 until one side is aligned.

---

### 7. PATCH `/api/account/password-reset` → PARTIAL

| | Backend spec | Frontend (actual) |
|---|---|---|
| Method | `PATCH` | `POST` |
| Path | `/api/account/password-reset` | `/api/auth/reset-password` |
| Payload | `{ newPassword, confirmPassword }` | `{ token, newPassword }` |

- **Frontend location:** `resetPassword()` in `src/api/authApi.js:16`, page at `src/pages/ResetPasswordPage.jsx`
- **Problem:** The frontend implements a token-based reset flow (forgot-password email → token link → reset). The backend spec documents a simple in-session password change requiring only `newPassword` and `confirmPassword` with a valid `accessToken`.
- **Resolution options:**
  - **Option A (backend):** Add `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` (token-based) to the backend to match the frontend flow.
  - **Option B (frontend):** Replace the forgot/token flow with an authenticated `PATCH /api/account/password-reset` call using `{ newPassword, confirmPassword }` — accessible only from within the logged-in dashboard.
  - Update `src/constants/api.js:10` (change path) and `src/api/authApi.js:16` (change method and payload).

---

### 9. GET `/api/admin/fetch-pending-kyc` → PARTIAL

| | Backend spec | Frontend (actual) |
|---|---|---|
| Method | `GET` | `GET` |
| Path | `/api/admin/fetch-pending-kyc` | `/api/admin/kyc/pending` |

- **Frontend location:** `getPendingKyc()` in `src/api/adminApi.js:19`, page at `src/pages/admin/AdminKycQueuePage.jsx`
- **Fix:** In `src/constants/api.js:39`, change:
  ```js
  adminKycPending: `${API_BASE}/admin/kyc/pending`,
  ```
  to:
  ```js
  adminKycPending: `${API_BASE}/admin/fetch-pending-kyc`,
  ```
  The page logic and pagination are correct — only the URL string needs updating.

---

### 11. PATCH `/api/admin/approvekyc/{kyc-id}` → PARTIAL

| | Backend spec | Frontend (actual) |
|---|---|---|
| Method | `PATCH` | `POST` |
| Path | `/api/admin/approvekyc/{kyc-id}` | `/api/admin/kyc/{id}/approve` |

- **Frontend location:** `approveKyc(kycId)` in `src/api/adminApi.js:22`, called from `AdminKycQueuePage.jsx:59`
- **Fix:** In `src/constants/api.js:40`, change:
  ```js
  adminKycApprove: (id) => `${API_BASE}/admin/kyc/${id}/approve`,
  ```
  to:
  ```js
  adminKycApprove: (id) => `${API_BASE}/admin/approvekyc/${id}`,
  ```
  In `src/api/adminApi.js:23`, change `client.post(` to `client.patch(`.

---

### 12. PATCH `/api/admin/reject-kyc` → PARTIAL

| | Backend spec | Frontend (actual) |
|---|---|---|
| Method | `PATCH` | `POST` |
| Path | `/api/admin/reject-kyc` | `/api/admin/kyc/{id}/reject` |
| Payload | `{ kycId, reason }` | `{ reason }` (ID in path) |

- **Frontend location:** `rejectKyc(kycId, reason)` in `src/api/adminApi.js:25`, called from `AdminKycQueuePage.jsx:74`
- **Fix:** In `src/constants/api.js:41`, change:
  ```js
  adminKycReject: (id) => `${API_BASE}/admin/kyc/${id}/reject`,
  ```
  to:
  ```js
  adminKycReject: `${API_BASE}/admin/reject-kyc`,
  ```
  In `src/api/adminApi.js:25-26`, change to:
  ```js
  export const rejectKyc = (kycId, reason) =>
    client.patch(ENDPOINTS.adminKycReject, { kycId, reason }).then((r) => r.data)
  ```
  The `kycId` moves from the URL path into the request body alongside `reason`.

---

### 13. PATCH `/api/admin/suspend-account` → PARTIAL

| | Backend spec | Frontend (actual) |
|---|---|---|
| Method | `PATCH` | `POST` |
| Path | `/api/admin/suspend-account` | `/api/admin/customers/{id}/suspend` |
| Payload | `{ accountId, suspensionReason }` | `{ reason }` (account ID in path) |

- **Frontend location:** `suspendCustomer(id, reason)` in `src/api/adminApi.js:13`, page at `src/pages/admin/AdminCustomerDetailPage.jsx:26`
- **Fix:** In `src/constants/api.js:37`, change:
  ```js
  adminSuspend: (id) => `${API_BASE}/admin/customers/${id}/suspend`,
  ```
  to:
  ```js
  adminSuspend: `${API_BASE}/admin/suspend-account`,
  ```
  In `src/api/adminApi.js:13-14`, change to:
  ```js
  export const suspendCustomer = (accountId, suspensionReason) =>
    client.patch(ENDPOINTS.adminSuspend, { accountId, suspensionReason }).then((r) => r.data)
  ```
  Update all callers in `AdminCustomerDetailPage.jsx` to pass the account's UUID as `accountId` instead of using it in the URL.

---

## Missing Endpoints (2)

These backend endpoints have no corresponding frontend implementation at all.

---

### 8. POST `/api/admin/create-Admin` — MISSING

- **What it does:** Admin creates another admin user. Requires an admin `accessToken`. Same payload as personal account creation plus admin-specific validation (age ≥ 18).
- **Under what capacity it can be tested now:** Directly via `curl` or Postman/Bruno — no UI exists:
  ```bash
  curl -X POST http://localhost:8080/api/admin/create-Admin \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <admin_accessToken>" \
    -d '{
      "firstName": "Alice",
      "lastName": "Manager",
      "email": "alice@bank.com",
      "password": "AdminSecure1!",
      "phoneNumber": "09012345678",
      "gender": "FEMALE",
      "dateOfBirth": "1988-03-22",
      "address": "10 Bank Avenue, Lagos"
    }'
  ```
- **To add to the frontend:** Create an "Add Admin" form in the admin dashboard (e.g. `src/pages/admin/AdminCreateAdminPage.jsx`) using `createAdminAccount()` — but note the endpoint must be `/api/admin/create-Admin`, not the existing `/api/account/create-admin-account`. A new constant and API function is needed:
  ```js
  // src/constants/api.js
  adminCreateAdmin: `${API_BASE}/admin/create-Admin`,

  // src/api/adminApi.js
  export const createAdmin = (payload) =>
    client.post(ENDPOINTS.adminCreateAdmin, payload).then((r) => r.data)
  ```

---

### 10. GET `/api/admin/fetch-pending-kyc-by-id/{account-id}` — MISSING

- **What it does:** Fetches the single pending KYC record for a specific account UUID. Used when an admin needs to drill into one customer's KYC before approving or rejecting.
- **Under what capacity it can be tested now:** Directly via `curl` or Postman/Bruno:
  ```bash
  curl -X GET http://localhost:8080/api/admin/fetch-pending-kyc-by-id/<account-uuid> \
    -H "Authorization: Bearer <admin_accessToken>"
  ```
- **To add to the frontend:** The `AdminKycQueuePage` already lists KYC submissions. A "View Details" link per row could call this endpoint and open a detail modal or side panel. Additions needed:
  ```js
  // src/constants/api.js
  adminKycPendingById: (accountId) => `${API_BASE}/admin/fetch-pending-kyc-by-id/${accountId}`,

  // src/api/adminApi.js
  export const getPendingKycById = (accountId) =>
    client.get(ENDPOINTS.adminKycPendingById(accountId)).then((r) => r.data)
  ```

---

## Frontend Endpoints with No Backend Documentation

The frontend calls several endpoints that do not appear in the current backend API spec. These may be planned, backend-team-owned, or placeholders. They will all 404 until the backend implements them.

| Frontend constant | URL called | Page / Usage |
|---|---|---|
| `forgotPassword` | `POST /api/auth/forgot-password` | Forgot password flow |
| `resetPassword` | `POST /api/auth/reset-password` | Reset password (token-based) |
| `verifyOtp` | `POST /api/auth/verify-otp` | OTP verification |
| `resendOtp` | `POST /api/auth/resend-otp` | Resend OTP |
| `accountBalance` | `GET /api/account/balance` | Balance display (separate from profile) |
| `kycStatus` | `GET /api/kyc/status` | KYC status polling |
| `adminStatsOverview` | `GET /api/admin/stats/overview` | Admin dashboard stats cards |
| `adminCustomers` | `GET /api/admin/customers` | Admin customer list |
| `adminCustomerById` | `GET /api/admin/customers/{id}` | Admin customer detail |
| `adminReactivate` | `POST /api/admin/customers/{id}/reactivate` | Reactivate a suspended account |
| `adminTransactions` | `GET /api/admin/transactions` | Admin transaction list |
| `adminAuditLogs` | `GET /api/admin/audit-logs` | Admin audit log view |

> **Note on `adminCustomers` and `adminCustomerById`:** The backend's documented admin endpoints don't include a customer list or customer detail view. These are essential for the admin suspend flow (the frontend needs to look up an account UUID before suspending). Either the backend needs to add these endpoints, or the admin suspend form must accept a raw UUID input.

---

## Recommended Fix Priority

| Priority | Action |
|---|---|
| **High** | Fix the 5 path/method mismatches in `src/constants/api.js` and `src/api/adminApi.js` so the admin KYC queue and suspend flow work against the real backend |
| **High** | Align the password-reset flow — decide whether backend adds token-based reset or frontend uses the authenticated in-session PATCH |
| **Medium** | Add the `POST /api/admin/create-Admin` page and API function |
| **Medium** | Add the `GET /api/admin/fetch-pending-kyc-by-id/{account-id}` call to the KYC queue page |
| **Low / Backend** | Backend team to confirm or implement: `stats/overview`, `customers`, `customers/{id}`, `reactivate`, `transactions`, `audit-logs`, `kyc/status`, OTP and forgot-password flows |
