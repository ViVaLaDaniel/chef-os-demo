## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-07-24 - Memoize array filtering with string ops in monolithic components
**Learning:** In a heavily monolithic React architecture with top-level state updates like a global timer (`useNow`), performing array `.filter` loops with string manipulations (like `.toLowerCase()`) directly in the render path creates severe performance bottlenecks.
**Action:** Always memoize derived lists and apply fast-path early returns (e.g., skip processing when search query is empty) to prevent expensive, unnecessary recalculations on every render tick.
