## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2023-10-24 - Unmemoized array filtering with string manipulation in main App render loop
**Learning:** The monolithic `App` component in `src/main.jsx` re-renders frequently due to various state changes (shift timers, typing, etc). Unmemoized filtering of `recipesList` using `.toLowerCase()` string manipulations on every render is a performance bottleneck.
**Action:** Use `React.useMemo` for derived lists that require `.toLowerCase()` string manipulations or heavy loop operations, and include an early return fast-path if no search query is active to avoid unnecessary loop processing.
