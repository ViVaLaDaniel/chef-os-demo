## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Cost of string operations in monolithic components
**Learning:** Monolithic files like `src/main.jsx` have huge main components (`App`) that re-render extremely frequently (e.g., ticking clocks via `useNow()`). Unmemoized array filtering with string concatenation and `.toLowerCase()` inside these components causes significant CPU overhead on every re-render.
**Action:** Always check array `.filter()` calls inside monolithic components. Memoize them with `React.useMemo` and implement fast-path early returns (e.g., returning early if search query is empty) to prevent expensive iterations and memory allocations on unrelated state updates.
