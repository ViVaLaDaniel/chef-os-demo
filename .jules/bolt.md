## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unmemoized array filtering and string mapping
**Learning:** Doing `.toLowerCase()` and string concatenation (`${recipe.title} ${recipe.category}`) inside a `filter` loop on every render in a large monolith like `App` creates significant unnecessary work, especially when the text query is empty and the global state updates frequently.
**Action:** When working with large lists and text search in heavily updated parent components, wrap the filtering in `React.useMemo` and implement a fast path to skip string operations when the query is empty.
