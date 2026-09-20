## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Search filtering performance in monolithic state
**Learning:** In a monolithic component like `src/main.jsx` where global state changes frequently (e.g., from global timers like `useNow()`), derived data like filtered lists are recalculated constantly on every render. If these recalculations involve string manipulations (like `.toLowerCase()`) inside loops, they become significant performance bottlenecks, especially when the search query is empty.
**Action:** When filtering lists based on a query, always wrap the derived list in `React.useMemo` and implement a fast-path early return for when the query is empty. This completely bypasses the iteration and expensive string operations during idle states or unrelated re-renders.
