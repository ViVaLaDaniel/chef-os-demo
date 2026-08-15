## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2024-05-25 - Expensive loop computations in rendering
**Learning:** Performing multiple string manipulations and `.toLowerCase()` operations inside array filtering during main component rendering degrades performance as lists grow.
**Action:** Always wrap heavy list filtering with nested string manipulations in `React.useMemo` to avoid redundant computations on every component render.
