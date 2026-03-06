# TRANQUIL

## Current State
- Settings page (`/settings`) exists with: Appearance (dark mode toggle), Smart Reminders (hydration/breaks/stretch toggles), Data & Privacy (simple export button + blockchain message), About section, and footer.
- App uses TanStack Router with a `/privacy` route not yet defined.
- Bottom navigation has 5 items (Home, Breathe, Sounds, Journal, Analytics) and must remain unchanged.
- Layout wraps all pages in a max-width 430px centered column with Header + BottomNav.

## Requested Changes (Diff)

### Add
- New page `PrivacySettings.tsx` at `/privacy` route — a dedicated "Privacy & Data" dashboard.
- New route `/privacy` registered in `App.tsx`.
- A "Privacy & Data" navigation entry inside the Settings page (clickable card/row with a right-arrow icon) that navigates to `/privacy`.
- The PrivacySettings page contains 6 sections as mobile-first cards:

  1. **SECURITY** — Biometric Authentication (toggle), Multi-Factor Authentication (toggle), Change Password (arrow row).
  2. **DATA MANAGEMENT** — Download My Data (arrow row), Selective Data Deletion (arrow row), Manage Devices (arrow row).
  3. **DATA USAGE CONTROLS** — Analytics Tracking (toggle), AI Prediction Usage (toggle), Cloud Backup (toggle).
  4. **DATA ACTIONS** — Download My Data with format info (arrow row), Selective Data Deletion (arrow row), Manage Connected Devices showing active device count (arrow row).
  5. **COMPLIANCE & LEGAL** — Privacy Policy (arrow row, "GDPR & Indian IT Act compliant"), Terms & Conditions (arrow row, shows last accepted date), Data Usage Explanation (arrow row).
  6. **ACCOUNT CONTROL** — Large red "Delete My Account" button + security encryption message below.

- All rows have relevant Lucide icons.
- Toggle state is managed locally (useState) since no backend API changes are needed.
- Inline modal/sheet for Change Password, Selective Data Deletion, Manage Devices, Privacy Policy, Terms & Conditions, Data Usage Explanation.
- Delete My Account triggers a confirmation dialog with warning text.
- All interactive elements have `data-ocid` deterministic markers.

### Modify
- `Settings.tsx`: Add a "Privacy & Data" section card/row at the top or after Appearance that links to `/privacy`. Do NOT change any existing sections.
- `App.tsx`: Register the new `/privacy` route.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/pages/PrivacySettings.tsx` with all 6 sections.
2. Add `/privacy` route in `App.tsx` pointing to `PrivacySettings`.
3. Add a "Privacy & Data" nav row in `Settings.tsx` (before or after Appearance section) linking to `/privacy`.
4. Validate (typecheck + build).
