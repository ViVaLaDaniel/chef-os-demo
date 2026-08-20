## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Heavy array filtering and string concatenations in monolithic renders
**Learning:** In a monolithic component like `App` with frequent state updates (e.g., from shift timers or chat inputs), performing unmemoized array filtering and string concatenation (`.toLowerCase().includes()`) causes severe performance degradation and unnecessary CPU usage.
**Action:** Always wrap derived data, especially loop-based or heavy string operations, in `React.useMemo` and implement fast-path early returns (e.g., returning the base array if the search query is empty) to avoid recalculating on unrelated renders.
