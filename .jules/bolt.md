## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoizing list processing in Monolith Components
**Learning:** Derived lists like `filteredRecipes` in a root-level component will unnecessarily recalculate strings and map/filter items during *any* state change (e.g. toggling a checkbox, sending a chat message).
**Action:** Always wrap heavy data processing and filtering (especially those using string manipulations) inside `React.useMemo` if they live in the root component, using appropriate dependency arrays.
