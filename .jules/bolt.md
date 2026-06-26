## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-26 - String operations in re-render hot path
**Learning:** In the `App` component monolithic architecture, derived data that performs string manipulation (e.g. `toLowerCase()`, string concat) inside loop functions (like `filter()`) becomes a significant performance bottleneck as the component re-renders on *any* state change (such as timers, tab changes, user typing).
**Action:** Always memoize derived arrays that perform string manipulation or heavy filtering, and implement fast-path early returns (e.g. if the search query is empty) to avoid the loop and string operations altogether.
