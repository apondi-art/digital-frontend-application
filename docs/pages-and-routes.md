# Pages & Routes

## Route Map

```
/                 → LandingPage    ┐
/register         → RegisterPage   ├── PublicLayout (Navbar + Footer)
                                   ┘
/dashboard        → DashboardPage  ┐
/transfer         → TransferPage   ├── AppLayout (Header + Sidebar + Footer)
/deposit          → DepositPage    │
/requery          → RequeryPage    ┘
```

Routes are declared in `src/App.jsx`. The constant strings live in `src/constants/routes.js` — update them there if paths change.

---

## LandingPage

**File:** `src/pages/LandingPage.jsx`
**Route:** `/`
**Layout:** `PublicLayout`
**Access:** Public

A full marketing page structured in five sections:

| Section | Content |
|---|---|
| **Hero** | Headline, subtext, CTA button, trust badges, phone mockup SVG |
| **Stats bar** | 2 min · Instant · 100% Online · Tier 1 |
| **Features** | Four cards with inline SVG illustrations (Transfers, Card Deposits, Tracking, Security) |
| **How it works** | Three numbered steps + account card SVG mockup |
| **CTA** | Final call-to-action with link to `/register` |

All illustrations are inline SVGs — no external image dependencies.

No API calls. No form. Purely presentational.

### Dark / Light

| Element | Light | Dark |
|---|---|---|
| Feature cards | `gray-100` bg | `emerald-800` bg |
| Stats bar | `gray-100` bg | `emerald-800` bg |
| How it works | `gray-100` bg | `emerald-800` bg |
| Headings | `gray-900` | white |
| Body text | `gray-600` | `emerald-300` |
| Trust badges | `gray-100` bg | `emerald-800` bg |

---

## RegisterPage

**File:** `src/pages/RegisterPage.jsx`
**Route:** `/register`
**Layout:** `PublicLayout`
**Access:** Public
**Hook:** `useRegister`
**API:** `POST /api/create-personal-account`

Two-column registration form covering all fields in `CustomerRegistrationRequest`:

| Field | Type | Validation |
|---|---|---|
| First Name | text | Required |
| Last Name | text | Required |
| Email | email | Required |
| Phone Number | text | Required, Nigerian format `0[7\|8\|9][0\|1]XXXXXXXX` |
| Password | password | Required, min 6 chars |
| Gender | select | Required (`MALE` / `FEMALE`) |
| Date of Birth | date | Required (backend enforces 18+) |
| Address | text | Required |
| NIN | text | Optional |
| BVN | text | Optional |

**On success:** Account number stored in `useAccount` hook, user navigated to `/dashboard`.

**On failure:** Axios interceptor displays the backend error message as a toast.

### Dark / Light

The page background is inherited from `PublicLayout` (`gray-50` light / `emerald-900` dark). The Card renders as `emerald-900` bg + `emerald-800` border. Inputs and Selects use `emerald-800` bg + `emerald-700` border. All surfaces stay within the emerald palette — no gray appears in dark mode. Page heading uses `gray-900 / dark:text-white` and the subtitle uses `gray-500 / dark:text-emerald-300`.

---

## DashboardPage

**File:** `src/pages/DashboardPage.jsx`
**Route:** `/dashboard`
**Layout:** `AppLayout`
**Access:** Authenticated shell
**Hook:** `useAccount`

Overview screen shown immediately after registration. Contains:
- Account card displaying the account number (always emerald-700/800)
- Three quick-action cards: Transfer, Deposit, Re-query
- A notice that auth is not yet enabled (matches backend state)

No form, no API calls. Reads `accountNumber` from the `useAccount` hook.

### Dark / Light

| Element | Light | Dark |
|---|---|---|
| Heading | `gray-900` | `gray-100` |
| Subtext | `gray-500` | `gray-400` |
| Action icon boxes | coloured `*-50` bg | `emerald-800` bg + `emerald-300` text |
| Notice banner | `amber-50` bg + `amber-700` text | `emerald-900` bg + `emerald-400` text |

---

## TransferPage

**File:** `src/pages/TransferPage.jsx`
**Route:** `/transfer`
**Layout:** `AppLayout`
**Access:** Authenticated shell
**Hook:** `useTransfer`
**API:** `POST /api/transaction/transfer`

Form fields:

| Field | Maps to backend field | Notes |
|---|---|---|
| Your Account ID | `accountId` | UUID of the source account |
| Destination Account Number | `destinationAccount` | 10-digit account number |
| Amount (₦) | `amount` | Minimum ₦1, parsed as float |
| Description | `description` | Narration / memo |

After submission, a result card appears showing a `Badge` with the transaction status.

> **Note:** The backend does not return the account UUID on registration (`POST /api/create-personal-account` only returns the account number). Until that is added, users must enter their UUID manually. This is a known limitation documented on the form as a hint.

---

## DepositPage

**File:** `src/pages/DepositPage.jsx`
**Route:** `/deposit`
**Layout:** `AppLayout`
**Access:** Authenticated shell
**Hook:** `useDeposit`
**API:** `POST /api/transaction/deposit`

Card deposit form. Fields:

| Field | Maps to backend field | Notes |
|---|---|---|
| Account ID | `accountId` | UUID of the destination account |
| Card Number | `cardNumber` | 16-digit string |
| Name on Card | `cardName` | Must match stored card record |
| Expiry | `dateOfExpiry` | `YYYY-MM` format |
| CVC | `cvc` | 3 digits, parsed as integer |
| Deposit Amount | `depositAmount` | Minimum ₦100 |
| Description | `description` | |

A helper panel shows the two test cards available in the backend's in-memory mock. The panel uses `emerald-50` in light and `emerald-900` bg + `emerald-700` border in dark, staying fully within the emerald palette.

**Two response paths:**
- **SUCCESSFUL (201):** Funds credited immediately. Green Badge displayed.
- **PENDING (202):** Funds held. Amber Badge + guidance to use Re-query page.

---

## RequeryPage

**File:** `src/pages/RequeryPage.jsx`
**Route:** `/requery`
**Layout:** `AppLayout`
**Access:** Authenticated shell
**Hook:** `useRequery`
**API:** `PUT /api/transaction/requery/{transaction-id}`

Single-field form: the UUID of a pending transaction.

The backend randomly resolves PENDING transactions to either:
- `SUCCESSFUL` — funds credited, green badge shown
- `DECLINED` — no credit, red badge shown

This simulates payment gateway reconciliation (e.g. verifying with card networks after a timeout).

---

## Page Anatomy (Pattern)

Every authenticated page follows the same structure:

```jsx
export default function FeaturePage() {
  // 1. Pull in the feature hook
  const { action, loading, result } = useFeature()

  // 2. Initialise form
  const { register, handleSubmit, formState: { errors } } = useForm()

  // 3. Build submit handler — transforms form values to API shape
  async function onSubmit(data) {
    await action({ ...transformedPayload })
  }

  return (
    <div className="max-w-lg">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">...</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">...</p>

      {/* Form inside a Card */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register('field')} ... />
          <Button type="submit" loading={loading}>Submit</Button>
        </form>
      </Card>

      {/* Result — only shown after a response */}
      {result && (
        <Card className="mt-4">
          <Badge status={result.status} />
        </Card>
      )}
    </div>
  )
}
```

This pattern keeps pages consistent and easy to extend with new features.
