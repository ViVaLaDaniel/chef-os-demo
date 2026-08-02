## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-12-25 - Avoid O(N) string transformations in unmemoized root component renders
**Learning:** Monolithic files like `src/main.jsx` trigger frequent re-renders due to global state like `useNow()`. Doing string concatenations and `.toLowerCase()` operations over arrays on every render (even when filters haven't changed) causes unnecessary CPU cycles and GC churn.
**Action:** Always wrap derived data calculations that iterate over arrays or do string transformations in `React.useMemo`, especially in components susceptible to frequent timer-based re-renders, and use fast-path early returns when filters are empty.
