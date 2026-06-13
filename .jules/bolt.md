## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-27 - Monolithic architecture and React.useMemo
**Learning:** Monolithic components, especially those rendering frequently via intervals (like `useNow` in `src/main.jsx`), require memoization to prevent recalculating large amounts of derived data (like filtering long arrays).
**Action:** When working in large unified components like `App`, aggressively look for unmemoized derived data (e.g. loops or filtering) in the render path, and wrap them in `React.useMemo` to prevent synchronous blocking on regular state updates.
