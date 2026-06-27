## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
>> ## 2026-06-27 - Memoize filtering lists in massive monolithic files
>> **Learning:** Due to the large monolithic nature of `src/main.jsx` and having many global states triggering re-renders, it's critical to use `React.useMemo` for any complex list filtering or mapping (especially string manipulations like `.toLowerCase()`) to avoid computing operations like O(n) multiple times every single time *any* state in `App` updates (such as timer ticks or inputs in other tabs).
>> **Action:** Implement memoization or fast-path early returns for expensive list filtering where filtering state or items list rarely change relative to other component states.
