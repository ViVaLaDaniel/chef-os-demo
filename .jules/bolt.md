## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2023-10-27 - Unnecessary String Ops on Empty Search
**Learning:** In a monolithic structure where global state causes frequent re-renders (like ticking `useNow` timers), inline lists that iterate over arrays doing expensive string formatting and `toLowerCase()` conversions run constantly.
**Action:** Always wrap heavy derived data (like search filtering) in `React.useMemo` and aggressively add fast-path early returns (e.g., `if (!query) return list`) to skip loops on empty states.
