## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-30 - Memoize derived UI lists in monolithic App component
**Learning:** Monolithic files like `src/main.jsx` (which contains most UI screens) suffer heavily from unnecessary re-renders. Derived lists (like `filteredRecipes`) that require iteration and string manipulation (e.g. `.toLowerCase()`) execute on every small state update (e.g., ticking off a checklist item), creating noticeable performance lag.
**Action:** Always wrap derived list computations in `React.useMemo` with minimal dependencies. Add fast-path early returns (e.g., skipping search-filtering when the query is empty) to bypass expensive loops.
