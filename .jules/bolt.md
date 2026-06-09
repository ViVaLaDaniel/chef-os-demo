## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-09 - Unnecessary re-renders on derived data in Monolithic Components
**Learning:** In a monolithic architecture where a single `App` component holds all global operational state (tasks, timers, chat messages), updating any piece of state triggers a full re-render. Unmemoized derived data calculations (like array filtering and string concatenations for search) execute repeatedly on unrelated updates, causing hidden performance bottlenecks.
**Action:** When working in highly monolithic files with global state, proactively use `React.useMemo` for any derived data mapping/filtering, since unrelated rapid state updates (e.g., from `useNow` timers) will otherwise trigger expensive recalculations.
