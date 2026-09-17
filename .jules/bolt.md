## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Memoizing heavy string manipulations in monolithic component architecture
**Learning:** Monolithic architectures with high-frequency state updates like `useNow()` timers can cause severe performance degradation if heavy derived data string manipulations (like nested `.toLowerCase().includes(...)`) are calculated on every single render cycle.
**Action:** When working inside large root components like `App` with many frequent state updates, always wrap string-heavy or loop-based derived data in `React.useMemo` and implement fast-path early returns.
