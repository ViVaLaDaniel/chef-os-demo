## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-10-09 - Memoizing loop-based operations in monolith component
**Learning:** In highly monolithic structures like `src/main.jsx` (which rerenders on many state changes like global shift timers or fast typing interactions), unmemoized loop-based calculations with string manipulations (like filtering recipes) cause noticeable performance drops.
**Action:** When filtering or transforming data arrays in `App`, always wrap the derivation in `React.useMemo` and implement fast-path early returns (e.g. skip string operations entirely if a query is empty) to avoid unnecessary expensive recalculations.
