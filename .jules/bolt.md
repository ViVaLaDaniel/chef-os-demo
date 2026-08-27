## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-10-24 - Expensive Array Operations inside App Monolith
**Learning:** The App component is highly monolithic and re-renders frequently due to timers (`useNow`). Unmemoized array filtering with string operations `.toLowerCase()` runs on every tick, causing unnecessary CPU cycles.
**Action:** Always wrap derived data calculations that involve loops or string manipulation in `React.useMemo` if they live in the root of a frequently rendering component, and add early-returns for common empty states.
