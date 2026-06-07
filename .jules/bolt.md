## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2023-10-24 - Expensive derived state in App monolith
**Learning:** In a heavily monolithic architecture (like `src/main.jsx`), computing derived state like `filteredRecipes` at the root component level triggers expensive re-calculations on *every* unrelated state change (e.g. typing in a chat message, toggling a task).
**Action:** When working in monoliths, aggressively memoize derived collections using `React.useMemo` to prevent these cascading calculations during rapid, local state updates.
