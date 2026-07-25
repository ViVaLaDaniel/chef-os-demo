## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-05-23 - Memoizing large filtering operations in App
**Learning:** Due to the global state structure in `App`, derived lists like `filteredRecipes` are recalculated on every component render (e.g., when the shift timer ticks or when typing in the search box), causing performance issues if the calculation is expensive.
**Action:** When working on expensive derivations inside `App`, always use `React.useMemo` and look for fast-path early returns (e.g. returning early if search query is empty) to optimize performance and prevent unneeded loop iterations.
