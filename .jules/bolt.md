## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-16 - Memoize derived data in monolithic components
**Learning:** The project uses a highly monolithic frontend architecture where `src/main.jsx` contains the root `App` component alongside most UI screens and global state. Due to frequent state updates (e.g., timers, interactions), recalculating derived data on every render can cause performance bottlenecks.
**Action:** Prioritize memoization (like `React.useMemo`) for derived data (like filtered lists) to prevent expensive recalculations and improve performance.
