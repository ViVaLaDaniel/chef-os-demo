## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-28 - Missing Memoization for derived array filter states
**Learning:** Found an expensive calculation where `.toLowerCase()` and string interpolations were inside a `.filter` block running on every render for `filteredRecipes` in the large `src/main.jsx` monolith component. This causes unnecessary overhead during unrelated state changes.
**Action:** When filtering or transforming data, always check if it can be wrapped in `React.useMemo` to prevent recalculations. Introduce early returns, like checking if a search query is empty before running string-based filters.
