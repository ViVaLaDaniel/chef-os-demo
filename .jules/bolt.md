## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2025-03-04 - Unnecessary recalculations in App monolith
**Learning:** High-frequency state updates in monolithic components (like timers in `App`) trigger expensive unmemoized derivations (e.g., string concatenations and filtering on arrays like `recipesList`).
**Action:** Always wrap heavy list derivations in `React.useMemo` and implement early returns ("fast paths") before filtering arrays to protect against global re-renders.
