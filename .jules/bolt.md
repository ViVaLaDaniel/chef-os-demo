## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-27 - Unnecessary re-renders on derived array filtering
**Learning:** In the monolithic component architecture (e.g., `App` component in `src/main.jsx`), heavy array filtering and string manipulations (like `.toLowerCase()`) execute on every re-render (which happens frequently due to global timers and state updates in other tabs), causing performance bottlenecks.
**Action:** Always memoize derived data with `React.useMemo` if it involves expensive operations, especially in root or monolithic components.
