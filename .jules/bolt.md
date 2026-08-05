## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-08-05 - Optimize derived data calculation in `src/main.jsx`
**Learning:** Monolithic architectures with centralized state and frequent updates (like shift timers or fast typing) require careful memoization of derived data. Expensive string manipulations like `.toLowerCase()` inside `filter()` on large arrays can cause performance bottlenecks if run on every render.
**Action:** When filtering lists using text matching in large centralized components, always wrap the filtered result in `React.useMemo` and provide fast paths (early returns) for empty search queries to bypass the array iteration entirely.
