## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unmemoized array filtering during global state updates
**Learning:** In a monolithic architecture like `src/main.jsx`, heavy operations like `.filter()` with `.toLowerCase()` string manipulations run on every state change, such as the `useNow` timer ticking every minute.
**Action:** Always wrap derived data calculations in `React.useMemo`, especially when they involve arrays or string manipulation, and use fast-path early returns (like checking for an empty query) to bypass work entirely when possible.
