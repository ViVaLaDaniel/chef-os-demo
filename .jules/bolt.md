## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-27 - Memoize and early return in string search operations
**Learning:** Monolithic architectures with frequent state updates (like time ticks) recalculate expensive loops and string manipulations on every tick if left unprotected. The recipe list filter was recalculating on every re-render.
**Action:** When working on monolithic components with global re-renders, wrap list filtering and mapping in `React.useMemo`, and implement fast-path early returns (e.g., `if (!query) return baseList`) to avoid executing expensive string conversions (`.toLowerCase()`) or loops unnecessarily.
