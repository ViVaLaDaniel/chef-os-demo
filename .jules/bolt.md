## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Memoization of Derived Data in Global State Monoliths
**Learning:** Due to the monolithic architecture where `App` manages all global state and re-renders frequently (e.g., from real-time checklists, chat messages, or active tabs), any unmemoized derived data calculations—such as filtering lists and executing `.toLowerCase()` on string combinations—causes performance bottlenecks.
**Action:** Always wrap heavy list filtering or string operations inside `React.useMemo` if they are defined directly inside `App` or any similarly monolithic root component, so they only recalculate when their specific dependencies change.
