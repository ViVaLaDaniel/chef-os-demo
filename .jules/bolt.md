## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-05 - Expensive Derived State in Monolith
**Learning:** Frequent timer updates in monolithic files (like `src/main.jsx`) cause full unmemoized tree re-renders, making derived lists with string manipulations (`.toLowerCase()`) very expensive.
**Action:** Always memoize derived lists with string/array methods in monolithic root components, and include fast-path early returns to skip operations entirely when filters are empty.
