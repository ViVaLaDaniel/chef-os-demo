## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-27 - Memoize derived lists in monoliths
**Learning:** In a monolithic architecture where `src/main.jsx` holds both the global state (including high-frequency updaters like `useNow()`) and renders most screens, derived lists (like `filteredRecipes`) that require expensive operations (such as `.toLowerCase()` on string concatenations) re-run on every state update, degrading performance.
**Action:** When filtering or transforming lists in the main monolith component, use `React.useMemo` to cache the derived data and add fast-path early returns (e.g., skip filtering if the query is empty) to avoid recalculating on unrelated renders.
