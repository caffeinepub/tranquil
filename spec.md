# Specification

## Summary
**Goal:** Match mobile UI colors to desktop and make the app fully responsive across all screen sizes.

**Planned changes:**
- Apply color tokens (backgrounds, text, accents, gradients) consistently across all breakpoints on all pages: Dashboard, Breathe, Sounds, Journal, Analytics, Profile, Settings, Sleep, VibrationControl, and TipsAndReminders
- Fix layouts, grids, and cards so they reflow correctly from mobile (320px+) to tablet (768px+) to desktop (1024px+)
- Ensure no horizontal overflow or scrollbar appears at any standard viewport width
- Make Recharts visualizations (StressChart, StressGauge, etc.) resize fluidly without clipping
- Scale typography appropriately across breakpoints using responsive classes
- Ensure all forms, sliders, modals (e.g., ProfileSetupModal), and EmergencyCalmOverlay are correctly sized and usable on all screen widths
- Ensure BottomNav and Header are correctly positioned on mobile/tablet/desktop

**User-visible outcome:** The app looks and feels consistent on mobile, tablet, and desktop — same colors, no overflow, and all layouts adapt gracefully to any screen size.
