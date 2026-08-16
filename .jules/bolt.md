## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-05-18 - Memoizing derived data in monolithic component
**Learning:** In a highly updated monolithic component (like `src/main.jsx`), derived data involving heavy operations like string concatenation or `toLowerCase()` can cause performance bottlenecks due to frequent re-renders (e.g., from `useNow()` updates or typing in a search input).
**Action:** Always wrap expensive derived data calculations in `React.useMemo` and implement fast-path early returns to skip unnecessary recalculations when inputs (like an empty search query) allow it.
