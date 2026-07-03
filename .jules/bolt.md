## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoize filteredRecipes inside monolithic App
**Learning:** The App component handles many different states (activity, timers, open modals, etc.) triggering frequent re-renders. Complex computed states like filtering lists over a thousand recipes with `.toLowerCase()` loops were firing excessively without memoization.
**Action:** Use `React.useMemo()` to cache expensive arrays and always utilize an early return within the hook to skip string computations when the default state (e.g. empty search query) applies.
