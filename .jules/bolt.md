## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-29 - Avoid unmemoized derived state with heavy loops
**Learning:** Monolithic components containing many derived arrays (e.g., list filtering) evaluate them on every render—which is frequent due to timers and state changes—leading to performance degradation, especially with expensive string methods like `.toLowerCase()`.
**Action:** Always wrap derived list filtering in `React.useMemo` and implement fast-path early returns (e.g., returning early if search query is empty) to skip computationally heavy iteration entirely.
