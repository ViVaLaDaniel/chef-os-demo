## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-03 - Expensive derived state in monolith component
**Learning:** Frequent state updates (like `useNow()` clock ticks or fast typing) in the root `App` component cause expensive calculations (like recipe filtering with `.toLowerCase()` and multiple array operations) to run on every render cycle, leading to performance bottlenecks.
**Action:** Use `React.useMemo` for derived data involving heavy loop-based operations or string manipulations, and implement early returns (like returning all recipes if the query is empty) to prevent expensive recalculations.
