## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-05 - Monolithic component frequent updates
**Learning:** In a monolithic architecture like `src/main.jsx`, global state updates (e.g., from `useNow()` ticking every minute) cause the entire App to re-render. This makes unmemoized derived data computations, especially those involving string manipulation (like `.toLowerCase()` in filtering), a hidden performance bottleneck.
**Action:** Always memoize derived data that depends on heavy string operations or arrays, and implement fast-path early returns to bypass operations entirely when the input doesn't require them.
