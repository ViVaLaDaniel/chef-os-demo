## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Expensive derived data recalculation in App monolith
**Learning:** Monolithic components like `App` re-render frequently (e.g., from global timers like `useNow` or fast typing). Derived data that loops over arrays to perform string concatenations and `.toLowerCase()` checks can become a significant bottleneck if recomputed on every render.
**Action:** Always memoize expensive derived state (using `React.useMemo`) and add fast-path early returns (e.g., skipping string searches if the query is empty) to prevent performance degradation during frequent state updates.
