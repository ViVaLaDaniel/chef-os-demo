## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Unnecessary recalculations caused by global timers
**Learning:** Global hooks like `useNow` that update state frequently (e.g., every minute) cause the entire monolithic `App` component to re-render. This makes expensive derived computations (like array filtering or string manipulation) run excessively even when the user isn't interacting.
**Action:** When working in large monolithic components with global ticking state, aggressively memoize derived data lists (using `React.useMemo`) that rely on expensive operations like `.filter()` or `.toLowerCase()`.
