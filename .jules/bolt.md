## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-07-11 - Monolithic App Re-render Bottlenecks
**Learning:** In a highly monolithic architecture where the root App component holds all state, derived data involving string manipulation (`.toLowerCase()`) or loops on large arrays will recalculate on every single state change (e.g., typing, timers, tab switching), causing unnecessary overhead.
**Action:** Always wrap heavy derived calculations (especially array filters with string parsing) in `React.useMemo` and implement fast-path early returns (e.g., returning the base array if a search query is empty) to bypass expensive loops entirely.
