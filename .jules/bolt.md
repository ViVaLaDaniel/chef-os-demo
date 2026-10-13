## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-10-13 - Memoizing costly string loops in monolithic state updates
**Learning:** Monolithic files like `src/main.jsx` trigger frequent re-renders due to global timers and frequent state changes. Deriving data directly in the render function without memoization, specifically those with expensive list iterations and multiple `.toLowerCase()` string manipulations, exacerbates rendering bottlenecks on every state update.
**Action:** Always wrap heavy list derivations (like search filtering) in `React.useMemo` within monolithic components, and consider implementing fast-path early returns when conditions bypass the need for processing.
