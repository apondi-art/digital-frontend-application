# Frontend Implementation Checklist

This document tracks every frontend gap, fix, and feature identified in the full project review (Part B + Part C of the
combined readiness guide). Items are grouped by category. Work through them top-to-bottom; **BLOCKING** items
must be completed before the app can be shown to anyone outside the team.

Each item has:
- A checkbox `[ ]` — mark `[x]` when done
- A file/location reference
- A clear description of what "done" means

---

## SECTION 1 — BLOCKING: Auth Flow Fixes

These bugs mean the app silently breaks for anyone who registers or whose token expires.

### 1.1 Fix: Registration Does Not Produce an Authenticated Session [BLOCKING]

**Files:** `src/hooks/useRegister.js`, `src/pages/RegisterPage.jsx`, `src/components/common/PrivateRoute.jsx`

**Problem:** After `POST /api/account/create-personal-account` succeeds, the frontend stores `accountNumber` in
session and navigates to `/dashboard`. There is no JWT token. Any authenticated API call from the dashboard
returns 401, triggers the refresh flow, which also fails (no refresh cookie), and silently redirects the user to home.

- [x] **1.1a** In `useRegister.js`: After successful registration, navigate to `/login` (not `/dashboard`). Pass a
  `{ state: { registrationSuccess: true } }` object so the login page can show a success toast.
- [x] **1.1b** In `LoginPage.jsx`: Read `location.state?.registrationSuccess` on mount; if present, show it as a success toast
  via `react-hot-toast` and then clear it from history state.
- [x] **1.1c** In `PrivateRoute.jsx`: Change the auth check from `token || accountNumber` to **only** `token`.
  An account number without a token is not an authenticated session.

**Done when:** After registering, the user lands on `/login` with a success toast. Navigating to `/dashboard` without
logging in first redirects back to `/`.

---

### 1.2 Fix: PrivateRoute Uses Weak Auth Check [BLOCKING]

**File:** `src/components/common/PrivateRoute.jsx`

- [x] **1.2a** Remove `|| accountNumber` from the guard condition. Only a valid `token` in session state grants
  access to protected routes.

**Done when:** A fresh browser session with no token always redirects protected routes to `/`.

---

## SECTION 2 — BLOCKING: Missing Pages

### 2.1 Add 404 Not Found Page [BLOCKING]

**Files:** `src/pages/NotFoundPage.jsx` *(new)*, `src/App.jsx`

- [x] **2.1a** Create `src/pages/NotFoundPage.jsx` — a simple page with a "Page not found" heading, a short
  message, and a "Go Home" button that navigates to `/`.
- [x] **2.1b** In `src/App.jsx`, add a catch-all route at the bottom of the route tree:
  ```jsx
  <Route path="*" element={<NotFoundPage />} />
  ```

**Done when:** Navigating to `/anything-random` renders the 404 page, not a blank screen.

---

## SECTION 3 — Core Missing Pages & Features

### 3.1 Build Profile Page

**Files:** `src/pages/ProfilePage.jsx` *(new)*, `src/App.jsx`, `src/layout/Sidebar.jsx`, `src/constants/routes.js`

- [ ] **3.1a** Create `src/pages/ProfilePage.jsx`:
  - Call `getUserProfile()` on mount (or read from `useAccount()` session state, re-fetch to ensure freshness).
  - Display all profile fields: `firstName`, `lastName`, `email`, `phoneNumber`, `gender`, `dateOfBirth`, `address`.
  - Show current account tier (e.g. `TIER_1 / TIER_2 / TIER_3`) as a badge.
  - Show KYC status for each submitted document (requires backend to add a `GET /api/kyc/status` endpoint —
    if not yet available, show a "KYC Status" section with "Check back soon" placeholder).
  - For `nin` and `bvn` fields: render `••••••••••` by default with a "Reveal" eye-icon button that toggles
    visibility. Never show these values on initial render.
- [ ] **3.1b** Register the route in `src/App.jsx` inside the `AppLayout / PrivateRoute` block:
  ```jsx
  <Route path={ROUTES.profile} element={<ProfilePage />} />
  ```
- [ ] **3.1c** Verify `ROUTES.profile` is set to `'/profile'` in `src/constants/routes.js` (it is already defined —
  just confirm it is correct).
- [ ] **3.1d** Add a "Profile" `NavLink` to `src/layout/Sidebar.jsx` between "Dashboard" and "History". Use the
  same style pattern as the existing links.

**Done when:** Clicking "Profile" in the sidebar loads the profile page with user data and masked NIN/BVN.

---

### 3.2 Display Account Balance on Dashboard

**Files:** `src/api/accountApi.js`, `src/constants/api.js`, `src/hooks/useBalance.js` *(new)*,
`src/pages/DashboardPage.jsx`

> **Dependency:** Requires backend to ship `GET /api/account/balance`. Coordinate with backend team first.
> If endpoint is not ready, add the hook and API call but display "Balance unavailable" gracefully.

- [ ] **3.2a** Add `BALANCE` constant to `src/constants/api.js`:
  ```js
  BALANCE: '/api/account/balance',
  ```
- [ ] **3.2b** Add `getAccountBalance()` function to `src/api/accountApi.js`:
  ```js
  export const getAccountBalance = () => apiClient.get(API_ENDPOINTS.BALANCE);
  ```
- [ ] **3.2c** Create `src/hooks/useBalance.js` — fetches balance on mount, returns `{ balance, loading, error }`.
  Expose a `refetch()` function so pages can refresh balance after a transaction.
- [ ] **3.2d** In `DashboardPage.jsx`:
  - Call `useBalance()` on mount.
  - Display the formatted balance (use `formatNaira()`) on the bank card component.
  - Show a loading skeleton in place of the balance while fetching.
  - Show "---" or "Unavailable" if the fetch fails.
  - Call `refetch()` after a successful transfer or deposit (coordinate with `useTransfer` / `useDeposit` callbacks).

**Done when:** The dashboard bank card shows a live account balance fetched from the backend.

---

### 3.3 Add Transaction Direction Indicator (Sent vs Received)

**File:** `src/pages/TransactionHistoryPage.jsx`

> **Note:** The `sourceAccount` field is already in the API response — no backend change needed.

- [ ] **3.3a** In `TransactionHistoryPage.jsx`, import `useAccount` and get the logged-in user's `accountNumber`.
- [ ] **3.3b** For each transaction in the history list, compare `transaction.sourceAccount` to the logged-in
  `accountNumber`:
  - If they **match** → outgoing (sent). Show a red/outgoing indicator: arrow pointing up-right, label
    "Sent to:", and the destination account number.
  - If they **don't match** → incoming (received). Show a green/incoming indicator: arrow pointing
    down-left, label "From:", and the source account number.
- [ ] **3.3c** Update the amount display: show negative (red) for sent, positive (green) for received.

**Done when:** Each transaction row clearly shows whether money was sent or received, with the counterpart account.

---

### 3.4 Copy Transaction ID from History + Pre-fill Requery

**Files:** `src/pages/TransactionHistoryPage.jsx`, `src/pages/RequeryPage.jsx`

- [ ] **3.4a** In `TransactionHistoryPage.jsx`, add a copy-to-clipboard button (clipboard icon) on each transaction
  row. On click: `navigator.clipboard.writeText(transaction.id)` then show a brief "Copied!" toast.
- [ ] **3.4b** For each transaction with status `PENDING`, add a "Requery" link/button that navigates to
  `/requery` and passes the transaction ID via router state:
  ```js
  navigate(ROUTES.requery, { state: { transactionId: transaction.id } })
  ```
- [ ] **3.4c** In `RequeryPage.jsx`, read `location.state?.transactionId` on mount and pre-fill the input field
  using `setValue` from `react-hook-form`.

**Done when:** Users can copy any transaction ID with one click, and clicking "Requery" pre-fills the form.

---

### 3.5 Display KYC Status and Account Tier

**Files:** `src/pages/DashboardPage.jsx`, `src/pages/KycPage.jsx`

> **Note:** `accountTier` and KYC data are available from `getUserProfile()`. Use what is already in `useAccount()`.

- [ ] **3.5a** In `DashboardPage.jsx`, below the bank card, add an "Account Tier" badge reading from
  `account.tier` or the stored session tier field. Use the existing `Badge` component, styled with:
  - `TIER_1` → yellow/amber
  - `TIER_2` → blue
  - `TIER_3` → green
- [ ] **3.5b** In `KycPage.jsx`, above the submission form, show the current tier as a badge and a short sentence
  explaining what submitting will unlock (e.g. "You are currently Tier 1. Submit your BVN to upgrade to Tier 2.").

**Done when:** The dashboard and KYC page both show the current account tier clearly.

---

## SECTION 4 — Admin Panel

All admin pages must be gated behind a new `AdminRoute` guard that checks `role === 'ADMIN'`.

### 4.1 AdminRoute Guard

**File:** `src/components/common/AdminRoute.jsx` *(new)*

- [ ] **4.1a** Create `AdminRoute.jsx` — similar to `PrivateRoute.jsx` but additionally checks that `role === 'ADMIN'`
  from `useAccount()`. If not admin, redirect to `/dashboard` (not home, to avoid confusing logged-in users).

**Done when:** Navigating to any `/admin/*` route as a non-admin redirects to `/dashboard`.

---

### 4.2 Admin Dashboard / Stats Page

**Files:** `src/pages/admin/AdminDashboardPage.jsx` *(new)*, `src/api/adminApi.js` *(new)*,
`src/constants/api.js`, `src/App.jsx`

- [ ] **4.2a** Add admin API endpoint constants to `src/constants/api.js`:
  ```js
  ADMIN_STATS_OVERVIEW: '/api/admin/stats/overview',
  ADMIN_CUSTOMERS: '/api/admin/customers',
  ADMIN_KYC_PENDING: '/api/admin/kyc/pending',
  ADMIN_TRANSACTIONS: '/api/admin/transactions',
  ADMIN_AUDIT_LOGS: '/api/admin/audit-logs',
  ```
- [ ] **4.2b** Create `src/api/adminApi.js` with functions:
  - `getStatsOverview()` → `GET /api/admin/stats/overview`
  - `getCustomers(page, size)` → `GET /api/admin/customers`
  - `getCustomerById(id)` → `GET /api/admin/customers/{id}`
  - `suspendCustomer(id, reason)` → `POST /api/admin/customers/{id}/suspend`
  - `reactivateCustomer(id)` → `POST /api/admin/customers/{id}/reactivate`
  - `getPendingKyc(page, size)` → `GET /api/admin/kyc/pending`
  - `approveKyc(kycId)` → `POST /api/admin/kyc/{kycId}/approve`
  - `rejectKyc(kycId, reason)` → `POST /api/admin/kyc/{kycId}/reject`
  - `getAllTransactions(page, size, filters)` → `GET /api/admin/transactions`
  - `getAuditLogs(page, size, filters)` → `GET /api/admin/audit-logs`
- [ ] **4.2c** Create `src/pages/admin/AdminDashboardPage.jsx` — shows stat cards:
  - Total registered customers
  - Active accounts
  - Transaction volume today (₦)
  - KYC submissions pending
  - Total suspended accounts
  Use `getStatsOverview()` on mount. Show loading skeletons while fetching.
- [ ] **4.2d** Register admin routes in `src/App.jsx` using `AdminRoute`:
  ```jsx
  <Route element={<AdminRoute />}>
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/customers" element={<AdminCustomersPage />} />
    <Route path="/admin/customers/:id" element={<AdminCustomerDetailPage />} />
    <Route path="/admin/kyc/pending" element={<AdminKycQueuePage />} />
    <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
    <Route path="/admin/audit-logs" element={<AdminAuditLogPage />} />
  </Route>
  ```
- [ ] **4.2e** Add admin routes to `src/constants/routes.js`:
  ```js
  adminDashboard: '/admin/dashboard',
  adminCustomers: '/admin/customers',
  adminKycQueue: '/admin/kyc/pending',
  adminTransactions: '/admin/transactions',
  adminAuditLogs: '/admin/audit-logs',
  ```
- [ ] **4.2f** Create `src/layout/AdminLayout.jsx` (or reuse `AppLayout.jsx`) — the admin shell includes the same
  `Header` and `Footer` but uses an `AdminSidebar` component with admin-specific nav links.
- [ ] **4.2g** Create `src/layout/AdminSidebar.jsx` with nav links to each admin page.

**Done when:** An admin who logs in sees an admin dashboard with live platform stats.

---

### 4.3 Admin Customer List Page

**File:** `src/pages/admin/AdminCustomersPage.jsx` *(new)*

- [ ] **4.3a** Create `AdminCustomersPage.jsx`:
  - Paginated table of all customers (name, email, tier, status, registration date).
  - Search bar filtering by name or email (client-side filter on the loaded page, or server-side with a debounced API call).
  - Each row links to the customer detail page.
- [ ] **4.3b** Implement pagination controls (Previous / Next / page number) reading from the backend's
  `page`, `size`, `totalElements`, `totalPages` response fields.

**Done when:** Admin can browse all customers in a paginated, searchable table.

---

### 4.4 Admin Customer Detail Page

**File:** `src/pages/admin/AdminCustomerDetailPage.jsx` *(new)*

- [ ] **4.4a** Create `AdminCustomerDetailPage.jsx`:
  - Fetch full customer profile by ID on mount.
  - Show all account details, KYC history with statuses, and transaction history.
  - "Suspend Account" button → confirm dialog → `suspendCustomer(id, reason)` → show result toast.
  - "Reactivate Account" button (if suspended) → `reactivateCustomer(id)`.

**Done when:** Admin can view a customer's full profile and suspend/reactivate their account.

---

### 4.5 Admin KYC Review Queue

**File:** `src/pages/admin/AdminKycQueuePage.jsx` *(new)*

- [ ] **4.5a** Create `AdminKycQueuePage.jsx`:
  - Paginated list of all `PENDING` KYC submissions (document type, customer name, submission date).
  - "Approve" button per row → `approveKyc(kycId)` → refresh list.
  - "Reject" button per row → opens a dialog asking for a reason (required text field) → `rejectKyc(kycId, reason)`.
  - After approve/reject, the row should disappear from the pending list (re-fetch or filter locally).

**Done when:** Admin can approve or reject KYC submissions from a paginated queue.

---

### 4.6 Admin Transaction Monitor

**File:** `src/pages/admin/AdminTransactionsPage.jsx` *(new)*

- [ ] **4.6a** Create `AdminTransactionsPage.jsx`:
  - Paginated table of all transactions across all accounts.
  - Filters: date range (from/to), status (SUCCESSFUL/PENDING/DECLINED), type (TRANSFER/DEPOSIT).
  - Shows: transaction ID, source account, destination account, amount, type, status, date.

**Done when:** Admin can view and filter all platform transactions.

---

### 4.7 Admin Audit Log Viewer

**File:** `src/pages/admin/AdminAuditLogPage.jsx` *(new)*

- [ ] **4.7a** Create `AdminAuditLogPage.jsx`:
  - Paginated, read-only table of audit events.
  - Columns: timestamp, action type, user email, description.
  - Filter by user email and date range.

**Done when:** Admin can view the immutable audit trail.

---

### 4.8 Admin Account Creation Page

**Files:** `src/pages/admin/AdminRegisterPage.jsx` *(new)*, `src/hooks/useAdminRegister.js` *(new)*,
`src/api/accountApi.js`, `src/App.jsx`

- [ ] **4.8a** Add `createAdminAccount()` to `src/api/accountApi.js` pointing to `/api/account/create-admin-account`.
- [ ] **4.8b** Create `src/hooks/useAdminRegister.js` — same pattern as `useRegister.js` but calls
  `createAdminAccount()`.
- [ ] **4.8c** Create `src/pages/admin/AdminRegisterPage.jsx` — same fields as `RegisterPage.jsx`. After success,
  redirect to `/login` with a success toast.
- [ ] **4.8d** Register a route for `/register/admin` in `src/App.jsx`. This route should **not** be publicly linked;
  it is accessible only by direct URL or from within the admin panel.
  > **Security note:** Once the backend secures this endpoint to require an existing ADMIN token, wrap this
  > route with `AdminRoute` so only logged-in admins can create other admins.

**Done when:** A new admin account can be created via `/register/admin`. The page is not linked anywhere public.

---

## SECTION 5 — Password Reset Flow

> **Dependency:** Requires backend to ship `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`.
> Coordinate with backend team. Build the pages now; they will render but API calls will fail until the backend is ready.

### 5.1 Forgot Password Page

**Files:** `src/pages/ForgotPasswordPage.jsx` *(new)*, `src/api/authApi.js`, `src/constants/api.js`,
`src/pages/LoginPage.jsx`

- [ ] **5.1a** Add constants to `src/constants/api.js`:
  ```js
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  ```
- [ ] **5.1b** Add `forgotPassword(email)` and `resetPassword(token, newPassword)` to `src/api/authApi.js`.
- [ ] **5.1c** Create `src/pages/ForgotPasswordPage.jsx`:
  - Single email input.
  - On submit: `POST /api/auth/forgot-password` → show a success message regardless of whether the
    email exists (security best practice: never confirm or deny that an email is registered).
  - Register route `/forgot-password` in `src/App.jsx` (public, no auth required).
- [ ] **5.1d** Add a "Forgot password?" link on `LoginPage.jsx` below the password field that navigates to
  `/forgot-password`.

**Done when:** Users can request a password reset from the login page.

---

### 5.2 Reset Password Page

**File:** `src/pages/ResetPasswordPage.jsx` *(new)*

- [ ] **5.2a** Create `src/pages/ResetPasswordPage.jsx`:
  - Two fields: new password + confirm password.
  - Read the reset token from the URL query string: `useSearchParams()` → `params.get('token')`.
  - On submit: `POST /api/auth/reset-password` with `{ token, newPassword }`.
  - On success: navigate to `/login` with a "Password reset successful" message.
  - On failure: show an error toast ("Link has expired or is invalid. Please request a new one.").
  - Register route `/reset-password` in `src/App.jsx` (public).

**Done when:** Clicking the email link navigates to `/reset-password?token=...` and the user can set a new password.

---

## SECTION 6 — OTP Verification Flow

> **Dependency:** Requires backend to ship OTP generation and verification. Build the UI now; wire it up when the
> backend is ready.

### 6.1 OTP Verification Page

**Files:** `src/pages/VerifyOtpPage.jsx` *(new)*, `src/api/authApi.js`, `src/constants/api.js`,
`src/hooks/useRegister.js`

- [ ] **6.1a** Add constants:
  ```js
  VERIFY_OTP: '/api/auth/verify-otp',
  RESEND_OTP: '/api/auth/resend-otp',
  ```
- [ ] **6.1b** Add `verifyOtp(otp)` and `resendOtp(email)` to `src/api/authApi.js`.
- [ ] **6.1c** Create `src/pages/VerifyOtpPage.jsx`:
  - 6-digit OTP input (consider individual digit boxes for UX).
  - "Resend OTP" button disabled for 60 seconds after send; shows a countdown.
  - On successful verification: navigate to `/login` with a success toast.
  - Register route `/verify-otp` in `src/App.jsx` (public).
- [ ] **6.1d** After backend ships OTP, update `useRegister.js` to navigate to `/verify-otp` instead of `/login`
  after successful registration, passing the email via router state.

**Done when:** After registration, users are directed to enter an OTP before being allowed to log in.

---

## SECTION 7 — Business User Post-Login Routing

> **Dependency:** Backend must fix `CustomUserDetailsService` to allow business users to log in. Coordinate first.

### 7.1 Business Dashboard

**Files:** `src/pages/BusinessDashboardPage.jsx` *(new)*, `src/hooks/useLogin.js`, `src/App.jsx`

- [ ] **7.1a** In `useLogin.js`, after login succeeds, check the `role` field returned by the API:
  - If `role === 'CUSTOMER'` → navigate to `/dashboard`
  - If `role === 'BUSINESS'` (or whatever the backend uses) → navigate to `/business/dashboard`
  - If `role === 'ADMIN'` → navigate to `/admin/dashboard`
- [ ] **7.1b** Create `src/pages/BusinessDashboardPage.jsx`:
  - Shows business account number, balance, and transaction history.
  - Reuses the same `AppLayout` shell.
- [ ] **7.1c** Register `/business/dashboard` in `src/App.jsx` wrapped in `PrivateRoute`.

**Done when:** A business user who logs in lands on a business-specific dashboard, not the customer dashboard.

---

## SECTION 8 — Accessibility Fixes

### 8.1 Skip-to-Main-Content Link

**Files:** `src/layout/PublicLayout.jsx`, `src/layout/AppLayout.jsx`

- [ ] **8.1a** Add a visually-hidden (but focusable) skip link as the very first element in both layout files:
  ```jsx
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded"
  >
    Skip to main content
  </a>
  ```
- [ ] **8.1b** Add `id="main-content"` to the `<main>` element in both layouts.

**Done when:** Tab-key on any page reveals the skip link; activating it jumps to page content.

---

### 8.2 Sidebar ARIA Landmark

**File:** `src/layout/Sidebar.jsx`

- [ ] **8.2a** Wrap the sidebar nav links in `<nav aria-label="Main navigation">`.

**Done when:** Screen readers announce "Main navigation" when entering the sidebar.

---

### 8.3 Focus Management on Route Change

**File:** `src/App.jsx` or a new `src/hooks/useFocusOnRouteChange.js`

- [ ] **8.3a** After each route change, programmatically move focus to the page's main `<h1>` element. Use a
  `useEffect` that depends on the route location and calls `.focus()` on the first `h1` or a dedicated
  focus-target element with `tabIndex={-1}`.

**Done when:** Screen reader users hear the new page heading announced after navigation.

---

### 8.4 Form Error Accessibility Audit

**Files:** All form pages

- [ ] **8.4a** Verify every form input's error message paragraph has a unique `id`, and the corresponding input's
  `aria-describedby` is set to that `id`. The `Input.jsx` component already sets `aria-describedby` — confirm
  the `id` prop is threaded through on every usage.
- [ ] **8.4b** Verify dark-mode colour contrast meets WCAG AA (4.5:1 for normal text) using browser DevTools
  Accessibility panel. Fix any emerald shade combinations that fail.

**Done when:** Accessibility audit in Chrome DevTools shows no critical contrast or form-label issues.

---

## SECTION 9 — Performance Improvements

### 9.1 Route-Based Code Splitting

**File:** `src/App.jsx`

- [ ] **9.1a** Wrap all route-level page imports with `React.lazy()`:
  ```js
  const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
  ```
- [ ] **9.1b** Wrap the router outlet in `<Suspense fallback={<div>Loading...</div>}>` (or a proper loading
  skeleton component).

**Done when:** Network tab shows separate JS chunks being loaded per route, not everything upfront.

---

### 9.2 Profile Re-Fetch on Dashboard Mount

**File:** `src/pages/DashboardPage.jsx`

- [ ] **9.2a** On `DashboardPage` mount, call `getUserProfile()` and update the session state via `setAccount()`.
  Show a loading skeleton while the request is in flight. This ensures the displayed data is always fresh
  (e.g. after a tier upgrade the dashboard reflects the new tier).

**Done when:** Refreshing the dashboard re-fetches the profile from the server, not just session storage.

---

### 9.3 Loading State on Dashboard Mount

**File:** `src/pages/DashboardPage.jsx`

- [ ] **9.3a** Show animated placeholder/skeleton for the bank card and quick-action area while `getUserProfile`
  is loading on mount. Use Tailwind's `animate-pulse` utility.

**Done when:** Dashboard shows a visual loading state for ~200ms before content appears on a fresh login.

---

## SECTION 10 — Testing Setup

### 10.1 Install Testing Libraries

**File:** `package.json`

- [ ] **10.1a** Install Vitest and React Testing Library:
  ```bash
  npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
  ```
- [ ] **10.1b** Create `vitest.config.js` (or add to `vite.config.js`):
  ```js
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  }
  ```
- [ ] **10.1c** Create `src/test/setup.js`:
  ```js
  import '@testing-library/jest-dom';
  ```
- [ ] **10.1d** Add scripts to `package.json`:
  ```json
  "test": "vitest",
  "test:ui": "vitest --ui",
  "coverage": "vitest run --coverage"
  ```

**Done when:** Running `npm test` starts Vitest without errors (even with zero tests).

---

### 10.2 Unit Tests — Format Utilities

**File:** `src/utils/format.test.js` *(new)*

- [ ] **10.2a** Test `formatNaira()`:
  - Zero amount → "₦0.00" (or equivalent)
  - Large amount (1,000,000) → "₦1,000,000.00"
  - Negative amount → handled gracefully (no crash)
- [ ] **10.2b** Test `formatDate()`:
  - Valid ISO string → correct formatted date
  - Invalid / null → does not throw; returns a fallback string
- [ ] **10.2c** Test `statusMeta()`:
  - `'SUCCESSFUL'` → returns expected label and color classes
  - `'PENDING'` → returns expected label and color classes
  - `'DECLINED'` → returns expected label and color classes
  - Unknown value → returns fallback without throwing

**Done when:** `npm test` passes all format utility tests.

---

### 10.3 Component Tests — Button

**File:** `src/components/common/Button.test.jsx` *(new)*

- [ ] **10.3a** Renders with `primary` variant — button has expected classes.
- [ ] **10.3b** Renders with `loading={true}` — spinner element is present, button is `disabled`.
- [ ] **10.3c** Renders with `disabled={true}` — button is not clickable (`onClick` not fired).
- [ ] **10.3d** `onClick` fires when not loading or disabled.

**Done when:** Button component tests pass.

---

### 10.4 Component Tests — Input

**File:** `src/components/common/Input.test.jsx` *(new)*

- [ ] **10.4a** Renders with `label` prop — label text is in the DOM.
- [ ] **10.4b** Renders with `error` prop — error message is displayed and `aria-invalid="true"` is set on input.
- [ ] **10.4c** Renders with `hint` prop and no error — hint text is shown.
- [ ] **10.4d** When both `hint` and `error` are provided — error takes precedence; hint is hidden.

**Done when:** Input component tests pass.

---

### 10.5 Hook Tests — useLogin

**File:** `src/hooks/useLogin.test.js` *(new)*

- [ ] **10.5a** Mock `authApi.loginUser` and `accountApi.getUserProfile`.
- [ ] **10.5b** On successful login and profile fetch → `useAccount()` session state has `token`, `firstName`, etc.
- [ ] **10.5c** On API failure → the hook returns an error and does not navigate.
- [ ] **10.5d** `loading` is `true` while the request is in flight, `false` after.

**Done when:** `useLogin` hook tests pass without real network calls.

---

### 10.6 Integration Test — Registration Flow

**File:** `src/pages/RegisterPage.test.jsx` *(new)*

- [ ] **10.6a** Test: submit with DOB making user 16 years old → form does not submit, age error message appears.
- [ ] **10.6b** Test: submit with a valid DOB (25 years old), all fields filled → mock API success → navigation to
  `/login` occurs.
- [ ] **10.6c** Test: submit with missing required field → field-level error message appears; API is not called.

**Done when:** Registration integration tests pass.

---

### 10.7 Integration Test — Protected Route Guard

**File:** `src/components/common/PrivateRoute.test.jsx` *(new)*

- [ ] **10.7a** Without a session token → navigating to `/dashboard` redirects to `/`.
- [ ] **10.7b** With a valid token in session → navigating to `/dashboard` renders `DashboardPage`.

**Done when:** Route guard tests pass.

---

## SECTION 11 — Build & Deployment

### 11.1 Environment Files

- [ ] **11.1a** Create `.env.example` in the project root:
  ```
  # Backend API base URL
  VITE_API_BASE_URL=http://localhost:8080
  ```
- [ ] **11.1b** Create `.env.production` in the project root:
  ```
  VITE_API_BASE_URL=https://api.your-production-domain.com
  ```
  *(Replace with the real production URL before deploying.)*
- [ ] **11.1c** Confirm `.env.production` and `.env` are in `.gitignore`. Only `.env.example` should be committed.

**Done when:** `.env.example` is committed and `.env.production` is gitignored.

---

### 11.2 Dockerfile + Nginx Config

**Files:** `Dockerfile` *(new)*, `nginx.conf` *(new)*, `.dockerignore` *(new)*

- [ ] **11.2a** Create `Dockerfile` (multi-stage):
  ```dockerfile
  # Stage 1 — Build
  FROM node:18-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  # Stage 2 — Serve
  FROM nginx:alpine
  COPY --from=build /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```
- [ ] **11.2b** Create `nginx.conf`:
  ```nginx
  server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing — serve index.html for all routes
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;
  }
  ```
- [ ] **11.2c** Create `.dockerignore`:
  ```
  node_modules
  dist
  .git
  .env
  .env.production
  ```
- [ ] **11.2d** Test locally: `docker build -t digital-frontend .` → `docker run -p 8081:80 digital-frontend`
  → open `http://localhost:8081` and verify the app loads and route refreshes work.

**Done when:** The Docker container serves the app and all routes (including refresh on `/dashboard`) work.

---

### 11.3 GitHub Actions CI Pipeline

**File:** `.github/workflows/frontend-ci.yml` *(new)*

- [ ] **11.3a** Create the workflow file:
  ```yaml
  name: Frontend CI

  on:
    push:
      branches: [ main, feat/** ]
    pull_request:
      branches: [ main ]

  jobs:
    build-and-test:
      runs-on: ubuntu-latest
      defaults:
        run:
          working-directory: digital-frontend-application

      steps:
        - uses: actions/checkout@v4

        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: '18'
            cache: 'npm'
            cache-dependency-path: digital-frontend-application/package-lock.json

        - name: Install dependencies
          run: npm ci

        - name: Lint
          run: npm run lint

        - name: Build
          run: npm run build

        - name: Test
          run: npm test -- --run
  ```
  > Adjust `working-directory` if the workflow lives at the monorepo root.
- [ ] **11.3b** Verify the workflow passes on the current branch by pushing and checking GitHub Actions.

**Done when:** Every push runs lint + build + tests in CI. The pipeline fails if any step fails.

---

## SECTION 12 — Footer & Minor Stubs

### 12.1 Fix Footer Links

**File:** `src/layout/Footer.jsx`

- [ ] **12.1a** Either:
  - Add real `href` or `onClick` handlers to the Privacy, Terms, and Support buttons (if those pages/URLs exist), OR
  - Remove the buttons entirely if there is no content for them yet.
  Do not leave non-functional buttons in a UI that users will see.

**Done when:** Footer links either navigate somewhere real or are removed.

---

## SECTION 13 — Security Hardening

### 13.1 Move Access Token to In-Memory Only

**File:** `src/hooks/useAccount.js`

> This is the "ideal" approach for fintech SPAs. It means the token is lost on page refresh — handled by the
> refresh cookie. Only do this after confirming the refresh flow works correctly end-to-end.

- [ ] **13.1a** Change `useAccount.js` to store the `token` field in the module-level `_state` variable only (not in
  `sessionStorage`). All other profile fields (name, accountNumber, etc.) can remain in `sessionStorage` for
  UX convenience — they are not security-sensitive.
- [ ] **13.1b** On page load (app mount), if `sessionStorage` has profile data but no in-memory token, call
  `POST /api/auth/new-access-token` immediately to restore the token from the refresh cookie. Show a loading
  screen while this happens.
- [ ] **13.1c** Remove the `token` field from the `sessionStorage` serialisation in `setAccount()`.

**Done when:** Opening DevTools → Application → sessionStorage shows no JWT token. The app still works because
the refresh cookie restores it.

---

### 13.2 Rate Limit Feedback on Login Form

**File:** `src/pages/LoginPage.jsx`

- [ ] **13.2a** After a failed login attempt, disable the submit button for 3 seconds before allowing another
  submission. Show a countdown in the button label: "Try again in 3s…".

**Done when:** Rapid repeated login submissions are slowed down with visual feedback.

---

## SECTION 14 — Transaction Pagination

### 14.1 Add Pagination to Transaction History

**Files:** `src/hooks/useTransactionHistory.js`, `src/pages/TransactionHistoryPage.jsx`,
`src/api/transactionApi.js`

> **Dependency:** Requires backend to add `Pageable` support to `GET /api/transaction/transaction-history`.

- [ ] **14.1a** Update `getTransactionHistory()` in `transactionApi.js` to accept `page` and `size` query params.
- [ ] **14.1b** Update `useTransactionHistory.js` to track `currentPage` state and expose a `setPage()` function.
- [ ] **14.1c** In `TransactionHistoryPage.jsx`, add pagination controls (Previous / Next buttons + page info like
  "Page 2 of 10"). Disable Previous on page 1; disable Next on the last page.
- [ ] **14.1d** Add a status filter dropdown (All / SUCCESSFUL / PENDING / DECLINED) above the transaction list.
  Pass the filter to the API call or apply client-side if the backend doesn't support it.

**Done when:** The transaction history shows 10 (or configurable) items per page with working navigation.

---

## Summary Progress Tracker

Use this table to track overall progress at a glance. Update as items are completed.

| Section | Total Items | Done | Remaining | Notes |
|---------|-------------|------|-----------|-------|
| 1. BLOCKING Auth Fixes | 3 | 3 | 0 | ✅ useRegister→/login, PrivateRoute token-only, LoginPage success toast |
| 2. BLOCKING Missing Pages | 1 | 1 | 0 | ✅ NotFoundPage + catch-all route |
| 3. Core Features | 5 groups | 5 | 0 | ✅ Profile, Balance, Direction, Copy+Requery, Tier badge |
| 4. Admin Panel | 8 groups | 8 | 0 | ✅ AdminRoute, Dashboard, Customers, Detail, KYC Queue, Transactions, AuditLog, Register |
| 5. Password Reset | 2 groups | 2 | 0 | ✅ ForgotPasswordPage, ResetPasswordPage (backend pending) |
| 6. OTP Verification | 1 group | 1 | 0 | ✅ VerifyOtpPage built (backend pending) |
| 7. Business Routing | 1 group | 1 | 0 | ✅ BusinessDashboardPage + role-based routing in useLogin |
| 8. Accessibility | 4 items | 3 | 1 | ✅ Skip links, ARIA nav, focus management; ⚠️ contrast audit manual |
| 9. Performance | 3 items | 3 | 0 | ✅ React.lazy + Suspense, profile re-fetch, loading skeleton |
| 10. Testing | 7 items | 4 | 3 | ✅ Vitest setup, format tests, Button tests, Input tests; ⚠️ hook/page tests remaining |
| 11. Build & Deploy | 3 items | 3 | 0 | ✅ .env.example, Dockerfile+nginx.conf, GitHub Actions CI |
| 12. Footer Stubs | 1 item | 1 | 0 | ✅ Replaced buttons with real anchor links |
| 13. Security Hardening | 2 items | 0 | 2 | ⚠️ Token in-memory (deferred — requires refresh flow validation); Login rate limit (deferred) |
| 14. Pagination | 1 group | 1 | 0 | ✅ Client-side pagination on TransactionHistoryPage |

### Remaining Work (deferred / needs backend)

- **13.1** Move access token to in-memory — do after confirming refresh cookie flow end-to-end
- **13.2** Login rate-limit feedback — minor, add countdown after failed login
- **10.5** `useLogin` hook tests — needs `vi.mock` setup for authApi
- **10.6** Registration page integration test — needs router wrapper setup
- **10.7** PrivateRoute integration test — needs router wrapper setup
- **Backend dependencies**: Balance endpoint, outbound transactions, OTP, password reset, admin endpoints

---

*Last updated: 2026-08-17*
