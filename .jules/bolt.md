## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.

## 2026-06-04 - Unmemoized expensive filtering blocks main thread
**Learning:** Monolithic components that run array filters and `.toLowerCase()` operations on every re-render (e.g. recipe search) cause significant lag, especially when combined with rapid state updates like typing.
**Action:** Always wrap derived data calculations that involve string manipulation or array iteration in `React.useMemo` to prevent performance bottlenecks.
