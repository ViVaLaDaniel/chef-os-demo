## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2023-10-12 - Memoize string-heavy list filtering
**Learning:** Frequent state updates in monolithic root components (like global shift timers or rapid typing in search boxes) will trigger re-renders of the entire tree. Re-evaluating derived data with heavy string manipulations (e.g. `.toLowerCase()` in array filters) on every render is a significant bottleneck.
**Action:** Always wrap heavy derived data computations, especially those involving string manipulation inside loops, in `React.useMemo()`. Include fast-path early returns (e.g., skipping the search filter if the query is empty) to bypass the expensive loops entirely when not needed.
