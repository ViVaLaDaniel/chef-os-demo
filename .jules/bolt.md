## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Optimize derived state in monolithic components
**Learning:** In a monolithic architecture where a root component like `App` frequently re-renders due to global state changes (like shift timers), unmemoized derived data (like filtering lists with heavy string operations) can cause performance bottlenecks.
**Action:** Prioritize memoizing derived data with `React.useMemo` and implement fast-path early returns when dealing with string manipulations inside loops.
