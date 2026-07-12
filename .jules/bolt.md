## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-07-12 - Missing memoization with expensive loops in monolithic components
**Learning:** In highly monolithic components like App in src/main.jsx, operations like filtering a large list with string concatenations and `.toLowerCase()` on every render (driven by frequent state updates like timers) can severely impact performance.
**Action:** When working with large lists and text search in massive components, wrap the filtering logic in `React.useMemo` and implement a fast-path early return when the search query is empty to skip the loop entirely.
