## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2023-10-25 - Unmemoized search filtering in Monolithic App
**Learning:** The `App` component in `src/main.jsx` is highly monolithic and experiences frequent state updates from various sources (e.g., chat, checklists, tasks). Unmemoized derived data calculations, especially O(N) operations like string-based search filtering across lists (like `filteredRecipes`), cause noticeable performance degradation because they re-run on every state change, even when their inputs haven't changed.
**Action:** Always wrap derived data calculations involving lists or expensive operations (like string manipulation or filtering) in `React.useMemo`, and include early returns for empty filters to bypass the calculation entirely when possible.
