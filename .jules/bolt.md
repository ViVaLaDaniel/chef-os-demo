## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2025-02-23 - Memoizing global filter logic
**Learning:** In a highly monolithic architecture like `src/main.jsx`, global derived states (like `filteredRecipes`) are recalculated on every unrelated state update (e.g. `useNow()` timer ticks every 60 seconds) causing unnecessary expensive string operations.
**Action:** Wrap derived datasets that depend on text filtering or heavy array loops in `React.useMemo` and use fast-path early returns (e.g. `if (!query)`) to bypass string `.toLowerCase()` operations entirely.
