# DigitalBank — Frontend Application

> React 19 + Vite 8 + Tailwind CSS v4 frontend for the NAIJUG Bootcamp Final Project (Group A).
> Fully integrated with the Spring Boot backend at `http://localhost:8080`.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [What Has Been Built](#what-has-been-built)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [How to Test the Full Stack](#how-to-test-the-full-stack)
- [API Coverage](#api-coverage)
- [Design System](#design-system)
- [Known Limitations](#known-limitations)

---

## Overview

DigitalBank is a Nigerian personal banking web application. It allows customers to open a bank account, deposit funds via debit card, transfer money to other accounts, and re-query pending transactions — all connected to the Spring Boot REST API backend.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Notifications | React Hot Toast |
| Theme | Custom dark/light mode (emerald palette) |

---

## What Has Been Built

### Pages

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Marketing page — hero, features, how it works, test cards, CTA |
| Register | `/register` | Account creation form wired to `POST /api/create-personal-account` |
| Dashboard | `/dashboard` | Account number card + quick-action links |
| Transfer | `/transfer` | Fund transfer form wired to `POST /api/transaction/transfer` |
| Deposit | `/deposit` | Card deposit form wired to `POST /api/transaction/deposit` |
| Re-query | `/requery` | Transaction re-query wired to `PUT /api/transaction/requery/{id}` |

### Layout & Navigation

- **PublicLayout** — Navbar + Footer for Landing and Register pages
- **AppLayout** — Header + Sidebar + Footer for all authenticated pages
- **Navbar** — Logo, Home and Register links, dark/light mode toggle
- **Header** — Displays account number, dark/light mode toggle
- **Sidebar** — Navigation links with active-state highlighting (Dashboard, Transfer, Deposit, Re-query)
- **Footer** — Brand, Privacy/Terms/Support links, copyright year

### Theme System

- Dark and light mode toggle with `localStorage` persistence (remembers preference across sessions)
- FOUC (flash of unstyled content) prevented by a blocking inline script in `index.html`
- Dark palette: `emerald-950` page background → `emerald-900` cards → `emerald-800` inputs → `emerald-300` text
- Light palette: white cards, `gray-50` page background, standard gray text hierarchy
- Tailwind v4 custom dark variant: `@custom-variant dark (&:where(.dark, .dark *))`

### Common Components

| Component | Purpose |
|---|---|
| `Button` | Primary action button with loading spinner state |
| `Input` | Labelled text input with hint, error, aria attributes, dark mode |
| `Select` | Dropdown with same pattern as Input |
| `Card` | White/dark surface with border and shadow |
| `Badge` | Coloured status chip — SUCCESSFUL (green), PENDING (yellow), DECLINED (red) |
| `ThemeToggle` | Sun/moon icon button — WCAG-compliant contrast in both modes |
| `PrivateRoute` | Redirects unauthenticated users to `/` |

### State Management

- `useAccount` — module-level pub/sub store shared across all components; account data persisted to `sessionStorage` so page refreshes keep the user logged in; clears automatically when the browser tab closes
- `setAccount` / `clearAccount` — exported functions to update or clear the account store from any hook

### Hooks

| Hook | Endpoint | Returns |
|---|---|---|
| `useRegister` | `POST /api/create-personal-account` | `{ register, loading }` |
| `useTransfer` | `POST /api/transaction/transfer` | `{ transfer, loading, result, error }` |
| `useDeposit` | `POST /api/transaction/deposit` | `{ deposit, loading, result, error }` |
| `useRequery` | `PUT /api/transaction/requery/{id}` | `{ requery, loading, result, error }` |

All hooks return a boolean (`true` = success, `false` = failure) so the calling page can reset the form only on success.

### API Layer

- `src/api/client.js` — Axios instance with `baseURL` from `VITE_API_BASE_URL`, 15-second timeout, and a response interceptor that automatically shows an error toast from `err.response.data.message`
- `src/api/accountApi.js` — `createPersonalAccount(payload)`
- `src/api/transactionApi.js` — `transferFunds(payload)`, `depositFunds(payload)`, `requeryTransaction(txId)`
- `src/constants/api.js` — all endpoint paths in one place

### Form Validation (Client-side)

| Field | Rule |
|---|---|
| First / Last Name | Required |
| Email | Required, valid format |
| Phone Number | Required, Nigerian format `0[7\|8\|9]XXXXXXXXX` |
| Password | Required, min 8 chars, must contain uppercase and number |
| Gender | Required, MALE or FEMALE |
| Date of Birth | Required, must be 18+ years old |
| Address | Required |
| NIN (optional) | 11 digits if provided |
| BVN (optional) | 11 digits if provided |
| Card Number | Required, exactly 16 digits |
| Expiry | Required, YYYY-MM format |
| CVC | Required, exactly 3 digits |
| Amount | Required, minimum ₦1 (transfer) / ₦100 (deposit) |

---

## Project Structure

```
src/
├── api/
│   ├── client.js            Axios instance + response interceptor
│   ├── accountApi.js        createPersonalAccount()
│   └── transactionApi.js    transferFunds(), depositFunds(), requeryTransaction()
├── components/
│   └── common/
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       ├── PrivateRoute.jsx
│       ├── Select.jsx
│       └── ThemeToggle.jsx
├── constants/
│   ├── api.js               All backend endpoint paths
│   └── routes.js            All frontend route paths
├── context/
│   └── ThemeContext.jsx      Dark/light mode context + useTheme hook
├── hooks/
│   ├── useAccount.js        Global account state (sessionStorage backed)
│   ├── useDeposit.js
│   ├── useRegister.js
│   ├── useRequery.js
│   └── useTransfer.js
├── layout/
│   ├── AppLayout.jsx        Header + Sidebar + Footer shell
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Navbar.jsx
│   ├── PublicLayout.jsx     Navbar + Footer shell
│   └── Sidebar.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── DepositPage.jsx
│   ├── LandingPage.jsx
│   ├── RegisterPage.jsx
│   ├── RequeryPage.jsx
│   └── TransferPage.jsx
├── utils/
│   └── format.js            formatCurrency(), formatDate(), statusMeta (badge colours)
├── App.jsx                  Route tree — PublicLayout + PrivateRoute + AppLayout
└── index.css                Tailwind v4 directives + dark mode custom variant
```

---

## Prerequisites

- **Node.js 18+**
- **npm 9+**
- Backend running on `http://localhost:8080` (see backend README)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the project root (already present):

```env
VITE_API_BASE_URL=http://localhost:8080
```

Change this value to point to a different backend (staging, production).

---

## How to Test the Full Stack

Follow these steps in order to run the complete application end-to-end.

### Step 1 — Start the database

In the backend directory:

```bash
cd ../digital-backend-application
docker-compose up -d
```

Verify containers are running:
```bash
docker ps
# Should show: digital-backend-application_db_1 (port 5433) and _adminer_1 (port 8082)
```

### Step 2 — Start the backend

```bash
cd ../digital-backend-application
mvn spring-boot:run
```

Wait for: `Started DigitalBackendApplication in X seconds`

The backend is ready at `http://localhost:8080`. Tables are auto-created on first run.

> **Note:** If port 8080 is already in use, kill the existing process first:
> ```bash
> kill $(lsof -ti :8080)
> ```

### Step 3 — Start the frontend

```bash
cd ../digital-frontend-application
npm run dev
```

Open `http://localhost:5173` in the browser.

---

### Test Scenario 1 — Register a New Account

1. Open `http://localhost:5173`
2. Click **Open Your Account** or navigate to `/register`
3. Fill in all required fields:
   - Use a Nigerian phone number: `08012345678`
   - Password must be 8+ chars with an uppercase letter and a number: e.g. `Password1`
   - Date of birth must be 18+ years ago
   - NIN and BVN are optional — leave blank or enter 11 digits
4. Click **Create Account**
5. On success: you are redirected to the Dashboard and your account number is displayed on the green card

> If you see a duplicate error, either use a different email/phone or clear the database:
> ```bash
> docker exec -it digital-backend-application_db_1 \
>   psql -U dbadmin -d digitalbank \
>   -c "DELETE FROM ledger_entry; DELETE FROM transactions; DELETE FROM accounts; DELETE FROM customers; DELETE FROM users;"
> ```

---

### Test Scenario 2 — Deposit Funds (Immediate)

1. From the Dashboard, click **Fund Account** or navigate to `/deposit`
2. Enter your **Account ID (UUID)** — find this in Adminer (`http://localhost:8082`)
   - Server: `db`, User: `dbadmin`, Password: `dbpass123`, Database: `digitalbank`
   - Look in the `accounts` table for the `id` column
3. Use the **SUCCESSFUL test card**:
   - Card Number: `7893234572819472`
   - Name on Card: `SOLOMON GRUNDY`
   - Expiry: `2029-01`
   - CVC: `324`
4. Enter an amount (minimum ₦100) and a description
5. Click **Deposit Funds**
6. Result card shows **SUCCESSFUL** badge

---

### Test Scenario 3 — Deposit Funds (Pending → Re-query)

1. Repeat the deposit flow using the **PENDING test card**:
   - Card Number: `1234567893824913`
   - Name on Card: `CHIOMA PRECIOUS`
   - Expiry: `2027-08`
   - CVC: `372`
2. Result card shows **PENDING** badge
3. Copy the transaction ID from Adminer (`transactions` table, `id` column)
4. Navigate to **Re-query** (`/requery`)
5. Paste the transaction ID and click **Re-query Transaction**
6. Result resolves randomly to **SUCCESSFUL** or **DECLINED**

---

### Test Scenario 4 — Transfer Funds

> Requires two accounts. Register a second account with a different email and phone number first.

1. Navigate to **Transfer** (`/transfer`)
2. Enter your **Account ID (UUID)** from the `accounts` table in Adminer
3. Enter the **destination account number** (the `account_number` from the second account)
4. Enter an amount and description
5. Click **Send Transfer**
6. Result shows **SUCCESSFUL** badge if balance was sufficient

---

### Test Scenario 5 — Page Refresh (Session Persistence)

1. After registering, note your account number on the Dashboard
2. Refresh the page (`F5`)
3. You remain on the Dashboard with your account number visible
4. Account data is stored in `sessionStorage` — it persists until you close the browser tab

---

### Accessing Adminer (Database UI)

- URL: `http://localhost:8082`
- System: `PostgreSQL`
- Server: `db`
- Username: `dbadmin`
- Password: `dbpass123`
- Database: `digitalbank`

Useful tables: `users`, `customers`, `accounts`, `transactions`, `ledger_entry`

---

## API Coverage

All 4 backend endpoints are fully wired:

| Method | Endpoint | Frontend Page | Hook |
|---|---|---|---|
| POST | `/api/create-personal-account` | Register | `useRegister` |
| POST | `/api/transaction/transfer` | Transfer | `useTransfer` |
| POST | `/api/transaction/deposit` | Deposit | `useDeposit` |
| PUT | `/api/transaction/requery/{id}` | Re-query | `useRequery` |

---

## Design System

- **No border radius** — all elements use sharp corners throughout
- **Emerald palette** — `emerald-400/500/600` for brand, `emerald-950/900/800` for dark surfaces
- **Dark mode** — fully supported; toggle persists via `localStorage`
- **Typography** — `font-mono` for account numbers and card numbers; standard sans-serif elsewhere
- **Toasts** — top-right, 4-second duration; errors from backend message field; success from hook

---

## Known Limitations

1. **Account ID must be looked up manually** — The registration response only returns `accountNumber`, not the `accountId` UUID. The Transfer and Deposit forms require the UUID, which must be copied from Adminer until the backend is updated to return it.
2. **No balance display** — There is no balance enquiry endpoint on the backend yet.
3. **No login page** — Authentication is not yet implemented on the backend. Account data is held in `sessionStorage` for the duration of the tab session.
4. **No transaction history** — No list endpoint exists on the backend yet.
