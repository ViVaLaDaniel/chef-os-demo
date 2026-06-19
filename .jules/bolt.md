## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-06-25 - React.useMemo missing in main.jsx
**Learning:** Found an expensive derived state calculation (`filteredRecipes` mapped and filtered list strings inside rendering process) without memoization inside `App` component that renders extremely frequently due to `useNow` timer polling.
**Action:** Always wrap heavy list manipulations inside `React.useMemo` within monolithic components receiving frequent state ticks.
