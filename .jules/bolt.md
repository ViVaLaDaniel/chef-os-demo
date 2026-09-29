## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoizing expensive derived state in monolithic components
**Learning:** In large monolithic components with frequent re-renders (like ticking timers), string manipulations inside array iterations during rendering (e.g., .filter combined with .toLowerCase) can cause noticeable performance degradation.
**Action:** Always wrap derived state involving array iterations and string manipulations in React.useMemo, especially in components that re-render frequently, to prevent redundant O(N) operations on every render.
