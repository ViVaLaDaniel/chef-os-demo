## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-05 - Monolithic component frequent updates causing expensive string derived data calculations
**Learning:** In a monolithic architecture (`src/main.jsx`), frequent state updates (like `useNow()` global timers for shift management) cause every derived value in the component to re-evaluate. The calculation for `filteredRecipes` performed multiple `.toLowerCase()` string manipulations within loops on every tick.
**Action:** Always wrap heavy derived arrays involving `.toLowerCase()` string combinations inside loops using `React.useMemo` if inside a top-level monolithic structure. Introduce early return fast-paths for empty text queries to avoid array map/filters completely.
