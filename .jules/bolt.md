## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Derived State Recalculation in Monolith
**Learning:** The monolithic architecture (e.g., `App` component in `src/main.jsx`) handles all state (like shift timers updating every minute, real-time chat, and toast notifications). This causes frequent, unrelated re-renders. Un-memoized derived data with operations like `.toLowerCase()` and string concatenation (like `filteredRecipes`) run on every pass and bottleneck the main thread.
**Action:** When adding or modifying derived state (especially list filtering) in monolithic views, always wrap it in `React.useMemo` and implement fast-path early returns to bypass expensive loop operations.
