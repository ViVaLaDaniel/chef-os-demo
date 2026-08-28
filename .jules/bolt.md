## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-08-28 - Derived state recalculation inside main file
**Learning:** `App` component in `src/main.jsx` re-renders every 60 seconds due to `useNow()` timer state, recalculating heavy operations like string matching arrays continuously without user input.
**Action:** Always wrap heavy list mapping, parsing, or filtering derived states in React.useMemo() when they sit inside high-level components with frequent state changes.
