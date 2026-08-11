## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unmemoized String Operations in Monoliths
**Learning:** In a highly monolithic component like `App` which frequently re-renders due to global state changes (timers, active shift data), computing derived state with string manipulations (`toLowerCase`, `.includes`) on every render can cause noticeable performance degradation.
**Action:** Always memoize derived arrays/objects with `React.useMemo` if the mapping/filtering relies on operations heavier than simple property access, and introduce fast paths (early returns) for empty search queries to bypass iterations completely.
