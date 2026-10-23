## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-24 - Memoize derived data relying on heavy operations
**Learning:** In large monolithic components with global state updates (like `useNow` triggering frequent renders), un-memoized derived state containing string manipulations and filtering (like `.toLowerCase().includes()`) causes unnecessary CPU cycles and performance bottleneck.
**Action:** Use `React.useMemo` to memoize expensive derived state, ensuring calculations are only run when their specific dependencies (e.g. `query`, `recipeFilter`, `recipesList`) change, not on every render.
