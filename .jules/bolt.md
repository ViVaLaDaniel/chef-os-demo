## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-05 - Expensive derived data recalculations in root component
**Learning:** In a monolithic root component (`App`) with frequent state updates (like `useNow` timers), unmemoized derived data (e.g., filtering lists using string matching) causes significant render bottlenecks.
**Action:** Always wrap expensive derived calculations in `React.useMemo` when working within components that have highly volatile, unrelated state.
