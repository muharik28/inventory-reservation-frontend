# 🗂️ Issue: React + Vite Inventory Reservation Dashboard

## Overview

Build a minimal but functional frontend dashboard that integrates with an existing Gin REST API. The app allows users to track live inventory, make reservations, watch a countdown timer, and confirm or cancel purchases — all without touching the developer tools.

---

## Tech Stack

Refer to `README.md` for full details. Summary:

- **React 18 + TypeScript** — component model and type safety
- **Vite** — dev server and build tool
- **Tailwind CSS** — utility-first styling
- **No external state library required** — React `useState` / `useEffect` is sufficient

---

## Project Initialization

Initialize the project in the current directory using Vite's React + TypeScript template:

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Set up Tailwind in `src/index.css` and configure `tailwind.config.ts` to scan `./src/**/*.{ts,tsx}`.

---

## API Reference

Base URL: `http://localhost:8080/api/v1/inventory`

All requests use `Content-Type: application/json` and `Accept: application/json`.

### 1. Get Stock
```
GET /stock?item_id={item_id}
```
Response: `{ item_id, total_stock, reserved_stock, available_stock }`

### 2. Reserve
```
POST /reserve
Body: { item_id, quantity, user_id }
```
Response: `{ status, reservation_id, item_id, quantity, expires_at }`

### 3. Confirm
```
POST /confirm
Body: { reservation_id }
```
Response: `{ status, reservation_id, confirmed_at }`

---

## Feature Breakdown

### 1. Live Inventory Panel
- Fetch and display `total_stock`, `reserved_stock`, and `available_stock` for a fixed `item_id`.
- Provide a **Refresh** button to re-fetch manually.
- Optionally poll every N seconds.

### 2. Reservation Form
- Input fields: **User ID** and **Quantity**.
- `item_id` can be hardcoded or shown as a read-only field.
- On submit: call `POST /reserve`, then display the result.
- Disable the submit button while the request is in-flight.
- Refresh stock automatically after a successful reservation.

### 3. Reservation Result + Countdown
- After a successful reservation, display:
  - `reservation_id`
  - `quantity`
  - `expires_at` (formatted)
  - **Live countdown** (mm:ss) computed from `expires_at` using a `setInterval`.
- When the countdown reaches zero, mark the reservation as expired and disable the Confirm button.

### 4. Confirm Purchase
- Show a **Confirm** button while the reservation is active (not expired).
- On click: call `POST /confirm` with the current `reservation_id`.
- Display success or error feedback inline.
- Disable the button while the request is in-flight or after confirmed/expired.
- Refresh stock after successful confirmation.

---

## UI States to Handle

| State | Behavior |
|---|---|
| Loading | Show spinner or disabled state on button |
| Empty / No reservation | Show placeholder text |
| Validation error | Show inline message before API call |
| API error | Show error message returned by backend |
| Insufficient stock | Show specific error from reserve response |
| Expired reservation | Disable confirm, show "Reservation expired" label |
| Confirmed | Show success message with `confirmed_at` |

---

## Project Structure

Follow the structure defined in `README.md`. Key files:

```
src/
├── components/
│   ├── StockPanel.tsx       # Displays live inventory stats + refresh
│   ├── ReservationForm.tsx  # Form for user_id + quantity
│   ├── ReservationCard.tsx  # Shows result, countdown, confirm button
│   └── StatusMessage.tsx    # Reusable success/error/info message
├── services/
│   └── api.ts               # All fetch calls to the backend (typed)
├── types/
│   └── index.ts             # Shared TypeScript interfaces
├── App.tsx                  # Composes all components, owns shared state
└── main.tsx                 # Entry point
```

---

## Acceptance Criteria

- [ ] Reviewer can open the app, see live stock numbers, and refresh them.
- [ ] Reviewer can fill in User ID + quantity and successfully reserve stock.
- [ ] Countdown is visible and ticks down in real time after reservation.
- [ ] Reviewer can click **Confirm** before expiry and see a success state.
- [ ] Backend errors (e.g., insufficient stock, invalid reservation) are shown in the UI — no need to open DevTools.
- [ ] Duplicate submissions are prevented while an operation is in progress.
- [ ] Stock is refreshed automatically after reserve, confirm, or expiry.

---

## Out of Scope

- Authentication / login
- Multiple items or item browsing
- Pagination or history list
- Backend changes
- Unit or integration tests (smoke test via `docker compose up` is sufficient)

---

## Definition of Done

- App runs with `npm run dev` and connects to `http://localhost:8080`.
- All acceptance criteria above are met.
- Code is committed incrementally (setup → components → integration → polish).

