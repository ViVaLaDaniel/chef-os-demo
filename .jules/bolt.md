## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-27 - Memoize derived data in root monolithic components
**Learning:** In monolithic components like `App` (src/main.jsx) that hold a lot of global state and frequent updates (like `useNow` timer updating every minute), derived calculations that run array loops and string manipulations (e.g. `.filter`, `.toLowerCase`) can quickly become performance bottlenecks by executing unnecessarily on every single render.
**Action:** When working with large central components, always use `React.useMemo` for derived data that relies on arrays and string operations. Include fast-path early returns where possible to bypass processing when it's not needed (e.g. no filter selected).
