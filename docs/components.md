# Component Reference

All reusable components live in `src/components/common/`. They are stateless — they accept props and return JSX. No API calls, no side effects. Every component supports both light and dark mode via Tailwind `dark:` variants.

---

## Button

**File:** `src/components/common/Button.jsx`

A single button component covering all use cases through the `variant` prop.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary" \| "outline" \| "ghost"` | `"primary"` | Visual style |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `disabled` | `boolean` | `false` | Disables button |
| `className` | `string` | `""` | Extra Tailwind classes |
| `...rest` | `ButtonHTMLAttributes` | — | Forwarded to `<button>` |

### Variants

| Variant | Light | Dark | When to use |
|---|---|---|---|
| `primary` | emerald-600 bg, white text | emerald-500 bg, white text | Main form submit actions |
| `outline` | emerald-600 border + text | emerald-400 border + text | Secondary actions alongside a primary |
| `ghost` | emerald-700 text | emerald-400 text | Inline/navigation actions |

### Examples

```jsx
// Submit button with loading state
<Button type="submit" loading={isSubmitting}>Create Account</Button>

// Secondary action
<Button variant="outline" onClick={onCancel}>Cancel</Button>

// Navigation link styled as ghost
<Button variant="ghost">Back</Button>
```

---

## Input

**File:** `src/components/common/Input.jsx`

Labelled text input with error and hint message slots. Uses `forwardRef` so it works directly with `react-hook-form`'s `register()`.

### Props

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Text label above the field |
| `error` | `string` | Red error message below field |
| `hint` | `string` | Grey helper text (hidden when error is shown) |
| `required` | `boolean` | Appends red `*` to label |
| `...rest` | `InputHTMLAttributes` | `type`, `placeholder`, `min`, etc. |

### Dark Mode

| Element | Light | Dark |
|---|---|---|
| Background | white | `emerald-800` |
| Text | `gray-900` | `emerald-50` |
| Border | `gray-300` | `emerald-700` |
| Label | `gray-700` | `emerald-300` |
| Hint text | `gray-400` | `emerald-600` |

### Example

```jsx
<Input
  label="Phone Number"
  placeholder="08012345678"
  required
  hint="Nigerian format: 0[7|8|9]XXXXXXXXX"
  error={errors.phoneNumber?.message}
  {...register('phoneNumber', {
    required: 'Phone number is required',
    pattern: { value: /^0[789][01]\d{8}$/, message: 'Invalid format' },
  })}
/>
```

---

## Select

**File:** `src/components/common/Select.jsx`

Styled `<select>` element. Same label/error/hint structure as `Input`. Also uses `forwardRef`.

### Props

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Text label above the field |
| `options` | `Array<{ value: string, label: string }>` | Dropdown options |
| `error` | `string` | Red error message |
| `required` | `boolean` | Appends `*` to label |

### Example

```jsx
<Select
  label="Gender"
  required
  error={errors.gender?.message}
  options={[
    { value: 'MALE',   label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ]}
  {...register('gender', { required: 'Gender is required' })}
/>
```

---

## Card

**File:** `src/components/common/Card.jsx`

Surface container with a border and shadow. Used as the background for every form and result panel. Adapts to dark mode automatically.

| Mode | Background | Border |
|---|---|---|
| Light | white | `gray-100` |
| Dark | `emerald-900` | `emerald-800` |

### Props

| Prop | Type | Description |
|---|---|---|
| `className` | `string` | Extra Tailwind classes (e.g. override background) |
| `children` | `ReactNode` | Card content |

### Example

```jsx
<Card>
  <form>...</form>
</Card>

{/* Override background for account number display */}
<Card className="bg-emerald-700 border-emerald-600">
  <p className="text-white font-mono text-2xl">{accountNumber}</p>
</Card>
```

---

## Badge

**File:** `src/components/common/Badge.jsx`

Colour-coded label that maps a `TransactionStatus` string to a readable label and colour class.

### Props

| Prop | Type | Description |
|---|---|---|
| `status` | `"SUCCESSFUL" \| "PENDING" \| "DECLINED"` | Backend transaction status |

### Status → Colour Mapping

| Status | Label | Colour |
|---|---|---|
| `SUCCESSFUL` | Successful | Emerald (green) |
| `PENDING` | Pending | Yellow/amber |
| `DECLINED` | Declined | Red |

The mapping is defined in `src/utils/format.js → statusMeta()` — update it there to affect every Badge in the app.

### Example

```jsx
<Badge status={result.status} />
// → renders a green "Successful" label
```

---

## ThemeToggle

**File:** `src/components/common/ThemeToggle.jsx`

A sun/moon icon button that reads from `ThemeContext` and calls `toggleTheme()` on click.

- **Dark mode** — shows a sun icon (click to switch to light)
- **Light mode** — shows a moon icon (click to switch to dark)

The active theme is persisted to `localStorage` under `db-theme`.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | `""` | Extra Tailwind classes |

### Placement

| Layout | Location |
|---|---|
| `Navbar` (public pages) | Between the Home link and the Open Account button |
| `Header` (authenticated pages) | Right side, next to the account number |

### Example

```jsx
import ThemeToggle from '../components/common/ThemeToggle'

// inside a nav bar
<ThemeToggle />
```

---

## Layout Components

### Navbar (`src/layout/Navbar.jsx`)

Top bar for public pages (Landing, Register). Contains:
- Brand logo + "DigitalBank" text
- Home link
- `ThemeToggle`
- "Open Account" CTA button

No props — reads `ROUTES` internally.

| Mode | Background | Brand text | Border |
|---|---|---|---|
| Light | white | `gray-900` | `gray-200` |
| Dark | `emerald-900` | white | `emerald-700` |

### Header (`src/layout/Header.jsx`)

Top bar for authenticated pages. Contains:
- Brand logo + "DigitalBank" text
- Account number display (when set)
- `ThemeToggle`

Always uses `emerald-800` background regardless of theme — it functions as a persistent brand colour.

| Prop | Type | Description |
|---|---|---|
| `accountNumber` | `string \| null` | Shown in top-right when set |

### Footer (`src/layout/Footer.jsx`)

Shared footer rendered by both `PublicLayout` and `AppLayout`. Contains:
- Brand logo + name
- Privacy, Terms, Support links
- Copyright line

No props — adapts to the current theme via `dark:` Tailwind classes.

### Sidebar (`src/layout/Sidebar.jsx`)

Left navigation for authenticated pages. `NavLink` with active link highlighting.

| Mode | Background | Active link | Inactive hover |
|---|---|---|---|
| Light | white | `emerald-50` bg + `emerald-700` text | `gray-50` |
| Dark | `emerald-950` | `emerald-800` bg + `emerald-300` text | `emerald-900` |

No props — reads `ROUTES` internally.

### PublicLayout (`src/layout/PublicLayout.jsx`)

Shell for public routes. Renders `Navbar → <Outlet /> → Footer`.

| Mode | Page background |
|---|---|
| Light | `gray-50` |
| Dark | `emerald-900` |

### AppLayout (`src/layout/AppLayout.jsx`)

Shell for authenticated routes. Reads `accountNumber` from `useAccount` and passes it to `Header`. Renders `Header → (Sidebar + <Outlet />) → Footer`.

| Mode | Page background |
|---|---|
| Light | `gray-50` |
| Dark | `emerald-950` |
