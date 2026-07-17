## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-27 - Expensive String Operations in Render Cycle
**Learning:** In a monolithic React component where global state changes (like clocks ticking or remote events) trigger frequent renders, string operations and array filtering on every render quickly become performance bottlenecks.
**Action:** When filtering lists using operations like `.toLowerCase()`, always memoize the derived state with `React.useMemo` and implement fast-path early returns (e.g., skip filtering if the search string is empty) to avoid O(N) recalculations.
