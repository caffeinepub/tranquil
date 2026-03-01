# Specification

## Summary
**Goal:** Add a Privacy Dashboard with full data ownership controls, account deletion flow, selective data deletion, enhanced data export formats, GDPR compliance UI, and a visual upgrade to the TRANQUIL app.

**Planned changes:**
- Add a `/privacy` Privacy Dashboard page accessible from Settings and Profile, displaying stored data summary cards, data usage explanation, analytics/AI prediction toggles, connected devices management, and a red "Delete My Account" button
- Implement account deletion flow: confirmation modal requiring user to type "DELETE", soft-delete backend flag (`pendingDeletion`, `deletionScheduledAt` with 30-day grace period), cache clearing, logout, and success toast
- Add selective data deletion controls: delete icons on individual stress log and mood journal entries with inline "Are you sure?" confirmation, "Clear Analytics History" button, and "Reset Device Data" button in the Privacy Dashboard
- Extend data export in Settings with a format selector (JSON / CSV / PDF) and implement `exportAsCSV` and `exportAsPDF` utility functions in `dataExport.ts`
- Add GDPR compliance UI: Terms & Conditions / Privacy Policy acceptance modal on first login (with `termsAcceptedAt` recorded on backend), policy links in Settings footer, and plain-language data usage explanation in Privacy Dashboard
- Update `UserProfile` Motoko type with `pendingDeletion`, `deletionScheduledAt`, `analyticsEnabled`, `aiPredictionEnabled`, `devicePairings`, and `termsAcceptedAt` fields
- Implement all new backend Motoko functions: `requestAccountDeletion`, `cancelAccountDeletion`, `deleteStressReading`, `deleteMoodEntry`, `clearAnalyticsHistory`, `addDevicePairing`, `removeDevicePairing`, `clearDevicePairings`, `updatePrivacyPreferences`, `recordTermsAcceptance` — all with caller-authorization checks
- Add all corresponding React Query hooks in `useQueries.ts` with proper cache invalidation
- Apply visual upgrade: teal-to-indigo gradient on Dashboard hero, glassmorphism card surfaces, ambient glow on stress gauge and breathing circle, fade-in/slide-up page entrance animations, hover/press micro-interactions, and new OKLCH accent color tokens (teal, sage green, soft gold)

**User-visible outcome:** Users can view and control all their stored data from a dedicated Privacy Dashboard, delete their account or individual data entries, export data in JSON/CSV/PDF formats, and accept privacy terms on first login. The app also has a more premium, calming visual design with gradient backgrounds, frosted glass cards, and smooth animations.
