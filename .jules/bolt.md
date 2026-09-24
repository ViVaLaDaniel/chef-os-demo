## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2024-09-24 - Memoize expensive list filtering
**Learning:** Operations like `.toLowerCase()` and string concatenation in list filters (like recipe filtering) are expensive and can block the main thread if recalculated on every render, especially in a monolithic app where many state changes trigger top-level re-renders.
**Action:** Always wrap heavy list filtering operations that involve string manipulation or mapping in `React.useMemo` to ensure they only run when their specific dependencies (e.g. data list, filter criteria, search query) change.
