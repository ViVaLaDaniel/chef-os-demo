## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-05 - Recipe Filtering Performance
**Learning:** In a monolithic architecture like `src/main.jsx`, unmemoized heavy operations (like mapping and filtering an array with `.toLowerCase()`) will be triggered by completely unrelated state updates (e.g. interval timers like `useNow`, user interactions on different tabs).
**Action:** When filtering or transforming arrays, aggressively use `React.useMemo` and fast-path common scenarios like empty search queries to limit redundant calculation cycles.
