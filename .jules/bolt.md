## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - Memoize Expensive Derived State with Fast Paths
**Learning:** In highly monolithic applications (like `src/main.jsx`), frequent state changes (chat, activeTab) can constantly trigger derived state recalculations. `.toLowerCase()` and string interpolations inside `.filter()` operations can be very expensive without fast-path bailouts.
**Action:** When calculating derived list states, wrap them in `useMemo` and always prioritize early returns (e.g., returning the full un-mutated array if the `query` is empty) to avoid O(N) string processing loops on idle renders.
