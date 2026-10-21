## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-21 - Memoization of heavy string operations in frequently re-rendered components
**Learning:** In a monolithic React component where global state changes (e.g. chat messages, activity logs) cause frequent re-renders, recalculating derived data that involves array filtering and expensive string operations (like `.toLowerCase()`) can create a noticeable performance bottleneck.
**Action:** When working in large, state-heavy components, aggressively memoize derived lists and always consider adding fast-path early returns (e.g., returning early if a search query is empty) to skip unnecessary iterations and string manipulations.
