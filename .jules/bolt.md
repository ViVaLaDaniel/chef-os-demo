## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoizing derived data in a monolithic component
**Learning:** In a monolithic architecture where global state resides in a single large component (e.g., `App` in `src/main.jsx`), derived data like filtered lists (e.g., `filteredRecipes`) gets recalculated on every render (triggered by global timers, fast typing, etc.). This recalculation can involve heavy string operations like `.toLowerCase()` on every item.
**Action:** Always use `React.useMemo` for derived data involving iterations or string manipulations in monolithic components to avoid unnecessary work. Add early returns (e.g., skip filtering if search query is empty) to bypass expensive operations.
