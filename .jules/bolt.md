## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-15 - Unmemoized Lists in Monolithic Apps
**Learning:** In a highly monolithic architecture (e.g. `src/main.jsx`), derived data like filtered lists (`filteredRecipes`) are recalculated entirely on every re-render, which happens frequently due to tick-based state (`useNow()`).
**Action:** Identify and memoize derived arrays that process complex logic (`filter`, `toLowerCase`, etc.) to prevent O(N) recalculations on unrelated state updates.
