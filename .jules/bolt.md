## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Cost of unmemoized derived state in App monolith
**Learning:** Monolithic root components like `App` with ticking timers (e.g., `useNow()`) cause aggressive re-renders. Unmemoized array filtering with string operations (`toLowerCase()`) on every tick causes unnecessary CPU churn and can lead to performance drops.
**Action:** Always memoize derived arrays (like `filteredRecipes`) that rely on heavy looping/string matching inside large components, especially when global state or timers trigger frequent renders. Implement early returns where possible to bypass loops entirely.
