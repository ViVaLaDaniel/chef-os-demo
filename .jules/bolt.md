## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-24 - Memoizing heavy loop operations in global component
**Learning:** In a monolithic structure where one giant component (like `App` in `src/main.jsx`) handles multiple fast-updating states (like global shift timers or rapid search inputs), derived states containing `.filter()` or `.toLowerCase()` can easily become performance bottlenecks.
**Action:** Identify expensive array manipulations inside global components and wrap them in `React.useMemo` early on to shield them from unrelated re-renders. Also ensure to add explanatory comments.
