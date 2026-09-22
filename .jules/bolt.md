## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unnecessary recalculations in App monolith
**Learning:** The `App` component in `src/main.jsx` re-renders frequently due to global timers (like `useNow`) and input changes. Unmemoized array filtering and string manipulations (like `.toLowerCase()` in `filteredRecipes`) run on every render, causing main thread blocking and lag.
**Action:** Always wrap derived data computations, especially those involving loops or string operations, in `React.useMemo` when they are inside large, frequently re-rendering components like `App`.
