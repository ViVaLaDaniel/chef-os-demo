## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-05 - Expensive Un-Memoized Array Operations
**Learning:** In a monolithic architecture like `src/main.jsx`, placing heavy loop-based string operations (like `.toLowerCase()` array filtering) in the render path without `useMemo` is a significant performance bottleneck due to the frequency of re-renders from state updates.
**Action:** When filtering or transforming arrays of data in derived state within this architecture, always use `React.useMemo` to prevent these expensive operations on every state change.
