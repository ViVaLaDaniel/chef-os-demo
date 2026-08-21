## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-05-18 - Heavy string manipulation in renders
**Learning:** Monolithic components often have derived state that runs on every render. Things like string concatenation and `.toLowerCase()` inside filters (e.g., `recipes.filter`) can cause significant performance bottlenecks if re-calculated constantly, especially when the search input is empty.
**Action:** When filtering lists based on query strings, always wrap the derived calculation in `React.useMemo`, and include an early return (e.g., `if (!query) return list`) to skip the expensive `.toLowerCase()` comparisons when no search is active.
