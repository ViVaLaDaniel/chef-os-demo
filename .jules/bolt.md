## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2024-06-14 - Monolithic App Component Re-renders
**Learning:** The `src/main.jsx` uses a highly monolithic `App` component that holds all global state (including frequent updates like `now` timer and `draft` chat typing). Because of this, derived data like `filteredRecipes` (which does string matching and filtering on arrays) is re-calculated on every single keystroke or minute tick, causing significant CPU overhead and potential frame drops.
**Action:** Always memoize derived array computations (like filtering and mapping) in monolithic architectures using `React.useMemo`, ensuring they only recalculate when their specific dependencies change.
