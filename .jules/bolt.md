## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Recipe filtering causes state fatigue
**Learning:** In the `App` component in `src/main.jsx`, `filteredRecipes` is calculated on every render based on the `query` string, performing expensive string concatenation and `.toLowerCase()` checks. Because this monolithic component handles global state (e.g. `useNow` ticks every minute), these heavy operations run constantly even when the user isn't searching.
**Action:** Always wrap heavy derived state (like array filtering combined with string parsing) in `React.useMemo` to protect it from the parent component's state update cycle. Add fast-path early returns to bypass the `filter` completely when the search query is empty.
