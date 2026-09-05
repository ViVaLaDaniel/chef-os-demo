## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-09-05 - Expensive string operations in render loop
**Learning:** Monolithic components that frequently update (like `App` responding to tick timers or chat activity) can cause expensive string concatenations and `.toLowerCase()` operations during list filtering to run unnecessarily on every render, causing main-thread stutter.
**Action:** When working with large lists and text search, always memoize the derived list with `React.useMemo` and include an early return fast-path if the search query is empty to skip string operations entirely.
