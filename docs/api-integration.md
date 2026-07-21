# API Integration

All HTTP calls go through `src/api/client.js` — an Axios instance that automatically shows a toast on error responses.

Backend base URL (dev): `http://localhost:8080`
Proxied via Vite as: `/api`

> No API changes were made as part of the navbar/footer or dark-mode additions. This document covers the full backend contract.

Every backend response is wrapped in:
```json
{
  "data": { ... },
  "message": "Human-readable result",
  "statusCode": "201 CREATED"
}
```

---

## Account Endpoints

### Create Personal Account

| | |
|---|---|
| **File** | `src/api/accountApi.js` |
| **Hook** | `src/hooks/useRegister.js` |
| **Page** | `src/pages/RegisterPage.jsx` |
| **Method** | `POST` |
| **Path** | `/api/create-personal-account` |

**Request body:**
```json
{
  "firstName":   "Ada",
  "lastName":    "Okonkwo",
  "email":       "ada@example.com",
  "password":    "secret123",
  "phoneNumber": "08012345678",
  "gender":      "FEMALE",
  "dateOfBirth": "1995-06-15",
  "address":     "123 Allen Avenue, Lagos",
  "nin":         "12345678901",
  "bvn":         "12345678901"
}
```

**Validation rules (enforced by backend + frontend form):**
- `phoneNumber` — Nigerian format: `0[7|8|9][0|1]XXXXXXXX`
- `dateOfBirth` — customer must be 18+ years old
- `email` and `phoneNumber` — must be unique in the system
- `nin` and `bvn` — optional but unique if provided

**Success response (201):**
```json
{
  "data": { "accountNumber": "2026847291" },
  "message": "Account Creation Successful",
  "statusCode": "201 CREATED"
}
```

**Error responses:**
- `400` — duplicate email/phone, underage, invalid phone format
- `400` — any required field missing

**Frontend flow:**
1. `RegisterPage` submits form → calls `useRegister.register(formData)`
2. Hook calls `createPersonalAccount(payload)` from `accountApi.js`
3. On success: stores `accountNumber` in `useAccount`, navigates to `/dashboard`
4. On error: Axios interceptor shows toast automatically

---

## Transaction Endpoints

### Transfer Funds

| | |
|---|---|
| **File** | `src/api/transactionApi.js` |
| **Hook** | `src/hooks/useTransfer.js` |
| **Page** | `src/pages/TransferPage.jsx` |
| **Method** | `POST` |
| **Path** | `/api/transaction/transfer` |

**Request body:**
```json
{
  "accountId":          "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "amount":             5000.00,
  "destinationAccount": "2026847291",
  "description":        "School fees payment"
}
```

> `accountId` is the UUID of the **source** account. The backend does not return this UUID on account creation yet — the user must supply it manually.

**Success response (201):**
```json
{
  "data": { "status": "SUCCESSFUL" },
  "message": "Transaction successful",
  "statusCode": "201 CREATED"
}
```

**Error responses:**
- `400` — insufficient balance
- `404` — source or destination account not found

---

### Deposit Funds (Card)

| | |
|---|---|
| **File** | `src/api/transactionApi.js` |
| **Hook** | `src/hooks/useDeposit.js` |
| **Page** | `src/pages/DepositPage.jsx` |
| **Method** | `POST` |
| **Path** | `/api/transaction/deposit` |

**Request body:**
```json
{
  "accountId":     "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "cardNumber":    "7893234572819472",
  "cardName":      "SOLOMON GRUNDY",
  "dateOfExpiry":  "2029-01",
  "cvc":           324,
  "depositAmount": 5000.00,
  "description":   "Wallet top-up"
}
```

**Test cards available in backend (in-memory mock):**

| Card Number | Name | Expiry | CVC | Outcome |
|---|---|---|---|---|
| `7893234572819472` | SOLOMON GRUNDY | `2029-01` | `324` | SUCCESSFUL (201) |
| `1234567893824913` | CHIOMA PRECIOUS | `2027-08` | `372` | PENDING (202) |

**Success response (201 — immediate):**
```json
{
  "data": { "status": "SUCCESSFUL" },
  "message": "Deposit Successful",
  "statusCode": "201 CREATED"
}
```

**Pending response (202 — requires requery):**
```json
{
  "data": { "status": "PENDING" },
  "message": "Deposit Pending",
  "statusCode": "202 ACCEPTED"
}
```

**Error responses:**
- `400` — deposit amount below ₦100 minimum
- `400` — card details do not match stored record
- `404` — account or card not found

**Frontend flow for PENDING:**
When `result.status === "PENDING"`, the deposit page prompts the user to copy their Transaction ID and use the Re-query page to resolve it.

---

### Re-query Transaction

| | |
|---|---|
| **File** | `src/api/transactionApi.js` |
| **Hook** | `src/hooks/useRequery.js` |
| **Page** | `src/pages/RequeryPage.jsx` |
| **Method** | `PUT` |
| **Path** | `/api/transaction/requery/{transaction-id}` |

**Path parameter:** UUID of the pending transaction.

**Request body:** none

**Response (201):**
```json
{
  "data": { "status": "SUCCESSFUL" },
  "message": "Transaction Successful",
  "statusCode": "201 CREATED"
}
```
or:
```json
{
  "data": { "status": "DECLINED" },
  "message": "Transaction Failed",
  "statusCode": "201 CREATED"
}
```

**Business rules:**
- Transaction must exist and have status `PENDING`
- The backend randomly resolves to `SUCCESSFUL` or `DECLINED` (payment reconciliation simulation)
- If `SUCCESSFUL` — funds are credited and ledger entries marked SETTLED
- If `DECLINED` — ledger entries marked VOID, no credit

**Error responses:**
- `400` — transaction is not in PENDING status
- `404` — transaction ID not found

---

## Error Handling

The Axios interceptor in `src/api/client.js` catches all non-2xx responses:

```js
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message ?? 'Something went wrong'
    toast.error(msg)
    return Promise.reject(err)
  }
)
```

This means:
- Pages and hooks do **not** need their own try/catch for display purposes
- The `finally` block in each hook always clears `loading`
- The error message shown in the toast comes directly from the backend's `ErrorResponse.message`
