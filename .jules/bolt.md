## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2024-06-06 - App Component Derived State
**Learning:** The `App` component acts as a monolith and manages almost all the state. Because of this, it suffers from severe re-render fatigue. Small state changes, such as modifying inputs in other tabs or chat, will cause expensive derived state calculations (like string concatenation + array filter in `filteredRecipes`) to be re-run on every render.
**Action:** Always wrap derived state arrays with `React.useMemo` if they're calculated via array iterations/filtering in monolithic components with high-frequency state updates.
