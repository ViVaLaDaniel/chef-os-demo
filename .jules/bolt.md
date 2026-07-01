## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-07-01 - Expensive string manipulations in frequent re-renders
**Learning:** The root `App` component re-renders frequently due to global state changes and timer ticks. Computing derived state that involves looping and expensive string operations like `.toLowerCase()` without memoization creates a noticeable performance bottleneck.
**Action:** Always memoize derived data lists (using `React.useMemo`) when they involve string manipulations, and implement fast-path early returns when filtering conditions are empty to skip iteration entirely.
