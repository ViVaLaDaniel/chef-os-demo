## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unnecessary recalculations in global App state
**Learning:** In highly monolithic React applications where frequent re-renders happen (e.g., from `useNow()` clock ticks running every minute), heavy computations like array filtering and string concatenations (`.toLowerCase()`) run pointlessly, severely wasting CPU cycles.
**Action:** Always wrap derived datasets in `React.useMemo` if they involve loops and strings, and inject fast-path early returns (e.g. `if (!query) return data;`) to bypass the processing altogether when filtering isn't active.
