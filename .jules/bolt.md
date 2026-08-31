## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Missing memoization for derived data
**Learning:** `filteredRecipes` is calculated on every render in the main `<App>` component which leads to sluggishness since it concatenates strings and calculates string inclusions synchronously during render.
**Action:** Always wrap expensive derived data processing with `React.useMemo` to prevent calculation on irrelevant state updates (e.g., when toggling top menu state or changing another tab).
