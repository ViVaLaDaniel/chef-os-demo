## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Search filtering performance in monolithic components
**Learning:** In a monolithic component like `src/main.jsx` with frequent state updates (e.g., from typing in a search box or the `useNow` timer), derived data operations like mapping arrays and concatenating strings inside a filter function become performance bottlenecks.
**Action:** Prioritize memoization (using `React.useMemo`) for heavy loop-based operations and always implement fast-path early returns (e.g., skipping operations if the search query is empty) to prevent expensive recalculations and reduce main thread blocking.
