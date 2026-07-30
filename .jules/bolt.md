## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-05 - Heavy string manipulations on derived data
**Learning:** In highly monolithic frontend architectures like this one, components may re-evaluate frequently. Complex string manipulations on derived data, such as `.toLowerCase()` array loops, become noticeable bottlenecks without adequate memoization.
**Action:** When filtering array data based on state strings (like queries) within a monolithic tree, always wrap the computation in `React.useMemo` and implement fast-path early returns for empty or unmodified states to skip processing entirely.
