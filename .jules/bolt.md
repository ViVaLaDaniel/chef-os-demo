## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-08-04 - Memoizing string operations in large components
**Learning:** In a highly monolithic React application with frequent re-renders (like from shift timers updating `useNow()`), derived state that relies on string concatenation and operations like `.toLowerCase()` can cause performance bottlenecks if left un-memoized.
**Action:** Always wrap heavy string-based array filtering (especially within long lists) in `React.useMemo` and use fast-path early returns (e.g. returning the unfiltered list immediately if the query is empty) to avoid recalculations.
