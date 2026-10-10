## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-05 - Expensive derived state in main loop
**Learning:** In large monolithic components handling global state (like Timers or Chat updates), expensive array filtering and string manipulations (`.toLowerCase()`) cause unnecessary recalculations on every render.
**Action:** Use `React.useMemo` to memoize expensive filter operations based on relevant state changes, and implement fast-path early returns (e.g., skip filtering entirely if the search query is empty) to prevent main thread blocking during frequent UI updates.
