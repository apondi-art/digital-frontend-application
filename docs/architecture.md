# Architecture

## Design Philosophy

The frontend mirrors the layered architecture of the Spring Boot backend. Each layer has one responsibility; nothing bleeds into another.

| Spring Boot Layer | React Equivalent |
|---|---|
| `@RestController` | `pages/` — thin, renders form + calls hook |
| `@Service` | `hooks/` — owns loading state, calls API, handles toasts |
| Repository / DAO | `api/` — Axios calls, nothing else |
| Entities / DTOs | Request objects built inline in hooks |
| `application.properties` | `constants/api.js` + `vite.config.js` |
| `@ControllerAdvice` | `api/client.js` Axios response interceptor |

---

## Folder Responsibilities

### `api/`
Pure HTTP — no React, no state. Each function takes a payload, calls Axios, and returns the unwrapped response body.

```
client.js         ← Axios instance + global error interceptor
accountApi.js     ← account-related endpoints
transactionApi.js ← transaction-related endpoints
```

Any new backend resource gets its own file here.

### `components/common/`
Stateless, presentational atoms. They accept props; they render JSX. No API calls, no side effects. All components support both light and dark mode via Tailwind `dark:` variants.

```
Button.jsx       → primary / outline / ghost variants, loading spinner
Input.jsx        → label, error, hint, forwarded ref (react-hook-form compatible)
Select.jsx       → styled dropdown with options array
Card.jsx         → surface container with border + shadow
Badge.jsx        → colour-coded transaction status pill
ThemeToggle.jsx  → sun/moon icon button, reads from ThemeContext
```

### `context/`
React context providers that wrap the entire app.

```
ThemeContext.jsx  ← theme state ("dark" | "light"), toggle fn, localStorage sync
```

The `ThemeProvider` is mounted at the top of `App.jsx` wrapping `BrowserRouter`. It applies or removes the `dark` class on `document.documentElement`, which activates Tailwind's `dark:` variant across every component.

### `hooks/`
One custom hook per user-facing feature. Each hook owns:
- `loading` boolean
- `result` state (what the backend returned)
- An async function that calls the API and shows a toast

Pages call these hooks — they never call `api/` directly.

### `layout/`
Two distinct shells depending on authentication state.

**Public shell** (`PublicLayout.jsx`):
```
Navbar.jsx       ← brand logo + Home link + theme toggle + Open Account CTA
PublicLayout.jsx ← composes Navbar + <Outlet /> + Footer
Footer.jsx       ← brand, Privacy/Terms/Support links, copyright
```

**Authenticated shell** (`AppLayout.jsx`):
```
Header.jsx    ← brand logo + account number display + theme toggle
Sidebar.jsx   ← NavLink navigation with active highlights
AppLayout.jsx ← composes Header + Sidebar + <Outlet /> + Footer
Footer.jsx    ← same component, light mode variant
```

`AppLayout` and `PublicLayout` use React Router's `<Outlet />` — the matched child page renders inside the main content area.

### `pages/`
One file per route. Pages are intentionally thin:
1. Call `useForm()` for field registration
2. Call the relevant custom hook
3. Render `<form>` using common components
4. Display the `result` from the hook

### `constants/`
Single source of truth for strings that appear in multiple places.

```
api.js    ← ENDPOINTS object — change base URL here, all calls update
routes.js ← ROUTES object — used in NavLink, navigate(), and <Route path>
```

### `utils/`
Pure functions, no React imports. Zero side effects.

```
formatNaira(amount)   → "₦5,000.00"
formatDate(iso)       → "18 Jul 2026, 10:30 AM"
statusMeta(status)    → { label, colour } for Badge rendering
```

---

## Routing

```
/                → LandingPage    ┐
/register        → RegisterPage   ├── wrapped by PublicLayout (Navbar + Footer)
                                  ┘
/dashboard  ┐
/transfer   ├── wrapped by AppLayout (Header + Sidebar + Footer)
/deposit    │
/requery    ┘
```

Both layout routes have no `path` — they act as wrapper-only routes. This is the nested routes pattern in React Router v6+.

---

## Dark / Light Mode

Theming is implemented with:

1. **Tailwind v4 `@custom-variant`** — `src/index.css` declares:
   ```css
   @custom-variant dark (&:where(.dark, .dark *));
   ```
   This enables the `dark:` prefix on every Tailwind utility class.

2. **`ThemeContext`** — `src/context/ThemeContext.jsx` provides:
   - `theme` — `"dark"` or `"light"`, initialised from `localStorage`
   - `toggleTheme()` — flips the value and adds/removes the `dark` class on `<html>`
   - Persists to `localStorage` key `db-theme`

3. **`ThemeToggle`** — `src/components/common/ThemeToggle.jsx` renders a sun icon in dark mode (click → light) and a moon icon in light mode (click → dark). Placed in both `Navbar` and `Header`.

4. **Component `dark:` classes** — every layout, page, and common component has paired `dark:` Tailwind classes. Default (light) styles target the white/gray palette; dark styles target the emerald-900/gray-800 palette.

| Surface | Light | Dark |
|---|---|---|
| Public page background | `bg-gray-50` | `bg-emerald-900` |
| Navbar / Footer | white + gray border | `emerald-900` + emerald border |
| Authenticated page background | `bg-gray-50` | `bg-emerald-950` |
| Sidebar | white + `gray-100` border | `emerald-950` + `emerald-800` border |
| Sidebar active link | `emerald-50` bg + `emerald-700` text | `emerald-800` bg + `emerald-300` text |
| Sidebar inactive hover | `gray-50` | `emerald-900` |
| Cards | white + `gray-100` border | `emerald-900` + `emerald-800` border |
| Inputs / Selects | white bg, `gray-300` border | `emerald-800` bg, `emerald-700` border |
| Input / Select text | `gray-900` | `emerald-50` |
| Form labels | `gray-700` | `emerald-300` |
| Info / helper banners | coloured `*-50` bg | `emerald-900` bg + `emerald-700` border |

The entire dark palette is emerald-based — from `emerald-950` (deepest backgrounds) up through `emerald-800` (cards, inputs) to `emerald-300/50` (text). No gray surfaces appear in dark mode.

---

## API Proxy (Development)

`vite.config.js` proxies `/api/*` to `http://localhost:8080`. This means:
- The frontend runs at `http://localhost:3000`
- Calls to `/api/create-personal-account` are forwarded to `http://localhost:8080/api/create-personal-account`
- No CORS headers needed during development

In production, configure your web server (Nginx, etc.) to handle this proxy.

---

## State Management

No Redux or Zustand. State lives in hooks and context:

| Store | Where | What |
|---|---|---|
| Theme | `ThemeContext` | `"dark"` \| `"light"`, synced to localStorage |
| Account | `useAccount` hook | `accountNumber` + `accountId` in module-level memory |
| Form state | `react-hook-form` | Local to each page component |
| Request state | Feature hooks | `loading` + `result`, local to each hook |

The backend is stateless — the frontend holds minimal transient state to match.
