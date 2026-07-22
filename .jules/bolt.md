## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2025-02-12 - Memoize list filtering in monolithic component
**Learning:** Monolithic files like `src/main.jsx` with frequent global state updates (e.g., `useNow()`) cause constant, heavy re-renders. A simple list filter mapping over strings with `.toLowerCase()` executes hundreds of times unnecessarily.
**Action:** Always wrap derived list computations in `React.useMemo` and aggressively look for early returns when search query filters are empty to bypass `.toLowerCase()` string manipulations completely.
