## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoize derived list filtering in monolithic components
**Learning:** In highly monolithic frontend architectures (like `src/main.jsx`), frequent state updates from inputs (like typing) can trigger expensive recalculations on derived data like filtered lists (e.g., `recipesList.filter`). These operations, especially string interpolations and `.toLowerCase()` operations on large arrays, can block the main thread and cause typing lag.
**Action:** Always wrap heavy list filtering in `React.useMemo` and implement fast-path early returns (e.g., skipping filtering if the query is empty) to prevent expensive loops on every re-render.
