## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-09-04 - Unmemoized String Filtering in Monolithic Components
**Learning:** In monolithic components like `App` (src/main.jsx) that hold a lot of disparate state, executing derived data filters—especially those that rely on heavy string manipulations like `.toLowerCase()` on arrays—can severely degrade performance across the entire application because any unrelated state update triggers those computations.
**Action:** When working on large monolithic components with many state variables, always actively search for array operations and string manipulation derived data inside the render function and aggressively memoize them using `React.useMemo` to isolate performance costs to only the state they depend on.
