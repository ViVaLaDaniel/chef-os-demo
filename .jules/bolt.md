## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
\n## 2026-07-07 - Memoization in large monolithic component\n**Learning:** In highly monolithic files like `src/main.jsx`, derived data computations involving string manipulations and loops on every render are a significant bottleneck due to frequent state updates.\n**Action:** Prioritize memoizing expensive derived data (like filtering arrays with `.toLowerCase()`) using `React.useMemo` and implementing early returns to prevent unnecessary recalculations.
