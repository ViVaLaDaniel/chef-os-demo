## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoizing derived data in a monolithic app
**Learning:** The project uses a highly monolithic frontend architecture where `src/main.jsx` contains the root `App` component and many UI screens. Because global state like `useNow()` updates frequently (e.g. every minute) or input happens quickly, it is crucial to memoize expensive derived calculations like filtering that involves loops and string conversions (e.g. `.toLowerCase()`).
**Action:** When working on filtering or mapping derived state in this monolith, always prioritize memoization (like `React.useMemo`) and add early returns for empty search cases to avoid costly recalculations that block rendering.
