## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unmemoized derived state with heavy string operations
**Learning:** In the monolithic `App` component, unmemoized list filtering that uses `toLowerCase()` and string interpolation inside a `.filter` block can be a significant performance bottleneck due to frequent top-level re-renders (e.g., from `useNow()` updates or typing in inputs).
**Action:** Always wrap derived state involving list filtering and text transformations in `React.useMemo`, and include early returns (e.g., `if (!normalizedQuery) return list;`) to skip expensive mapping operations when the search query is empty.
