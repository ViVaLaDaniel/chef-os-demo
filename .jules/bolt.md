## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-10 - Derived Data Bottlenecks in Monolithic State
**Learning:** In a monolithic architecture where a root component like `App` manages all state and re-renders frequently (e.g., from checklist toggles or timer updates), deriving expensive data synchronously in the component body (like array filtering and string manipulations for search) causes significant main thread blocking and CPU load on every state change, even unrelated ones.
**Action:** Aggressively apply `React.useMemo` to all non-trivial derived data in monolithic root components to ensure expensive recalculations only happen when their specific dependencies change.
