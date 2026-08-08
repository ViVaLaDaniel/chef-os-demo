## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-03-24 - Expensive Array Operations in Monolithic State
**Learning:** `src/main.jsx` re-renders frequently due to global state changes (like global timers and typing). Derived state, such as `filteredRecipes` which uses `.filter()` and `.toLowerCase()`, creates a performance bottleneck if recalculated on every render when there's no active search query.
**Action:** When filtering arrays based on user input, prioritize wrapping derived state in `React.useMemo` and implement fast-path early returns (e.g. bypassing iterations when the query is empty).
