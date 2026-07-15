## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-27 - Unmemoized array filtering during keystrokes
**Learning:** Monolithic architectures (like App in src/main.jsx) trigger root re-renders very frequently (e.g., from typing in a search input). Unmemoized array operations with string concatenation and `.toLowerCase()` inside the render function block the main thread and degrade input responsiveness.
**Action:** Always memoize derived data that performs heavy string manipulations or array filtering (`useMemo`), and add fast-path early returns when the search query is empty to skip processing altogether.
