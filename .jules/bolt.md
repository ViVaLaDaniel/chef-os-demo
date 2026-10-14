## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-10-14 - Expensive computations in App root
**Learning:** `src/main.jsx`'s `App` component holds almost all of the application's global state and frequently re-renders (e.g., when a user updates tasks or types in a chat). Computations inside the root `App` component block the main thread.
**Action:** When adding heavy computations (like nested filters or string manipulations) inside root components, wrap them with `React.useMemo` to prevent them from executing on every state change and use early returns to skip complex logic when unnecessary.
