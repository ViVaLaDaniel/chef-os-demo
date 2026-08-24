## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Memoize heavy string operations
**Learning:** In a monolithic root component (`src/main.jsx`), frequent state updates (like minute-by-minute timers or chat inputs) trigger top-level re-renders. Derived data involving heavy array filtering with `.toLowerCase()` and string concatenation recalculates unnecessarily, acting as a performance bottleneck.
**Action:** Always wrap heavy list filtering/string-matching logic with `React.useMemo` (e.g. `const filteredRecipes = React.useMemo(...)`) when computing derived state at the root of a large monolith.
