## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Memoize expensive operations in monolithic components
**Learning:** Monolithic components with frequent state updates (like `App` rendering 1800 lines) cause derived state to recalculate frequently on unrelated changes (e.g. `useNow` ticks).
**Action:** Always memoize expensive array operations involving string manipulation like `.toLowerCase()` inside monolithic components using `React.useMemo` and implement fast-path early returns.
