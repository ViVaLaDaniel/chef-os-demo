## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-05 - Monolithic app state re-render bottlenecks
**Learning:** In highly monolithic applications where a single root component (like `App` in `src/main.jsx`) holds almost all state (e.g., activeTab, global timers like `useNow()`, inputs), every state change triggers a full re-render. Inline array derivations involving string concatenation and `.toLowerCase()` operations become a significant performance bottleneck during these frequent re-renders.
**Action:** Always wrap heavy list derivations (like search/filtering) in `React.useMemo` with proper dependencies, and implement early fast-paths (like returning early if the search query is empty) to bypass string manipulations entirely when not needed.
