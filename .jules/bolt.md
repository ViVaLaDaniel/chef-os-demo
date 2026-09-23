## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-05 - Expensive filtering in monolithic components
**Learning:** Performing list filtering and heavy string manipulations (like concatenating fields and running `.toLowerCase().includes()`) on every render can cause performance issues in monolithic architectures where root components update frequently (e.g., from global timers or unrelated UI state).
**Action:** When filtering lists in root components, always use `React.useMemo` to memoize the result based on search query and data source. Additionally, include fast-path early returns (e.g., `if (!query) return list`) to skip the expensive `.filter` loops entirely when the search is empty.
