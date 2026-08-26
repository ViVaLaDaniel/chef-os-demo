## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-24 - Expensive string manipulation in render path
**Learning:** Monolithic components that re-render frequently (e.g. from `useNow()` interval or frequent chat state updates) will repeatedly execute unmemoized data transformations like `Array.filter` and `.toLowerCase()`, causing unnecessary CPU load.
**Action:** Always wrap derived data calculations that involve loops or string manipulations in `React.useMemo`, especially in high-frequency update contexts.
