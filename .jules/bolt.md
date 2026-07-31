## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoization in monolithic architecture
**Learning:** Due to frequent state updates (like the global shift timer `useNow()`) causing entire App re-renders in `src/main.jsx`, derived data requiring loop-based operations and string manipulations (`toLowerCase`) can become performance bottlenecks.
**Action:** Always prioritize `React.useMemo` with fast-path early returns for derived data to avoid recalculations of arrays when filtering or searching isn't active.
