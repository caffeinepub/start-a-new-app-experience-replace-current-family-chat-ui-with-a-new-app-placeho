# Specification

## Summary
**Goal:** Replace the current Family Chat primary UI flow with a minimal “New App” placeholder experience shown after Internet Identity sign-in.

**Planned changes:**
- Update the post-sign-in primary route/screen to display a dedicated “New App” placeholder instead of the existing chat and family settings views.
- Remove/disable main navigation routes/tabs/buttons that expose the existing ChatPage/FamilySettingsPage from the primary user flow.
- Add a “What do you want to build?” area on the placeholder screen: a multi-line English-labeled text input stored in client-side state, plus a primary English-labeled button that shows an on-screen confirmation when clicked (no backend calls).

**User-visible outcome:** After signing in, users land on a “New App” placeholder screen where they can type an app description and click a button to see confirmation that their input was captured locally, without access to the existing chat or family settings screens from the main navigation.
