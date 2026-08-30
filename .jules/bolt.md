## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-27 - Unnecessary heavy string computations on empty filter query
**Learning:** Monolithic files like `src/main.jsx` with many heavy data derivations (like `.filter()` and `.toLowerCase()`) execute on every render unless wrapped with memoization. This gets worse when the component updates frequently (e.g. `useNow()`).
**Action:** Always wrap heavy list derivations (like search/filtering) in `React.useMemo` and include fast-path early returns (e.g. `if (!query) return baseList`) to avoid useless iterations.
