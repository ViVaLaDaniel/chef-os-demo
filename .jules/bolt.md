## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unnecessary String Mapping in Monolithic Renders
**Learning:** In the large `App` component (`src/main.jsx`), derived data filtering that involves array iterations and string manipulations (like `.toLowerCase()`) runs synchronously on every render. Because the component has frequent state updates from timers and UI interactions, this can cause significant main thread blocking and frame drops.
**Action:** Always wrap heavy list filtering inside `React.useMemo` when working inside the `App` monolith, and always implement fast-path early returns (e.g., skip filtering if search query is empty) to avoid O(n) string mapping operations when not strictly needed.
