# Specification

## Summary
**Goal:** Add a comprehensive "Privacy & Data Control" section inside the Settings page of the TRANQUIL app, covering full account deletion, selective data deletion, data download, security information, and compliance details.

**Planned changes:**
- Add a "Privacy & Data Control" section to the Settings page with a calm blue/teal theme, plain-English labels, and no dark patterns
- Implement a Full Account Deletion flow with a red "Delete Account" button, multi-step confirmation modal, password/biometric re-authentication, permanent warning message, optional 7-day recovery period toggle, and backend deletion of all user data (profile, stress logs, mood logs, sleep data, device history)
- Add backend `deleteAllUserData` actor method that removes all records for the calling user from every data Map, and a `logDeletionEvent` method that records a timestamped anonymous deletion event — both enforcing caller-based authorization
- Implement Selective Data Deletion sub-section allowing users to independently delete individual stress log entries, individual mood entries, all analytics history, and device pairing data — each with a confirmation dialog and toast notification
- Add a "Download My Data" button with export format options (JSON, CSV, PDF summary) using the existing `dataExport.ts` utility for client-side downloads including stress readings, mood entries, sleep data, and profile info
- Display a SecurityInfoCard listing six security features (AES-256 encryption, encrypted BLE, Firebase Security Rules, MFA, biometric re-auth, HTTPS) with icons and brief descriptions
- Add a Compliance sub-section showing GDPR and Indian IT data protection adherence, user consent timestamps via ComplianceCard, links to Privacy Policy and Terms of Service via PolicyModal, and a privacy-first ownership statement
- Invalidate all active React Query caches after account deletion

**User-visible outcome:** Users can visit the Settings page to manage all aspects of their privacy and data — including deleting their account or specific data entries, downloading their data in multiple formats, reviewing security practices, and checking compliance and consent records.
