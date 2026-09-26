## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Expensive string manipulation inside render functions of large components
**Learning:** Monolithic components that have frequent state updates (like `App` which tracks timers or tabs) will trigger expensive derived calculations (like `.toLowerCase()` in filters) repeatedly on every re-render unless adequately memoized.
**Action:** When filtering or manipulating strings in lists based on query state in a monolithic component, use `React.useMemo` to cache the derived data and add an early return for empty queries to skip computation altogether.
